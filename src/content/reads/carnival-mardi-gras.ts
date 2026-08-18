import type { ShipContent } from "@/lib/types";
import {
  BOLT_RULES,
  CARNIVAL_EMBARKATION,
  CARNIVAL_KIDS_RULES,
  CARNIVAL_MINOR_PLACEMENT,
  CARNIVAL_MONEY,
  CARNIVAL_SOURCES,
  EXCEL_ACCESSIBILITY_NOTE,
  EXCEL_COVE_NOTE,
  EXCEL_ELEVATOR_NOTE,
  EXCEL_FORWARD_OBSTRUCTION,
  EXCEL_OBSTRUCTED_DECKS,
} from "./carnival-common";
import {
  BOTTOM_DECK_NOTE,
  CONNECTING_RULE,
  MOTION_RULE,
  PORTHOLE_STEER,
  VIBRATION_RULE,
} from "./operator-rules";

/**
 * RESEARCHED, NOT OPERATOR-CONFIRMED — verified: false.
 *
 * The money and trap fields come from the line-wide sources in
 * carnival-common.ts and are solid. The cabin fields are thinner:
 *
 *   - "lowest bookable deck is 4" and "decks 16 and 17 are forward cabins
 *     only" are sourced (see cabinSource below).
 *   - `midshipRange` is NOT sourced. It is inferred from the deck-plan
 *     span rather than taken from an operator or a cited recommendation,
 *     and it is the field most in need of Jimmy's number.
 *
 * Do not flip `verified` until the cabin block has been read back by
 * someone who has actually walked this ship.
 */
export const carnivalMardiGras: ShipContent = {
  reviewDue: "2027-02-01",

  sources: [
    ...CARNIVAL_SOURCES,
    {
      label: "Excel-class forward-view obstruction — 8L decks 9/10/11/12/14/15",
      url: "https://cruiseweb.com/cruise-lines/carnival-cruise-line/ship-mardi-gras",
      checked: "2026-08-17",
    },
    {
      label: "Excel Corner Suites — forward wrap, steel railing obstruction",
      url: "https://www.cruisedeckplans.com/ships/Carnival-Mardi-Gras",
      checked: "2026-08-17",
    },
    {
      label: "Cloud 9 Spa forward-view deck 17 partially obstructed",
      url: "https://www.icruise.com/cabins/carnival-cruises-carnival-celebration-cabin-17202.html",
      checked: "2026-08-17",
    },
    {
      label: "Deck 5 Cove balcony under lifeboats, view not obstructed",
      url: "https://cruiseline.com/ship/carnival-celebration/cabin/5425",
      checked: "2026-08-17",
    },
    {
      label: "Minor placement rule for bookings from 1 Feb 2025",
      url: "https://help.carnival.com/app/answers/detail/a_id/10972",
      checked: "2026-08-17",
    },
    {
      label: "Midship elevator congestion, forward/aft preferred at peak",
      url: "https://cruiseline.com/ship/carnival-celebration/review/547711",
      checked: "2026-08-17",
    },
    {
      label: "Scooter compatibility and accessible deck plan",
      url: "https://www.carnival.com/en-US/about-carnival/special-needs/pre-cruise-forms",
      checked: "2026-08-17",
    },
    {
      label: "Mardi Gras cabin decks and forward-only decks 16–17",
      url: "https://cruiseyourself.com/index.php/2023/10/11/best-and-worst-cabins-on-carnival-mardi-gras/",
      checked: "2026-08-17",
    },
  ],

  cabin: {
    // Signed off by Jimmy, 2026-08-18, after his review corrections:
    // deck range dropped for placement guidance, motion split from
    // vibration, the forward/aft veto softened, porthole downgraded.
    verified: true,
    // CORRECTED (Jimmy, 2026-08-17). "Decks 6 to 9" was wrong: on Excel
    // class decks 6 and 7 are essentially public space, 8 is mixed, and 9
    // is the first full stateroom deck. No fixed range is claimed now —
    // the guidance goes in placementNote and the call falls back to the
    // rule, which is what he actually says out loud.
    placementNote:
      "Prioritise midship first. Deck 9 is a strong default on this class because it's the lowest full stateroom deck — but judge the actual cabin rather than working to a fixed deck range.",
    // SHIP MOTION only. Softened from a blanket veto on both ends:
    // forward is the real problem, aft is a relative negative.
    motionAvoid: MOTION_RULE,
    // PROPULSION VIBRATION — a separate concept from motion, and the
    // correction that mattered most in Jimmy's review.
    vibrationNote: VIBRATION_RULE,
    // OPERATOR-CONFIRMED (Jimmy, 2026-08-17). Both are value/comfort
    // calls rather than motion ones, so they show on every read.
    //
    // The bottom-deck entry CORRECTS an earlier record of mine that said
    // "never an interior cabin at the bottom". Jimmy's actual call is a
    // tradeoff, not a veto: it is fine on a budget, and the drawbacks are
    // vibration, motion and the crowd it draws.
    categoryWarnings: [
      // DOWNGRADED (Jimmy, 2026-08-17): the size-and-price comparison
      // could not be established for these hulls, so this reads as an
      // operator's steer plus a check rather than a stated ship fact.
      PORTHOLE_STEER,
      // CORRECTED (Jimmy, 2026-08-17): the motion claim here was
      // backwards. Lower is generally BETTER for motion. The vibration
      // point survives, and now lives in cabin.vibrationNote.
      BOTTOM_DECK_NOTE,
      EXCEL_COVE_NOTE,
    ],
    hazardsAboveBelow: [
      // No deck numbers recorded — omitted rather than guessed.
      { source: "lido" },
      { source: "buffet" },
      { source: "nightclub", where: "the atrium and the late-night venues" },
    ],
    // OPERATOR-RESEARCHED (Jimmy, 2026-08-17). Corrects an earlier record
    // of mine that named tender boats — wrong. The obstruction is the
    // solid steel forward railing, and it spans six decks not one.
    obstructedViewNotes: EXCEL_FORWARD_OBSTRUCTION,
    obstructionKinds: ["solid-structure"],
    connectingNote: CONNECTING_RULE,
    minorPlacementRule: CARNIVAL_MINOR_PLACEMENT,
    elevatorNote: EXCEL_ELEVATOR_NOTE,
    accessibilityNote: EXCEL_ACCESSIBILITY_NOTE,
  },

  money: CARNIVAL_MONEY,

  traps: {
    // Signed off by Jimmy, 2026-08-17, after the embarkation and BOLT fixes.
    verified: true,
    kidAgeHeightRules: `${BOLT_RULES} ${CARNIVAL_KIDS_RULES}`,
    obstructedBalconyDecks: EXCEL_OBSTRUCTED_DECKS,
    embarkationNote: CARNIVAL_EMBARKATION,
    // "Per ride" and "closes in weather" removed — Jimmy could not find
    // sources for either. The extra cost is the part Carnival confirms.
    other: ["BOLT costs extra on top of the fare."],
  },
};
