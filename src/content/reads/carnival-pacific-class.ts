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
  QUIET_DEFAULT_RULE,
  VIBRATION_RULE,
} from "./operator-rules";

/**
 * Carnival Adventure and Carnival Encounter — Grand-class Princess hulls
 * on their third brand.
 *
 * SIGNED OFF by Jimmy, 2026-08-18, with one claim explicitly held at
 * researched rather than verified.
 *
 * Adventure was Golden Princess (2001), then Pacific Adventure with P&O
 * Australia (2020), then Carnival (2025). Encounter was Star Princess
 * (2002), then Pacific Encounter (2021), then Carnival (2025).
 *
 * This record needed the most provenance discipline of the six, and the
 * split it ended up with is the useful part:
 *
 *   - The 5A obstructed ocean-view CATEGORY is verified — it's on
 *     Carnival's current deck material for both ships.
 *   - WHAT causes the obstruction is only researched. Secondary cabin
 *     data points at some combination of lifeboat, tender and steel
 *     structure, and that is not the same standard of evidence as the
 *     category itself. The record says which is which.
 *   - The deck 10 balcony geometry stays researched too. There is real
 *     support for the Grand-class pattern of deep, partly-covered
 *     balconies with an exposed section visible from above, but not
 *     enough to sign "half covered and deck 11 overlooks them" as a
 *     universal statement. It's written as something to verify per cabin.
 *
 * The family finding that was missing entirely: both ships have Speedway
 * Splash, and Carnival publishes its limits — 47 inches minimum, 242
 * pounds maximum, included in the fare. Also EDGE. These are not ordinary
 * Carnival ships just because they now carry Carnival branding.
 */

const PACIFIC_SOURCES: Source[] = [
  {
    label:
      "Carnival Adventure accessible deck plan — category 5A obstructed ocean view",
    url: "https://www.carnival.com/~/media/Images/Ships/AQ/DeckPlans/carnival-adventure-accessible-cruising-deck-plan-pdf.pdf",
    checked: "2026-08-18",
  },
  {
    label:
      "Encounter deck 11 balcony geometry — partial cover on the Grand-class pattern",
    url: "https://www.cruisedeckplans.com/ships/deckbydeck.php?deck=11&ship=Carnival-Encounter",
    checked: "2026-08-18",
  },
  {
    label: "Speedway Splash — 47 inch minimum, 242 pound maximum, included",
    url: "https://www.carnival.com/onboard/speedway-splash-waterslides",
    checked: "2026-08-18",
  },
  {
    label: "EDGE adventure offering",
    url: "https://www.carnival.com/onboard/edge",
    checked: "2026-08-18",
  },
  {
    label: "Mini-golf availability list — neither ship appears",
    url: "https://www.carnival.com/onboard/mini-golf",
    checked: "2026-08-18",
  },
];

/**
 * Roughly decks 9 to 11 midship, held as an inference rather than a
 * verified ship fact — and one that the deck 9 and 10 balcony privacy
 * question can override for a particular cabin.
 *
 * OPERATOR-CONFIRMED as an inference (Jimmy, 2026-08-18).
 */
const PACIFIC_QUIET_DEFAULT = `Midship around decks 9 to 11. ${QUIET_DEFAULT_RULE} On this hull that band is the closest thing to a clean sandwich — but treat it as a starting point rather than a verdict, because the balcony privacy question on 9 and 10 can override it for a specific cabin.`;

function pacificClassContent(ship: "adventure" | "encounter"): ShipContent {
  const formerName =
    ship === "adventure"
      ? "Golden Princess, then Pacific Adventure"
      : "Star Princess, then Pacific Encounter";

  return {
    reviewDue: "2027-02-01",
    sources: [...CARNIVAL_SOURCES, ...PACIFIC_SOURCES],

    cabin: {
      // Signed off by Jimmy, 2026-08-18. Two claims inside are marked in
      // their own text as researched rather than verified: the mechanism
      // behind the 5A obstruction, and the deck 10 balcony geometry.
      verified: true,
      placementNote: `${PACIFIC_QUIET_DEFAULT} Above that, deck 14 carries staterooms alongside the Lido pools and the buffet, and deck 15 carries more alongside the spa, the fitness centre and the kids' club — with the adventure park and the waterslides on 16 directly above them. So the top of this ship is busy in a way the deck numbers don't advertise.`,
      motionAvoid: MOTION_RULE,
      vibrationNote: VIBRATION_RULE,
      categoryWarnings: [
        "The deck 10 balconies need explaining rather than avoiding, and the honest version is less precise than what circulates. These are the Princess Caribe design — unusually deep, with the forward portion covered and a meaningful section left open. Some of those open sections are visible from the deck above. How much varies by position, and I don't have evidence good enough to give you a universal rule, so verify the specific cabin's geometry rather than quoting a fraction at a client.",
        "The cabins are still Princess rooms under Carnival category codes. Balcony size and coverage vary by deck in a way they don't on a Carnival-built ship. Check the specific cabin's dimensions rather than trusting the category to be uniform.",
        PORTHOLE_STEER,
        "Deck 8 carries a whole obstructed-oceanview category. If you're booking an oceanview here, read the code before the deck.",
      ],
      hazardsAboveBelow: [
        {
          source: "lido",
          where: "deck 14, which carries cabins alongside the pools",
        },
        {
          source: "buffet",
          where: "the main buffet on 14, on the same deck as those cabins",
        },
        {
          source: "kids",
          where:
            "the kids' club on 15, plus the adventure park and waterslides on 16 directly above the deck 15 cabins",
        },
        {
          source: "gym",
          where: "the fitness centre on 15, alongside the cabins there",
        },
      ],
      obstructedViewNotes:
        "Category 5A on deck 8 is the one, and Carnival's own deck material for both ships confirms it as an obstructed ocean view — that part is solid. What's NOT equally solid is what does the obstructing: secondary cabin data points at some mix of lifeboat, tender and steel structure, and I'd treat that as a lead rather than a fact when you're describing it to a client. No complete cabin-number list is published, so read the category code on the specific cabin. Keep this separate from the deck 10 balcony coverage question — different deck, different problem, and merging them is the obvious mistake.",
      connectingNote: CONNECTING_RULE,
      minorPlacementRule: CARNIVAL_MINOR_PLACEMENT,
      elevatorNote:
        "Three lift lobbies — forward, midship and aft, the Grand-class layout — and two of the three connect the accessible corridors, so the bank matters more here than on a ship where they're interchangeable. I couldn't establish car counts. The glazed panoramic lifts only run at the atrium on decks 5 to 7 and up at 14 over the pool, and the atrium is only three decks tall, so it isn't the landmark it is on a Carnival-built ship.",
      accessibilityNote:
        "Only two of the three lift lobbies connect the wheelchair-accessible corridors, which makes the choice of bank a real decision rather than a convenience — check it against the accessible deck plan for the specific cabin. Dining and entertainment sit low around decks 5 to 7 while the pools are on 14 and the adventure park is on 16, so the vertical trip is substantial.",
    },

    money: CARNIVAL_MONEY,

    traps: {
      // Signed off by Jimmy, 2026-08-18.
      verified: true,
      kidAgeHeightRules: `Speedway Splash is the waterslide on this ship and Carnival publishes its limits: 47 inches minimum, 242 pounds maximum, included in the fare. Quote those rather than the fleet's usual numbers — this hull came from a different builder and the limits aren't Carnival's standard ones. ${CARNIVAL_KIDS_RULES}`,
      obstructedBalconyDecks:
        "the category 5A obstructed ocean views on deck 8",
      embarkationNote: CARNIVAL_EMBARKATION,
      other: [
        `This ship has had three names — ${formerName}, and now this one. Reviews, photos and deck plans circulate under all of them. The deck and cabin numbers mostly survived the rebrandings but every venue name changed, so an old plan will navigate correctly and describe the wrong ship.`,
        ship === "encounter"
          ? "Extra care searching this one: Princess launched a brand-new Star Princess in 2025, so searching that name returns a completely different, much newer ship rather than this hull's history."
          : "Searching the old Princess name will surface a 2001-era review — accurate about the bones, wrong about everything Carnival and P&O have changed since.",
        "No mini-golf. Carnival's current availability list doesn't include either of these two. Don't treat them as ordinary Carnival ships on facilities just because they now carry Carnival branding — check each amenity rather than assuming the fleet default.",
        "What they do have is the P&O Australia inheritance: Speedway Splash, the EDGE adventure offering, and the outdoor complex up top. These are their own concepts, so name them rather than describing them by analogy to a Carnival venue.",
      ],
    },
  };
}

export const carnivalAdventure = pacificClassContent("adventure");
export const carnivalEncounter = pacificClassContent("encounter");
