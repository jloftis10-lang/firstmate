import type { ShipContent } from "@/lib/types";

/**
 * SAMPLE CONTENT — verified: false.
 *
 * Placeholder operator judgment in the right voice, not verified fact.
 * Deck numbers, prices and rules below are plausible, not confirmed.
 * Replace with real ship-specific knowledge, then flip `verified` to true.
 */
export const wonderOfTheSeas: ShipContent = {
  verified: false,
  reviewDue: "2026-12-31",

  cabin: {
    midshipRange: "decks 8 to 10",
    motionAvoid: "the top decks and the forward third of the ship",
    hazardsAboveBelow: [
      "the pool deck and the Windjammer buffet up top",
      "the Music Hall and the late-night lounges",
    ],
    obstructedViewNotes:
      "A run of balconies on the lower promenade decks looks straight into a lifeboat.",
    connectingNote:
      "Central Park and Boardwalk balcony cabins face inward — quieter, but no ocean. Families often assume they get a sea view.",
    elevatorNote:
      "The midship elevator banks are the busiest on the ship at dinner hour.",
    accessibilityNote:
      "This is a very long ship — aft cabin to midship dining is a genuine hike.",
  },

  money: {
    drinkPackagePrice: 95,
    breakEvenDrinksPerDay: 6,
    specialtyDiningNote:
      "The good nights at the specialty restaurants sell out before sailing.",
    gratuityPerDayUSD: 18,
  },

  traps: {
    kidAgeHeightRules:
      "The waterslides and the kids'-club tiers both run on height and age cutoffs.",
    obstructedBalconyDecks: "the lower promenade decks",
    embarkationNote:
      "Check-in runs in staggered windows — turning up early just means a longer line.",
    other: [
      "The headline shows take reservations that open before sailing and fill fast.",
    ],
  },
};
