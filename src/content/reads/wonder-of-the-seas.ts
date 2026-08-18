import type { ShipContent } from "@/lib/types";

/**
 * RESEARCHED, NOT OPERATOR-CONFIRMED — verified: false.
 *
 * Replaces an earlier record that was entirely invented: plausible
 * operator language over facts nobody had checked. Everything below now
 * comes from the sources listed, all of it Royal Caribbean line policy.
 *
 * NO CABIN BLOCK. The previous version had one, and every word of it was
 * mine — deck ranges, hazard locations, lifeboat obstructions, all made
 * up. It is gone rather than dressed up, and the read now reports the
 * cabin category as uncharted for this ship. Same split as the Carnival
 * fleet: policy is researchable, cabin advice needs an operator.
 */
export const wonderOfTheSeas: ShipContent = {
  verified: false,
  reviewDue: "2027-02-01",

  sources: [
    {
      label: "Royal Caribbean daily gratuity rates 2026",
      url: "https://deeparrival.com/cruise/cruise-lines/royal-caribbean/gratuities/",
      checked: "2026-08-17",
    },
    {
      label: "Deluxe Beverage Package pricing",
      url: "https://allaboarddeals.com/blog/royal-caribbean-deluxe-beverage-package",
      checked: "2026-08-17",
    },
    {
      label: "Adventure Ocean age bands",
      url: "https://travelingears.com/royal-caribbean-kids-clubs/",
      checked: "2026-08-17",
    },
  ],

  money: {
    // Fleet median. The package spans roughly $70–125 depending on ship
    // and sailing, so the figure is indicative rather than exact.
    drinkPackagePrice: 84,
    // No sourced break-even figure for this line — omitted rather than
    // carried over from Carnival's. The engine falls back to prose.
    drinkPackageNote:
      "The 18% gratuity on the package is charged on top of the headline price, so the real daily cost is about a fifth higher than the quoted rate.",
    specialtyDiningNote:
      "The specialty restaurants take bookings before sailing and the good nights go first.",
    // $16.00 for interior, ocean view and balcony; $18.50 for suites.
    gratuityPerDayUSD: 16,
  },

  traps: {
    kidAgeHeightRules:
      "Adventure Ocean runs 3 to 11 in bands — Aquanauts 3–5, Explorers 6–8, Voyagers 9–12 — with a separate nursery for 6 to 36 months.",
    other: [
      "Adventure Ocean registration happens on embarkation day, and the nursery and late-night sitting fill up fast.",
    ],
  },
};
