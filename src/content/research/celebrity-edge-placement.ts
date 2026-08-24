import { quietCandidates, type Deck } from "@/lib/decks";

/**
 * EDGE-SERIES PLACEMENT RESEARCH AND OPERATOR DECISION.
 *
 * The detailed official pages available for four hulls describe an earlier
 * sailing window than the current production plan, while Xcel's current page exposes
 * cabin decks but not its public-space overlay in accessible text. The data
 * prepared the operator decision. Jimmy signed every result on 2026-08-24,
 * then confirmed Xcel deck 6 is mixed-use and deck 12 is cabins only. The
 * four complete stacks and all five placement bands now feed `ShipContent`;
 * Xcel's incomplete full-deck overlay remains outside the live deck table.
 */

export type EdgePlacementResearch = {
  ship: string;
  checked: "2026-08-24";
  currentPlanUrl: string;
  currentPlanWindow: string;
  currentPlanReviewed: "2026-08-24";
  detailedPlanUrl: string;
  detailedPlanWindow: string;
  evidence:
    | "historical-detailed-plan"
    | "current-cabin-decks-plus-secondary-public-space";
  decks: Deck[] | null;
  /** Enough adjacent decks to evaluate the proposed band, not a full stack. */
  reviewedBand?: Deck[];
  cabinDecks: number[];
  arithmeticCandidates: number[] | null;
  operatorStatus: "signed-2026-08-24";
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
  input: Omit<
    EdgePlacementResearch,
    "checked" | "currentPlanReviewed" | "arithmeticCandidates"
  >,
): EdgePlacementResearch {
  return {
    ...input,
    checked: "2026-08-24",
    currentPlanReviewed: "2026-08-24",
    arithmeticCandidates:
      input.decks || input.reviewedBand
        ? quietCandidates(input.decks ?? input.reviewedBand ?? [])
        : null,
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
    operatorStatus: "signed-2026-08-24",
    decks: EARLY_STACK,
    cabinDecks: [3, 6, 7, 8, 9, 10, 11, 12, 15, 16],
    note: "Reference-hull extraction. Jimmy reviewed the current production plan on 2026-08-24, confirmed it matches the placement geometry and signed the result.",
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
    operatorStatus: "signed-2026-08-24",
    decks: EARLY_STACK,
    cabinDecks: [3, 6, 7, 8, 9, 10, 11, 12, 15, 16],
    note: "Independently checked against Apex's detailed page; not inherited from Edge. Jimmy reviewed the current production plan on 2026-08-24 and signed the result.",
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
    operatorStatus: "signed-2026-08-24",
    decks: LATER_STACK,
    cabinDecks: [3, 6, 7, 8, 9, 10, 11, 12, 15, 16],
    note: "Independently checked. Unlike Edge/Apex, Luminae is on deck 16 rather than cabin deck 12. Jimmy reviewed the current production plan on 2026-08-24 and signed the result.",
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
    operatorStatus: "signed-2026-08-24",
    decks: LATER_STACK,
    cabinDecks: [3, 6, 7, 8, 9, 10, 11, 12, 15, 16],
    note: "Independently checked. Like Beyond, Luminae is on deck 16 and deck 12 is cabins only. Jimmy reviewed the current production plan on 2026-08-24 and signed the result.",
  }),
  researched({
    ship: "Celebrity Xcel",
    currentPlanUrl:
      "https://www.celebritycruises.com/cruise-ships/celebrity-xcel/deck-plans",
    currentPlanWindow: "November 1, 2025–April 9, 2027",
    detailedPlanUrl:
      "https://tst1.celebritycruises.com/cruise-ships/celebrity-xcel/deck-plan",
    detailedPlanWindow: "beginning November 2025",
    evidence: "current-cabin-decks-plus-secondary-public-space",
    operatorStatus: "signed-2026-08-24",
    decks: null,
    reviewedBand: [
      {
        deck: 6,
        carriesCabins: true,
        publicSpace: ["The Bazaar (upper level)"],
        note: "Mixed-use confirmed by Jimmy and identified as The Bazaar's upper level by Cruise Critic's shipyard tour, checked 2026-08-24.",
      },
      { deck: 7, carriesCabins: true, publicSpace: [] },
      { deck: 8, carriesCabins: true, publicSpace: [] },
      { deck: 9, carriesCabins: true, publicSpace: [] },
      { deck: 10, carriesCabins: true, publicSpace: [] },
      { deck: 11, carriesCabins: true, publicSpace: [] },
      {
        deck: 12,
        carriesCabins: true,
        publicSpace: [],
        note: "Cabins only, confirmed by Jimmy on 2026-08-24.",
      },
    ],
    cabinDecks: [3, 6, 7, 8, 9, 10, 11, 12, 15, 16],
    note: "The current page confirms the cabin decks. Jimmy confirmed deck 6 is mixed-use and deck 12 is cabins only on 2026-08-24, which establishes the decks 8–11 band. Cruise Critic's shipyard tour identifies deck 6's public space as the upper level of The Bazaar. The remaining public-space overlay is not fully transcribed, so no full deck stack is published.",
  }),
];
