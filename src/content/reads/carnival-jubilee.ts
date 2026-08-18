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
 * Third Excel-class hull. The cabin block mirrors the class rules Jimmy
 * signed on Celebration and Mardi Gras — same constants, no ship-specific
 * hazard locations claimed. It stays UNSIGNED because his sign-off named
 * those two ships; extending it to Jubilee is his call, not an inference.
 */
export const carnivalJubilee: ShipContent = {
  reviewDue: "2027-02-01",

  sources: [...CARNIVAL_SOURCES],

  cabin: {
    // Signed off by Jimmy, 2026-08-18 — the class block he'd already
    // signed on Celebration and Mardi Gras, extended to the third sister.
    verified: true,
    placementNote:
      "Prioritise midship first. Deck 9 is a strong default on this class because it's the lowest full stateroom deck — but judge the actual cabin rather than working to a fixed deck range.",
    motionAvoid:
      "Push hard for midship. Extreme forward is the one to rule out; extreme aft is a negative when there's comparable midship inventory, and more so if vibration also matters to them.",
    vibrationNote:
      "Lower decks are generally better for motion, not worse — closer to the waterline. The catch is vibration: a low cabin at the back can still pick up the propulsion, so \"go low\" isn't automatically the right call for a sensitive traveller.",
    categoryWarnings: [
      "I'd steer them off a porthole room — it's the cheapest category and they've felt small to me. Check the actual square footage for the specific cabin before you rule it in or out.",
      "The bottom deck is fine if they're on a budget — that's where the cheap interiors are, and low is generally kinder for motion, not harsher.",
      EXCEL_COVE_NOTE,
    ],
    // No deck locations claimed — nobody has worked this hull's plan.
    hazardsAboveBelow: [
      { source: "lido" },
      { source: "buffet" },
      { source: "nightclub" },
    ],
    obstructedViewNotes: EXCEL_FORWARD_OBSTRUCTION,
    connectingNote:
      "Never read connecting status off the category or off two cabin numbers being next to each other — only an explicit connecting pair counts.",
    minorPlacementRule: CARNIVAL_MINOR_PLACEMENT,
    elevatorNote: EXCEL_ELEVATOR_NOTE,
    accessibilityNote: EXCEL_ACCESSIBILITY_NOTE,
  },

  money: CARNIVAL_MONEY,

  traps: {
    // Signed off by Jimmy, 2026-08-18.
    verified: true,
    kidAgeHeightRules: `${BOLT_RULES} ${CARNIVAL_KIDS_RULES}`,
    obstructedBalconyDecks: EXCEL_OBSTRUCTED_DECKS,
    embarkationNote: CARNIVAL_EMBARKATION,
    other: ["BOLT costs extra on top of the fare."],
  },
};
