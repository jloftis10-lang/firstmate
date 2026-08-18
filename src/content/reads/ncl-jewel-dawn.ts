import type { ShipContent, Source } from "@/lib/types";
import {
  NCL_EMBARKATION,
  NCL_FLEET_TRAPS,
  NCL_FREESTYLE,
  NCL_KIDS_RULES,
  NCL_MINOR_PLACEMENT,
  NCL_MONEY,
  NCL_SOURCES,
} from "./ncl-common";
import {
  CONNECTING_RULE,
  MOTION_RULE,
  VIBRATION_RULE,
  withShipNote,
} from "./operator-rules";

/**
 * Jewel class: Jewel (2005), Jade (2006), Pearl (2006), Gem (2007).
 * Dawn class: Dawn (2002), Star (2001).
 *
 * MY RESEARCH, NOT OPERATOR-CONFIRMED. Cabin and traps are `verified: false`.
 *
 * One file, two factories, because these hulls are related but give
 * OPPOSITE answers to the question that matters most:
 *
 *   - Jewel class: deck 12 is the Lido and carries no cabins. Deck 11 is
 *     the top cabin deck and sits under all of it.
 *   - Dawn class: deck 12 is the Lido AND a cabin deck. Cabins share the
 *     pool deck.
 *
 * THE HAVEN IS THE BIG OVER-PROMISE RISK HERE, and it differs between
 * the two classes as well:
 *
 *   - Jewel class has a genuine enclosed Haven on deck 14 — courtyard,
 *     splash pool, whirlpool, small gym, keycard access, private sundeck
 *     above. But there is NO Haven restaurant and NO Haven bar. Guests
 *     get Moderno for breakfast and Cagney's for lunch and are on their
 *     own for dinner. Sell the courtyard; do not sell a Haven restaurant.
 *   - Dawn class deck 14 holds only the two Garden Villas. I found no
 *     confirmation of a shared Haven courtyard on Dawn or Star at all,
 *     and the courtyard language in search results attaches to the Jewel
 *     pages. Do not promise a Haven complex on these two.
 *
 * Deliberately NOT encoded: the size of the deck 8 obstruction, where
 * one source says 90% blocked and another 50–75% and the lower figure
 * comes from a site demonstrably wrong about this fleet elsewhere; the
 * ninth cabin deck on Dawn and Star, which I could not identify; and
 * Norwegian Star's azipod failures, which are propulsion history rather
 * than cabin advice.
 */

const JEWEL_DAWN_SOURCES: Source[] = [
  {
    label: "Jewel deck 12 is Lido with no cabins; deck 11 is the top cabin deck",
    url: "https://www.cruisemapper.com/deckplans/Norwegian-Jewel-583/deck12-305",
    checked: "2026-08-18",
  },
  {
    label: "Star deck 12 plan is titled Cabins-Lido-Pools-Sundeck",
    url: "https://www.cruisemapper.com/deckplans/Norwegian-Star-706/deck12-1056",
    checked: "2026-08-18",
  },
  {
    label: "Category OK — obstructed oceanview with porthole, deck 8",
    url: "https://cruiseline.com/ship/norwegian-dawn/cabins/OK",
    checked: "2026-08-18",
  },
  {
    label: "Jewel-class Haven has no restaurant — Moderno and Cagney's instead",
    url: "https://boards.cruisecritic.com/topic/3073984",
    checked: "2026-08-18",
  },
  {
    label: "Jewel deck 14 Haven — courtyard, splash pool, private sundeck on 15",
    url: "https://www.cruisemapper.com/deckplans/Norwegian-Jewel-583/deck14-307",
    checked: "2026-08-18",
  },
];

const SAIL_AWAY_WARNING =
  "Watch the Sail Away guarantee codes on these ships — the BX, MX, IX and OX categories. They can be assigned as late as the day before sailing, on any deck, and explicitly may be obstructed. They're genuinely cheap and genuinely a gamble; don't sell one to a client who has a view in their head.";

const DECK_8_OBSTRUCTION =
  "Deck 8 is the lifeboat band on both these classes, and NCL sells the obstruction as its own category rather than hiding it — category OK, an oceanview with a porthole window, described as fully obstructed. Sources disagree on how much of the view goes, and the lower estimate comes from a site that gets other facts about this fleet plainly wrong, so I'd treat it as \"mostly gone\" and check the specific cabin.";

function jewelClassContent(
  ship: "jewel" | "jade" | "pearl" | "gem",
): ShipContent {
  return {
    reviewDue: "2027-02-01",
    sources: [...NCL_SOURCES, ...JEWEL_DAWN_SOURCES],

    cabin: {
      // MY RESEARCH. Not signed off.
      verified: false,
      placementNote:
        "Midship on 9 or 10. Cabins sit on decks 4, 5, 8, 9, 10, 11 and 14, and deck 12 is a pure Lido deck with no staterooms on it — which makes deck 11 the one taking everything from above. And it's a lot on this class: two pools, a waterslide, the Garden Café buffet, Splash Academy, the teen club and the spa are all on 12. Deck 8 is the lifeboat deck. Deck 14 is The Haven.",
      motionAvoid: withShipNote(MOTION_RULE, "Nothing hull-specific is documented for this class, so that's the general rule."),
      vibrationNote: VIBRATION_RULE,
      categoryWarnings: [
        "Deck 11 is the one to steer off on this class. Everything noisy is on 12 directly above it — two pools, the slide, the buffet, both kids' clubs and the spa — and chair scraping first thing is exactly the complaint you'd expect.",
        SAIL_AWAY_WARNING,
        "There are no purpose-built solo studios on this class. NCL has re-categorised some standard cabins as solo on older ships, but those are converted rooms without Studio Lounge access, not the real thing. If a solo client wants the studio experience, they want a newer hull.",
        ...(ship === "jade"
          ? [
              "Jade was built as Pride of Hawaii for the US-flagged NCL America operation and converted in 2008. It's the same hull as its sisters, but it carries a slightly different stateroom count and nobody publishes why — so don't assume a cabin number here matches the same number on Jewel.",
            ]
          : []),
      ],
      hazardsAboveBelow: [
        {
          source: "lido",
          where:
            "deck 12 — two pools and a waterslide, directly over the deck 11 cabins",
        },
        {
          source: "buffet",
          where: "the Garden Café, also on 12 above those same cabins",
        },
        {
          source: "kids",
          where: "Splash Academy and the teen club, again on 12",
        },
      ],
      obstructedViewNotes: DECK_8_OBSTRUCTION,
      obstructionKinds: ["lifeboat-davit"],
      connectingNote: CONNECTING_RULE,
      minorPlacementRule: NCL_MINOR_PLACEMENT,
      elevatorNote:
        "Around twelve lifts on this class, which is reasonable for the size. I couldn't establish the bank layout. One thing reported on Pearl specifically and worth checking on any of them: the aft lifts only run down as far as deck 7.",
      accessibilityNote:
        "A smaller, simpler ship than the modern hulls, so distances are short and the layout is easy to learn. The thing to verify is the aft lift coverage — on at least one ship in this class the aft bank stops at deck 7, which matters if the cabin is lower than that. Confirm against the accessible deck plan for the specific cabin.",
    },

    money: NCL_MONEY,

    traps: {
      // MY RESEARCH. Not signed off.
      verified: false,
      kidAgeHeightRules: NCL_KIDS_RULES,
      obstructedBalconyDecks:
        "the category OK oceanviews on deck 8, behind the lifeboats",
      embarkationNote: NCL_EMBARKATION,
      other: [
        "Be careful how you describe The Haven on this class. It's real — deck 14, keycard access, private courtyard, splash pool, whirlpool, a small gym and a private sundeck above. But there is no Haven restaurant and no Haven bar. Guests eat breakfast at Moderno and lunch at Cagney's, and dinner is wherever everyone else eats. A client who has read about the Haven on Bliss or Prima will expect a restaurant, and there isn't one.",
        "The absence list on this class: no go-karts, no Waterfront promenade, no Ocean Boulevard, no ropes course, no laser tag, no big waterslide complex. There is a modest family pool slide on 12. And there is a forward observation lounge — the Spinnaker — so don't tell a client the ship has no view lounge.",
      ],
      linePolicy: [NCL_FREESTYLE, ...NCL_FLEET_TRAPS],
    },
  };
}

function dawnClassContent(ship: "dawn" | "star"): ShipContent {
  return {
    reviewDue: "2027-02-01",
    sources: [...NCL_SOURCES, ...JEWEL_DAWN_SOURCES],

    cabin: {
      // MY RESEARCH. Not signed off.
      verified: false,
      placementNote:
        "Midship on 9 or 10. The thing that separates this class from its Jewel-class cousins: deck 12 here is both the Lido deck and a cabin deck, so staterooms sit alongside the pools rather than safely below them — the forward end of 12 carries the bigger suites. Deck 11 has the bridge and the spa on it as well as cabins. Deck 8 is the lifeboat deck. Deck 14 is just the two Garden Villas.",
      motionAvoid: withShipNote(MOTION_RULE, "Nothing hull-specific is documented for this class."),
      vibrationNote: VIBRATION_RULE,
      categoryWarnings: [
        "Deck 12 carries cabins and the pool deck at the same time on this class. That's the opposite of the Jewel ships, where 12 is pure Lido — so if you've learned one, don't apply it to the other. A deck 12 cabin here is beside the action, not above or below it.",
        SAIL_AWAY_WARNING,
        "The no-balcony family suites on deck 12 are large — over 400 square feet — and genuinely good value for a family who'll be outdoors anyway. Just be clear there's no balcony, because the square footage makes people assume there is one.",
        "There are no purpose-built solo studios on this class.",
      ],
      hazardsAboveBelow: [
        {
          source: "lido",
          where:
            "deck 12 — the pools are on the same deck as the cabins there, and over the deck 11 cabins below",
        },
        {
          source: "kids",
          where: "the children's area, also up on 12",
        },
        {
          source: "spa",
          where: "the spa on deck 11, alongside the cabins on that deck",
        },
      ],
      obstructedViewNotes: DECK_8_OBSTRUCTION,
      connectingNote: CONNECTING_RULE,
      minorPlacementRule: NCL_MINOR_PLACEMENT,
      elevatorNote:
        "Around eight lifts, which is few for a ship this size — expect waiting at peak. I couldn't establish the bank layout.",
      accessibilityNote:
        "Only about eight lifts on a 92,000-ton hull, so peak-time waits are the thing to prepare a slower traveller for. The ship is otherwise compact and easy to learn. Confirm the accessible deck plan for the specific cabin.",
    },

    money: NCL_MONEY,

    traps: {
      // MY RESEARCH. Not signed off.
      verified: false,
      kidAgeHeightRules: NCL_KIDS_RULES,
      obstructedBalconyDecks:
        "the category OK oceanviews on deck 8, behind the lifeboats",
      embarkationNote: NCL_EMBARKATION,
      other: [
        "Do not promise a Haven complex on this ship. Deck 14 holds the two Garden Villas — genuinely spectacular rooms with private gardens and hot tubs — but I found no confirmation of the shared Haven courtyard that the Jewel-class ships have, and the courtyard material online attaches to those ships rather than these. If a client is buying for The Haven, verify what this specific ship actually offers before you take a deposit.",
        ship === "dawn"
          ? "The absence list: no go-karts, no Waterfront, no Ocean Boulevard, no ropes course, no laser tag, no big waterslide complex. There is a forward lounge, but on this ship it was renamed the Bliss Lounge and sits on deck 7 rather than up top — so don't say there's no view bar, and don't call it the Spinnaker either."
          : "The absence list: no go-karts, no Waterfront, no Ocean Boulevard, no ropes course, no laser tag, no big waterslide complex. There is a forward lounge, so don't tell a client the ship has no view bar.",
      ],
      linePolicy: [NCL_FREESTYLE, ...NCL_FLEET_TRAPS],
    },
  };
}

export const norwegianJewel = jewelClassContent("jewel");
export const norwegianJade = jewelClassContent("jade");
export const norwegianPearl = jewelClassContent("pearl");
export const norwegianGem = jewelClassContent("gem");
export const norwegianDawn = dawnClassContent("dawn");
export const norwegianStar = dawnClassContent("star");
