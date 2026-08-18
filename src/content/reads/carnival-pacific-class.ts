import type { ShipContent, Source } from "@/lib/types";
import {
  CARNIVAL_EMBARKATION,
  CARNIVAL_KIDS_RULES,
  CARNIVAL_MINOR_PLACEMENT,
  CARNIVAL_MONEY,
  CARNIVAL_SOURCES,
} from "./carnival-common";
import {
  CONNECTING_RULE,
  MOTION_RULE,
  PORTHOLE_STEER,
  VIBRATION_RULE,
} from "./operator-rules";

/**
 * Carnival Adventure and Carnival Encounter — Grand-class Princess hulls
 * on their third brand.
 *
 * MY RESEARCH, NOT OPERATOR-CONFIRMED. Cabin and traps are `verified: false`.
 *
 * Adventure was Golden Princess (2001), then Pacific Adventure with P&O
 * Australia (2020), then Carnival (2025). Encounter was Star Princess
 * (2002), then Pacific Encounter (2021), then Carnival (2025). Three
 * names each, and the research trap that follows from it is severe:
 * deck numbers and cabin numbers largely survived both rebrandings while
 * every venue name changed, so an old Princess deck plan is roughly
 * navigationally correct and completely wrong about what's on it.
 *
 * Worse: "Star Princess" now names a brand-new 2025 Sphere-class ship.
 * Searching for Star Princess deck plans returns a different vessel
 * entirely, not this hull.
 *
 * Two separate cabin defects on this class must NOT be merged, because
 * they're different decks and different problems:
 *   - Deck 8 carries an obstructed OCEANVIEW category (5A), blocked by
 *     lifeboats and structure.
 *   - Deck 10 (Caribe) balconies are only partly covered, so the deck 11
 *     balconies above overlook the outer half. That's a privacy problem,
 *     not a view obstruction.
 *
 * Deliberately NOT encoded: per-bank elevator car counts (not found), a
 * complete deck 8 obstructed-cabin list (not published anywhere
 * reachable), and any height minimum for the Twin-Racer waterslide — it's
 * a P&O-built slide and assuming Carnival's usual 42 inches applies to it
 * would be a guess with a child's disappointment on the other end.
 */

const PACIFIC_SOURCES: Source[] = [
  {
    label: "Adventure and Encounter lineage — Golden/Star Princess to P&O to Carnival",
    url: "https://cruise.blog/2025/03/carnival-adventure-carnival-encounter-debut",
    checked: "2026-08-18",
  },
  {
    label: "Deck 8 category 5A obstructed oceanviews; cabins on decks 14 and 15",
    url: "https://cruiseline.com/ship/carnival-encounter/decks",
    checked: "2026-08-18",
  },
  {
    label: "Caribe deck balconies partially covered and overlooked from above",
    url: "https://www.cruisedeckplans.com/ships/Carnival-Adventure",
    checked: "2026-08-18",
  },
  {
    label: "Mini-golf ship list excludes Adventure, Encounter and Luminosa",
    url: "https://www.carnival.com/onboard/mini-golf",
    checked: "2026-08-18",
  },
];

function pacificClassContent(ship: "adventure" | "encounter"): ShipContent {
  const formerName =
    ship === "adventure"
      ? "Golden Princess, then Pacific Adventure"
      : "Star Princess, then Pacific Encounter";

  return {
    reviewDue: "2027-02-01",
    sources: [...CARNIVAL_SOURCES, ...PACIFIC_SOURCES],

    cabin: {
      // MY RESEARCH. Not signed off.
      verified: false,
      placementNote:
        "Midship, and below deck 14. Cabins run from about deck 5 up to 15, and the top two of those are the busy ones: deck 14 carries staterooms alongside the Lido pools, the family pool and the buffet, and deck 15 carries more alongside the spa, the fitness centre and Camp Ocean — with the adventure park and the waterslides on 16 directly above them. Decks 9 to 12 midship are the band to work in. Deck 10 has its own catch, below.",
      motionAvoid: MOTION_RULE,
      vibrationNote: VIBRATION_RULE,
      categoryWarnings: [
        "Deck 10 balconies are the ones to explain in advance. They're the Princess Caribe design — bigger than the decks above at about 81 square feet, but only half covered, so the balconies on deck 11 look down onto the open half. It's a privacy trade, not an obstruction, and clients who wanted the bigger balcony are usually happy once they know. The ones who weren't told are not.",
        "The cabins are still Princess rooms under Carnival category codes. Balcony size and coverage vary by deck in a way they don't on a Carnival-built ship — the aft balconies on some decks are much bigger than others. Check the specific cabin's dimensions rather than trusting the category to be uniform.",
        PORTHOLE_STEER,
        "Deck 8 carries a whole obstructed-oceanview category. If you're booking an oceanview on this ship, read the code before the deck.",
      ],
      hazardsAboveBelow: [
        {
          source: "lido",
          where:
            "deck 14, which carries cabins itself alongside the pools and the buffet",
        },
        {
          source: "buffet",
          where: "the main buffet on deck 14, on the same deck as those cabins",
        },
        {
          source: "kids",
          where:
            "Camp Ocean on deck 15, plus the adventure park and waterslides on 16 directly above the deck 15 cabins",
        },
        {
          source: "gym",
          where: "the fitness centre on deck 15, alongside the cabins there",
        },
      ],
      obstructedViewNotes:
        "Deck 8 is the one. It carries category 5A, an oceanview sold as obstructed, blocked by lifeboats and ship structure — cabin numbers on that deck run from 8101 up to 8733, and no complete list of which ones are affected is published anywhere I could reach. One source claims a block around 8401 to 8412 is clear of the lifeboats, which is worth checking but not worth promising. Note this is separate from the deck 10 balcony coverage issue — different deck, different problem, don't merge them.",
      connectingNote: CONNECTING_RULE,
      minorPlacementRule: CARNIVAL_MINOR_PLACEMENT,
      elevatorNote:
        "Three lift lobbies — forward, midship and aft, the Grand-class layout. Two of the three connect the accessible corridors, so the bank matters more here than on a ship where they're interchangeable. I couldn't establish the car counts. The glazed panoramic lifts only run at the atrium on decks 5 to 7 and up at deck 14 over the pool; the atrium itself is only three decks tall, so it's not the landmark it is on a Carnival-built ship.",
      accessibilityNote:
        "Only two of the three lift lobbies connect the wheelchair-accessible corridors, which makes the choice of bank a real decision rather than a convenience — check it against the accessible deck plan for the specific cabin before booking. The dining and entertainment core sits low around decks 5 to 7 while the pools are on 14 and the adventure park is on 16, so the vertical trip is substantial even though the top of the ship is more compressed than Splendor's.",
    },

    money: CARNIVAL_MONEY,

    traps: {
      // MY RESEARCH. Not signed off.
      verified: false,
      kidAgeHeightRules: `The Twin-Racer waterslide came over from P&O rather than being built to Carnival's spec, and I could not find a published height minimum for it — do not quote the fleet's usual 42 inches for this slide without checking, because being wrong means a child turned away at the top of the stairs. ${CARNIVAL_KIDS_RULES}`,
      obstructedBalconyDecks:
        "the category 5A obstructed oceanviews on deck 8, blocked by lifeboats and structure",
      embarkationNote: CARNIVAL_EMBARKATION,
      other: [
        `This ship has had three names — ${formerName}, and now this one. Reviews, photos and deck plans circulate under all of them. The deck and cabin numbers mostly survived the rebrandings but every venue name changed, so an old plan will navigate correctly and describe the wrong ship.`,
        ship === "encounter"
          ? "Extra care searching this one: Princess launched a brand-new Star Princess in 2025, so searching that name returns a completely different, much newer ship rather than this hull's history."
          : "Searching the old Princess name will surface a 2001-era ship review — accurate about the bones, wrong about everything Carnival and P&O have changed since.",
        "No mini-golf. Carnival's own facility list excludes Adventure, Encounter and Luminosa — those three are the only ships in the fleet without it. Also no SportSquare, no ropes course, no BOLT and no SkyRide.",
        "What it does have is the P&O Australia inheritance: the Edge Adventure Park up on 16 with a zipline, a rock wall and a plank walk, plus the Twin-Racer slide and four pools. These are Australian-market concepts with no US-fleet equivalent, so don't describe them by analogy to a Carnival venue — name them.",
      ],
    },
  };
}

export const carnivalAdventure = pacificClassContent("adventure");
export const carnivalEncounter = pacificClassContent("encounter");
