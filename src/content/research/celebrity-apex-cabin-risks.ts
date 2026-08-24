import type { ObstructionKind } from "@/lib/obstruction";

/**
 * CELEBRITY APEX CABIN-RISK RESEARCH — AWAITING OPERATOR DECISION.
 *
 * This is deliberately separate from `ShipContent`. The sources establish
 * cabin-level view limitations, three noise-location checks and the lift-bank
 * geometry, but they do not establish every marked cabin's obstruction cause,
 * current activity availability or a refit history. Nothing in this file
 * reaches the live Apex record until the operator signs the wording.
 */

type ResearchSource = {
  label: string;
  url: string;
  checked: "2026-08-24";
  evidence: "official" | "member-report" | "secondary-cabin-guide";
};

type NoiseCandidate = {
  source: "theater" | "lido" | "buffet";
  where: string;
  evidence:
    | "member-report-plus-official-plan"
    | "secondary-guide-plus-official-plan";
  sourceUrl: string;
};

const CURRENT_PLAN: ResearchSource = {
  label: "Celebrity Apex current deck plans — Apr 24, 2026 to Apr 22, 2027",
  url: "https://www.celebritycruises.com/cruise-ships/celebrity-apex/deck-plans",
  checked: "2026-08-24",
  evidence: "official",
};

const DETAILED_PLAN: ResearchSource = {
  label: "Celebrity Apex detailed official deck plan and legend — beginning Mar 7, 2025",
  url: "https://www.test1.celebritycruises.com/gb/cruise-ships/celebrity-apex/deck-plan",
  checked: "2026-08-24",
  evidence: "official",
};

function officialDeckImage(deck: 3 | 4 | 6 | 7 | 8 | 12 | 14): ResearchSource {
  const paddedDeck = String(deck).padStart(2, "0");
  return {
    label: `Celebrity Apex official deck ${deck} image`,
    url: `https://www.test1.celebritycruises.com/content/dam/celebrity/miscellaneous/deckplans/apex/profile-2321/AX_2321_Deck_${paddedDeck}.png`,
    checked: "2026-08-24",
    evidence: "official",
  };
}

const LIFEBOAT_REPORT: ResearchSource = {
  label: "Cruise Critic member report — lifeboat below an Apex cabin",
  url: "https://www.cruisecritic.com/cruise/celebrity/celebrity-apex/reviews/720809",
  checked: "2026-08-24",
  evidence: "member-report",
};

const EDEN_REPORT: ResearchSource = {
  label: "Cruise Critic member report — deck 7 cabin above Eden show noise",
  url: "https://www.cruisecritic.com/cruise/celebrity/celebrity-apex/reviews/732264",
  checked: "2026-08-24",
  evidence: "member-report",
};

const OCEANVIEW_REPORT: ResearchSource = {
  label: "Cruise Critic member report — deck 12 below Oceanview Cafe",
  url: "https://www.cruisecritic.com/cruise/celebrity/celebrity-apex/reviews/724738",
  checked: "2026-08-24",
  evidence: "member-report",
};

const PARTIAL_VIEW_GUIDE: ResearchSource = {
  label: "Planet Cruise Apex cabin guide — partial views from structure or lifeboat",
  url: "https://www.planetcruise.com/en/celebrity-apex/cabin-details",
  checked: "2026-08-24",
  evidence: "secondary-cabin-guide",
};

const POOL_OVERHEAD_GUIDE: ResearchSource = {
  label: "Cruise.Blog Apex cabin guide — deck 12 pool and buffet overhead",
  url: "https://cruise.blog/2025/08/celebrity-apex-cabins-to-avoid",
  checked: "2026-08-24",
  evidence: "secondary-cabin-guide",
};

export const CELEBRITY_APEX_CABIN_RISK_RESEARCH = {
  ship: "Celebrity Apex",
  checked: "2026-08-24",
  operatorStatus: "awaiting-operator-sign-off",
  currentPlanWindow: "April 24, 2026–April 22, 2027",
  detailedPlanWindow: "beginning March 7, 2025",
  freshnessNote:
    "The production page establishes the current sailing window. The detailed legend and image set begin March 7, 2025, so the operator must confirm that the current plan retains the same symbols and geometry before signing.",
  sources: [
    CURRENT_PLAN,
    DETAILED_PLAN,
    officialDeckImage(3),
    officialDeckImage(4),
    officialDeckImage(6),
    officialDeckImage(7),
    officialDeckImage(8),
    officialDeckImage(12),
    officialDeckImage(14),
    LIFEBOAT_REPORT,
    EDEN_REPORT,
    OCEANVIEW_REPORT,
    PARTIAL_VIEW_GUIDE,
    POOL_OVERHEAD_GUIDE,
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
      "An Apex passenger reports a lifeboat below the cabin window. A secondary cabin-category guide attributes partial views to either structure or lifeboat, while the official deck images show the ship's lifeboats and Magic Carpet frame geometry. None of those sources makes either cause a deck-wide rule.",
    candidateWording:
      "Celebrity marks view limitations by exact cabin and sells Partial View categories on Apex. An Apex passenger report establishes a lifeboat below at least one cabin, while cabin-category guidance identifies structure or lifeboat as cabin-specific causes. Treat both as exact-cabin checks, not deck-wide rules, and verify the current plan marker and category for the exact cabin.",
  },
  noise: {
    candidates: [
      {
        source: "theater",
        where: "aft deck 7 above Eden on deck 6",
        evidence: "member-report-plus-official-plan",
        sourceUrl: EDEN_REPORT.url,
      },
      {
        source: "lido",
        where: "deck 12 below the pool area on deck 14",
        evidence: "secondary-guide-plus-official-plan",
        sourceUrl: POOL_OVERHEAD_GUIDE.url,
      },
      {
        source: "buffet",
        where: "aft deck 12 below Oceanview Cafe on deck 14",
        evidence: "member-report-plus-official-plan",
        sourceUrl: OCEANVIEW_REPORT.url,
      },
    ] satisfies NoiseCandidate[],
    candidateWording:
      "At the aft end of deck 7, check the exact footprint over Eden: an Apex passenger reports late-evening music and bass in a cabin above the venue. On deck 12, check the deck 14 footprint immediately above because Celebrity skips deck 13. One passenger reports all-day noise beginning around 4 a.m. below Oceanview Cafe, and secondary cabin guidance warns about the pool footprint. These are location checks, not warnings against every cabin on either deck.",
  },
  elevators: {
    bankCount: 2,
    positions: ["forward of center", "aft of center"],
    evidence:
      "The official deck 3, 6, 8 and 12 images each show the same two passenger elevator banks and no central midship bank.",
    candidateWording:
      "Apex's cabin decks have one elevator bank forward of center and one aft of center, with no central midship bank. For a mobility booking, balance the midship motion advantage against the walk to a lift and check the specific cabin's route.",
  },
  excludedReports: [
    "A post-dry-dock report that the Magic Carpet was stuck describes one sailing and is too perishable to establish current availability.",
    "Reports of Infinite Veranda creaks and rattles are maintenance- or condition-specific and do not establish a stable cabin-location rule.",
    "General deck 3 noise guidance was weak or conflicting, so no Apex deck 3 noise warning is proposed.",
  ],
  availability: {
    state: "unknown",
    note: "No current out-of-service experience was established in this pass. Absence of a report is not proof that every experience is operating.",
  },
  refits: {
    state: "unknown",
    note: "No refit claim is made. The current plan window is recorded instead of assuming that the detailed image set remains identical.",
  },
} as const;
