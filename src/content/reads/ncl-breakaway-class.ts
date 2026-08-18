import type { ShipContent, Source } from "@/lib/types";
import {
  NCL_EMBARKATION,
  NCL_FLEET_TRAPS,
  NCL_FREESTYLE,
  NCL_HAVEN_WARNING,
  NCL_KIDS_RULES,
  NCL_MINOR_PLACEMENT,
  NCL_MONEY,
  NCL_SOURCES,
} from "./ncl-common";
import {
  CONNECTING_RULE,
  MOTION_RULE,
  VIBRATION_RULE,
} from "./operator-rules";

/**
 * Breakaway class: Breakaway (2013), Getaway (2014).
 * Breakaway Plus: Escape (2015), Joy (2017), Bliss (2018), Encore (2019).
 *
 * MY RESEARCH, NOT OPERATOR-CONFIRMED. Cabin and traps are `verified: false`.
 *
 * The class signature is The Waterfront — an outdoor oceanfront promenade
 * on deck 8 — and it creates the one cabin problem unique to these ships.
 * A handful of deck 8 balconies are directly overlooked from the
 * promenade; one passenger described it as a fishbowl and kept the
 * curtains shut all week. Separately, some deck 9 aft cabins look down
 * onto the Waterfront's steel roof rather than the sea.
 *
 * The good news is about the go-karts, and it's worth telling clients
 * because it cuts against the obvious assumption: the karts are electric
 * and the engine sound is piped into the driver's helmet rather than out
 * into the air. No cabin-noise complaints for Joy, Bliss or Encore
 * surfaced at all. The kart-noise reports that circulate are from the
 * Prima ships, not these.
 *
 * Where the pool deck sits differs between the two halves of this family,
 * so it's handled per ship rather than as one rule:
 *   - Breakaway and Getaway: deck 15 is the pool deck AND carries Haven
 *     cabins. Deck 14 is the one underneath it.
 *   - Breakaway Plus: pool on 16, Haven on 17 and 18 above it — and on
 *     Joy, Bliss and Encore the go-kart track on 18 and 19 sits right by
 *     the Haven suites.
 *
 * Deliberately NOT encoded: obstructed-cabin lists for Getaway, Joy,
 * Bliss and Encore — none are published, and one search summary was
 * caught importing Breakaway's cabin numbers wholesale onto Escape.
 * Only Breakaway's and Escape's own findings are recorded.
 */

const BREAKAWAY_SOURCES: Source[] = [
  {
    label: "Breakaway deck 8 — Waterfront-overlooked balconies",
    url: "https://www.cruisedeckplans.com/ships/deckbydeck.php?ship=Norwegian-Breakaway&deck=8",
    checked: "2026-08-18",
  },
  {
    label: "Breakaway deck 9 — Haven forward penthouse and overlooked balconies",
    url: "https://www.cruisedeckplans.com/ships/deckbydeck.php?ship=Norwegian-Breakaway&deck=9",
    checked: "2026-08-18",
  },
  {
    label: "Getaway deck 14 — under the pool deck, overhang and chair scraping",
    url: "https://www.cruisedeckplans.com/ships/deckbydeck.php?ship=Norwegian-Getaway&deck=14",
    checked: "2026-08-18",
  },
  {
    label: "Go-karts are electric with the engine sound piped into the helmet",
    url: "https://www.cruzely.com/15-must-know-things-about-norwegians-go-kart-track-at-sea/",
    checked: "2026-08-18",
  },
  {
    label: "Bliss elevators — 8 forward, 8 aft, forward bank overloaded",
    url: "https://boards.cruisecritic.com/topic/2601692-bliss-elevators/",
    checked: "2026-08-18",
  },
  {
    label: "Joy's 2019 reconfiguration removed 22 of 95 Concierge cabins",
    url: "https://www.travelweekly.com/Cruise-Travel/After-China-sojourn-Norwegian-Joy-updated-for-Alaska",
    checked: "2026-08-18",
  },
];

type BreakawayShip =
  | "breakaway"
  | "getaway"
  | "escape"
  | "joy"
  | "bliss"
  | "encore";

const PLUS = new Set<BreakawayShip>(["escape", "joy", "bliss", "encore"]);
const KARTS = new Set<BreakawayShip>(["joy", "bliss", "encore"]);

function breakawayContent(ship: BreakawayShip): ShipContent {
  const isPlus = PLUS.has(ship);
  const hasKarts = KARTS.has(ship);

  return {
    reviewDue: "2027-02-01",
    sources: [...NCL_SOURCES, ...BREAKAWAY_SOURCES],

    cabin: {
      // MY RESEARCH. Not signed off.
      verified: false,
      placementNote: isPlus
        ? `Midship, decks 10 to 13. Cabins run from deck 5 and then 8 upward, the pool deck and aqua park sit on 16, and The Haven is above all of it on 17 and 18. The deck directly under the pool is the one to check.${
            hasKarts
              ? " The go-kart track runs across 18 and 19, right alongside the Haven — which matters for a Haven booking rather than a standard one."
              : ""
          } Deck 8 is The Waterfront, the outdoor promenade, and a few balconies there are overlooked from it.`
        : "Midship, decks 10 to 13. Cabins run from deck 5 and then 8 up to 14, and deck 15 is doing two jobs at once — it's the pool deck, the Garden Café and the aqua park, and it also carries the Haven cabins. That makes deck 14 the one sitting under all the noise. Deck 8 is The Waterfront, the outdoor promenade, and a few balconies there are directly overlooked from it.",
      motionAvoid: MOTION_RULE,
      vibrationNote: VIBRATION_RULE,
      categoryWarnings: [
        "The Waterfront on deck 8 is the class's best feature and the source of its one odd cabin problem. A small run of deck 8 balconies is directly overlooked by people walking the promenade — one passenger called it a fishbowl and kept the curtains closed all week. Separately, some deck 9 aft cabins look down onto the Waterfront's steel roof rather than the water. Neither is sold as obstructed, so it's a deck-plan check rather than a category check.",
        "Club Balcony Suite is the renamed mini-suite. It is not a Haven category and carries no Haven access, and it sits in the lower service-charge band. Clients hear \"suite\" and picture the private complex — be explicit that it isn't that.",
        ...(ship === "joy"
          ? [
              "Joy was built for the Chinese market and reconfigured for North America in 2019. The part that still shows in the cabin inventory: adding the Observation Lounge meant removing 22 of the 95 Concierge cabins, so that tier — which is a Joy-only category — is much thinner than it looks on paper. Check availability early if a client wants it.",
            ]
          : []),
        "The solo studios here are keycard-clustered with a private Studio Lounge and no single supplement — around 59 on the original pair and roughly 82 on the newer ones, on decks 10 through 12 with the lounge on 11. Sources disagree slightly on which decks, so confirm on the plan.",
      ],
      hazardsAboveBelow: isPlus
        ? [
            {
              source: "lido",
              where: "the pool deck and aqua park on 16, over the cabins on 15",
            },
            {
              source: "buffet",
              where: "the Garden Café, on the same deck as the pool",
            },
            ...(hasKarts
              ? [
                  {
                    source: "sports",
                    where:
                      "the go-kart track on decks 18 and 19, immediately above and beside the Haven suites on 17 and 18",
                  },
                ]
              : []),
          ]
        : [
            {
              source: "lido",
              where:
                "deck 15 — the pool and aqua park, over the deck 14 cabins, and the deck also carries the Haven",
            },
            {
              source: "buffet",
              where: "the Garden Café, also on 15 above those same cabins",
            },
            {
              source: "gym",
              where:
                "the fitness centre, over a run of starboard cabins on deck 14",
            },
          ],
      obstructedViewNotes:
        ship === "breakaway"
          ? "Two specific things on this hull. The Haven forward penthouses 9106 and 9706 have small side balconies partly blocked by the ship's structure. And on deck 8, balconies 8176, 8178 and 8180 on port with 8776, 8778 and 8780 on starboard are the ones overlooked from The Waterfront — not obstructed, but not private either. On deck 9, the run from 9112 to 9134 on port and 9712 to 9734 on starboard has 50-square-foot balconies whose outer part is visible from above, and 9134 forward and 9734 forward look down onto the deck 8 balconies."
          : ship === "escape"
            ? "The deck 8 oceanviews and balconies on this hull carry partial to full lifeboat obstruction. Beyond that no per-cabin list is published for this ship — and be careful with what circulates, because at least one summary was caught copying Breakaway's cabin numbers onto this ship wholesale. Check the specific cabin."
            : "No per-cabin obstruction list is published for this hull. The class pattern is worth checking against the plan anyway: lifeboat obstruction on the lower balcony decks, and a few deck 8 balconies overlooked from The Waterfront promenade.",
      obstructionKinds: ["lifeboat-davit", "overlooked"],
      connectingNote: CONNECTING_RULE,
      minorPlacementRule: NCL_MINOR_PLACEMENT,
      elevatorNote: isPlus
        ? "Around sixteen lifts split evenly forward and aft. The documented complaint on this class is lopsided demand rather than the count: the buffet, the Observation Lounge and the theatre all sit forward, so the forward bank takes the load and it's worst on port days. If your client is in an aft cabin they'll be walking forward a lot."
        : "Forward and aft banks. I couldn't establish car counts for this pair, so check the deck plan rather than taking a number from me.",
      accessibilityNote: isPlus
        ? "The forward bank carries most of the traffic here because the buffet, the theatre and the observation lounge are all at that end — so for a slower traveller, a forward cabin genuinely reduces the walking, at the cost of queuing with everyone else. Weigh that against where they'll actually spend the day, and confirm the accessible deck plan for the specific cabin."
        : "Deck 15 doing double duty as both pool deck and Haven means the top of this ship is busier than the plan suggests. For a mobility booking, work out the route from the cabin to the main dining room specifically, and confirm it against the accessible deck plan.",
    },

    money: NCL_MONEY,

    traps: {
      // MY RESEARCH. Not signed off.
      verified: false,
      kidAgeHeightRules: `${
        hasKarts
          ? "The go-karts need 55 inches minimum and 82 maximum with a 265-pound cap, closed flat shoes required, and they cost about $15 for ten laps or roughly $199 for unlimited. "
          : ""
      }The ropes course needs 48 inches to go up unaccompanied, with a Sky Tykes version for smaller children with an adult, and it's free. ${NCL_KIDS_RULES}`,
      embarkationNote: NCL_EMBARKATION,
      other: [
        ...(hasKarts
          ? [
              "If a client is worried about go-kart noise in the cabins, the evidence doesn't support it on this ship. The karts are electric and the engine sound is piped into the driver's helmet rather than out across the deck, and no cabin-noise complaints surfaced for this class at all. The kart-noise reports that circulate are about the Prima ships.",
            ]
          : []),
        ...(ship === "joy"
          ? [
              "Joy spent its first two years in the Chinese market and was rebuilt for North America in 2019 — private karaoke rooms, two of three casinos, tea rooms and the Asian-market restaurants went, and the Observation Lounge came in. Reviews and photos from before 2019 describe a materially different ship.",
            ]
          : []),
      ],
      linePolicy: [NCL_HAVEN_WARNING, NCL_FREESTYLE, ...NCL_FLEET_TRAPS],
    },
  };
}

export const norwegianBreakaway = breakawayContent("breakaway");
export const norwegianGetaway = breakawayContent("getaway");
export const norwegianEscape = breakawayContent("escape");
export const norwegianJoy = breakawayContent("joy");
export const norwegianBliss = breakawayContent("bliss");
export const norwegianEncore = breakawayContent("encore");
