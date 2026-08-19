import { diff, listDiff } from "./classes";
import type { FieldDiff, ListDiff } from "./classes";
import type { CoveredShip, ShipContent } from "./types";
import { shipProvenance } from "./provenance";
import { packageCost, packageLine, usd } from "./money";
import type { PackageCost } from "./money";

/**
 * TWO SHIPS, SIDE BY SIDE.
 *
 * Almost all of this is the class-page machinery pointed at a different
 * pair of ships, and that is the finding rather than a shortcut:
 * `buildClassRecord` never knew it was looking at a class. It takes
 * covered ships and a field accessor and reports what they agree on and
 * where they diverge. A class is one interesting pair of that shape; two
 * ships an advisor is choosing between is another.
 *
 * So `ExceptionField` and `sentenceFraming` work here unchanged, and
 * they matter more here than they did there. Comparing sisters —
 * Radiance against Brilliance — produces ten agreements and one
 * difference, and that one difference is two 850-character notes that
 * share four opening sentences. Without the framing the page would show
 * two near-identical walls of text and leave the reader to spot the
 * clause that differs, which is the entire question they came with.
 *
 * WHAT THIS ADDS THAT A CLASS PAGE DOES NOT: money. Every hull on a line
 * carries the same money block by reference, so a class can only ever
 * agree with itself and the class page rightly never looks. Across lines
 * it is frequently the biggest difference between two ships — Carnival
 * and Norwegian differ on the gratuity rate, the package price and the
 * rules that govern both.
 *
 * NO CLIENT PROFILE. The check answers "what about this booking"; this
 * answers "how do these two hulls differ", which is a question about the
 * ships and not about who is sailing. Bolting the five questions on
 * would make it a second Booking Check with an extra ship, and the
 * per-client reasoning already has a home on each ship page.
 */

const MONEY_FIELDS: {
  field: string;
  read: (c: ShipContent) => string | undefined;
}[] = [
  {
    field: "money.gratuityPerDayUSD",
    read: (c) =>
      c.money?.gratuityPerDayUSD
        ? `${usd(c.money.gratuityPerDayUSD)} per person, per day, added to the folio automatically.`
        : undefined,
  },
  {
    field: "money.drinkPackagePrice",
    // Never a bare price. A row reading "around $83.94" against "around
    // $75" is the exact misleading comparison the normalisation panel
    // exists to correct, and printing it underneath that panel would
    // contradict it on the same screen. Where the service charge is
    // unrecorded the row says so rather than implying the price is
    // all-in.
    read: (c) => {
      const cost = packageCost(c.money);
      if (cost) return packageLine(cost);
      return c.money?.drinkPackagePrice
        ? `Around ${usd(c.money.drinkPackagePrice)} per person, per day. Whether the service charge is already in that number has not been recorded for this line.`
        : undefined;
    },
  },
  { field: "money.drinkPackageNote", read: (c) => c.money?.drinkPackageNote },
  {
    field: "money.breakEvenDrinksPerDay",
    read: (c) =>
      c.money?.breakEvenDrinksPerDay
        ? `Around ${c.money.breakEvenDrinksPerDay} drinks a day.`
        : undefined,
  },
  {
    field: "money.specialtyDiningNote",
    read: (c) => c.money?.specialtyDiningNote,
  },
];

export type Comparison = {
  a: CoveredShip;
  b: CoveredShip;
  sameLine: boolean;
  sameClass: boolean;
  /** Fields both ships record identically. */
  agree: FieldDiff[];
  /** Fields they record differently — including one recording nothing. */
  differ: FieldDiff[];
  /** Money, kept apart because it is a line fact rather than a hull one. */
  moneyAgree: FieldDiff[];
  moneyDiffer: FieldDiff[];
  /** Category notes and ship traps: what both carry, and what each adds. */
  lists: ListDiff[];
  /**
   * How many recorded fields matched, out of how many either ship
   * records. Stated on the page rather than left for the reader to
   * count, and derived so it cannot be wrong.
   */
  tally: { matched: number; total: number };
};

const CABIN_FIELDS = [
  "placementNote",
  "motionAvoid",
  "vibrationNote",
  "obstructedViewNotes",
  "connectingNote",
  "minorPlacementRule",
  "elevatorNote",
  "accessibilityNote",
] as const;

const TRAPS_FIELDS = [
  "kidAgeHeightRules",
  "obstructedBalconyDecks",
  "embarkationNote",
] as const;

export function compareShips(a: CoveredShip, b: CoveredShip): Comparison {
  const pair = [a, b];

  const hull: FieldDiff[] = [
    ...CABIN_FIELDS.map((f) =>
      diff(pair, `cabin.${f}`, (c) => c.cabin?.[f] as string | undefined),
    ),
    ...TRAPS_FIELDS.map((f) =>
      diff(pair, `traps.${f}`, (c) => c.traps?.[f] as string | undefined),
    ),
  ];

  const money = MONEY_FIELDS.map((m) => diff(pair, m.field, m.read));

  const lists: ListDiff[] = [
    listDiff(pair, "cabin.categoryWarnings", (c) => c.cabin?.categoryWarnings),
    listDiff(pair, "traps.other", (c) => c.traps?.other),
  ];

  // A field neither ship records is neither an agreement nor a
  // difference — `diff` returns it with no `shared` and no `perShip`,
  // and counting it as a match would inflate the tally with absence.
  const agree = hull.filter((d) => d.shared !== undefined);
  const differ = hull.filter((d) => d.perShip !== undefined);
  const moneyAgree = money.filter((d) => d.shared !== undefined);
  const moneyDiffer = money.filter((d) => d.perShip !== undefined);

  const matched = agree.length + moneyAgree.length;
  const total = matched + differ.length + moneyDiffer.length;

  return {
    a,
    b,
    sameLine: a.line === b.line,
    sameClass: a.line === b.line && a.shipClass === b.shipClass && Boolean(a.shipClass),
    agree,
    differ,
    moneyAgree,
    moneyDiffer,
    lists,
    tally: { matched, total },
  };
}

/** Coverage side by side — the first thing to check before trusting a diff. */
export function comparisonCoverage(c: Comparison) {
  return {
    a: shipProvenance(c.a.content),
    b: shipProvenance(c.b.content),
  };
}

/* ------------------------------------------------------------------ */

export type Normalised = {
  a: { ship: string; slug: string; line: string; cost: PackageCost };
  b: { ship: string; slug: string; line: string; cost: PackageCost };
  /** The hull whose package costs less at checkout. */
  cheaper: "a" | "b" | "level";
  /** Per person per day, at checkout, on the recorded prices. */
  gap: number;
  /** True when the sticker prices point the other way from the real ones. */
  reverses: boolean;
};

/**
 * THE PRICING ILLUSION, CORRECTED.
 *
 * Carnival posts CHEERS! with its 20% service charge already in the
 * number. Royal posts its package before the 18% and adds that at
 * checkout. Printed side by side those look like the same kind of
 * number and they are not: $83.94 against $75 reads as Carnival being
 * nine dollars a day dearer, when the figures a client actually pays are
 * $83.94 against $88.50 and the gap runs the other way.
 *
 * `reverses` is the flag worth having. It marks the case where the
 * sticker comparison and the checkout comparison disagree — which is the
 * only case where an advisor reading the two posted prices reaches the
 * wrong conclusion rather than merely an imprecise one.
 *
 * RETURNS NULL WHEN EITHER SIDE IS UNRECORDED. Norwegian has no service
 * charge on file, so a Norwegian pair is not normalised at all. Assuming
 * an unrecorded rate is zero would reproduce exactly the wrong
 * comparison this function exists to correct, and it would do it
 * silently.
 *
 * THE GAP IS ARITHMETIC ON THE RECORDED PRICES, NOT A FLEET CLAIM.
 * Royal's $75 is a tracked median of roughly $55 to $120 depending on
 * ship and sailing — its own record says so — so the dollar figure moves
 * with the sailing even though the rates do not. The page states that
 * beside the number rather than presenting a median as a rate.
 */
export function normalisePackages(c: Comparison): Normalised | null {
  const costA = packageCost(c.a.content.money);
  const costB = packageCost(c.b.content.money);
  if (!costA || !costB) return null;

  const gap = Math.abs(costA.allIn - costB.allIn);
  const cheaper =
    costA.allIn === costB.allIn ? "level" : costA.allIn < costB.allIn ? "a" : "b";

  // Which way the posted prices point, if they point anywhere.
  const sticker =
    costA.base === costB.base ? "level" : costA.base < costB.base ? "a" : "b";

  return {
    a: { ship: c.a.name, slug: c.a.id, line: c.a.line, cost: costA },
    b: { ship: c.b.name, slug: c.b.id, line: c.b.line, cost: costB },
    cheaper,
    gap,
    reverses: sticker !== "level" && cheaper !== "level" && sticker !== cheaper,
  };
}
