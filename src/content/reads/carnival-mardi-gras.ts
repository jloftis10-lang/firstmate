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
    // NOT SOURCED — inferred from the deck plan (cabins run deck 4 upward).
    midshipRange: "decks 6 to 8",
    motionAvoid:
      "decks 16 and 17, which are forward cabins only, and anything forward on the upper decks",
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
