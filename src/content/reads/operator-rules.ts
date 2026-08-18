/**
 * Jimmy's general cabin rules — the judgment that holds on any hull, on
 * any line.
 *
 * OPERATOR-CONFIRMED. Each constant records when. These are not research
 * and not my wording: they came out of the intake conversations and the
 * Excel-class review, and Jimmy has signed the text as written.
 *
 * They live here for the same reason the noise table lives in
 * `src/lib/noise.ts`: a ship record's job is to say what is true about
 * THAT hull. General judgment repeated in fifty places is fifty places
 * to drift, and — worse for this product — it buries the line between
 * what an operator confirmed and what I merely researched. Reading a
 * class file now, anything imported from here is signed and anything
 * written inline is not.
 *
 * IMPORTANT, so nobody reads more into this than it says: importing a
 * confirmed rule does NOT make a block verified. Verification is per
 * block, and a block also carries ship-specific claims that nobody has
 * checked. What this file changes is clarity and edit cost, not status.
 * A cabin block stays `verified: false` until Jimmy signs the whole of
 * it.
 */

/**
 * SHIP MOTION — pitch and roll.
 *
 * Note what it deliberately does NOT say: it doesn't veto the aft end.
 * Aft is a relative negative against comparable midship inventory, not a
 * disqualifier, and an earlier version that blanket-vetoed both ends was
 * corrected at the Excel-class review.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-17).
 */
export const MOTION_RULE =
  "Push hard for midship. Extreme forward is the one to rule out; extreme aft is a negative when there's comparable midship inventory, and more so if vibration also matters to them.";

/**
 * PROPULSION VIBRATION — a different thing from motion, and the
 * distinction cost us a wrong answer once already.
 *
 * I originally wrote that lower decks mean more motion. That is
 * backwards: lower is BETTER for motion and worse only for vibration.
 * Jimmy caught it and asked for the two to be permanently separate
 * concepts, which is why `cabin.motionAvoid` and `cabin.vibrationNote`
 * are separate fields rather than one paragraph.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-17, after correcting my error).
 */
export const VIBRATION_RULE =
  'Lower decks are generally better for motion, not worse — closer to the waterline. The catch is vibration: a low cabin at the back can still pick up the propulsion, so "go low" isn\'t automatically the right call for a sensitive traveller.';

/**
 * The porthole steer. A preference with a reason attached, not a veto —
 * hence the instruction to check the actual square footage rather than
 * ruling the category out.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-17).
 */
export const PORTHOLE_STEER_CORE =
  "I'd steer them off a porthole room — it's the cheapest category and they've felt small to me.";

/**
 * The steer plus its usual tail. Split from the core above because one
 * hull ends the same judgment differently: on Splendor, Carnival's own
 * plan marks the two-porthole cabins with a symbol rather than giving
 * them a category name, so "read the plan" is the useful instruction
 * there instead of "check the square footage". Both halves are Jimmy's;
 * only which tail applies varies.
 */
export const PORTHOLE_STEER = `${PORTHOLE_STEER_CORE} Check the actual square footage for the specific cabin before you rule it in or out.`;

/**
 * The bottom deck, as a tradeoff rather than a warning.
 *
 * An earlier version of this also called the bottom deck a party deck.
 * Jimmy retracted that himself ("I was wrong about the bottom deck being
 * a party deck") and the claim is gone. What's left is the budget case
 * and the motion point, both of which he stands behind.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-17, after his own retraction).
 */
export const BOTTOM_DECK_NOTE =
  "The bottom deck is fine if they're on a budget — that's where the cheap interiors are, and low is generally kinder for motion, not harsher.";

/**
 * Connecting cabins. This is the one that fails at the pier: two cabin
 * numbers being adjacent proves nothing, and neither does the category.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-17).
 */
export const CONNECTING_RULE =
  "Never read connecting status off the category or off two cabin numbers being next to each other — only an explicit connecting pair counts.";

/**
 * Attach a ship-specific observation to a confirmed general rule.
 *
 * The pattern throughout the class files is "the confirmed rule, then
 * what's true about this hull" — for example the general vibration rule
 * followed by a note that a particular class's aft-vibration reports
 * come from sources not worth leaning on. Composing them here keeps the
 * confirmed half byte-identical everywhere instead of letting each file
 * carry its own copy that can drift.
 *
 * `note` is MY research unless its own comment says otherwise. Passing
 * one does not make the result confirmed; it makes it a confirmed rule
 * with an unconfirmed rider, which is exactly what the reader should
 * understand it to be.
 */
export function withShipNote(rule: string, note?: string): string {
  return note ? `${rule} ${note}` : rule;
}
