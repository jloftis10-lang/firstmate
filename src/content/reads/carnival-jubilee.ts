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
    motionAvoid: MOTION_RULE,
    vibrationNote: VIBRATION_RULE,
    categoryWarnings: [
      PORTHOLE_STEER,
      BOTTOM_DECK_NOTE,
      EXCEL_COVE_NOTE,
    ],
    // No deck locations claimed — nobody has worked this hull's plan.
    hazardsAboveBelow: [
      { source: "lido" },
      { source: "buffet" },
      { source: "nightclub" },
    ],
    obstructedViewNotes: EXCEL_FORWARD_OBSTRUCTION,
    obstructionKinds: ["solid-structure"],
    connectingNote: CONNECTING_RULE,
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
