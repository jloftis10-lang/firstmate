import type { ShipContent } from "@/lib/types";
import {
  BOLT_RULES,
  CARNIVAL_EMBARKATION,
  CARNIVAL_KIDS_RULES,
  CARNIVAL_MONEY,
  CARNIVAL_SOURCES,
} from "./carnival-common";

/**
 * RESEARCHED, NOT OPERATOR-CONFIRMED — verified: false.
 *
 * The money and trap fields come from the line-wide sources in
 * carnival-common.ts and are solid. The cabin fields are thinner:
 *
 *   - "lowest bookable deck is 4" and "decks 16 and 17 are forward cabins
 *     only" are sourced (see cabinSource below).
 *   - `midshipRange` is NOT sourced. It is inferred from the deck-plan
 *     span rather than taken from an operator or a cited recommendation,
 *     and it is the field most in need of Jimmy's number.
 *
 * Do not flip `verified` until the cabin block has been read back by
 * someone who has actually walked this ship.
 */
export const carnivalMardiGras: ShipContent = {
  verified: false,
  reviewDue: "2027-02-01",

  sources: [
    ...CARNIVAL_SOURCES,
    {
      label: "Mardi Gras cabin decks and forward-only decks 16–17",
      url: "https://cruiseyourself.com/index.php/2023/10/11/best-and-worst-cabins-on-carnival-mardi-gras/",
      checked: "2026-08-17",
    },
  ],

  cabin: {
    // OPERATOR-CONFIRMED (Jimmy, 2026-08-17): "midship 6-9", off the rule
    // "lower or middle levels, towards the middle of the ship". This
    // replaces a range I had inferred from the deck plan.
    midshipRange: "decks 6 to 9",
    // OPERATOR-CONFIRMED (Jimmy, 2026-08-17). Corrects the researched
    // version, which had forward only — the call is both ends.
    motionAvoid: "the front and the back of the ship",
    // OPERATOR-CONFIRMED (Jimmy, 2026-08-17). Both are value/comfort
    // calls rather than motion ones, so they show on every read.
    //
    // The bottom-deck entry CORRECTS an earlier record of mine that said
    // "never an interior cabin at the bottom". Jimmy's actual call is a
    // tradeoff, not a veto: it is fine on a budget, and the drawbacks are
    // vibration, motion and the crowd it draws.
    categoryWarnings: [
      "Never a porthole room. They're the absolute cheapest category on the ship and smaller than an interior — cheaper than one, too.",
      "The bottom deck is fine if they're on a budget — that's where the cheap interiors are. Just know the tradeoff: the lower you go the more vibration and motion you feel, and it tends to draw a louder, party crowd.",
    ],
    hazardsAboveBelow: [
      "the Lido deck and the buffet",
      "the atrium and the late-night venues",
    ],
    obstructedViewNotes:
      "Lower-deck balconies on Carnival hulls commonly sit behind lifeboat housings — check the specific cabin, not just the category.",
    connectingNote:
      "Confirm the cabins actually share an internal door; Carnival lists connecting rooms by category and they go early on family sailings.",
    elevatorNote:
      "Midship banks are the shortest walk to dining and the busiest corridor position at dinner hour.",
    accessibilityNote:
      "Deck 4 is the lowest bookable deck and the ship runs bow to stern across six themed zones, so cabin placement decides how much walking the week involves.",
  },

  money: CARNIVAL_MONEY,

  traps: {
    kidAgeHeightRules: `${BOLT_RULES} ${CARNIVAL_KIDS_RULES}`,
    obstructedBalconyDecks: "the lower balcony decks",
    embarkationNote: CARNIVAL_EMBARKATION,
    other: ["BOLT runs on its own schedule, charges per ride, and closes in weather."],
  },
};
