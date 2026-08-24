import type { ObstructionKind } from "@/lib/obstruction";

/**
 * CELEBRITY XCEL CABIN-RISK RESEARCH AND OPERATOR DECISION.
 *
 * This is deliberately separate from `ShipContent`. The sources establish
 * where the plan marks view limitations, one confirmed obstruction mechanism,
 * three noise adjacencies and the lift-bank geometry. They do not establish
 * every marked cabin's obstruction cause, current activity availability or a
 * refit history. Jimmy signed the obstruction, noise and elevator wording on
 * 2026-08-24. Those three findings now reach the Xcel record only; availability
 * and refit history remain unknown.
 */

type ResearchSource = {
  label: string;
  url: string;
  checked: "2026-08-24";
};

type NoiseCandidate = {
  source: "nightclub" | "lido" | "buffet";
  where: string;
  evidence: "firsthand-editor-report" | "editor-warning-plus-official-plan";
  sourceUrl: string;
};

const CURRENT_PLAN: ResearchSource = {
  label: "Celebrity Xcel current deck plans — Nov 1, 2025 to Apr 9, 2027",
  url: "https://www.celebritycruises.com/int/cruise-ships/celebrity-xcel/deck-plans",
  checked: "2026-08-24",
};

const DETAILED_PLAN: ResearchSource = {
  label: "Celebrity Xcel detailed official deck plan and legend",
  url: "https://tst1.celebritycruises.com/cruise-ships/celebrity-xcel/deck-plan",
  checked: "2026-08-24",
};

const DECK_6_IMAGE: ResearchSource = {
  label: "Celebrity Xcel official deck 6 image",
  url: "https://tst1.celebritycruises.com/content/dam/celebrity/miscellaneous/deckplans/xcel/XC_2331_Deck_06.png",
  checked: "2026-08-24",
};

const DECK_8_IMAGE: ResearchSource = {
  label: "Celebrity Xcel official deck 8 image",
  url: "https://tst1.celebritycruises.com/content/dam/celebrity/miscellaneous/deckplans/xcel/XC_2331_Deck_08.png",
  checked: "2026-08-24",
};

const DECK_12_IMAGE: ResearchSource = {
  label: "Celebrity Xcel official deck 12 image",
  url: "https://tst1.celebritycruises.com/content/dam/celebrity/miscellaneous/deckplans/xcel/XC_2331_Deck_12.png",
  checked: "2026-08-24",
};

const DECK_14_IMAGE: ResearchSource = {
  label: "Celebrity Xcel official deck 14 image",
  url: "https://tst1.celebritycruises.com/content/dam/celebrity/miscellaneous/deckplans/xcel/XC_2331_Deck_14.png",
  checked: "2026-08-24",
};

const CRUISE_CRITIC_CABINS: ResearchSource = {
  label: "Cruise Critic editor review — Celebrity Xcel cabins and rooms to avoid",
  url: "https://www.cruisecritic.com/cruise/celebrity/celebrity-xcel/cabins",
  checked: "2026-08-24",
};

export const CELEBRITY_XCEL_CABIN_RISK_RESEARCH = {
  ship: "Celebrity Xcel",
  checked: "2026-08-24",
  operatorStatus: "signed-2026-08-24",
  currentPlanWindow: "November 1, 2025–April 9, 2027",
  sources: [
    CURRENT_PLAN,
    DETAILED_PLAN,
    DECK_6_IMAGE,
    DECK_8_IMAGE,
    DECK_12_IMAGE,
    DECK_14_IMAGE,
    CRUISE_CRITIC_CABINS,
  ],
  obstruction: {
    officialMarkerDecks: [3, 6, 7, 8, 9, 10, 11, 12],
    partialViewCategories: [
      "Edge Stateroom with Infinite Veranda (Partial View)",
      "Concierge Class (Partial View)",
    ],
    confirmedMechanisms: ["lifeboat-davit"] as ObstructionKind[],
    mechanismScope:
      "Cruise Critic attributes many deck 6 obstructions to lifeboats hanging just below the windows. The cause of markers outside deck 6 is not established.",
    candidateNote:
      "Celebrity marks view limitations by cabin and sells Partial View categories on Xcel. Cruise Critic specifically identifies lifeboats just below many deck 6 windows; disclose that deck 6 mechanism, but do not call every marked cabin on decks 3 and 7–12 a lifeboat obstruction. Check the current plan symbol and category for the exact cabin.",
  },
  noise: {
    candidates: [
      {
        source: "nightclub",
        where: "deck 6 cabin 6155 above The Club",
        evidence: "firsthand-editor-report",
        sourceUrl: CRUISE_CRITIC_CABINS.url,
      },
      {
        source: "lido",
        where: "deck 12 below The Pool Club and pool area on deck 14",
        evidence: "editor-warning-plus-official-plan",
        sourceUrl: CRUISE_CRITIC_CABINS.url,
      },
      {
        source: "buffet",
        where: "aft deck 12 below Oceanview Cafe on deck 14",
        evidence: "editor-warning-plus-official-plan",
        sourceUrl: CRUISE_CRITIC_CABINS.url,
      },
    ] satisfies NoiseCandidate[],
    candidateWarning:
      "Cabin 6155 has a firsthand report of nighttime sound from The Club directly below. On deck 12, check the exact overhead footprint before booking: The Pool Club/pool area and Oceanview Cafe occupy deck 14 immediately above because Celebrity skips deck 13.",
  },
  elevators: {
    bankCount: 2,
    positions: ["forward of center", "aft of center"],
    evidence:
      "The official deck 6, 8 and 12 images each show the same two passenger elevator banks and no central midship bank.",
    candidateNote:
      "Xcel's cabin decks have one elevator bank forward of center and one aft of center, with no central midship bank. For a mobility booking, balance the midship motion advantage against the walk to a lift and check the specific cabin's route.",
  },
  availability: {
    state: "unknown",
    note: "No current out-of-service experience was established in this pass. Absence of a report is not proof that every experience is operating.",
  },
  refits: {
    state: "unknown",
    note: "No refit claim is made. The current plan window is recorded instead of inferring that a new ship has no configuration changes.",
  },
} as const;
