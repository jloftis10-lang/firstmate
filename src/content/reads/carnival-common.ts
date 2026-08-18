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
  verified: false,
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

/** Fleet-wide waterslide minimums. Twister is 42"; most run 42–48". */
export const CARNIVAL_SLIDE_RULES =
  "The WaterWorks slides run a 42-inch minimum on most of the fleet, and up to 48 inches depending on the slide.";

/** Venezia and Firenze carry a higher Aqua Tunnel minimum than the rest. */
export const AQUA_TUNNEL_TALL_RULES =
  "The Aqua Tunnel slide needs 51 inches on this ship, higher than the 42 inches it runs elsewhere in the fleet.";

/**
 * Money and traps for a Carnival hull nobody has walked yet.
 *
 * Everything here is line-wide policy: the gratuity rate, the Cheers!
 * price, the youth age bands, the Arrival Appointment. All of it is
 * researched and sourced, none of it is operator-confirmed.
 *
 * There is deliberately NO cabin block. Cabin advice is the part that
 * needs someone who has actually sailed the ship — deck bands, what sits
 * above and below, which balconies are cut by a lifeboat — and inventing
 * it per hull is exactly the failure this product exists to prevent. The
 * read reports the cabin category as uncharted until an operator fills
 * it in.
 */
export function carnivalFleetContent(opts: {
  /** Ship or class-specific ride minimums, appended to the fleet rules. */
  thrillRules?: string;
  otherTraps?: string[];
}): ShipContent {
  const kidRules = [opts.thrillRules, CARNIVAL_SLIDE_RULES, CARNIVAL_KIDS_RULES]
    .filter(Boolean)
    .join(" ");

  return {
    reviewDue: "2027-02-01",
    sources: CARNIVAL_SOURCES,
    money: CARNIVAL_MONEY,
    traps: {
      verified: false,
      kidAgeHeightRules: kidRules,
      embarkationNote: CARNIVAL_EMBARKATION,
      ...(opts.otherTraps ? { other: opts.otherTraps } : {}),
    },
  };
}

/**
 * Minor placement, effective for bookings made from 1 February 2025.
 *
 * This is the one an advisor loses a booking over. Putting a young child
 * NEXT DOOR to the guardian no longer satisfies it — the cabins have to
 * actually connect, or the child has to be in the guardian's cabin. An
 * adjacent pair that looks fine on a deck plan fails.
 */
export const CARNIVAL_MINOR_PLACEMENT =
  "Carnival requires anyone 14 or under to be in the same cabin as their 25-or-over guardian, or in a cabin that genuinely connects to it. Adjacent is not enough — for bookings made from February 2025 this is a rule, not a preference. Guests 15 to 17 have more room to move.";

/**
 * Excel-class forward-view obstruction.
 *
 * The obstruction is a solid steel forward railing, and it runs across
 * six decks rather than one. Reports on Mardi Gras say the forward view
 * can disappear entirely when seated and open up when standing.
 */
export const EXCEL_FORWARD_OBSTRUCTION =
  "On this class the forward-facing balconies are the problem, and it's the solid steel forward railing rather than a lifeboat. Passengers report the view can vanish while they're sitting down and come back when they stand.";

/** The decks the forward-view obstruction actually spans. */
export const EXCEL_OBSTRUCTED_DECKS =
  "the 8L forward-view extended balconies on decks 9, 10, 11, 12, 14 and 15, the forward-wrap Excel Corner Suites on those same decks, and the forward-facing Cloud 9 Spa balconies on deck 17";

/**
 * Cove balconies sit under the lifeboats but are NOT sold as obstructed,
 * and reviews describe a good sea view from them. Worth saying out loud
 * because "under the lifeboats" sounds like an obstruction and isn't.
 */
export const EXCEL_COVE_NOTE =
  "Deck 5 Cove balconies sit below the lifeboat level, which sounds worse than it is — they aren't sold as obstructed and the sea view holds up. Don't talk a client out of one on the assumption it's blocked.";

/**
 * Elevators on the Excel ships. The useful call is not "which bank is
 * best" but "where will this client actually spend the week".
 */
export const EXCEL_ELEVATOR_NOTE =
  "Forward, midship and aft banks, and the midship one is where everybody converges — steer them forward or aft at busy times. Forward suits the theatre and the spa, aft suits Summer Landing and the aft dining; pick the end that matches where they'll actually spend the week.";

/**
 * Excel-class mobility. The friction is the vertical split, not stairs:
 * indoor dining and shows sit on 6–8, the outdoor action on 16–18, so a
 * slower traveler ends up making the same elevator trip several times a
 * day at exactly the busiest moments.
 */
export const EXCEL_ACCESSIBILITY_NOTE =
  "The indoor dining and shows sit on decks 6 to 8 and the outdoor action is up on 16 to 18, so anyone slower on their feet makes that elevator trip several times a day, and the queues at peak are the single biggest complaint on these ships. If they use a wheelchair or a scooter, treat that as a different job entirely: not every Excel cabin takes a scooter, standard doorways run about 22 inches, and there are lips into the bathroom, shower and balcony — get the cabin confirmed against Carnival's accessible deck plan before you book it.";
