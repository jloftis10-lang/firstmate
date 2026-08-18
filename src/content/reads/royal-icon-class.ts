import type { ShipContent, Source } from "@/lib/types";
import {
  ROYAL_ATTRACTION_RULES,
  ROYAL_EMBARKATION,
  ROYAL_FLEET_TRAPS,
  ROYAL_KIDS_COST,
  ROYAL_KIDS_RULES,
  ROYAL_MINOR_PLACEMENT,
  ROYAL_MONEY,
  ROYAL_SOURCES,
} from "./royal-common";
import {
  CONNECTING_RULE,
  MOTION_RULE,
  VIBRATION_RULE,
  withShipNote,
} from "./operator-rules";

/**
 * Icon class: Icon (2024), Star (2025), Legend (2026).
 *
 * MY RESEARCH, NOT OPERATOR-CONFIRMED. Cabin and traps are `verified: false`.
 *
 * Two structural facts separate this class from Oasis, and both change
 * the advice rather than just the brochure:
 *
 *   1. **The AquaTheater is enclosed.** It sits inside the glass
 *      AquaDome instead of open-air at the aft end, so the Boardwalk
 *      noise problem that defines Oasis-class cabin advice simply does
 *      not exist here. No cabin category overlooks it.
 *   2. **The pool decks and the cabins share decks.** Chill Island runs
 *      across 15, 16 and 17 while the suite neighbourhood sits forward on
 *      16, 17 and 18 — separated horizontally, not vertically. So the
 *      Oasis reassurance that everything above the cabins is public space
 *      doesn't transfer.
 *
 * Legend is a genuine per-ship exception and it's a big one: it replaces
 * the Infinite Balcony with a traditional verandah in its new family
 * category. Selling an Icon or Star cabin type on Legend is a real risk.
 *
 * Deliberately NOT encoded: obstructed cabin numbers (none published that
 * I could reach), the deck 14 "avoid" ranges (Icon's and Star's published
 * lists conflict, so they are not the same cabins ship-to-ship), the
 * elevator bank layout (three sources give three different answers), and
 * anything about how these hulls ride — nothing Icon-specific exists and
 * extrapolating from Oasis would be a guess.
 */

const ICON_SOURCES: Source[] = [
  {
    label: "Icon deck 16 and 17 — suite neighbourhood forward, Chill Island midship and aft",
    url: "https://www.cruisedeckplans.com/ships/deckbydeck.php?ship=Icon-of-the-Seas&deck=16",
    checked: "2026-08-18",
  },
  {
    label: "Icon room types — Infinite Balcony, Surfside family categories",
    url: "https://www.royalcaribbean.com/guides/icon-of-the-seas-room-types",
    checked: "2026-08-18",
  },
  {
    label: "Deck 14 under Chill Island, The Hideaway and the Windjammer",
    url: "https://www.royalcaribbeanblog.com/2024/03/21/icon-of-the-seas-cabins-avoid",
    checked: "2026-08-18",
  },
  {
    label: "Legend swaps the Infinite Balcony for a traditional verandah",
    url: "https://www.royalcaribbeanblog.com/2026/07/06/how-legend-of-the-seas-different-icon-and-star-of-the-seas",
    checked: "2026-08-18",
  },
];

function iconClassContent(ship: "icon" | "star" | "legend"): ShipContent {
  const isLegend = ship === "legend";

  return {
    reviewDue: "2027-02-01",
    sources: [...ROYAL_SOURCES, ...ICON_SOURCES],

    cabin: {
      // MY RESEARCH. Not signed off.
      verified: false,
      placementNote:
        "Midship, and deck 14 is the one to rule out — it sits under Chill Island's pools, and at the aft end under both The Hideaway, which is an adults-only DJ space, and the Windjammer. Cabins are spread across eleven decks from 3 up to 17. The thing that surprises people coming off an Oasis ship: up top the pools and the suite cabins are on the SAME decks, separated forward-to-aft rather than stacked, so being high here doesn't mean being above it all.",
      motionAvoid: withShipNote(MOTION_RULE, "I found nothing documented about how these specific hulls ride — they're very large and new, but I'm not going to infer a calmer ride from tonnage alone."),
      vibrationNote: VIBRATION_RULE,
      categoryWarnings: [
        isLegend
          ? "Do NOT sell this ship on the Infinite Balcony. Legend replaces it in the new Family Ocean View Balcony category with a traditional verandah — about 285 square feet inside plus a 50-foot balcony — and many of those are adjoining, so they combine into something like a mini-suite for a big group. That's arguably a better family product than Icon's, but it is a different one, and a client who saw an Icon video will be expecting the drop-down window."
          : "The Infinite Balcony is the signature category and it needs explaining before it's booked. It's an interior living space whose window drops at the touch of a button to become a partial balcony — not a separate outdoor room with a door. People who understand that love them; people expecting a conventional verandah feel short-changed. There are ocean-view and Central Park-view versions.",
        "Interiors here are meaningfully bigger than on the Oasis ships — roughly 156 to 178 square feet depending on category, against Oasis interiors that bottom out around 140. If a client is choosing between the two classes on a budget cabin, that's a real point in this one's favour.",
        "The neighbourhood-facing balconies in Central Park and Surfside price lower than ocean-facing for a reason, and the reported noise sources are the Promenade parades and the pool decks rather than the venue below. Surfside balconies on decks 9 to 11 are the ones flagged for pool noise. That's advice-blog level, not published — treat it as a check to make, not a verdict.",
        "There don't appear to be solo or studio cabins on this class. If you have a solo client set on Royal Caribbean, the Quantum ships are where the no-supplement studios are.",
      ],
      hazardsAboveBelow: [
        {
          source: "lido",
          where:
            "Chill Island's pools on deck 15, over the deck 14 cabins — the single clearest avoid on the class",
        },
        {
          source: "nightclub",
          where:
            "The Hideaway, the adults-only DJ space aft, also above the aft deck 14 cabins",
        },
        {
          source: "buffet",
          where: "the Windjammer, aft on the same deck as The Hideaway",
        },
      ],
      obstructedViewNotes:
        "The obstructions cluster on deck 8, above the lifeboats, and in parts of deck 10 — one first-hand review describes a deck 10 Central Park balcony sitting directly over a venue and partly blocked by it. No cabin-by-cabin list is published anywhere I could reach, so read the category code and check the specific cabin on the booking screen.",
      connectingNote: withShipNote(CONNECTING_RULE, "This class does publish connecting balcony pairs in the Surfside family area, which is the easiest place on the ship to put a family across two rooms."),
      minorPlacementRule: ROYAL_MINOR_PLACEMENT,
      elevatorNote:
        "Twenty-two elevators, and they're destination-dispatch — you pick your deck at a panel and it assigns you a car, with no buttons inside. Worth briefing anyone who'd find that stressful. Three sources give three different answers on how the banks are arranged, so I won't tell you where they are; check the deck plan.",
      accessibilityNote:
        "The destination-dispatch elevators are the thing to prepare a slower traveller for — a system that assigns you a car is harder to improvise with. Beyond that, this is a very large ship organised into neighbourhoods, which means horizontal distance as much as vertical: map their actual daily route before picking a cabin rather than optimising for deck number, and confirm the accessible deck plan for the specific room.",
    },

    money: ROYAL_MONEY,

    traps: {
      // MY RESEARCH. Not signed off.
      verified: false,
      kidAgeHeightRules: `${ROYAL_ATTRACTION_RULES} I could not find published height minimums for this class's own waterslide complex, so don't quote the fleet's usual numbers for them — check the ship's page before you promise a child a ride. ${ROYAL_KIDS_RULES} ${ROYAL_KIDS_COST}`,
      embarkationNote: ROYAL_EMBARKATION,
      other: [
        "The AquaTheater is enclosed in the glass dome on this class rather than open-air at the back. If a client has been warned off Boardwalk balconies on the Oasis ships, that whole problem doesn't exist here — there's no cabin category overlooking the show.",
        ...(isLegend
          ? [
              "Legend differs from Icon and Star in ways that matter at the point of sale: the traditional verandah in place of the Infinite Balcony, and a two-deck casino with a non-smoking section on deck 3. Don't quote this ship's cabins off an Icon or Star review.",
            ]
          : [
              "Icon and Star are close sisters but their published cabin lists don't match cabin-for-cabin, so don't transfer a specific room number between them. Legend differs more substantially again.",
            ]),
        "Royal Genie service is Star Class only within Royal Suite Class — Sky and Sea Class get less, and the tier names are close enough that clients conflate them.",
        ...ROYAL_FLEET_TRAPS,
      ],
    },
  };
}

export const iconOfTheSeas = iconClassContent("icon");
export const starOfTheSeas = iconClassContent("star");
export const legendOfTheSeas = iconClassContent("legend");
