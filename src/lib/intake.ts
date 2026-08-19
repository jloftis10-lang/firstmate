/**
 * SHIP INTAKE — the structured handoff that replaces me guessing.
 *
 * Every field here exists because a review corrected me on it. This is
 * not a general-purpose ship schema; it is the specific list of things I
 * got wrong across 27 class reviews, turned into questions somebody with
 * the primary sources can answer.
 *
 * WHY IT EXISTS AT ALL. The old sequence was: I research from search
 * snippets, write a record, and Jimmy corrects it against the real deck
 * plans. That worked — it found six distinct classes of error — but his
 * correction messages were doing two jobs, research AND judgment, and
 * only the judgment needs him. This inverts the order. Extraction comes
 * first, in this shape; I compose the record from it; he signs.
 *
 * The point is that I stop inventing and start assembling, which is the
 * half of this I am reliable at. Access to the deck-plan sites would NOT
 * have prevented most of the errors — of the six classes below, exactly
 * one was a sourcing problem:
 *
 *   1. Bad sources           phantom lifeboat bands on Voyager and Vision
 *   2. Good source misread   Pride of America's refit attributed to Epic
 *   3. True fact, wrong ship Sky's "zero balconies" — the cancelled Costa
 *                            design, not the ship NCL delivered
 *   4. Stale but once true   Sky Pad and Enchantment's bungee trampolines,
 *                            both real announcements, both long gone
 *   5. Absence as evidence   Sunshine's SportSquare, Prima's kart noise,
 *                            "no solo studios" written in four files
 *   6. Plausible inference   three accessibility warnings, all withdrawn
 *
 * Only (1) is fixed by better sources. (2) through (6) are fixed by
 * structure — which is what this file is.
 *
 * THE MOST IMPORTANT RULE IN HERE: every field that can be unknown IS
 * `"unknown"`, explicitly, as a value rather than an omission. Errors
 * 5 and 6 both happened in gaps I filled myself. A field that says
 * `"unknown"` cannot be reasoned into a claim; a missing field can.
 */

/** Answer to anything that might not be establishable. Never omit — say so. */
export type Unknown = "unknown";
export const UNKNOWN: Unknown = "unknown";

/** How well a single claim is established. Drives what the record may assert. */
export type IntakeConfidence =
  /** Read off the line's own current deck plan, room page or FAQ. */
  | "official"
  /** A reputable secondary source, or several agreeing. */
  | "secondary"
  /** One passenger's report, a forum thread, a single review. */
  | "anecdotal";

export type Claim<T> = {
  value: T | Unknown;
  confidence: IntakeConfidence;
  /** URL the value came from. Required whenever value is not "unknown". */
  source?: string;
  /** ISO date the source was checked. Required with `source`. */
  checked?: string;
  /** Anything that qualifies the value — a conflict, a locale variation. */
  note?: string;
};

/**
 * ONE DECK, described the way the quiet-default rule actually needs.
 *
 * `carriesCabins` and `publicSpace` are separate booleans on purpose,
 * because a deck can be both — that is `PUBLIC_SPACE_SANDWICH`, and it
 * came up on Fantasy class, Dawn class, Breakaway/Getaway and Sun.
 * Asking only "what is above this cabin" misses every one of them.
 */
export type DeckEntry = {
  /** As the line numbers it. Royal skips 13; record what the plan says. */
  deck: number;
  carriesCabins: boolean;
  /** Public venues ON this deck, named. Empty when it is pure cabins. */
  publicSpace: string[];
  note?: string;
};

/**
 * An obstructed cabin, as the OFFICIAL plan marks it.
 *
 * `cause` is separate from the fact of obstruction and defaults to
 * unknown, because most lines publish that a cabin is obstructed without
 * publishing by what. Guessing the cause is how "obstructed" came to
 * mean five different things — see `src/lib/obstruction.ts`.
 */
export type ObstructedCabin = {
  cabin: string;
  cause: string | Unknown;
  /** What the guest loses, if the source says. Not inferred from cause. */
  effect: string | Unknown;
};

/**
 * An attraction as it exists on THIS hull TODAY.
 *
 * `presentToday` is the field that matters. Sky Pad and Enchantment's
 * bungee trampolines were both real, both announced, and both gone years
 * before I wrote about them. A refit announcement is history; this is
 * inventory.
 */
export type AttractionEntry = {
  name: string;
  presentToday: boolean;
  /** Verbatim from the line. Height, weight, age — whatever it publishes. */
  restriction: string | Unknown;
  /** Set when it exists but is not currently operating. */
  outOfService?: boolean;
};

/** A dated change. Ships like Joy have three configurations, not one. */
export type RefitEntry = {
  /** ISO date or year. Undated refits are how records go stale silently. */
  when: string;
  whatChanged: string;
  /** Things REMOVED. The half an old review will never tell you about. */
  removed: string[];
};

/**
 * The whole intake for one hull.
 *
 * PER SHIP, NEVER PER CLASS. Error (2) — Pride of America's kids-club
 * relocation written onto Epic — happened because one press release
 * covered two ships and I read across. A class-level intake would make
 * that mistake structural instead of accidental. Sisters that genuinely
 * share geometry get noticed when their intakes match; they do not get
 * assumed.
 */
export type ShipIntake = {
  ship: string;
  line: string;
  shipClass?: string;
  /** Who extracted it and when, so a stale intake is visible as stale. */
  extractedOn: string;

  /** Every deck the plan shows, in order. The sandwich scan runs on this. */
  decks: DeckEntry[];

  /** Cabins the OFFICIAL plan marks obstructed. Empty array = none marked. */
  obstructedCabins: ObstructedCabin[];
  /**
   * TRUE only if the line's own plan legend has no obstructed marker at
   * all. An empty `obstructedCabins` means "none marked"; this means
   * "the line does not mark them". I claimed no list existed seven times
   * and was wrong every time, so the two states must be distinguishable.
   */
  lineDoesNotMarkObstruction: Claim<boolean>;

  attractions: AttractionEntry[];
  refits: RefitEntry[];

  /** Verbatim solo/studio category names and the line's supplement wording. */
  soloCategories: Claim<string[]>;
  soloSupplementWording: Claim<string>;

  /** Count AND positions. A count with no layout gives no usable advice. */
  elevatorCount: Claim<number>;
  elevatorBanks: Claim<string[]>;

  /** Per category, never a class range. Deleted six times as a constant. */
  cabinDimensions: Claim<Record<string, string>>;

  /** What the top-tier product actually includes on THIS hull. */
  suiteProduct: Claim<string>;

  /**
   * MINIMUM GUEST AGE, and this field exists because the Viking pilot
   * found it missing before any extraction happened.
   *
   * The engine's family read opens with "Kid access is the trap on this
   * ship." On an adults-only line that is not a warning, it is nonsense —
   * children cannot be booked at all. Every hull in the catalog so far
   * has been Carnival, Royal or Norwegian, so the assumption never
   * surfaced. `18` here is what tells the record it must not answer a
   * family question with height rules.
   */
  minimumGuestAge: Claim<number>;

  /**
   * WHAT THE FARE ALREADY INCLUDES — drinks, Wi-Fi, shore excursions,
   * gratuities, specialty dining.
   *
   * Same origin as the field above. The money read's whole opening call
   * is whether a drink package is worth buying, which presumes there is
   * one to buy. On a fare-inclusive line the question is not close to
   * right, and the engine currently raises the correction as a FLAG
   * underneath a call that has already said the wrong thing.
   *
   * Empty array means genuinely nothing is included; `"unknown"` means
   * nobody checked. Those are different and the money block reads them
   * differently.
   */
  fareInclusions: Claim<string[]>;

  /** Anything the extractor could not settle, in their own words. */
  openQuestions: string[];
};

export type IntakeProblem = { field: string; problem: string };

/**
 * Reject a malformed intake before it becomes a record.
 *
 * This is the part that makes the handoff worth having. Prose I have to
 * re-parse is prose I can misread — which is error (2) exactly. A typed
 * intake that fails loudly cannot be quietly misunderstood.
 *
 * Returns every problem rather than the first, so one round trip fixes
 * the whole extraction.
 */
export function validateIntake(intake: ShipIntake): IntakeProblem[] {
  const problems: IntakeProblem[] = [];
  const iso = /^\d{4}-\d{2}-\d{2}$/;

  if (!intake.ship.trim()) problems.push({ field: "ship", problem: "missing" });
  if (!iso.test(intake.extractedOn)) {
    problems.push({
      field: "extractedOn",
      problem: "must be an ISO date — an undated intake cannot be seen to go stale",
    });
  }

  // Any claim with a value must say where it came from and when.
  const claims: [string, Claim<unknown>][] = [
    ["lineDoesNotMarkObstruction", intake.lineDoesNotMarkObstruction],
    ["soloCategories", intake.soloCategories],
    ["soloSupplementWording", intake.soloSupplementWording],
    ["elevatorCount", intake.elevatorCount],
    ["elevatorBanks", intake.elevatorBanks],
    ["cabinDimensions", intake.cabinDimensions],
    ["suiteProduct", intake.suiteProduct],
    ["minimumGuestAge", intake.minimumGuestAge],
    ["fareInclusions", intake.fareInclusions],
  ];
  for (const [field, claim] of claims) {
    if (claim.value === UNKNOWN) continue;
    if (!claim.source) {
      problems.push({ field, problem: "has a value but no source" });
    }
    if (!claim.checked || !iso.test(claim.checked)) {
      problems.push({ field, problem: "has a value but no ISO checked date" });
    }
  }

  if (intake.decks.length === 0) {
    problems.push({
      field: "decks",
      problem: "empty — the quiet-default scan cannot run without the full stack",
    });
  }
  const seen = new Set<number>();
  for (const d of intake.decks) {
    if (seen.has(d.deck)) {
      problems.push({ field: `decks[${d.deck}]`, problem: "duplicate deck number" });
    }
    seen.add(d.deck);
  }

  // An attraction that is present must say what its restriction is, even
  // if the answer is that it has none or that nobody published one.
  for (const a of intake.attractions) {
    if (a.presentToday && a.restriction === undefined) {
      problems.push({
        field: `attractions.${a.name}`,
        problem: 'present but restriction omitted — say "unknown" rather than leaving it out',
      });
    }
  }

  // A refit with no date is how a record silently ages.
  for (const r of intake.refits) {
    if (!r.when.trim()) {
      problems.push({ field: "refits", problem: `"${r.whatChanged}" has no date` });
    }
  }

  return problems;
}

/**
 * SISTER-SHIP DIFFERENCE CHECK — three states, and the third is the point.
 *
 * Twelve identical-looking hulls do not justify twelve full extractions,
 * but they must not be assumed identical either: a published summary was
 * caught copying Norwegian Breakaway's obstructed cabin numbers onto
 * Escape, which is not even the same sub-class.
 *
 * So one hull gets the full intake and the rest get this. The states are
 * deliberately not two:
 *
 *   "no-difference-found"  somebody looked and found none
 *   "not-checked"          nobody looked
 *   "differs"              somebody looked and found some
 *
 * Collapsing the first two is the absence-as-evidence error again, and
 * it is the one that would do the most damage here — silence across
 * eleven ships reads as eleven confirmations.
 */
export type SisterCheck = {
  ship: string;
  /** The hull this was compared against. */
  against: string;
} & (
  | { state: "no-difference-found"; checked: string; source: string }
  | { state: "not-checked" }
  | { state: "differs"; differences: string[]; checked: string; source: string }
);

/**
 * Reject a sister check that claims a finding without saying where from.
 * "not-checked" needs nothing, which is exactly why it must be stated
 * rather than left blank.
 */
export function validateSisterCheck(check: SisterCheck): IntakeProblem[] {
  const problems: IntakeProblem[] = [];
  const iso = /^\d{4}-\d{2}-\d{2}$/;
  if (check.state === "not-checked") return problems;

  if (!check.source) {
    problems.push({ field: check.ship, problem: "claims a finding with no source" });
  }
  if (!iso.test(check.checked)) {
    problems.push({ field: check.ship, problem: "claims a finding with no ISO checked date" });
  }
  if (check.state === "differs" && check.differences.length === 0) {
    problems.push({
      field: check.ship,
      problem: 'state is "differs" but no differences listed — use "no-difference-found"',
    });
  }
  return problems;
}

/**
 * The decks that pass the quiet-default test, computed rather than
 * judged: cabins on this deck, cabins above, cabins below.
 *
 * This is the check I got wrong four times before Jimmy named the rule,
 * and it is pure arithmetic over the intake — so it should never be done
 * by hand again. Note it deliberately does NOT filter out mixed-use
 * decks: a deck can pass this and still be a bad answer because of what
 * shares it. `mixedUseDecks` is the second question.
 */
export function quietCandidates(decks: DeckEntry[]): number[] {
  const byNumber = new Map(decks.map((d) => [d.deck, d]));
  const ordered = [...decks].sort((a, b) => a.deck - b.deck);
  const out: number[] = [];

  for (let i = 0; i < ordered.length; i++) {
    const d = ordered[i];
    if (!d.carriesCabins) continue;
    const below = ordered[i - 1];
    const above = ordered[i + 1];
    if (!below?.carriesCabins || !above?.carriesCabins) continue;
    out.push(d.deck);
  }
  void byNumber;
  return out;
}

/**
 * Decks carrying cabins AND public space — the `PUBLIC_SPACE_SANDWICH`
 * cases. These can pass `quietCandidates` and still be wrong, which is
 * exactly why the two are separate functions.
 */
export function mixedUseDecks(decks: DeckEntry[]): DeckEntry[] {
  return decks.filter((d) => d.carriesCabins && d.publicSpace.length > 0);
}
