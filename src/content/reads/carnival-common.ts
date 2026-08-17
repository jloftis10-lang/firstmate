import type { ShipContent, Source } from "@/lib/types";

/**
 * Carnival line-wide facts, shared by every Carnival hull.
 *
 * Gratuity rates, the Cheers! price, the youth-programme age bands and the
 * Arrival Appointment rules are set by the line, not the ship. They live
 * here so a rate change is one edit rather than twenty-nine.
 *
 * Researched August 2026 from the sources below — NOT operator-confirmed.
 * Every record using these still carries `verified: false`.
 */

export const CARNIVAL_SOURCES: Source[] = [
  {
    label: "Carnival raises daily gratuity to $17 (April 2026)",
    url: "https://www.travelweekly.com/Cruise-Travel/Carnival-increases-daily-gratuity-17-dollars",
    checked: "2026-08-17",
  },
  {
    label: "Cheers! package pricing and break-even",
    url: "https://www.cruisebooking.com/articles/carnival-cruise-tips/average-cost-carnival-cruise-drink-package",
    checked: "2026-08-17",
  },
  {
    label: "BOLT height and weight limits",
    url: "https://www.cruzely.com/what-to-know-about-carnivals-bolt-roller-coaster-before-you-ride/",
    checked: "2026-08-17",
  },
  {
    label: "Camp Ocean / Circle C / Club O2 age bands",
    url: "https://help.carnival.com/app/answers/detail/a_id/1064/~/carnival-youth-programs-facilities-and-activities",
    checked: "2026-08-17",
  },
  {
    label: "Arrival Appointment and staggered check-in",
    url: "https://www.cruzely.com/guide-to-carnivals-staggered-check-in/",
    checked: "2026-08-17",
  },
];

/**
 * $17.00 per person per day for standard staterooms from 2 April 2026
 * (suites are $19.00 — the engine carries the standard figure, which is
 * what the overwhelming majority of bookings pay).
 *
 * The Cheers! figure is the pre-purchased rate including the 20% service
 * charge; bought onboard it is about $6/day more.
 *
 * Break-even is deliberately the CONSERVATIVE end of the range. Sources
 * put it at roughly 6 cocktails or about 8 mixed alcoholic drinks a day.
 * Overselling the package is the specific failure the framework warns
 * about — a barely-used package is lost trust — so the record carries the
 * number that makes the advisor more cautious, not less.
 */
export const CARNIVAL_MONEY: ShipContent["money"] = {
  drinkPackagePrice: 84,
  breakEvenDrinksPerDay: 8,
  specialtyDiningNote:
    "Specialty dining opens for booking pre-cruise under Manage My Booking, and the good nights go first.",
  gratuityPerDayUSD: 17,
};

/** Camp Ocean 2–11, Circle C 12–14, Club O2 15–17. BOLT needs 52 inches. */
export const CARNIVAL_KIDS_RULES =
  "Camp Ocean splits 2–11 into age bands (Penguins 2–5, Sting Rays 6–8, Sharks 9–11), then Circle C at 12–14 and Club O2 at 15–17.";

/** BOLT is on the Excel-class ships only. */
export const BOLT_RULES =
  "BOLT, the rollercoaster, needs 52 inches minimum — and caps at 77 inches and 300 pounds.";

/**
 * The Arrival Appointment is the single biggest embarkation trap on
 * Carnival right now: it is a 30-minute window, not a suggestion, and
 * guests who turn up early are held outside the terminal.
 */
export const CARNIVAL_EMBARKATION =
  "Carnival assigns a 30-minute Arrival Appointment, usually somewhere between 10:30am and 3pm, and guests who show up before their window are not let into the terminal.";
