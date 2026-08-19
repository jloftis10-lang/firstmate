import type {
  ClientProfile,
  CoveredShip,
  Experience,
  Itinerary,
  Party,
  Seasick,
} from "./types";
import { getRead } from "./engine";

/**
 * WHAT CHANGES WITH WHO IS SAILING — derived by running the engine, not
 * by restating what the engine does.
 *
 * The ship page has a problem the Booking Check does not: it has no
 * client. The check knows the party, the seasickness, the experience and
 * the itinerary, so it can print one answer. A reference page for the
 * hull has to serve every booking at once, and the two dishonest ways
 * out of that are equally available.
 *
 * The first is to pick a default profile, print its read, and not say so
 * — which shows an advisor a page that quietly assumes their client is a
 * non-seasick first-timer on a port-heavy sailing.
 *
 * The second is worse and it is the one this codebase has a history of:
 * write a second copy of the gating rules in the page ("families should
 * also read the height rules; multigen bookings should read the lift
 * note"), which is a parallel source of truth that agrees with
 * `engine.ts` until somebody edits one of them. The class records refuse
 * to be authored for exactly this reason and so does this.
 *
 * So the page ENUMERATES. Every combination of the five inputs but the
 * ship — 4 parties x 2 x 2 x 2 = 32 profiles — is run through the real
 * engine, and the output is partitioned:
 *
 *   ALWAYS       said on all 32. True of the ship, not of the booking.
 *   CONDITIONAL  said on some. Attributed to the answers that turn it on.
 *
 * Nothing here knows what a family is or why a lift note matters. It
 * knows that a particular sentence appears on exactly the eight profiles
 * whose party is "multigen", and reports that. Change the gating in
 * `engine.ts` and this follows on the next build; it cannot drift,
 * because there is nothing here to drift from.
 *
 * THE ATTRIBUTION CAN FAIL, and says so rather than guessing. A flag
 * gated on two inputs at once matches no single dimension, gets an empty
 * trigger list, and renders as "depends on more than one answer". That
 * is a real state and not an error — see `explain()`.
 */

export const PARTIES: Party[] = ["couple", "family", "multigen", "solo"];
export const SEASICKNESS: Seasick[] = ["no", "yes"];
export const EXPERIENCES: Experience[] = ["first", "seasoned"];
export const ITINERARIES: Itinerary[] = ["port-heavy", "sea-days"];

export type Dimension = "party" | "seasick" | "experience" | "itinerary";

/** One input answer, worded for a sentence rather than for a form. */
export type Trigger = { dimension: Dimension; value: string; label: string };

export type ReadCategoryKey = "cabin" | "money" | "traps";

/** A call or a flag, with the answers that produce it. */
export type Variant = {
  text: string;
  /**
   * The answers this appears under. Empty means no single input explains
   * it — see the file comment. Never empty on an `always` entry, which
   * carries no triggers by definition.
   */
  triggers: Trigger[];
};

export type CategoryFit = {
  category: ReadCategoryKey;
  /**
   * The headline call. One entry when it never changes, several when it
   * does — the cabin call has two forms, the traps call has three.
   */
  calls: Variant[];
  /** Flags on every profile. The ship's own facts. */
  always: string[];
  /** Flags on some. The booking's facts. */
  conditional: Variant[];
};

export type ShipFit = {
  /** One per category the ship carries content for. */
  categories: CategoryFit[];
  /** How many profiles were enumerated. Stated on the page, not implied. */
  profileCount: number;
};

const LABELS: Record<Dimension, Record<string, string>> = {
  party: {
    couple: "a couple",
    family: "a family with kids",
    multigen: "a multigen or mobility booking",
    solo: "a solo traveller",
  },
  seasick: {
    yes: "someone prone to seasickness",
    no: "travellers who don't get seasick",
  },
  experience: {
    first: "a first-time cruiser",
    seasoned: "a seasoned cruiser",
  },
  itinerary: {
    "port-heavy": "a port-heavy itinerary",
    "sea-days": "an itinerary with lots of sea days",
  },
};

const DIMENSION_VALUES: Record<Dimension, string[]> = {
  party: PARTIES,
  seasick: SEASICKNESS,
  experience: EXPERIENCES,
  itinerary: ITINERARIES,
};

/** Every profile but the ship. Order is stable, which the sets rely on. */
function profiles(shipId: string): ClientProfile[] {
  const out: ClientProfile[] = [];
  for (const party of PARTIES)
    for (const seasick of SEASICKNESS)
      for (const experience of EXPERIENCES)
        for (const itinerary of ITINERARIES)
          out.push({ shipId, party, seasick, experience, itinerary });
  return out;
}

/**
 * Which answers explain a sentence appearing on exactly this set of
 * profiles.
 *
 * A dimension explains the set when, for some group of its values, the
 * sentence appears on every profile holding one of those values and on
 * no other profile. That handles both the single-value case (the height
 * rules, on `party: family`) and the union case — the non-family
 * connecting-door warning appears on couple, multigen and solo, which is
 * one dimension with three values, not three unrelated conditions.
 *
 * Returns [] when nothing single explains it. That is the honest answer
 * and the page renders it as one.
 */
function explain(present: Set<number>, all: ClientProfile[]): Trigger[] {
  for (const dimension of Object.keys(DIMENSION_VALUES) as Dimension[]) {
    const matching: string[] = [];
    for (const value of DIMENSION_VALUES[dimension]) {
      const indices = all
        .map((p, i) => ({ p, i }))
        .filter(({ p }) => p[dimension] === value)
        .map(({ i }) => i);
      if (indices.every((i) => present.has(i))) matching.push(value);
    }
    if (matching.length === 0 || matching.length === DIMENSION_VALUES[dimension].length) {
      continue;
    }
    const covered = all.filter((p) => matching.includes(p[dimension])).length;
    if (covered === present.size) {
      return matching.map((value) => ({
        dimension,
        value,
        label: LABELS[dimension][value],
      }));
    }
  }
  return [];
}

/** Collect a category's calls and flags across every profile. */
function categoryFit(
  category: ReadCategoryKey,
  reads: { call: string; flags: string[] }[],
  all: ClientProfile[],
): CategoryFit {
  const total = reads.length;

  const collect = (pick: (r: { call: string; flags: string[] }) => string[]) => {
    const seen = new Map<string, Set<number>>();
    reads.forEach((r, i) => {
      for (const text of pick(r)) {
        const set = seen.get(text) ?? new Set<number>();
        set.add(i);
        seen.set(text, set);
      }
    });
    return seen;
  };

  const callSets = collect((r) => [r.call]);
  const flagSets = collect((r) => r.flags);

  const calls: Variant[] = [...callSets].map(([text, set]) => ({
    text,
    triggers: set.size === total ? [] : explain(set, all),
  }));

  const always: string[] = [];
  const conditional: Variant[] = [];
  for (const [text, set] of flagSets) {
    if (set.size === total) always.push(text);
    else conditional.push({ text, triggers: explain(set, all) });
  }

  return { category, calls, always, conditional };
}

/**
 * The whole partition for one ship.
 *
 * A category with no content yields no entry at all — `getRead` returns
 * null for it on every profile, and an absent category is reported as
 * uncharted by the page from the record, not inferred from here.
 */
export function shipFit(ship: CoveredShip): ShipFit {
  const all = profiles(ship.id);
  const reads = all.map((p) => getRead(ship, p));

  const categories: CategoryFit[] = [];
  for (const key of ["cabin", "money", "traps"] as ReadCategoryKey[]) {
    const present = reads
      .map((r) => r[key])
      .filter((c): c is NonNullable<typeof c> => c !== null);
    // Eligibility can null a category on SOME profiles — a family read on
    // an adults-only hull. Enumerating only the profiles that produced a
    // category would silently drop that, so a partial set is reported
    // rather than partitioned: the page has an eligibility section for it.
    if (present.length !== reads.length) continue;
    categories.push(categoryFit(key, present, all));
  }

  return { categories, profileCount: all.length };
}

/** "a family with kids" / "a family with kids or a multigen booking". */
export function triggerSentence(triggers: Trigger[]): string {
  const labels = triggers.map((t) => t.label);
  if (labels.length === 0) return "";
  if (labels.length === 1) return labels[0];
  return `${labels.slice(0, -1).join(", ")} or ${labels[labels.length - 1]}`;
}

/* ------------------------------------------------------------------ */

export type FitItem = {
  category: ReadCategoryKey;
  /** A headline call reads differently from an extra warning. */
  kind: "call" | "flag";
  text: string;
};

export type FitGroup = {
  /** Which of the five inputs this group turns on. */
  dimension: Dimension;
  /** "a family with kids" — the answer, worded for a sentence. */
  label: string;
  /** Stable key: the trigger values, joined. */
  key: string;
  items: FitItem[];
};

const DIMENSION_ORDER: Dimension[] = ["party", "seasick", "experience", "itinerary"];

export const DIMENSION_LABEL: Record<Dimension, string> = {
  party: "Who's travelling",
  seasick: "Seasickness",
  experience: "Cruise experience",
  itinerary: "Itinerary",
};

/**
 * The partition, re-sorted BY THE ANSWER rather than by the category.
 *
 * An advisor arrives at a ship page holding a client, not a taxonomy.
 * "Here are the five things that change if this is a family" is the
 * shape of their question; "here are the cabin flags, of which two are
 * family-gated" is the shape of our data. This turns the second into the
 * first without either one becoming authored copy.
 *
 * Grouped by the FULL trigger set, not by individual value, so the
 * non-family connecting-door warning appears once under "a couple, a
 * multigen booking or a solo traveller" rather than three times.
 *
 * Items with no explanation are dropped from the groups and returned
 * separately by `unexplainedItems` — they belong on the page, but not
 * under a heading that would misattribute them.
 */
export function groupFit(fit: ShipFit): FitGroup[] {
  const groups = new Map<string, FitGroup>();

  const add = (v: Variant, category: ReadCategoryKey, kind: FitItem["kind"]) => {
    if (v.triggers.length === 0) return;
    const key = `${v.triggers[0].dimension}:${v.triggers.map((t) => t.value).join("+")}`;
    const group = groups.get(key) ?? {
      dimension: v.triggers[0].dimension,
      label: triggerSentence(v.triggers),
      key,
      items: [],
    };
    group.items.push({ category, kind, text: v.text });
    groups.set(key, group);
  };

  for (const c of fit.categories) {
    for (const v of c.calls) add(v, c.category, "call");
    for (const v of c.conditional) add(v, c.category, "flag");
  }

  // The call leads its group. It is the sentence that changes the whole
  // read for this client; the flags qualify it. Rendering them in the
  // order the categories happen to be iterated puts a headline third.
  for (const g of groups.values()) {
    g.items.sort((a, b) => (a.kind === b.kind ? 0 : a.kind === "call" ? -1 : 1));
  }

  return [...groups.values()].sort(
    (a, b) =>
      DIMENSION_ORDER.indexOf(a.dimension) - DIMENSION_ORDER.indexOf(b.dimension) ||
      b.items.length - a.items.length ||
      a.label.localeCompare(b.label),
  );
}

/** Calls and flags no single answer explains. Rendered, never hidden. */
export function unexplainedItems(fit: ShipFit): FitItem[] {
  const out: FitItem[] = [];
  for (const c of fit.categories) {
    for (const v of c.calls) if (v.triggers.length === 0 && c.calls.length > 1) out.push({ category: c.category, kind: "call", text: v.text });
    for (const v of c.conditional) if (v.triggers.length === 0) out.push({ category: c.category, kind: "flag", text: v.text });
  }
  return out;
}
