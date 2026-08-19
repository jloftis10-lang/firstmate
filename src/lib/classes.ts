import type { CoveredShip, Ship, ShipContent } from "./types";
import type { Deck } from "./decks";

/**
 * CLASS RECORDS — derived, never authored.
 *
 * A class page has to answer: what is true of every ship in this class,
 * and what is true of only one? The brief calls that "teaching the
 * inheritance model", and it is the most useful page on the platform for
 * an advisor who has learned one hull and is about to quote another.
 *
 * There is no `ClassContent` type here and there should not be. Writing
 * class rules by hand would create a second source of truth that agrees
 * with the ship records until the day somebody edits one and not the
 * other — and the whole project has spent weeks establishing that class
 * rules must not drift from the ships that inherit them.
 *
 * So the class record is COMPUTED BY DIFFING THE SHIPS. A field that is
 * byte-identical across every hull in the class is inherited; a field
 * that varies is a per-ship exception, and the exceptions are listed by
 * ship. Both fall out of the data with nothing restated.
 *
 * This has a property authoring cannot match: it is self-maintaining and
 * it cannot lie. Add a per-ship exception to a class factory and the
 * class page reports it on the next build. Remove one and it disappears.
 * The page cannot claim a rule is class-wide when the code says
 * otherwise, because the page is reading the same code.
 *
 * It also surfaces something no hand-written page would: which fields
 * this class ACTUALLY varies on. That is a real finding about a class,
 * and it is invisible in the files themselves.
 */

/** The cabin/traps fields worth diffing. Prose fields, compared exactly. */
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

/**
 * ARRAY FIELDS, AND THEY MATTER MORE THAN THE PROSE ONES.
 *
 * The first version of this file diffed only the string fields and
 * reported "nothing — every hull identical" for Carnival Spirit class.
 * That is false: Spirit class carries a per-ship nightclub note, because
 * two of the four had their lower dance-club levels converted and two did
 * not. The exception was real, signed, and invisible — because it lives
 * in `categoryWarnings`, an array.
 *
 * Most per-ship exceptions in this codebase live in arrays. Jade's Pride
 * of Hawaii history, Legend's family balcony, Viva's solo products, Joy's
 * three configurations — all of them are entries in `categoryWarnings` or
 * `traps.other`. A class page built on the string diff alone would have
 * claimed uniformity across ships that are documented as differing, which
 * is precisely the substitution this product exists to refuse.
 *
 * Arrays diff differently from strings and the difference is the useful
 * part: the INTERSECTION is what the class inherits, and what is left
 * over on each hull is that hull's exception. That models the
 * architecture exactly.
 */
const CABIN_ARRAYS = ["categoryWarnings"] as const;
const TRAPS_ARRAYS = ["other"] as const;

export type FieldDiff = {
  /** `cabin.placementNote`, `traps.kidAgeHeightRules`. */
  field: string;
  /** Human label for the class page. */
  label: string;
  /** Present when every ship agrees — the inherited rule. */
  shared?: string;
  /** Present when they differ — one entry per ship, in catalog order. */
  perShip?: { ship: string; slug: string; value: string | undefined }[];
};

/**
 * An array field's split: what every hull shares, and what each adds.
 * `extras` only lists ships that actually have something of their own.
 */
export type ListDiff = {
  field: string;
  label: string;
  /** Entries present on every ship in the class. */
  shared: string[];
  /** Entries unique to one hull. Empty when the class is uniform. */
  extras: { ship: string; slug: string; items: string[] }[];
};

export type ClassRecord = {
  /** The `shipClass` string, which is how ships are keyed to a class. */
  name: string;
  line: string;
  ships: CoveredShip[];
  /** Class geometry, when every ship carries the same stack. */
  decks?: Deck[];
  /** Fields every ship in the class agrees on. */
  inherited: FieldDiff[];
  /** Fields at least one ship differs on. */
  exceptions: FieldDiff[];
  /** Array fields, split into what is inherited and what is per-ship. */
  lists: ListDiff[];
};

const LABEL: Record<string, string> = {
  "cabin.placementNote": "Where to book",
  "cabin.motionAvoid": "Motion",
  "cabin.vibrationNote": "Vibration",
  "cabin.obstructedViewNotes": "Obstructed views",
  "cabin.connectingNote": "Connecting cabins",
  "cabin.minorPlacementRule": "Minors",
  "cabin.elevatorNote": "Lifts",
  "cabin.accessibilityNote": "Accessibility",
  "traps.kidAgeHeightRules": "Height and age rules",
  "traps.obstructedBalconyDecks": "Obstructed balconies",
  "traps.embarkationNote": "Embarkation",
  "cabin.categoryWarnings": "Category notes",
  "traps.other": "Ship-specific traps",
};

function diff(
  ships: CoveredShip[],
  field: string,
  read: (c: ShipContent) => string | undefined,
): FieldDiff {
  const values = ships.map((s) => ({
    ship: s.name,
    slug: s.id,
    value: read(s.content),
  }));
  const first = values[0]?.value;
  const same = values.every((v) => v.value === first);

  // A field nobody in the class populates is not an exception — it is
  // simply absent, and listing it as "these nine ships all have nothing
  // here" would be noise dressed as a finding.
  if (same) {
    return first === undefined
      ? { field, label: LABEL[field] ?? field }
      : { field, label: LABEL[field] ?? field, shared: first };
  }
  return { field, label: LABEL[field] ?? field, perShip: values };
}

function listDiff(
  ships: CoveredShip[],
  field: string,
  read: (c: ShipContent) => string[] | undefined,
): ListDiff {
  const per = ships.map((s) => ({
    ship: s.name,
    slug: s.id,
    items: read(s.content) ?? [],
  }));

  // Shared = present on EVERY hull. Anything else belongs to the ships
  // that carry it, however many that is — a note on three of four hulls
  // is still an exception, not a class rule.
  const shared = (per[0]?.items ?? []).filter((item) =>
    per.every((p) => p.items.includes(item)),
  );
  const extras = per
    .map((p) => ({
      ship: p.ship,
      slug: p.slug,
      items: p.items.filter((i) => !shared.includes(i)),
    }))
    .filter((p) => p.items.length > 0);

  return { field, label: LABEL[field] ?? field, shared, extras };
}

export function buildClassRecord(
  name: string,
  ships: CoveredShip[],
): ClassRecord {
  const diffs: FieldDiff[] = [
    ...CABIN_FIELDS.map((f) =>
      diff(ships, `cabin.${f}`, (c) => c.cabin?.[f] as string | undefined),
    ),
    ...TRAPS_FIELDS.map((f) =>
      diff(ships, `traps.${f}`, (c) => c.traps?.[f] as string | undefined),
    ),
  ];

  const lists: ListDiff[] = [
    ...CABIN_ARRAYS.map((f) =>
      listDiff(ships, `cabin.${f}`, (c) => c.cabin?.[f] as string[] | undefined),
    ),
    ...TRAPS_ARRAYS.map((f) =>
      listDiff(ships, `traps.${f}`, (c) => c.traps?.[f] as string[] | undefined),
    ),
  ];

  // Deck geometry counts as class-level only when every hull carries the
  // same stack. One ship differing makes it ship data, not class data.
  const stacks = ships.map((s) => JSON.stringify(s.content.decks ?? null));
  const sharedDecks =
    stacks.length > 0 && stacks.every((d) => d === stacks[0]) && stacks[0] !== "null"
      ? ships[0].content.decks
      : undefined;

  return {
    name,
    line: ships[0]?.line ?? "",
    ships,
    decks: sharedDecks,
    inherited: diffs.filter((d) => d.shared !== undefined),
    exceptions: diffs.filter((d) => d.perShip !== undefined),
    lists,
  };
}

/** Every class that has at least one covered ship. */
export function buildClassRecords(ships: Ship[]): ClassRecord[] {
  const byClass = new Map<string, CoveredShip[]>();
  for (const s of ships) {
    if (!s.content || !s.shipClass) continue;
    const key = `${s.line}::${s.shipClass}`;
    const list = byClass.get(key) ?? [];
    list.push(s as CoveredShip);
    byClass.set(key, list);
  }
  return [...byClass.entries()]
    .map(([key, list]) => buildClassRecord(key.split("::")[1], list))
    .sort((a, b) => a.line.localeCompare(b.line) || a.name.localeCompare(b.name));
}
