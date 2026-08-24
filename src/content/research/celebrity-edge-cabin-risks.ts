import type { ObstructionKind } from "@/lib/obstruction";

/**
 * CELEBRITY EDGE CABIN-RISK RESEARCH — AWAITING OPERATOR SIGN-OFF.
 *
 * This is deliberately separate from `ShipContent`. The official plan and
 * cabin reports establish candidate obstruction mechanisms, two noise checks
 * and the lift-bank geometry, but the detailed image set predates the current
 * production-plan window. Nothing in this file reaches live advice until the
 * operator reviews the current plan and signs the proposed wording.
 */

type ResearchSource = {
  label: string;
  url: string;
  checked: "2026-08-24";
  evidence: "official" | "editor" | "member-report";
};

const CURRENT_PLAN: ResearchSource = {
  label: "Celebrity Edge current deck plans — May 14, 2026 to Apr 18, 2027",
  url: "https://www.celebritycruises.com/cruise-ships/celebrity-edge/deck-plans",
  checked: "2026-08-24",
  evidence: "official",
};

const DETAILED_PLAN: ResearchSource = {
  label: "Celebrity Edge detailed official deck plan and legend",
  url: "https://www.test1.celebritycruises.com/mx/cruise-ships/celebrity-edge/deck-plan",
  checked: "2026-08-24",
  evidence: "official",
};

function officialDeckImage(deck: 3 | 4 | 6 | 8 | 12 | 14): ResearchSource {
  const paddedDeck = String(deck).padStart(2, "0");
  return {
    label: `Celebrity Edge official deck ${deck} image`,
    url: `https://www.test1.celebritycruises.com/content/dam/celebrity/miscellaneous/deckplans/edge-updated/EG_2196_Deck_${paddedDeck}.png`,
    checked: "2026-08-24",
    evidence: "official",
  };
}

const CRUISE_CRITIC_CABINS: ResearchSource = {
  label: "Cruise Critic editor review — Celebrity Edge cabins to avoid",
  url: "https://www.cruisecritic.com/cruise/celebrity/celebrity-edge/cabins",
  checked: "2026-08-24",
  evidence: "editor",
};

const LIFEBOAT_REPORT: ResearchSource = {
  label: "Cruise Critic member report — solo cabins with lifeboat-obstructed views",
  url: "https://www.cruisecritic.com/cruise/celebrity/celebrity-edge/reviews/666241",
  checked: "2026-08-24",
  evidence: "member-report",
};

const MAGIC_CARPET_FRAME_REPORT: ResearchSource = {
  label: "Cruise Critic member report — Magic Carpet frame at starboard midship cabins",
  url: "https://www.cruisecritic.com/cruise/celebrity/celebrity-edge/reviews/673055",
  checked: "2026-08-24",
  evidence: "member-report",
};

const DECK_12_REPORT: ResearchSource = {
  label: "Cruise Critic member report — cabin 12148 support bar and pool-deck noise",
  url: "https://www.cruisecritic.com/cruise/celebrity/celebrity-edge/reviews/650687",
  checked: "2026-08-24",
  evidence: "member-report",
};

export const CELEBRITY_EDGE_CABIN_RISK_RESEARCH = {
  ship: "Celebrity Edge",
  checked: "2026-08-24",
  operatorStatus: "awaiting-operator-sign-off",
  currentPlanWindow: "May 14, 2026–April 18, 2027",
  detailedPlanWindow: "beginning April 16, 2023",
  freshnessNote:
    "The production page establishes the current sailing window. The detailed legend and images are an older official set, so the operator must confirm that the current plan retains the same symbols and geometry before signing.",
  sources: [
    CURRENT_PLAN,
    DETAILED_PLAN,
    officialDeckImage(3),
    officialDeckImage(4),
    officialDeckImage(6),
    officialDeckImage(8),
    officialDeckImage(12),
    officialDeckImage(14),
    CRUISE_CRITIC_CABINS,
    LIFEBOAT_REPORT,
    MAGIC_CARPET_FRAME_REPORT,
    DECK_12_REPORT,
  ],
  obstruction: {
    officialMarkerDecks: [3, 6, 7, 8, 9, 10, 11, 12],
    partialViewCategories: [
      "Edge Stateroom with Infinite Veranda (Partial View)",
      "Concierge Class (Partial View)",
    ],
    candidateMechanisms: [
      "lifeboat-davit",
      "solid-structure",
    ] as ObstructionKind[],
    mechanismScope:
      "Member reports identify lifeboats below some solo cabins on decks 6 and 7, and the Magic Carpet support frame beside specific starboard midship cabins. The official deck images corroborate the frame's location but do not turn either mechanism into a deck-wide rule.",
    proposedWording:
      "Celebrity marks view limitations by exact cabin and sells Partial View categories on Edge. Passenger reports identify two mechanisms: lifeboats below some solo cabins on decks 6 and 7, and the Magic Carpet support frame beside some starboard midship cabins. Treat both as cabin-specific checks, not deck-wide rules, and verify the current plan marker and category for the exact cabin.",
  },
  noise: {
    deckThreeCaution:
      "Cruise Critic's editor advises caution on deck 3 because cabins sit below casino, restaurant and shop space. Celebrity's deck 3 and 4 images confirm the mixed public-space adjacency, but not one common noise source for every cabin.",
    deckTwelveCaution:
      "A passenger in partial-view cabin 12148 reports nighttime chair movement from the pool deck above. Celebrity's deck 12 and 14 images confirm that deck 14 is physically above deck 12 because deck 13 is skipped and show the pool footprint overhead.",
    proposedWording:
      "On deck 3, check the exact overhead footprint before booking: cabins sit below a mixed deck of casino, restaurant and shop space. On deck 12, check the deck 14 footprint immediately above; a cabin 12148 report describes nighttime chair movement under the pool deck. These are location checks, not warnings against every cabin on either deck.",
    excludedReport:
      "A cabin 3143 report attributes noise to Le Grand Bistro, but the official deck images do not support that venue directly above the cabin. The report is therefore excluded from the proposed wording rather than reconciled by guesswork.",
  },
  elevators: {
    bankCount: 2,
    positions: ["forward of center", "aft of center"],
    evidence:
      "The official deck 3, 6, 8 and 12 images each show the same two passenger elevator banks and no central midship bank.",
    proposedWording:
      "Edge's cabin decks have one elevator bank forward of center and one aft of center, with no central midship bank. For a mobility booking, balance the midship motion advantage against the walk to a lift and check the specific cabin's route.",
  },
  availability: {
    state: "unknown",
    note: "No current out-of-service experience was established in this pass. Absence of a report is not proof that every experience is operating.",
  },
  refits: {
    state: "unknown",
    note: "No refit claim is made. The current plan window is recorded instead of assuming that the older detailed image set remains identical.",
  },
} as const;
