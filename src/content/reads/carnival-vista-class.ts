import type { ShipContent, Source } from "@/lib/types";
import {
  CARNIVAL_EMBARKATION,
  CARNIVAL_KIDS_RULES,
  CARNIVAL_MINOR_PLACEMENT,
  CARNIVAL_MONEY,
  CARNIVAL_SLIDE_RULES,
  CARNIVAL_SOURCES,
} from "./carnival-common";
import {
  BOTTOM_DECK_NOTE,
  CONNECTING_RULE,
  MOTION_RULE,
  PORTHOLE_STEER,
  VIBRATION_RULE,
} from "./operator-rules";

/**
 * Vista class: Vista, Horizon, Panorama. One rule family, worked up by
 * Jimmy (2026-08-18) from his own research — sources below, chat-verified
 * by him, not independently opened from this environment.
 *
 * The class exceptions he flagged:
 *   - IMAX exists on Vista and Horizon only. Panorama substitutes Sky
 *     Zone. Nothing IMAX-related may leak onto Panorama.
 *   - Vista's Havana Bar runs as a late-night Latin disco; on the other
 *     two it is recorded as a bar, not a nightclub.
 *
 * What he explicitly kept as researched-not-promoted, so it is NOT
 * encoded as fact here: midship-elevator congestion (traveler reports),
 * IMAX noise, gym noise, and any SkyRide weather-closure rule.
 */

const VISTA_CLASS_SOURCES: Source[] = [
  {
    label: "Vista deck plans — cabins deck 1 up, Lido on 10 over 9",
    url: "https://www.cruisemapper.com/deckplans/Carnival-Vista-1039",
    checked: "2026-08-18",
  },
  {
    label: "Junior Suites 9205/9206 obstructed — solid panel, all three ships",
    url: "https://www.icruise.com/cabins/carnival-cruises-carnival-vista-cabin-9205.html",
    checked: "2026-08-18",
  },
  {
    label: "Spa Suites 14205/14206 — solid steel panel railing",
    url: "https://cruiseline.com/ship/carnival-panorama/cabin/14205",
    checked: "2026-08-18",
  },
  {
    label: "Elevator layout — 8 forward, 4 midship, 4 aft",
    url: "https://cruisereport.com/reviews-2/carnival-vista",
    checked: "2026-08-18",
  },
  {
    label: "Panorama has no IMAX — Sky Zone instead",
    url: "https://www.carnival.com/cruise-ships/carnival-panorama",
    checked: "2026-08-18",
  },
];

/** SkyRide is on all three. Included in the fare, unlike BOLT. */
const SKYRIDE_RULES =
  "SkyRide needs 54 inches minimum and caps at 250 pounds. It's included in the fare, but the dress rules catch people: closed-toe athletic shoes and workout clothing required, and glasses need a strap or they stay behind.";

function vistaClassContent(ship: "vista" | "horizon" | "panorama"): ShipContent {
  const hasImax = ship !== "panorama";

  return {
    reviewDue: "2027-02-01",
    sources: [...CARNIVAL_SOURCES, ...VISTA_CLASS_SOURCES],

    cabin: {
      // Signed off by Jimmy, 2026-08-18, across the whole class — the
      // workup is his own research and he treats the three as one rule
      // family. Per-ship exceptions (IMAX, Vista's Havana disco) are
      // handled in the content, not by withholding the signature.
      verified: true,
      // The class's biggest insight: deck 9 is the trap that looks like
      // the answer. All cabins, but the Lido complex on 10 sits directly
      // over parts of it — exactly the looks-right-on-a-filter,
      // wrong-on-vertical-inspection case this product exists to catch.
      placementNote:
        "Deck 8, midship to aft, is the cleanest starting point on this class when nothing special is in play — it's sandwiched between cabin decks 7 and 9. Deck 9 looks ideal on paper but the Lido pools and buffet on 10 sit directly over parts of it, so check the vertical before booking 9. Cabins run all the way down to deck 1 here, unlike the newer ships.",
      motionAvoid: MOTION_RULE,
      vibrationNote: VIBRATION_RULE,
      categoryWarnings: [
        PORTHOLE_STEER,
        BOTTOM_DECK_NOTE,
        `On this class, check what shares the corridor before you confirm: the Havana complex aft on 5${
          ship === "vista" ? " (the Havana Bar turns Latin disco after midnight)" : ""
        }, Circle C and the entertainment complex on 6${
          hasImax ? " (the IMAX structure spans 6 to 8)" : ""
        }, Camp Ocean on 11, the gym forward on 12, and SkyRide over the spa cabins on 14. None of these is an automatic no — they're adjacency checks, not noise verdicts.`,
      ],
      // Only the genuinely vertical hazard goes here: Lido and buffet on
      // 10, over parts of 9. Same-deck adjacencies live in the warning
      // above — the engine renders this list as "directly above and
      // below", and it must not claim more than that.
      hazardsAboveBelow: [
        {
          source: "lido",
          where:
            "deck 10 — parts of deck 9 sit directly beneath the pools, so check the specific cabin rather than writing off the whole deck",
        },
        { source: "buffet", where: "the Lido Marketplace, also on deck 10" },
      ],
      obstructedViewNotes:
        "Four specific cabins, the same on all three ships: Junior Suites 9205 and 9206 and Spa Suites 14205 and 14206. A solid steel panel or bulkhead blocks the seated view — not a lifeboat.",
      obstructionKinds: ["solid-structure"],
      connectingNote: CONNECTING_RULE,
      minorPlacementRule: CARNIVAL_MINOR_PLACEMENT,
      elevatorNote:
        "Eight elevators forward, four midship, four aft — match the bank to where they'll spend the week. Forward suits the theatre and spa and has twice the cars; aft suits Havana and the aft pool and dining; midship balances the walking but sits where everyone converges. For mobility with no strong destination pattern, lean forward for the extra cars.",
      accessibilityNote:
        "Cabins run from deck 1 to 14 on a big hull, so align the cabin with the elevator bank nearest their daily routine rather than chasing a category — the forward bank's eight cars are the safest default when their week has no clear centre of gravity.",
    },

    money: CARNIVAL_MONEY,

    traps: {
      // Signed off by Jimmy, 2026-08-18.
      verified: true,
      kidAgeHeightRules: `${SKYRIDE_RULES} ${CARNIVAL_SLIDE_RULES} ${CARNIVAL_KIDS_RULES}`,
      obstructedBalconyDecks:
        "Junior Suites 9205 and 9206 and Spa Suites 14205 and 14206 — a solid panel, the same four cabins on all three ships",
      embarkationNote: CARNIVAL_EMBARKATION,
      other: hasImax
        ? [
            "The IMAX costs extra on top of the fare — no current price is published, so don't quote one — and the movie's own rating decides who can watch, not a ship rule.",
          ]
        : [
            "No IMAX on this one — Vista and Horizon have it, Panorama got Sky Zone instead. Don't promise the cinema.",
          ],
    },
  };
}

export const carnivalVista = vistaClassContent("vista");
export const carnivalHorizon = vistaClassContent("horizon");
export const carnivalPanorama = vistaClassContent("panorama");
