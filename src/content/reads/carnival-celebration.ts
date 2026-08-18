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
    // OPERATOR-CONFIRMED (Jimmy, 2026-08-17): "midship 6-9", off the rule
    // "lower or middle levels, towards the middle of the ship". This
    // replaces a range I had inferred from the deck plan.
    midshipRange: "decks 6 to 9",
    // OPERATOR-CONFIRMED (Jimmy, 2026-08-17). Corrects the researched
    // version, which had forward only — the call is both ends.
    motionAvoid: "the front and the back of the ship",
    // Still a bare call — Jimmy gave this one without a rationale, and
    // inventing one would put words in the operator's mouth. Ask before
    // filling it in.
    motionAlsoAvoid: ["Not an interior cabin at the bottom of the ship either."],
    // OPERATOR-CONFIRMED (Jimmy, 2026-08-17): porthole rooms are the
    // cheapest category and smaller than an interior. That is a value and
    // size warning, not a motion one, so it sits here and shows on every
    // read rather than only for a seasick client.
    categoryWarning:
      "Never a porthole room. They're the absolute cheapest category on the ship and smaller than an interior — cheaper than one, too.",
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
