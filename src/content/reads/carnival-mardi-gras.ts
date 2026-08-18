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
    // Jimmy's own calls, but the block also carries researched detail he
    // has accepted rather than recalled. Flip only when the whole block
    // is something he'd say on the phone.
    verified: false,
    // OPERATOR-CONFIRMED (Jimmy, 2026-08-17): "midship 6-9", off the rule
    // "lower or middle levels, towards the middle of the ship". This
    // replaces a range I had inferred from the deck plan.
    midshipRange: "decks 6 to 9",
    // OPERATOR-CONFIRMED (Jimmy, 2026-08-17). Corrects the researched
    // version, which had forward only — the call is both ends.
    motionAvoid: "the front and the back of the ship",
    // OPERATOR-CONFIRMED (Jimmy, 2026-08-17). Both are value/comfort
    // calls rather than motion ones, so they show on every read.
    //
    // The bottom-deck entry CORRECTS an earlier record of mine that said
    // "never an interior cabin at the bottom". Jimmy's actual call is a
    // tradeoff, not a veto: it is fine on a budget, and the drawbacks are
    // vibration, motion and the crowd it draws.
    categoryWarnings: [
      "Never a porthole room. They're the absolute cheapest category on the ship and smaller than an interior — cheaper than one, too.",
      "The bottom deck is fine if they're on a budget — that's where the cheap interiors are. Just know the tradeoff: the lower you go the more vibration and motion you feel.",
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
    connectingNote:
      "Never read connecting status off the category or off two cabin numbers being next to each other — only an explicit connecting pair counts.",
    minorPlacementRule: CARNIVAL_MINOR_PLACEMENT,
    elevatorNote: EXCEL_ELEVATOR_NOTE,
    accessibilityNote: EXCEL_ACCESSIBILITY_NOTE,
  },

  money: CARNIVAL_MONEY,

  traps: {
    verified: false,
    kidAgeHeightRules: `${BOLT_RULES} ${CARNIVAL_KIDS_RULES}`,
    obstructedBalconyDecks: EXCEL_OBSTRUCTED_DECKS,
    embarkationNote: CARNIVAL_EMBARKATION,
    other: ["BOLT runs on its own schedule, charges per ride, and closes in weather."],
  },
};
