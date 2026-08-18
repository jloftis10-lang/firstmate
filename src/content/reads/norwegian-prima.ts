import type { ShipContent } from "@/lib/types";

/**
 * RESEARCHED, NOT OPERATOR-CONFIRMED — verified: false.
 *
 * Replaces an entirely invented earlier record, same as Wonder of the
 * Seas. NO CABIN BLOCK — the previous one was fabricated and is gone.
 *
 * Norwegian is the reason `drinkPackageNote` exists. The line usually
 * bundles the beverage package into Free at Sea, so the engine's
 * worth-it-or-not call is the wrong question on most NCL fares. Without
 * that note the read would confidently tell an advisor to skip a package
 * their client has already been given.
 */
export const norwegianPrima: ShipContent = {
  verified: false,
  reviewDue: "2027-02-01",

  sources: [
    {
      label: "Norwegian daily service charge 2026",
      url: "https://deeparrival.com/cruise/cruise-lines/norwegian/gratuities/",
      checked: "2026-08-17",
    },
    {
      label: "Free at Sea beverage package structure",
      url: "https://deeparrival.com/cruise/cruise-lines/norwegian/drink-packages/",
      checked: "2026-08-17",
    },
    {
      label: "Splash Academy and Entourage age bands",
      url: "https://eatsleepcruise.com/whats-included-on-norwegian-cruise-line/",
      checked: "2026-08-17",
    },
  ],

  money: {
    // No standalone daily rate quoted here on purpose: on most Free at Sea
    // fares the package is included and the guest pays only the service
    // charge, so a headline price would misrepresent the decision.
    drinkPackageNote:
      "Check what the fare already includes before you sell a package. On most Free at Sea bookings the premium package comes with it and the client pays only the 20% service charge — so the question isn't whether it's worth it, it's whether they already have it.",
    specialtyDiningNote:
      "Specialty dining is the draw on this ship and the Free at Sea dining credits get used early, so the good nights go fast.",
    // $20.00 per guest for Club Balcony Suite and below; $25.00 in The Haven.
    gratuityPerDayUSD: 20,
  },

  traps: {
    kidAgeHeightRules:
      "Splash Academy runs 3 to 12, and Entourage is the teen space for 13 to 17.",
  },
};
