/**
 * WHAT KIND of obstruction — because "obstructed" is five different
 * things wearing one word.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-18), generalised across the Carnival
 * class audits. His framing: "obstruction needs two fields — obstructed =
 * true and obstructionType. A steel forward bulkhead, outdoor walkway,
 * lifeboat/davit, partially exposed balcony and tender obstruction can
 * all produce the word obstructed, but they are very different things for
 * an advisor to explain to a client."
 *
 * The distinction is not cosmetic. It changes the recommendation:
 *
 *   - A steel bulkhead takes the view. Steer a view-motivated client off.
 *   - Lifeboats and davits take the view DOWNWARD and often leave the
 *     horizon usable — someone who wants to sit and read with sea in
 *     front of them may be perfectly happy, at a lower price.
 *   - An outdoor walkway is as much a privacy problem as a view one:
 *     the people out there are looking back in.
 *   - An overlooked balcony isn't a view problem at all. The sea is
 *     fine; the neighbours can see you.
 *   - A pool-deck overhang takes the SKY, not the sea. The horizon is
 *     untouched and the balcony is in permanent shade.
 *
 * Collapsing them loses a booking that would have worked, which is the
 * opposite of what this product is for.
 *
 * The last three were added at the Voyager/Freedom review, where the
 * first draft reached for "overlooked" to describe a whirlpool
 * cantilevered over a balcony. Jimmy drew the line: "overlooked" is
 * reserved for a PRIVACY problem where people can physically see down
 * into the balcony; an overhang is a structure-and-shade problem. Both
 * get sold as "obstructed" and they lead to opposite conversations.
 *
 * CAUSE AND EFFECT ARE SEPARATE AXES (Jimmy, 2026-08-19, Radiance
 * review). One enum trying to describe both is what forced the bad
 * choice on Radiance's deck 7: the lifeboat ROOF has the cause of a
 * structure and the effect of a lifeboat, and neither existing kind fit.
 * His framing: "An obstruction isn't just what blocks the view. It needs
 * both a cause and an effect."
 *
 * So every kind now carries a typed `effect` alongside its prose. The
 * effect is what the advice actually keys off — two different causes
 * with the same effect get the same recommendation, and the same cause
 * with different effects does not.
 *
 * The `effect` field is DATA, not yet rendered. The prose in `cause` and
 * `experience` is unchanged byte-for-byte, because Carnival, Oasis and
 * Quantum are signed against those exact sentences and rewriting signed
 * text to adopt a better structure would silently change what an
 * operator approved. Same call as the superseded attraction constant.
 * Rendering the effect axis waits for the classes it would change.
 *
 * This lives in lib/ next to the noise table for the same reason that one
 * does: it is general judgment that holds on any hull and any line, so a
 * ship record's job is only to say WHICH kinds it has.
 */

/**
 * WHAT THE CLIENT LOSES. The advice keys off this, not off the cause.
 *
 *   - horizon-lost      the primary sea view is materially gone
 *   - downward-blocked  can't see straight down; horizon preserved
 *   - sky-blocked       permanent shade from above; horizon preserved
 *   - privacy-reduced   the view is fine; other people can see in
 */
export type ViewEffect =
  | "horizon-lost"
  | "downward-blocked"
  | "sky-blocked"
  | "privacy-reduced";

export type ObstructionKind =
  | "solid-structure"
  | "lifeboat-davit"
  | "outdoor-walkway"
  | "overlooked"
  | "pool-deck-overhang"
  | "cantilevered-whirlpool"
  | "aft-superstructure"
  | "lifeboat-roof"
  | "window-washing-platform";

export type Obstruction = {
  id: ObstructionKind;
  /** What is physically in the way, as an advisor would say it. */
  cause: string;
  /** What the client actually loses. The recommendation keys off this. */
  effect: ViewEffect;
  /** What the client actually experiences, and what survives. */
  experience: string;
};

export const OBSTRUCTION_KINDS: Obstruction[] = [
  {
    id: "solid-structure",
    effect: "horizon-lost",
    cause: "solid structure — a steel bulkhead, panel or railing",
    experience:
      "this is the kind that genuinely takes the view, and on some ships it blocks everything from a seated position and opens up when you stand. Steer a client who is buying the view somewhere else",
  },
  {
    id: "lifeboat-davit",
    effect: "downward-blocked",
    cause: "lifeboats, tenders and their davits",
    experience:
      "this takes the view straight DOWN more than the view out, and the horizon is often still there. Someone who wants to sit with a book and see sea can be very happy in one of these at a lower price — describe it rather than writing it off",
  },
  {
    id: "outdoor-walkway",
    effect: "privacy-reduced",
    cause: "an outdoor observation deck or public walkway",
    experience:
      "as much a privacy problem as a view one, because the people out there are looking back in. Fine for a client who wants light and doesn't care; wrong for anyone expecting either a sea view or privacy",
  },
  {
    id: "overlooked",
    effect: "privacy-reduced",
    cause: "the balcony being open to view from another deck or a public space",
    experience:
      "not a view problem at all — the sea is fine and the neighbours can see you. Worth raising in advance, because the client who wasn't told is the one who keeps the curtains shut all week",
  },
  {
    id: "pool-deck-overhang",
    effect: "sky-blocked",
    cause: "the pool deck above overhanging the balcony",
    experience:
      "this one takes the SKY rather than the sea — the horizon is completely untouched and the balcony sits in permanent shade. That's a genuine negative for a sun-seeker and a genuine positive in the Caribbean for anyone who wanted shade anyway, so ask before you assume which",
  },
  {
    id: "cantilevered-whirlpool",
    effect: "sky-blocked",
    cause: "a whirlpool cantilevered out from the deck above, directly overhead",
    experience:
      "structure and shade rather than a blocked view, with the pool deck's noise and activity immediately above. A different thing from a plain overhang because there are people up there, not just steel — worth naming to a client rather than filing under obstructed",
  },
  {
    id: "aft-superstructure",
    effect: "horizon-lost",
    cause: "the ship's own aft superstructure and framing",
    experience:
      "an aft balcony can look THROUGH or OVER substantial metalwork rather than at open water. Aft balconies are often oversized and sell themselves on that, so this is the one where a client's expectation and the reality diverge most — check the specific cabin rather than trusting the category",
  },
  {
    id: "lifeboat-roof",
    effect: "downward-blocked",
    cause:
      "a structural roof or canopy covering the lifeboats BELOW the balcony, extending out from under it",
    experience:
      "the horizon and the sea out in front are essentially preserved — what's gone is the view straight down at the water. Disclose it and let them decide; this is not a reason to steer a scenic-view client away, and it only really matters to someone who pictured looking down from their own rail",
  },
  {
    id: "window-washing-platform",
    effect: "horizon-lost",
    cause: "the ship's window-washing platform and its equipment",
    experience:
      "an unusual one, and it affects a small number of specific cabins rather than a band — the platform sits in the view itself. Worth checking by cabin number rather than by deck, because the cabins either side can be perfectly clear",
  },
];

const BY_ID = new Map(OBSTRUCTION_KINDS.map((o) => [o.id, o]));

export function obstruction(id: ObstructionKind): Obstruction | undefined {
  return BY_ID.get(id);
}

/**
 * The advisor-facing sentence for one or more kinds. Returns an empty
 * string for an empty list, so a record that hasn't established the
 * mechanism simply says nothing rather than guessing.
 */
export function obstructionSentence(kinds: ObstructionKind[]): string {
  const found = kinds.map(obstruction).filter(Boolean) as Obstruction[];
  if (found.length === 0) return "";
  const parts = found.map((o) => `${o.cause} — ${o.experience}`);
  return `What's actually in the way matters here: ${parts.join(". And separately, ")}.`;
}

/**
 * The distinct effects a set of kinds produces. Not rendered today — see
 * the file comment — but it is what a future recommendation should key
 * off, and having it typed now keeps the two axes from drifting back
 * together.
 */
export function viewEffects(kinds: ObstructionKind[]): ViewEffect[] {
  const found = kinds.map(obstruction).filter(Boolean) as Obstruction[];
  return [...new Set(found.map((o) => o.effect))];
}
