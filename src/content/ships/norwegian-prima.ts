import type { Ship } from "@/lib/types";

/**
 * SAMPLE CONTENT — verified: false.
 *
 * Placeholder operator judgment in the right voice, not verified fact.
 * Deck numbers, prices and rules below are plausible, not confirmed.
 * Replace with real ship-specific knowledge, then flip `verified` to true.
 */
export const norwegianPrima: Ship = {
  id: "norwegian-prima",
  line: "Norwegian",
  name: "Norwegian Prima",
  shipClass: "Prima",
  verified: false,
  reviewDue: "2026-12-31",

  cabin: {
    midshipRange: "decks 9 to 11",
    motionAvoid: "the highest decks and the forward staterooms",
    hazardsAboveBelow: [
      "the pool deck and the buffet",
      "the theatre and the nightclub after hours",
    ],
    obstructedViewNotes:
      "Balcony sightlines on some lower decks are cut by lifeboats.",
    connectingNote:
      "Connecting staterooms are limited on this class — book them early or the family gets separated.",
    elevatorNote:
      "The midship bank is the practical one; the forward bank means a long walk to dinner.",
    accessibilityNote:
      "The outdoor promenade and stepped terraces mean more stairs than a flat-deck ship.",
  },

  money: {
    drinkPackagePrice: 109,
    breakEvenDrinksPerDay: 7,
    specialtyDiningNote:
      "Specialty restaurants are the draw on this ship and book out fast.",
    gratuityPerDayUSD: 20,
  },

  traps: {
    kidAgeHeightRules:
      "The go-kart track and the drop slides both carry height and age minimums.",
    obstructedBalconyDecks: "the lower balcony decks",
    embarkationNote:
      "Check-in times are assigned in advance — arriving early does not move you up.",
    other: [
      "The go-kart track charges per session and books out at peak times.",
    ],
  },
};
