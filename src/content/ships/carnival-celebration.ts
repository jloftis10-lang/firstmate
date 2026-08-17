import type { Ship } from "@/lib/types";

/**
 * SAMPLE CONTENT — verified: false.
 *
 * Placeholder operator judgment in the right voice, not verified fact.
 * Deck numbers, prices and rules below are plausible, not confirmed.
 * Replace with real ship-specific knowledge, then flip `verified` to true.
 */
export const carnivalCelebration: Ship = {
  id: "carnival-celebration",
  line: "Carnival",
  name: "Carnival Celebration",
  shipClass: "Excel",
  verified: false,
  reviewDue: "2026-12-31",

  cabin: {
    midshipRange: "decks 7 to 9",
    motionAvoid: "the top decks and anything forward of the atrium",
    hazardsAboveBelow: [
      "the Lido deck and the buffet",
      "the main atrium stage and the late-night comedy club",
    ],
    obstructedViewNotes:
      "Some balconies on the lower cabin decks sit behind lifeboats.",
    connectingNote:
      "Connecting cabins go quickly on family sailings — book them early or the group ends up split across a corridor.",
    elevatorNote:
      "The forward and midship banks get crowded either side of the dinner seatings.",
    accessibilityNote:
      "The zones are spread bow to stern, so 'walk to the next thing' is longer than it looks on paper.",
  },

  money: {
    drinkPackagePrice: 82,
    breakEvenDrinksPerDay: 6,
    specialtyDiningNote:
      "The steakhouse books out for the prime nights well before departure.",
    gratuityPerDayUSD: 16,
  },

  traps: {
    kidAgeHeightRules:
      "The rollercoaster and the waterworks slides carry height minimums, and the kids' clubs split by age band.",
    obstructedBalconyDecks: "the lower cabin decks",
    embarkationNote:
      "Arrival appointments are assigned — showing up outside the window means waiting.",
    other: [
      "The rollercoaster runs on its own schedule and closes in weather.",
    ],
  },
};
