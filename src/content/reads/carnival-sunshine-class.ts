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
 * Sunshine class: Sunshine, Sunrise, Radiance.
 *
 * MY RESEARCH, NOT OPERATOR-CONFIRMED. Cabin and traps are both
 * `verified: false`.
 *
 * These aren't a class in the built-together sense — they're three
 * Destiny-class hulls (Destiny, Triumph, Victory) rebuilt and renamed
 * years apart. That matters more than usual: the rebuilds added different
 * things at different times, so "what's onboard" varies by ship in a way
 * it doesn't within a real class.
 *
 * The exception that actually bites: WaterWorks came with Sunshine's 2013
 * rebuild, but SportSquare and mini-golf were added only in the later
 * Radiance (2018) and Sunrise (2019) rebuilds. Sunshine doesn't have them.
 *
 * Deliberately NOT encoded:
 *   - elevator counts. Two figures surfaced (ten ship-wide, and four glass
 *     cars at the atrium) and nothing reconciles them, so the record says
 *     nothing rather than picking one.
 *   - porthole square footage. Sources gave both 170 and 220 sq ft for
 *     what may or may not be the same category. The general porthole steer
 *     stands on its own without a number attached.
 *   - the exact cabin numbers for the deck 10 spa obstructions. The source
 *     rendered them in a four-digit form that doesn't match Carnival's
 *     usual numbering, so they're described by position instead.
 *   - theater, nightclub and galley placement. Nothing class-specific
 *     surfaced, and the Dream-class prose must not be borrowed onto these
 *     hulls just because they're both mid-size Carnival ships.
 */

const SUNSHINE_CLASS_SOURCES: Source[] = [
  {
    label: "Radiance obstructed staterooms — Carnival's own knowledge base",
    url: "https://help.goccl.com/app/answers/detail/a_id/5523",
    checked: "2026-08-18",
  },
  {
    label: "Sunshine's 2013 rebuild — WaterWorks, Twister, deck 10",
    url: "https://www.seatrade-cruise.com/refurb-design-interiors/carnival-sunshine-has-over-the-water-slide-milkshake-bar-and-more",
    checked: "2026-08-18",
  },
  {
    label: "Sunshine deck plans — cabins on the Lido and spa decks",
    url: "https://www.icruise.com/deckplans/carnival-cruises-carnival-sunshine-deckplans-lido-deck.html",
    checked: "2026-08-18",
  },
];

/** SportSquare and mini-golf came with the later two rebuilds only. */
const REBUILT_WITH_SPORTSQUARE = new Set(["sunrise", "radiance"]);

function sunshineClassContent(
  ship: "sunshine" | "sunrise" | "radiance",
): ShipContent {
  const hasSportSquare = REBUILT_WITH_SPORTSQUARE.has(ship);

  return {
    reviewDue: "2027-02-01",
    sources: [...CARNIVAL_SOURCES, ...SUNSHINE_CLASS_SOURCES],

    cabin: {
      // MY RESEARCH. Not signed off.
      verified: false,
      placementNote:
        "Midship first. This is an older, smaller hull than the Dream or Vista ships and the stack is more compressed — the Lido on deck 9 carries cabins itself, and deck 10 mixes the spa and the waterpark in with more cabins. So the top two cabin decks are both busy decks, not quiet ones. Decks 6 to 8 midship are the sensible default; treat anything on 9 or 10 as needing a look at what's next door before you confirm it.",
      motionAvoid: MOTION_RULE,
      vibrationNote: VIBRATION_RULE,
      categoryWarnings: [
        PORTHOLE_STEER,
        BOTTOM_DECK_NOTE,
        "These three are rebuilt Destiny-class hulls, not sisters that came out of the yard together, and they were rebuilt years apart. Don't assume a cabin or a venue that exists on one exists on the others — check the actual ship rather than the class.",
        "A client asking for a high deck to get away from the crowd is asking for the wrong thing here. On this hull, high means the pool deck and the waterpark. Midship on 7 or 8 gets them what they actually want.",
      ],
      hazardsAboveBelow: [
        {
          source: "lido",
          where:
            "deck 9 — the pool deck carries cabins itself, so it's a corridor-and-next-door problem there rather than only an overhead one",
        },
        {
          source: "kids",
          where:
            "the WaterWorks complex on deck 10, in among the spa cabins on the same deck",
        },
      ],
      obstructedViewNotes:
        ship === "sunshine"
          ? "No obstruction list surfaced for this hull. Carnival's own knowledge base documents them on Radiance — a steel balcony railing across the forward spa cabins on deck 10, and the forward cabins on decks 6 and 7 looking onto a shared observation platform. These are rebuilt sisters, so check the same positions here, but I'm not claiming the same cabins are affected."
          : "Forward-facing cabins are the problem on this hull, in two places. The forward spa cabins on deck 10 are blocked by a solid steel balcony railing, and the forward cabins on decks 6 and 7 — roughly 6201 to 6206 and 7201 to 7206 — look onto a shared observation platform rather than open sea. The deck 6 and 7 numbers came through a secondary source, so confirm them on the booking screen before you promise a view.",
      connectingNote: CONNECTING_RULE,
      minorPlacementRule: CARNIVAL_MINOR_PLACEMENT,
      accessibilityNote:
        "Everything is closer together on this hull than on the big new ships, which generally helps — the Lido isn't a separate expedition upward, it's a cabin deck. The Excel-class problem of dining low and pool high is much less pronounced here, though that's my read of the deck mix rather than a sourced claim. Confirm scooter clearance against Carnival's accessible deck plan as usual.",
    },

    money: CARNIVAL_MONEY,

    traps: {
      // MY RESEARCH. Not signed off.
      verified: false,
      kidAgeHeightRules: `${CARNIVAL_SLIDE_RULES} The Twister slide runs a 42-inch minimum. ${CARNIVAL_KIDS_RULES}`,
      ...(ship === "sunshine"
        ? {}
        : {
            obstructedBalconyDecks:
              "the forward spa cabins on deck 10, and the forward cabins on decks 6 and 7 facing the shared observation platform",
          }),
      embarkationNote: CARNIVAL_EMBARKATION,
      other: [
        "Neither BOLT nor SkyRide is on this class — those are the Excel and Vista ships. Don't let a client arrive expecting the rollercoaster or the sky ride.",
        hasSportSquare
          ? "SportSquare and mini-golf came with this ship's rebuild. Sunshine didn't get them, so don't quote this ship's facilities off a Sunshine review."
          : "No SportSquare and no mini-golf on this one — those came with the later Radiance and Sunrise rebuilds, not Sunshine's. WaterWorks is here; the sports complex isn't.",
        "All three of these were rebuilt from older hulls at different times, so photos and reviews of one sister can be wrong about another. Check what's actually on the ship they're booked on.",
      ],
    },
  };
}

export const carnivalSunshine = sunshineClassContent("sunshine");
export const carnivalSunrise = sunshineClassContent("sunrise");
export const carnivalRadiance = sunshineClassContent("radiance");
