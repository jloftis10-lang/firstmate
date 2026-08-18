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
 * Dream class: Dream, Magic, Breeze (2009–2012).
 *
 * MY RESEARCH, NOT OPERATOR-CONFIRMED. Both cabin and traps are
 * `verified: false` — Jimmy has not walked these hulls in this workup, and
 * the deck-plan detail below came from secondary aggregators because
 * cruisemapper, cruisedeckplans and carnival.com are all unreachable from
 * this environment. Everything here is a lead for his review, not a call
 * an advisor should act on yet.
 *
 * The class insight, if it holds up: unlike the newer ships, deck 10 is
 * BOTH the Lido deck and a cabin deck. The pool isn't above those cabins,
 * it's beside them — which is a different conversation from the Vista
 * class's "deck 9 sits under the Lido on 10".
 *
 * The within-class exception: Magic and Breeze carry SportSquare and the
 * SkyCourse ropes course; Dream is absent from Carnival's own SportSquare
 * ship list. Same shape as Panorama's missing IMAX — don't let it leak.
 *
 * Deliberately NOT encoded, because the sourcing didn't hold up:
 *   - the forward/midship/aft elevator split (only a total of 18 surfaced)
 *   - Dream/Magic obstruction lists (only Breeze's surfaced)
 *   - theater/nightclub/galley deck numbers (generic aggregator prose with
 *     no attributable source — it read like fleet boilerplate, not a
 *     Dream-class deck plan)
 */

const DREAM_CLASS_SOURCES: Source[] = [
  {
    label: "Dream-class deck plans — cabins on the Lido deck, spa cabins on 12",
    url: "https://www.cruisedeckplans.com/ships/Carnival-Dream",
    checked: "2026-08-18",
  },
  {
    label: "Breeze obstructed cabins — 9205/9206 bulkhead, forward observation platform",
    url: "https://www.cruisebooking.com/articles/carnival-cruise-tips/carnival-breeze-rooms-to-avoid",
    checked: "2026-08-18",
  },
  {
    label: "SportSquare ship list — Magic and Breeze, not Dream",
    url: "https://help.carnival.com/app/answers/detail/a_id/1158",
    checked: "2026-08-18",
  },
  {
    label: "Twister waterslide — 42 inch minimum",
    url: "https://www.carnival.com/onboard/twister-waterslide",
    checked: "2026-08-18",
  },
];

/** Magic and Breeze only. Dream is not on Carnival's SportSquare list. */
const SPORTSQUARE_SHIPS = new Set(["magic", "breeze"]);

function dreamClassContent(ship: "dream" | "magic" | "breeze"): ShipContent {
  const hasSportSquare = SPORTSQUARE_SHIPS.has(ship);

  return {
    reviewDue: "2027-02-01",
    sources: [...CARNIVAL_SOURCES, ...DREAM_CLASS_SOURCES],

    cabin: {
      // MY RESEARCH. Not signed off — the deck-level detail below rests on
      // aggregator snippets, not a deck plan anyone opened.
      verified: false,
      placementNote:
        "Midship first, as always. The thing that's different about this class: deck 10 is the Lido deck and a cabin deck at the same time, so a client who books deck 10 for the view can end up beside the pool rather than below it. Cabins run down to deck 1 and up to deck 12, with the spa cabins on 12 sitting under the waterpark and sport deck. Treat decks 10 and 12 as the two that need a vertical check, and decks 7 to 9 midship as the quiet middle of the stack.",
      motionAvoid: MOTION_RULE,
      vibrationNote: VIBRATION_RULE,
      categoryWarnings: [
        PORTHOLE_STEER,
        BOTTOM_DECK_NOTE,
        "Cove balconies here run about 185 square feet inside with a 45-foot partly-enclosed veranda, and the aft-view extended balconies get the wake — both are worth pricing against a standard balcony rather than assuming the standard one wins.",
        "Deck 10 cabins sit on the Lido deck itself rather than under it. That's not automatically bad — it's a short walk to everything — but it's the wrong pick for anyone who wants quiet, and it surprises people who read \"deck 10\" as \"high and away from it all\".",
      ],
      hazardsAboveBelow: [
        {
          source: "lido",
          where:
            "deck 10 — same deck as the cabins there rather than above them, so it's an along-the-corridor problem, not an overhead one",
        },
        {
          source: "kids",
          where:
            "the waterpark on the sport deck, over the spa cabins on 12 — check the specific cabin rather than writing off the deck",
        },
        {
          source: "sports",
          where: "the sport deck above 12, on the ships that carry it",
        },
      ],
      obstructedViewNotes:
        ship === "breeze"
          ? "On Breeze specifically: Junior Suites 9205 and 9206 are blocked by a steel bulkhead, and the forward cabins on decks 6, 7, 9 and 10 look onto a shared observation platform rather than open sea. That list came from traveler write-ups rather than Carnival's own obstruction sheet, so confirm it on the booking screen before you promise anything. No equivalent list surfaced for Dream or Magic — that's a gap in the research, not evidence they're clean."
          : "No obstruction list surfaced for this hull. Breeze has a documented one (a steel bulkhead at 9205/9206, plus forward cabins on 6, 7, 9 and 10 facing an observation platform), and these are sister ships, so check the same positions on the booking screen — but I'm not claiming the same cabins are affected here.",
      connectingNote: CONNECTING_RULE,
      minorPlacementRule: CARNIVAL_MINOR_PLACEMENT,
      elevatorNote:
        "Eighteen elevators on this class, which is a lot of cars — but I couldn't establish how they split forward, midship and aft, so don't steer anyone to a bank on my say-so. The rule that still holds: pick the end of the ship where they'll actually spend the week.",
      accessibilityNote:
        "Cabins spread from deck 1 to deck 12 on a big hull, and the pool sits on a cabin deck rather than well above it — which actually helps a slower traveller, because the Lido isn't a separate trip up. The vertical split that bites on the Excel ships is less pronounced here, though that's my read of the deck mix rather than something a source states outright. Confirm scooter clearance against Carnival's accessible deck plan as usual.",
    },

    money: CARNIVAL_MONEY,

    traps: {
      // MY RESEARCH. Not signed off.
      verified: false,
      kidAgeHeightRules: `${CARNIVAL_SLIDE_RULES} The Twister slide runs a 42-inch minimum. ${CARNIVAL_KIDS_RULES}`,
      ...(ship === "breeze"
        ? {
            obstructedBalconyDecks:
              "Junior Suites 9205 and 9206, and the forward cabins on decks 6, 7, 9 and 10 that face the shared observation platform",
          }
        : {}),
      embarkationNote: CARNIVAL_EMBARKATION,
      other: [
        "Neither BOLT nor SkyRide is on this class — those are the Excel and Vista ships. Don't let a client arrive expecting the rollercoaster or the sky ride.",
        hasSportSquare
          ? "SportSquare and the SkyCourse ropes course are here, but I don't have published height or weight minimums for the ropes course — check before you quote one to a family."
          : "No SportSquare or ropes course on this one — Magic and Breeze have it, Dream doesn't appear on Carnival's own list for it. Don't promise the ropes course.",
      ],
    },
  };
}

export const carnivalDream = dreamClassContent("dream");
export const carnivalMagic = dreamClassContent("magic");
export const carnivalBreeze = dreamClassContent("breeze");
