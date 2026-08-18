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
 * This lives in lib/ next to the noise table for the same reason that one
 * does: it is general judgment that holds on any hull and any line, so a
 * ship record's job is only to say WHICH kinds it has.
 */

export type ObstructionKind =
  | "solid-structure"
  | "lifeboat-davit"
  | "outdoor-walkway"
  | "overlooked"
  | "pool-deck-overhang"
  | "cantilevered-whirlpool"
  | "aft-superstructure";

export type Obstruction = {
  id: ObstructionKind;
  /** What is physically in the way, as an advisor would say it. */
  cause: string;
  /** What the client actually experiences, and what survives. */
  experience: string;
};

export const OBSTRUCTION_KINDS: Obstruction[] = [
  {
    id: "solid-structure",
    cause: "solid structure — a steel bulkhead, panel or railing",
    experience:
      "this is the kind that genuinely takes the view, and on some ships it blocks everything from a seated position and opens up when you stand. Steer a client who is buying the view somewhere else",
  },
  {
    id: "lifeboat-davit",
    cause: "lifeboats, tenders and their davits",
    experience:
      "this takes the view straight DOWN more than the view out, and the horizon is often still there. Someone who wants to sit with a book and see sea can be very happy in one of these at a lower price — describe it rather than writing it off",
  },
  {
    id: "outdoor-walkway",
    cause: "an outdoor observation deck or public walkway",
    experience:
      "as much a privacy problem as a view one, because the people out there are looking back in. Fine for a client who wants light and doesn't care; wrong for anyone expecting either a sea view or privacy",
  },
  {
    id: "overlooked",
    cause: "the balcony being open to view from another deck or a public space",
    experience:
      "not a view problem at all — the sea is fine and the neighbours can see you. Worth raising in advance, because the client who wasn't told is the one who keeps the curtains shut all week",
  },
  {
    id: "pool-deck-overhang",
    cause: "the pool deck above overhanging the balcony",
    experience:
      "this one takes the SKY rather than the sea — the horizon is completely untouched and the balcony sits in permanent shade. That's a genuine negative for a sun-seeker and a genuine positive in the Caribbean for anyone who wanted shade anyway, so ask before you assume which",
  },
  {
    id: "cantilevered-whirlpool",
    cause: "a whirlpool cantilevered out from the deck above, directly overhead",
    experience:
      "structure and shade rather than a blocked view, with the pool deck's noise and activity immediately above. A different thing from a plain overhang because there are people up there, not just steel — worth naming to a client rather than filing under obstructed",
  },
  {
    id: "aft-superstructure",
    cause: "the ship's own aft superstructure and framing",
    experience:
      "an aft balcony can look THROUGH or OVER substantial metalwork rather than at open water. Aft balconies are often oversized and sell themselves on that, so this is the one where a client's expectation and the reality diverge most — check the specific cabin rather than trusting the category",
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
