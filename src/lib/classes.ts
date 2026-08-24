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
  "familyProgramRules",
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
  "traps.familyProgramRules": "Family programme rules",
  "traps.obstructedBalconyDecks": "Obstructed balconies",
  "traps.embarkationNote": "Embarkation",
  "cabin.categoryWarnings": "Category notes",
  "traps.other": "Ship-specific traps",
  // Money is never diffed for a class page — every hull on a line
  // carries the same block by reference, so a class can only ever agree
  // with itself. The compare page diffs it across lines, where it is
  // often the largest difference between two ships. See lib/compare.ts.
  "money.gratuityPerDayUSD": "Gratuities",
  "money.drinkPackagePrice": "Drink package",
  "money.drinkPackageNote": "Before you price it",
  "money.breakEvenDrinksPerDay": "Break-even",
  "money.specialtyDiningNote": "Specialty dining",
};

/**
 * Exported for the compare page, which diffs two ships that are not a
 * class — see `src/lib/compare.ts`. The function never knew or cared:
 * it takes a list of covered ships and a field accessor.
 */
export function diff(
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

/** Exported for the same reason as `diff`. */
export function listDiff(
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

/* ------------------------------------------------------------------ *
 * Routing
 * ------------------------------------------------------------------ */

/**
 * CLASS NAMES ARE NOT UNIQUE ACROSS THE CATALOG. Carnival has a Spirit
 * class and so does Norwegian, and they are entirely different ships. A
 * slug built from the class name alone would collide and one of the two
 * pages would silently win at build time — the Pride of America error
 * with a URL instead of a press release.
 *
 * So the line id is part of the slug, and `routedClassRecords` THROWS on
 * a duplicate rather than letting one page overwrite another. Class
 * names in this catalog also carry punctuation a URL cannot ("Grand
 * (ex-P&O)", "Vista/Spirit hybrid"), which the same slugify handles and
 * the same assertion protects: two names that differ only in punctuation
 * would slug identically, and that must fail the build, not the reader.
 */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type RoutedClass = ClassRecord & {
  /** `royal-caribbean-radiance`. Unique across the catalog, or the build fails. */
  slug: string;
  /** Matches `CruiseLine.id`, so a class page can link to its line. */
  lineId: string;
};

export function routedClassRecords(
  ships: Ship[],
  lines: { id: string; name: string }[],
): RoutedClass[] {
  const lineId = new Map(lines.map((l) => [l.name, l.id]));
  const seen = new Map<string, string>();

  return buildClassRecords(ships).map((record) => {
    const id = lineId.get(record.line);
    if (!id) {
      throw new Error(
        `Class "${record.name}" belongs to line "${record.line}", which is not in the line list.`,
      );
    }
    const slug = `${id}-${slugify(record.name)}`;
    const clash = seen.get(slug);
    if (clash) {
      throw new Error(
        `Class slug "${slug}" is claimed by both "${clash}" and "${record.line} ${record.name}". Two class pages cannot share a URL.`,
      );
    }
    seen.set(slug, `${record.line} ${record.name}`);
    return { ...record, slug, lineId: id };
  });
}

/**
 * Does this class vary at all? Seven of the twenty-nine charted classes
 * do not, and that is a real finding about a class rather than an
 * absence of one — every hull carries byte-identical operator content.
 */
export function isUniform(record: ClassRecord): boolean {
  return (
    record.exceptions.length === 0 &&
    record.lists.every((l) => l.extras.length === 0)
  );
}

/**
 * How many DISTINCT ways this class diverges. Drives the one signal on
 * the directory card and the sentence in the class header.
 *
 * Counted by distinct text, not by ship. Three Radiance hulls carry the
 * same hump-cabin note and Serenade carries a variant of it: that is two
 * divergences, not four. Counting per ship inflated the number in
 * proportion to how big the class is, which made a five-hull class look
 * worse than a two-hull one for carrying the same single exception.
 */
export function exceptionCount(record: ClassRecord): number {
  const texts = new Set<string>();
  for (const l of record.lists) {
    for (const e of l.extras) for (const item of e.items) texts.add(item);
  }
  return record.exceptions.length + texts.size;
}

/**
 * A list entry, with the hulls that carry it.
 *
 * WHY THIS EXISTS. `listDiff` splits an array field two ways — present
 * on EVERY hull, or an extra belonging to a ship — and that binary hides
 * a third state the records are full of. The solo-studios note is on
 * three of the four Breakaway Plus hulls and not on Viva; the hump-cabin
 * note is on three of the four Radiance hulls and Serenade carries a
 * variant. Rendered per ship, those read as three unrelated notes that
 * happen to say the same thing, when the real finding is "three of four
 * carry this and one does not".
 *
 * Nine entries across eight classes are in exactly that position. So an
 * extra is grouped by its own text and reports its hulls — exact string
 * equality, no similarity matching, because a class page that guessed at
 * which notes were "the same" would be inventing an inheritance the
 * records do not state.
 */
export type SharedExtra = {
  field: string;
  label: string;
  text: string;
  ships: { ship: string; slug: string }[];
};

export function groupedExtras(record: ClassRecord): {
  /** Carried by more than one hull, but not all of them. */
  partial: SharedExtra[];
  /** Carried by exactly one hull. */
  unique: SharedExtra[];
} {
  const byText = new Map<string, SharedExtra>();
  for (const l of record.lists) {
    for (const e of l.extras) {
      for (const text of e.items) {
        const key = `${l.field}\u0000${text}`;
        const entry =
          byText.get(key) ?? { field: l.field, label: l.label, text, ships: [] };
        entry.ships.push({ ship: e.ship, slug: e.slug });
        byText.set(key, entry);
      }
    }
  }
  const all = [...byText.values()];
  return {
    // Most-shared first: a note on three of four hulls is closer to a
    // class rule than one hull's footnote, and reads first.
    partial: all.filter((e) => e.ships.length > 1).sort((a, b) => b.ships.length - a.ships.length),
    unique: all.filter((e) => e.ships.length === 1),
  };
}

/* ------------------------------------------------------------------ *
 * Sentence framing
 * ------------------------------------------------------------------ */

export type Framing = {
  /** Sentences every hull opens with, in order. */
  lead: string[];
  /** Sentences every hull closes with, in order. */
  tail: string[];
  /** What is left for each hull, once the shared framing is lifted out. */
  perShip: { ship: string; slug: string; middle: string }[];
};

/**
 * LIFT THE SHARED FRAMING OUT OF A DIVERGING FIELD.
 *
 * The by-field layout was supposed to let an advisor read the versions
 * against each other. On Radiance class it does the opposite: the four
 * obstruction notes share four opening sentences and one closing one,
 * and differ in a single clause buried in the middle of four
 * four-hundred-word paragraphs. Rendering them whole asks the reader to
 * diff prose by eye, which is the work this page exists to have already
 * done. Lifting the frame takes those four from ~850 characters each to
 * ~150, and the Oasis obstruction notes from ~1,030 to ~130.
 *
 * IT IS EXACT, BY CONSTRUCTION. Each hull's middle is a `slice` of its
 * own record between two offsets — not sentences rejoined with a space,
 * which is how the first version of this silently normalised a trailing
 * space inside one Vision-class note. Nothing is rewritten, reordered or
 * dropped, and the shared framing renders above the per-ship list rather
 * than behind anything.
 *
 * Sentences are matched on their trimmed text so that two hulls whose
 * records differ only in spacing still share a frame. The frame that is
 * DISPLAYED is the first hull's, which is the one place this is not
 * byte-exact for every hull — and it can only differ in whitespace,
 * because differing text is what stops a sentence being shared.
 *
 * IT DECLINES RATHER THAN GUESSES. Returns null when the values do not
 * share a frame worth lifting — a hull with nothing recorded, fewer than
 * two shared sentences, or any hull left with an empty middle, which
 * would mean its whole note is the frame and it has nothing of its own.
 * The caller then renders the values whole, which is the honest fallback
 * and the one that cannot mislead.
 */
type Sentence = { text: string; start: number; end: number };

function sentences(value: string): Sentence[] {
  const out: Sentence[] = [];
  const re = /[^.!?]*[.!?]+|[^.!?]+$/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(value)) !== null) {
    const raw = m[0];
    const lead = raw.length - raw.trimStart().length;
    const text = raw.trim();
    if (!text) continue;
    out.push({
      text,
      start: m.index + lead,
      end: m.index + lead + text.length,
    });
  }
  return out;
}

export function sentenceFraming(
  values: { ship: string; slug: string; value: string | undefined }[],
): Framing | null {
  // A hull with nothing recorded has no sentences to share. Its absence
  // is a real state the caller renders separately; including it here
  // would collapse the common frame to nothing.
  if (values.length < 2) return null;
  if (values.some((v) => !v.value)) return null;

  const raw = values.map((v) => v.value as string);
  const parts = raw.map(sentences);
  if (parts.some((p) => p.length < 2)) return null;

  // Never consume a whole value into the frame — every hull must keep at
  // least one sentence of its own, or there is nothing to compare.
  const room = (lead: number, tail: number) =>
    parts.every((p) => lead + tail < p.length);

  let lead = 0;
  while (
    room(lead + 1, 0) &&
    parts.every((p) => p[lead].text === parts[0][lead].text)
  ) {
    lead++;
  }

  let tail = 0;
  while (
    room(lead, tail + 1) &&
    parts.every(
      (p) => p[p.length - 1 - tail].text === parts[0][parts[0].length - 1 - tail].text,
    )
  ) {
    tail++;
  }

  if (lead + tail < 2) return null;

  const perShip = values.map((v, i) => {
    const p = parts[i];
    return {
      ship: v.ship,
      slug: v.slug,
      // Sliced out of the record itself, so the middle is exactly what
      // the record says between those two sentences.
      middle: raw[i].slice(p[lead].start, p[p.length - 1 - tail].end),
    };
  });
  if (perShip.some((p) => !p.middle.trim())) return null;

  return {
    lead: parts[0].slice(0, lead).map((s) => s.text),
    tail: tail > 0 ? parts[0].slice(parts[0].length - tail).map((s) => s.text) : [],
    perShip,
  };
}
