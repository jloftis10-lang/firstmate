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
 * Same split as Mardi Gras: line-wide money and traps are solid, cabin
 * detail is thinner.
 *
 *   - Lido and buffet sit aft on decks 16–17, and cabin decks run from 6
 *     upward — both sourced.
 *   - Cruise Critic flags deck 9 and the forward wrap-around balconies
 *     (blocked by solid steel railing) for obstructed views. Reported via
 *     search summary; the Cruise Critic pages themselves are unreachable
 *     from this environment, so treat it as second-hand.
 *   - `midshipRange` is NOT sourced — inferred from the deck-plan span.
 */
export const carnivalCelebration: ShipContent = {
  verified: false,
  reviewDue: "2027-02-01",

  sources: [
    ...CARNIVAL_SOURCES,
    {
      label: "Celebration deck layout — Lido aft on decks 16–17, cabin decks from 6",
      url: "https://www.cruisemapper.com/deckplans/Carnival-Celebration-2106",
      checked: "2026-08-17",
    },
    {
      label: "Celebration obstructed views — deck 9 and forward wrap-around balconies",
      url: "https://www.cruisecritic.com/cruise/carnival/carnival-celebration/cabins",
      checked: "2026-08-17",
    },
  ],

  cabin: {
    // midshipRange deliberately omitted. Jimmy's call is the rule, not a
    // deck range: "lower or middle levels, towards the middle of the ship"
    // (operator-confirmed, 2026-08-17). The engine states that rather than
    // the deck numbers I had previously inferred from the deck plan.
    motionAvoid: "the top decks and anything forward of the atrium",
    hazardsAboveBelow: [
      "the Lido Marketplace buffet and the pool deck, both aft on 16 and 17",
      "the atrium stage and the late-night comedy club",
    ],
    obstructedViewNotes:
      "Deck 9 is the one to check, and the forward wrap-around balconies are cut by solid steel railing rather than glass.",
    connectingNote:
      "Connecting cabins go quickly on family sailings — book them early or the group ends up split across a corridor.",
    elevatorNote:
      "The forward and midship banks get crowded either side of the dinner seatings.",
    accessibilityNote:
      "The themed zones are spread bow to stern, so 'walk to the next thing' is longer than it looks on paper.",
  },

  money: CARNIVAL_MONEY,

  traps: {
    kidAgeHeightRules: `${BOLT_RULES} ${CARNIVAL_KIDS_RULES}`,
    obstructedBalconyDecks: "deck 9 and the forward wrap-around balconies",
    embarkationNote: CARNIVAL_EMBARKATION,
    other: ["BOLT runs on its own schedule, charges per ride, and closes in weather."],
  },
};
