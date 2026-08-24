import { quietCandidates, type Deck } from "@/lib/decks";

/**
 * UNSIGNED EDGE-SERIES PLACEMENT RESEARCH.
 *
 * This file is intentionally not wired into `ShipContent`. The detailed
 * official pages available for four hulls describe an earlier sailing
 * window than the current production plan, while Xcel's current page exposes
 * cabin decks but not its public-space overlay in accessible text. The data
 * is useful enough to prepare the operator decision and not current enough
 * to publish as verified advice.
 */

export type EdgePlacementResearch = {
  ship: string;
  checked: "2026-08-24";
  currentPlanUrl: string;
  currentPlanWindow: string;
  detailedPlanUrl: string;
  detailedPlanWindow: string;
  evidence: "historical-detailed-plan" | "current-cabin-decks-only";
  decks: Deck[] | null;
  cabinDecks: number[];
  arithmeticCandidates: number[] | null;
  operatorStatus: "unsigned";
  note: string;
};

const LOWER_PUBLIC: Deck[] = [
  {
    deck: 2,
    carriesCabins: false,
    publicSpace: ["Medical Facility", "Destination Gateway", "Magic Carpet"],
  },
  {
    deck: 3,
    carriesCabins: true,
    publicSpace: ["The Theatre", "Camp at Sea", "Grand Plaza", "main dining rooms"],
  },
  {
    deck: 4,
    carriesCabins: false,
    publicSpace: ["The Theatre", "Grand Plaza", "main dining rooms"],
  },
  {
    deck: 5,
    carriesCabins: false,
    publicSpace: ["The Theatre", "The Club", "Grand Plaza", "restaurants"],
  },
];

const CABIN_RUN: Deck[] = [
  { deck: 6, carriesCabins: true, publicSpace: ["Eden"] },
  { deck: 7, carriesCabins: true, publicSpace: [] },
  { deck: 8, carriesCabins: true, publicSpace: [] },
  { deck: 9, carriesCabins: true, publicSpace: [] },
  { deck: 10, carriesCabins: true, publicSpace: [] },
  { deck: 11, carriesCabins: true, publicSpace: [] },
];

const DECK_14: Deck = {
  deck: 14,
  carriesCabins: false,
  publicSpace: [
    "SEA Thermal Suite",
    "Solarium",
    "Spa Cafe & Juice Bar",
    "Mast Grill",
    "Oceanview Cafe",
    "The Spa",
  ],
};

const DECK_15: Deck = {
  deck: 15,
  carriesCabins: true,
  publicSpace: [
    "Fitness Center",
    "Retreat Lounge",
    "Rooftop Garden",
    "Rooftop Garden Grill",
    "Sunset Bar",
  ],
};

const EARLY_STACK: Deck[] = [
  ...LOWER_PUBLIC,
  ...CABIN_RUN,
  { deck: 12, carriesCabins: true, publicSpace: ["Luminae at The Retreat"] },
  DECK_14,
  DECK_15,
  {
    deck: 16,
    carriesCabins: true,
    publicSpace: ["Retreat pool bar", "Magic Carpet", "Retreat Sundeck"],
  },
];

const LATER_STACK: Deck[] = [
  ...LOWER_PUBLIC,
  ...CABIN_RUN,
  { deck: 12, carriesCabins: true, publicSpace: [] },
  DECK_14,
  DECK_15,
  {
    deck: 16,
    carriesCabins: true,
    publicSpace: ["Luminae at The Retreat", "Magic Carpet", "Retreat Sundeck"],
  },
  {
    deck: 17,
    carriesCabins: false,
    publicSpace: ["Retreat pool bar", "Retreat Sundeck"],
  },
];

function researched(
  input: Omit<EdgePlacementResearch, "checked" | "operatorStatus" | "arithmeticCandidates">,
): EdgePlacementResearch {
  return {
    ...input,
    checked: "2026-08-24",
    operatorStatus: "unsigned",
    arithmeticCandidates: input.decks ? quietCandidates(input.decks) : null,
  };
}

export const CELEBRITY_EDGE_PLACEMENT_RESEARCH: EdgePlacementResearch[] = [
  researched({
    ship: "Celebrity Edge",
    currentPlanUrl:
      "https://www.celebritycruises.com/cruise-ships/celebrity-edge/deck-plans",
    currentPlanWindow: "May 14, 2026–April 18, 2027",
    detailedPlanUrl:
      "https://tst1.celebritycruises.com/cruise-ships/celebrity-edge/deck-plan",
    detailedPlanWindow: "beginning April 16, 2023",
    evidence: "historical-detailed-plan",
    decks: EARLY_STACK,
    cabinDecks: [3, 6, 7, 8, 9, 10, 11, 12, 15, 16],
    note: "Reference-hull extraction. Recheck the current production images before signing; the accessible detailed plan is older than the current sailing window.",
  }),
  researched({
    ship: "Celebrity Apex",
    currentPlanUrl:
      "https://www.celebritycruises.com/cruise-ships/celebrity-apex/deck-plans",
    currentPlanWindow: "April 24, 2026–April 22, 2027",
    detailedPlanUrl:
      "https://www.test1.celebritycruises.com/gb/cruise-ships/celebrity-apex/deck-plan",
    detailedPlanWindow: "beginning March 7, 2025",
    evidence: "historical-detailed-plan",
    decks: EARLY_STACK,
    cabinDecks: [3, 6, 7, 8, 9, 10, 11, 12, 15, 16],
    note: "Independently checked against Apex's detailed page; not inherited from Edge. Current production window still needs image-level confirmation.",
  }),
  researched({
    ship: "Celebrity Beyond",
    currentPlanUrl:
      "https://www.celebritycruises.com/cruise-ships/celebrity-beyond/deck-plans",
    currentPlanWindow: "April 25, 2026–April 23, 2027",
    detailedPlanUrl:
      "https://tst1.celebritycruises.com/int/cruise-ships/celebrity-beyond/deck-plan",
    detailedPlanWindow: "beginning April 27, 2025",
    evidence: "historical-detailed-plan",
    decks: LATER_STACK,
    cabinDecks: [3, 6, 7, 8, 9, 10, 11, 12, 15, 16],
    note: "Independently checked. Unlike Edge/Apex, the detailed plan places Luminae on deck 16 rather than cabin deck 12.",
  }),
  researched({
    ship: "Celebrity Ascent",
    currentPlanUrl:
      "https://www.celebritycruises.com/cruise-ships/celebrity-ascent/deck-plans",
    currentPlanWindow: "April 16, 2026–April 17, 2027",
    detailedPlanUrl:
      "https://tst1.celebritycruises.com/int/cruise-ships/celebrity-ascent/deck-plan",
    detailedPlanWindow: "beginning April 19, 2025",
    evidence: "historical-detailed-plan",
    decks: LATER_STACK,
    cabinDecks: [3, 6, 7, 8, 9, 10, 11, 12, 15, 16],
    note: "Independently checked. Like Beyond, Luminae is listed on deck 16 and deck 12 is shown as cabins only.",
  }),
  researched({
    ship: "Celebrity Xcel",
    currentPlanUrl:
      "https://www.celebritycruises.com/cruise-ships/celebrity-xcel/deck-plans",
    currentPlanWindow: "November 1, 2025–April 9, 2027",
    detailedPlanUrl:
      "https://tst1.celebritycruises.com/cruise-ships/celebrity-xcel/deck-plan",
    detailedPlanWindow: "beginning November 2025",
    evidence: "current-cabin-decks-only",
    decks: null,
    cabinDecks: [3, 6, 7, 8, 9, 10, 11, 12, 15, 16],
    note: "The current page confirms the cabin decks and Xcel-only upper-deck shape, but its accessible text omits the public-area overlay. Do not copy Beyond's candidate band; no arithmetic result is claimed.",
  }),
];
