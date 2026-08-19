/**
 * THE DECK STACK — the structured form of what the quiet-default rule
 * has been answering in prose since the first class review.
 *
 * Every ship record until now expressed its stack as a sentence:
 * "cabins run 2 to 4 and then 7 to 10, so deck 7 fails BELOW". That is
 * the right sentence and it stays. What it cannot do is render a table,
 * be checked by a test, or show an advisor the working deck by deck.
 *
 * WHY THIS IS TRANSCRIPTION AND NOT RESEARCH. These stacks were
 * established during the class reviews and signed. Moving them into
 * structure introduces no new facts; the risk is that I transcribe one
 * wrong. That risk is what `quietBandHolds()` below exists to catch, and
 * it is why this is worth doing at all — a prose claim cannot be
 * checked by a build, and a structured one can.
 *
 * The type is the SAME shape the extraction pipeline produces, so an
 * intake handed over by someone reading a deck plan drops straight in.
 * `src/lib/intake.ts` re-exports it rather than defining a twin.
 */

export type Deck = {
  /** As the LINE numbers it. Royal skips 13; record what the plan says. */
  deck: number;
  carriesCabins: boolean;
  /**
   * Public venues ON this deck, named. Empty means none — a deck that
   * is pure cabins. It does NOT mean nobody checked; a stack recorded
   * without venue data leaves this empty and says so in `note`.
   *
   * Name every venue including the dull ones. A self-service launderette
   * belongs here even though nobody is kept awake by one — the row
   * decides what matters, not the extraction.
   */
  publicSpace: string[];
  note?: string;
};

/**
 * What a deck is, once you have looked above and below it.
 *
 * `undetermined` is a first-class outcome and the reason this function
 * exists rather than a boolean. A deck at the edge of a recorded stack
 * has no known neighbour, and "we don't know what's under deck 2" is a
 * different answer from "deck 2 has public space under it". Collapsing
 * them is the absence-as-evidence error in table form.
 */
export type DeckVerdict =
  | "quiet-candidate"
  | "check-above"
  | "check-below"
  | "check-both"
  | "mixed-use"
  | "not-a-cabin-deck"
  | "undetermined";

export type DeckRow = {
  deck: number;
  carriesCabins: boolean;
  publicSpace: string[];
  /** What sits directly below, as far as the recorded stack knows. */
  below: "cabins" | "public" | "unknown";
  above: "cabins" | "public" | "unknown";
  verdict: DeckVerdict;
  /** Plain-English reason. This is what an advisor reads, not the enum. */
  reason: string;
};

const label = (d: Deck | undefined): "cabins" | "public" | "unknown" =>
  d === undefined ? "unknown" : d.carriesCabins ? "cabins" : "public";

/**
 * One row per deck, in order, with the working shown.
 *
 * Note what this deliberately does NOT do: it does not pick the answer.
 * A `quiet-candidate` verdict means the deck passes the above-and-below
 * test, not that it is the recommendation. On Radiance three decks pass
 * and the operator answer is two of them; on Viking Star four pass and
 * the answer is two. Arithmetic narrows the field, judgment picks from
 * it, and conflating those was the original error the rule was named to
 * prevent.
 */
export function deckRows(decks: Deck[]): DeckRow[] {
  const ordered = [...decks].sort((a, b) => a.deck - b.deck);
  const byNumber = new Map(ordered.map((d) => [d.deck, d]));

  return ordered.map((d) => {
    const below = label(byNumber.get(d.deck - 1));
    const above = label(byNumber.get(d.deck + 1));
    const mixed = d.carriesCabins && d.publicSpace.length > 0;

    if (!d.carriesCabins) {
      return {
        deck: d.deck,
        carriesCabins: false,
        publicSpace: d.publicSpace,
        below,
        above,
        verdict: "not-a-cabin-deck",
        reason: d.publicSpace.length
          ? `No staterooms — ${d.publicSpace.join(", ")}.`
          : "No staterooms on this deck.",
      };
    }

    // Unknown neighbours beat every other outcome. A deck we cannot see
    // under is not a candidate and is not a failure either.
    if (below === "unknown" || above === "unknown") {
      const which =
        below === "unknown" && above === "unknown"
          ? "what sits above or below it"
          : below === "unknown"
            ? "what sits below it"
            : "what sits above it";
      return {
        deck: d.deck,
        carriesCabins: true,
        publicSpace: d.publicSpace,
        below,
        above,
        verdict: "undetermined",
        reason: `Can't call this one — the stack on file doesn't record ${which}. Not a problem found; a gap.`,
      };
    }

    const failsBelow = below === "public";
    const failsAbove = above === "public";

    if (mixed) {
      return {
        deck: d.deck,
        carriesCabins: true,
        publicSpace: d.publicSpace,
        below,
        above,
        verdict: "mixed-use",
        reason: `Staterooms share this deck with ${d.publicSpace.join(", ")}. The question here isn't what's overhead — it's what's beside them.`,
      };
    }
    if (failsBelow && failsAbove) {
      return {
        deck: d.deck,
        carriesCabins: true,
        publicSpace: d.publicSpace,
        below,
        above,
        verdict: "check-both",
        reason: "Public space above AND below. Exposed at both ends.",
      };
    }
    if (failsAbove) {
      return {
        deck: d.deck,
        carriesCabins: true,
        publicSpace: d.publicSpace,
        below,
        above,
        verdict: "check-above",
        reason: "Cabins below, public space directly above. Check what's overhead on the specific room.",
      };
    }
    if (failsBelow) {
      return {
        deck: d.deck,
        carriesCabins: true,
        publicSpace: d.publicSpace,
        below,
        above,
        verdict: "check-below",
        reason: "Cabins above, public space directly below. Check what's underneath on the specific room.",
      };
    }
    return {
      deck: d.deck,
      carriesCabins: true,
      publicSpace: d.publicSpace,
      below,
      above,
      verdict: "quiet-candidate",
      reason: "Cabins above and cabins below, nothing public sharing the deck. Passes the sandwich test.",
    };
  });
}

/** Decks passing the above-and-below test. Candidates, not the answer. */
export function quietCandidates(decks: Deck[]): number[] {
  return deckRows(decks)
    .filter((r) => r.verdict === "quiet-candidate")
    .map((r) => r.deck);
}

/** Cabin decks that also carry public space — the sandwich cases. */
export function mixedUseDecks(decks: Deck[]): Deck[] {
  return decks.filter((d) => d.carriesCabins && d.publicSpace.length > 0);
}

/**
 * THE CHECKSUM. This is what makes transcribing prose into structure a
 * safe operation rather than a re-derivation I could get wrong.
 *
 * Every signed record names its quiet band in words — "midship on decks
 * 8 or 9". If the transcribed stack is right, every deck in that band
 * must survive the arithmetic. If one doesn't, either the stack is
 * mis-transcribed or the signed answer is wrong, and both are worth
 * failing a build over.
 *
 * It is a SUBSET test, not equality, and that asymmetry is the whole
 * point: judgment is allowed to be narrower than arithmetic and never
 * wider. Radiance computes 3, 8 and 9 while the operator answer is 8 and
 * 9 — deck 3 passes on paper and lost on judgment, which is correct and
 * must not fail the check. A signed deck that does NOT compute is the
 * only real error.
 */
export function quietBandHolds(
  decks: Deck[],
  signedBand: number[],
): { holds: boolean; computed: number[]; missing: number[] } {
  const computed = quietCandidates(decks);
  const missing = signedBand.filter((d) => !computed.includes(d));
  return { holds: missing.length === 0, computed, missing };
}
