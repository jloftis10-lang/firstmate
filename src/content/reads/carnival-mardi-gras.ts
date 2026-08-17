import type { ShipContent } from "@/lib/types";

/**
 * SAMPLE CONTENT — verified: false.
 *
 * Placeholder operator judgment in the right voice, not verified fact.
 * Deck numbers, prices and rules below are plausible, not confirmed.
 * Replace with real ship-specific knowledge, then flip `verified` to true.
 */
export const carnivalMardiGras: ShipContent = {
  verified: false,
  reviewDue: "2026-12-31",

  cabin: {
    midshipRange: "decks 7 to 9",
    motionAvoid: "the top decks and the forward cabins",
    hazardsAboveBelow: [
      "the Lido deck and the buffet",
      "the atrium and the late-night venues",
    ],
    obstructedViewNotes:
      "A stretch of lower-deck balconies looks onto lifeboat housings.",
    connectingNote:
      "Confirm connecting cabins have an internal door — adjacent is not connecting.",
    elevatorNote:
      "Midship banks are the shortest walk to dining but the noisiest corridor position.",
    accessibilityNote:
      "Six themed zones end to end — cabin placement decides how much walking the week involves.",
  },

  money: {
    drinkPackagePrice: 82,
    breakEvenDrinksPerDay: 6,
    specialtyDiningNote:
      "Specialty dining fills early, and the best nights go first.",
    gratuityPerDayUSD: 16,
  },

  traps: {
    kidAgeHeightRules:
      "The rollercoaster and slides have height minimums; the kids' programming splits by age.",
    obstructedBalconyDecks: "the lower cabin decks",
    embarkationNote:
      "Check-in is by assigned window — early arrivals still wait their turn.",
  },
};
