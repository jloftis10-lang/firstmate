import { diff, listDiff } from "./classes";
import type { FieldDiff, ListDiff } from "./classes";
import type { CoveredShip, ShipContent } from "./types";
import { shipProvenance } from "./provenance";

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

/** A whole-dollar rate reads as "$17"; anything with cents needs both. */
function usd(amount: number): string {
  return Number.isInteger(amount) ? `$${amount}` : `$${amount.toFixed(2)}`;
}

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
    read: (c) =>
      c.money?.drinkPackagePrice
        ? `Around ${usd(c.money.drinkPackagePrice)} per person, per day.`
        : undefined,
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
