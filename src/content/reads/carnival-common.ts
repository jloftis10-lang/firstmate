import type { ShipContent, Source } from "@/lib/types";
import {
  BOTTOM_DECK_NOTE,
  CONNECTING_RULE,
  MOTION_RULE,
  PORTHOLE_STEER,
  VIBRATION_RULE,
} from "./operator-rules";

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
 * $17.00 per person per day for standard staterooms, $19.00 for suites,
 * posted to the Sail & Sign account if it isn't prepaid.
 *
 * No effective date is claimed. An earlier version said "from 2 April
 * 2026" and no Carnival source supports that — it came from an unrelated
 * FAQ update.
 *
 * Cheers! is $83.94 per person per day pre-cruise and $89.94 onboard,
 * both including the 20% service charge.
 *
 * There is deliberately NO break-even figure. Break-even is not a
 * property of the ship or the line — someone drinking beer and coffee
 * has a completely different one from someone ordering $15 cocktails.
 * A fixed number here would undercut the real calculation, which is
 * package cost against that client's expected consumption.
 */
export const CARNIVAL_MONEY: ShipContent["money"] = {
  // Signed off by Jimmy, 2026-08-17, after dropping the unsupported
  // effective date and the fixed break-even figure.
  //
  // The package price, the service charge and the note below were added
  // 2026-08-19 on Jimmy's sign-off, after the compare page put Carnival
  // and Royal side by side and showed $84 against $75 — which reads as
  // Carnival being dearer when the all-in figures run the other way.
  // The facts were already in the header comment above and had never
  // reached a rendered field.
  verified: true,
  // The exact advance price rather than the rounded 84 it carried, so
  // the normalised comparison is arithmetic on a real number.
  drinkPackagePrice: 83.94,
  serviceCharge: { rate: 0.2, includedInPrice: true },
  drinkPackageNote:
    "CHEERS! is $83.94 per person per day bought in advance and $89.94 bought onboard, and both figures already include the 20% service charge — so the price you see is the price they pay. Every guest of drinking age in the stateroom has to buy it if one does. Worth saying plainly when a client is comparing against another line: some lines post the package before their gratuity and add it at checkout, so a lower-looking number can end up costing more.",
  specialtyDiningNote:
    "It's reservable pre-cruise through Cruise Manager, and times are first-come first-served, so lock in the nights that matter early.",
  gratuityPerDayUSD: 17,
};

/** Camp Ocean 2–11, Circle C 12–14, Club O2 15–17. BOLT needs 52 inches. */
export const CARNIVAL_KIDS_RULES =
  "Camp Ocean splits 2–11 into age bands (Penguins 2–5, Sting Rays 6–8, Sharks 9–11), then Circle C at 12–14 and Club O2 at 15–17. Turtles covers 6 months to under 2 at certain times.";

/**
 * SkyCourse, the ropes course. Carnival publishes current restrictions —
 * an earlier version of the Dream-class record said none were published,
 * which was out of date.
 *
 * Note the per-person limits match BOLT's exactly (52 to 77 inches, 300
 * pounds). Same restraint spec, different ride.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-18, against Carnival's current
 * published restrictions).
 */
export const CARNIVAL_ROPES_COURSE_RULES =
  "The ropes course is included in the fare, needs 52 inches minimum and caps at 77 inches and 300 pounds per person. Closed-toe athletic shoes and workout clothing are required, so a child in sandals gets turned away at the gate no matter how tall they are.";

/** BOLT is on the Excel-class ships only. */
export const BOLT_RULES =
  "BOLT, the rollercoaster, needs 52 inches minimum and caps at 77 inches, 300 pounds per person and 440 pounds per vehicle. Anyone under 12 has to ride with someone 15 or over.";

/**
 * The Arrival Appointment is the single biggest embarkation trap on
 * Carnival right now: it is a 30-minute window, not a suggestion, and
 * guests who turn up early are held outside the terminal.
 */
export const CARNIVAL_EMBARKATION =
  "Guests pick an Arrival Appointment during online check-in and need to turn up inside that window — anyone arriving early may be held until their assigned time.";

/** Fleet-wide waterslide minimums. Twister is 42"; most run 42–48". */
export const CARNIVAL_SLIDE_RULES =
  "The WaterWorks slides run a 42-inch minimum on most of the fleet, and up to 48 inches depending on the slide.";

/**
 * The Venezia and Firenze slide exception, and it has to sit ABOVE the
 * fleet rule rather than beside it — the Aqua Tunnel runs 42 inches on
 * some other Carnival ships and 51 on these two. An advisor working from
 * the fleet number will be nine inches wrong, which is the difference
 * between a seven-year-old riding and being turned away.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-18, against Carnival's current
 * water-sports policy).
 */
export const ITALIAN_SLIDE_RULES =
  "Ship-specific exception, and it overrides the fleet rule: on this ship the Aqua Tunnel needs 51 inches, not the 42 it runs on some other Carnival hulls, and the Gondola Glide needs 51 too. Both cap at 300 pounds. A child who cleared the slides on their last Carnival cruise can be turned away here, so quote these numbers rather than the fleet ones.";

/**
 * Minor placement, effective for bookings made from 1 February 2025.
 *
 * This is the one an advisor loses a booking over. Putting a young child
 * NEXT DOOR to the guardian no longer satisfies it — the cabins have to
 * actually connect, or the child has to be in the guardian's cabin. An
 * adjacent pair that looks fine on a deck plan fails.
 */
export const CARNIVAL_MINOR_PLACEMENT =
  "For bookings made from 1 February 2025, anyone 14 or under has to be in the same cabin as their qualifying guardian or in one that genuinely connects — adjacent doesn't satisfy it. Guests 15 to 17 can be up to three cabins away. One exception worth knowing: a parent aged 21 to 24 can sail with their own children, so don't insist on a 25-plus guardian in that case.";

/**
 * Excel-class forward-view obstruction.
 *
 * The obstruction is a solid steel forward railing, and it runs across
 * six decks rather than one. Reports on Mardi Gras say the forward view
 * can disappear entirely when seated and open up when standing.
 */
export const EXCEL_FORWARD_OBSTRUCTION =
  "On this class the forward-facing balconies are the problem, and it's the solid steel forward railing rather than a lifeboat — Carnival sells the category as partially obstructed. Passengers also report the view disappearing while they're seated and opening up when they stand, though that's a traveler observation rather than a published spec.";

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
  "Most of the indoor dining and entertainment sits around decks 6 to 8, while the Lido, pool and sport decks run from about 16 up to 19 where BOLT is — so anyone slower on their feet repeats that lift trip several times a day, and peak queues are the standing complaint on these ships. If they use a wheelchair or a scooter, treat it as a different job entirely: not every Excel cabin takes a scooter, standard and ambulatory-accessible cabins run about a 22-inch entry door with lips into the bathroom, shower and balcony, and a larger scooter needs a fully accessible cabin. Confirm it against Carnival's accessible deck plan before you book.";

/**
 * The fleet-wide cabin baseline — Jimmy's general rules, which he
 * confirmed hold across the Carnival fleet (2026-08-18).
 *
 * Nothing uses this right now: every hull in the fleet has been worked up
 * to a class file with its own decks, so there is no ship left that needs
 * the generic answer. It stays because the content is operator-confirmed
 * general judgment rather than scaffolding — when Carnival announces a
 * new hull, this is what that ship gets on day one, before anyone has
 * seen a deck plan.
 */
export function carnivalCabinBaseline(): NonNullable<ShipContent["cabin"]> {
  return {
    verified: false,
    placementNote:
      "Prioritise midship first, on a lower or middle deck. This is the fleet rule — nobody has worked this hull's decks up yet, so judge the specific cabin against it.",
    motionAvoid: MOTION_RULE,
    vibrationNote: VIBRATION_RULE,
    categoryWarnings: [
      PORTHOLE_STEER,
      BOTTOM_DECK_NOTE,
    ],
    hazardsAboveBelow: [],
    connectingNote: CONNECTING_RULE,
    minorPlacementRule: CARNIVAL_MINOR_PLACEMENT,
  };
}
