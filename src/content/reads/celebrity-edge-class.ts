import type { ShipContent, Source } from "@/lib/types";
import { CELEBRITY_EDGE_PLACEMENT_RESEARCH } from "@/content/research/celebrity-edge-placement";
import { CELEBRITY_XCEL_CABIN_RISK_RESEARCH } from "@/content/research/celebrity-xcel-cabin-risks";
import { MOTION_RULE, VIBRATION_RULE } from "./operator-rules";
import {
  CELEBRITY_TRAPS,
  celebrityShipSources,
} from "./celebrity-common";

type EdgeShip = "edge" | "apex" | "beyond" | "ascent" | "xcel";

const EDGE_VERANDA_SOURCE: Source = {
  label:
    "Celebrity veranda categories — Infinite Veranda design and conventional Sunset/Porthole alternatives",
  url: "https://www.celebritycruises.com/things-to-do-onboard/staterooms/veranda-stateroom",
  checked: "2026-08-24",
};

const XCEL_SOURCE: Source = {
  label: "Celebrity Xcel — The Bazaar is an Xcel-only destination experience",
  url: "https://www.celebritycruises.com/xcel/date-night-all-day/",
  checked: "2026-08-24",
};

const XCEL_BAZAAR_DECK_SOURCE: Source = {
  label:
    "Cruise Critic Celebrity Xcel shipyard tour — The Bazaar spans decks 5 and 6",
  url: "https://www.cruisecritic.com/articles/celebrity-xcel-photos-whats-new-sneak-peek-shipyard",
  checked: "2026-08-24",
};

const XCEL_CABIN_RISK_SOURCES: Source[] = [
  {
    label:
      "Cruise Critic Celebrity Xcel cabin review — deck 6 obstruction and venue-noise reports",
    url: "https://www.cruisecritic.com/cruise/celebrity/celebrity-xcel/cabins",
    checked: "2026-08-24",
  },
  {
    label:
      "Celebrity Xcel official deck 8 image — forward and aft elevator banks",
    url: "https://tst1.celebritycruises.com/content/dam/celebrity/miscellaneous/deckplans/xcel/XC_2331_Deck_08.png",
    checked: "2026-08-24",
  },
  {
    label:
      "Celebrity Xcel official deck 14 image — pool and Oceanview Cafe overhead footprint",
    url: "https://tst1.celebritycruises.com/content/dam/celebrity/miscellaneous/deckplans/xcel/XC_2331_Deck_14.png",
    checked: "2026-08-24",
  },
];

const EDGE_CABIN: NonNullable<ShipContent["cabin"]> = {
  // Infinite Veranda tradeoff signed off by Jimmy, 2026-08-24. The imported
  // motion and vibration rules were already operator-confirmed.
  verified: true,
  motionAvoid: MOTION_RULE,
  vibrationNote: VIBRATION_RULE,
  categoryWarnings: [
    "Treat an Edge Stateroom with Infinite Veranda as its own cabin design, not as a conventional balcony with a different name. Celebrity describes the room’s living area becoming the veranda at the touch of a button. If the client wants a separate outdoor platform, compare it with the Sunset Veranda or Deluxe Porthole View with Veranda categories, which Celebrity describes as outdoor step-out spaces. This is a preference tradeoff, not a verdict on which is better.",
  ],
  hazardsAboveBelow: [],
};

const PLACEMENT_RANGE: Partial<Record<EdgeShip, string>> = {
  edge: "decks 8 through 10",
  apex: "decks 8 through 10",
  beyond: "decks 8 through 11",
  ascent: "decks 8 through 11",
  xcel: "decks 8 through 11",
};

const PLACEMENT_NOTE: Partial<Record<EdgeShip, string>> = {
  edge:
    "Decks 8 through 10 are the cabin-sandwich band on this hull. Deck 7 sits above mixed-use deck 6, while deck 11 sits below Luminae on cabin deck 12. Keep the choice midship and check the actual cabin rather than blessing every room in the band.",
  apex:
    "Decks 8 through 10 are the cabin-sandwich band on this hull. Deck 7 sits above mixed-use deck 6, while deck 11 sits below Luminae on cabin deck 12. Keep the choice midship and check the actual cabin rather than blessing every room in the band.",
  beyond:
    "Decks 8 through 11 are the cabin-sandwich band on this hull. Deck 7 sits above mixed-use deck 6; deck 12 is cabins only on the checked plan, with Luminae up on deck 16. Keep the choice midship and check the actual cabin rather than blessing every room in the band.",
  ascent:
    "Decks 8 through 11 are the cabin-sandwich band on this hull. Deck 7 sits above mixed-use deck 6; deck 12 is cabins only on the checked plan, with Luminae up on deck 16. Keep the choice midship and check the actual cabin rather than blessing every room in the band.",
  xcel:
    "Decks 8 through 11 are the confirmed cabin-sandwich band on this hull. Deck 7 sits above the upper level of The Bazaar on mixed-use deck 6, while deck 12 is cabins only. Keep the choice midship and check the actual cabin rather than extending this reviewed band into a full-deck claim.",
};

const PLACEMENT = new Map(
  CELEBRITY_EDGE_PLACEMENT_RESEARCH.map((record) => [
    record.ship.toLowerCase().replace("celebrity ", "") as EdgeShip,
    record,
  ]),
);

function edgeShip(ship: EdgeShip): ShipContent {
  const name = `Celebrity ${ship.charAt(0).toUpperCase()}${ship.slice(1)}`;
  const isXcel = ship === "xcel";
  const placement = PLACEMENT.get(ship);
  const placementRange = PLACEMENT_RANGE[ship];
  const placementNote = PLACEMENT_NOTE[ship];
  let cabin: NonNullable<ShipContent["cabin"]> = EDGE_CABIN;
  let decks: ShipContent["decks"];
  if (placement && placementRange && placementNote) {
    // Jimmy signed all five per-hull placement results on 2026-08-24. Xcel
    // carries the signed placement fields but no deck table because only the
    // adjacent decks needed for the decision have been transcribed.
    cabin = {
      ...EDGE_CABIN,
      verified: true,
      midshipRange: placementRange,
      placementNote,
    };
    decks = placement.decks ?? undefined;
  }
  if (isXcel) {
    // Jimmy signed all three Xcel cabin-risk decisions on 2026-08-24.
    // These facts stay hull-specific: no sister inherits Xcel's obstruction
    // mechanism, noise adjacencies or elevator geometry.
    cabin = {
      ...cabin,
      hazardsAboveBelow:
        CELEBRITY_XCEL_CABIN_RISK_RESEARCH.noise.candidates.map(
          ({ source, where }) => ({ source, where }),
        ),
      obstructedViewNotes:
        CELEBRITY_XCEL_CABIN_RISK_RESEARCH.obstruction.candidateNote,
      obstructionKinds: [
        ...CELEBRITY_XCEL_CABIN_RISK_RESEARCH.obstruction
          .confirmedMechanisms,
      ],
      elevatorNote:
        CELEBRITY_XCEL_CABIN_RISK_RESEARCH.elevators.candidateNote,
    };
  }
  const hasSignedPlacement = Boolean(placement && placementRange && placementNote);

  return {
    sources: [
      ...celebrityShipSources(`celebrity-${ship}`, name),
      EDGE_VERANDA_SOURCE,
      ...(hasSignedPlacement && placement
        ? [
            {
              label: `${name} detailed official deck plan — ${placement.detailedPlanWindow}`,
              url: placement.detailedPlanUrl,
              checked: placement.checked,
            },
          ]
        : []),
      ...(isXcel
        ? [
            XCEL_SOURCE,
            XCEL_BAZAAR_DECK_SOURCE,
            ...XCEL_CABIN_RISK_SOURCES,
          ]
        : []),
    ],
    fareInclusions: { state: "not-researched" },
    decks,
    cabin,
    traps: isXcel
      ? {
          ...CELEBRITY_TRAPS,
          // Xcel-specific Bazaar exception signed off by Jimmy, 2026-08-24.
          verified: true,
          other: [
            "The Bazaar is an Xcel-specific experience, not an Edge-series class constant. Do not promise it on Edge, Apex, Beyond or Ascent because a client has seen it in Xcel material.",
          ],
        }
      : CELEBRITY_TRAPS,
  };
}

export const celebrityEdge = edgeShip("edge");
export const celebrityApex = edgeShip("apex");
export const celebrityBeyond = edgeShip("beyond");
export const celebrityAscent = edgeShip("ascent");
export const celebrityXcel = edgeShip("xcel");
