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
  CONNECTING_RULE,
  MOTION_RULE,
  VIBRATION_RULE,
  withShipNote,
} from "./operator-rules";

/**
 * Fantasy class: Elation and Paradise (1998) — the last two survivors,
 * the oldest and smallest hulls Carnival still runs.
 *
 * MY RESEARCH, NOT OPERATOR-CONFIRMED. Cabin and traps are `verified: false`.
 *
 * Three things make this class genuinely different from everything else
 * in the fleet, and all three are advisor traps rather than trivia:
 *
 *   1. **Fewer than one cabin in ten has a balcony.** On a modern
 *      Carnival ship the balcony is the default assumption. Here it's a
 *      scarce category, and the ones on decks 5 to 7 were retrofitted
 *      onto existing rooms rather than built in.
 *   2. **Cabin numbers are letter-prefixed, not deck-numbered.** R, M, U,
 *      E, A, V and G, not 7201. Any habit of reading the deck off the
 *      first digit of the cabin number fails completely here.
 *   3. **The Lido is BELOW two cabin decks.** Deck 10 is the Lido; decks
 *      11 and 14 carry cabins above it. That's the reverse of every other
 *      hull in the fleet, and it means "book above the pool to escape it"
 *      is exactly backwards on this class.
 *
 * Deliberately NOT encoded: the elevator layout, which didn't surface at
 * all for this class; and the balcony square footages, where two figures
 * (230 sq ft retrofit, 202 plus 53 for the Grand-deck junior suites)
 * describe what are probably different categories but couldn't be
 * reconciled from the sources.
 */

const FANTASY_SOURCES: Source[] = [
  {
    label: "Category OB and PT cabin lists — Carnival's own knowledge base",
    url: "https://help.goccl.com/app/answers/detail/a_id/647",
    checked: "2026-08-18",
  },
  {
    label: "Deck 11 Verandah — cabins sharing the deck with Camp Ocean and WaterWorks",
    url: "https://www.cruisedeckplans.com/ships/Carnival-Elation",
    checked: "2026-08-18",
  },
  {
    label: "Under 10% of cabins on Elation and Paradise have balconies",
    url: "https://thepointsguy.com/reviews/carnival-cruise-ships-classes/",
    checked: "2026-08-18",
  },
  {
    label: "Refit added deck 14 and retrofitted 98 balconies on decks 5 to 7",
    url: "https://www.seatrade-cruise.com/ship-refits/carnival-elation-emerges-from-dry-dock",
    checked: "2026-08-18",
  },
];

function fantasyClassContent(ship: "elation" | "paradise"): ShipContent {
  return {
    reviewDue: "2027-02-01",
    sources: [...CARNIVAL_SOURCES, ...FANTASY_SOURCES],

    cabin: {
      // MY RESEARCH. Not signed off.
      verified: false,
      placementNote:
        "Empress or Atlantic — decks 7 and 8 — midship. The thing to unlearn on this class is that high means quiet: the Lido is on deck 10 and there are two cabin decks ABOVE it, Verandah on 11 and Grand on 14. So booking above the pool puts them above the pool, not away from it. Deck 11 is the one to be most careful with: the forward cabins there share the deck with Camp Ocean, and the entire WaterWorks complex is aft on the same deck.",
      motionAvoid: withShipNote(MOTION_RULE, "This is a small, old hull — motion is more noticeable here than on the big new ships, so the midship rule matters more, not less."),
      vibrationNote: VIBRATION_RULE,
      categoryWarnings: [
        "Cabin numbers here are letter-prefixed by deck — R, M, U, E, A, V, G — not the four-digit numbers the rest of the fleet uses. If you're used to reading the deck off the first digit, that habit will put someone on the wrong deck. Read the letter.",
        "Category PT is a cabin with two portholes instead of a picture window. No modern Carnival ship has this category at all, so a client who's sailed recently won't be expecting it, and it's a genuinely different room from an oceanview. Check the code before you call anything a window cabin.",
        "Balconies are scarce on this class — under one cabin in ten — and the ones on decks 5, 6 and 7 were retrofitted onto existing rooms rather than designed in. If a client's picture of a cruise includes a balcony, price it early, because the inventory runs out and there's no fallback deck full of them.",
        "Interiors and oceanviews both run about 185 square feet. That's not unusually small for Carnival, but the ship around them is a 1998 hull at about 70,000 tons — roughly half the size of the newest ships. Set the scale expectation, not just the cabin one.",
      ],
      hazardsAboveBelow: [
        {
          source: "kids",
          where:
            "Camp Ocean forward on deck 11 and the whole WaterWorks complex aft on the same deck — the deck 11 cabins sit between them",
        },
        {
          source: "lido",
          where:
            "deck 10, which is BELOW the cabins on 11 and 14 rather than above them",
        },
        {
          source: "sports",
          where: "the sports deck on 12, over the deck 11 cabins",
        },
      ],
      obstructedViewNotes:
        "Category OB, eight junior suites on the Verandah deck: V21, V23, V25, V27, V30, V34, V38 and V42. The obstruction is rescue boats, water-shuttle boats and their davits sitting directly in front of the balcony, and Carnival's own description says the view is obstructed sitting or standing — not the usual \"stand up and it clears\". There are crew stairs in the mix too. That's a real veto for anyone booking a junior suite for the view.",
      connectingNote: CONNECTING_RULE,
      minorPlacementRule: CARNIVAL_MINOR_PLACEMENT,
      accessibilityNote:
        "A small hull, so distances are short — that part helps. What doesn't is the age: this class predates most of the accessible-design conventions the newer ships were built to, and I found nothing reliable on the elevator layout here at all. Treat a mobility booking on this class as needing the accessible deck plan checked cabin by cabin rather than reasoned from a rule.",
    },

    money: CARNIVAL_MONEY,

    traps: {
      // MY RESEARCH. Not signed off.
      verified: false,
      kidAgeHeightRules: `${CARNIVAL_SLIDE_RULES} The Twister slide runs a 42-inch minimum. ${CARNIVAL_KIDS_RULES}`,
      obstructedBalconyDecks:
        "the eight category OB junior suites on the Verandah deck — V21, V23, V25, V27, V30, V34, V38 and V42 — where boats and davits block the view sitting or standing",
      embarkationNote: CARNIVAL_EMBARKATION,
      other: [
        "This is a 1998 ship at around 70,000 tons, less than half the size of the newest hulls, and under 10% of the cabins have a balcony. If the client's mental image came from a Mardi Gras advert, the gap between that and this is the single biggest thing to close before deposit. It's a perfectly good ship — it just isn't that one.",
        "No SportSquare on this class — Carnival's own facility list excludes both of these ships. WaterWorks and the Twister slide are here; the sports complex isn't.",
        ship === "elation"
          ? "Elation's mini-golf was relocated to the Grand deck in refit and gained a bocce court, so older deck plans put it in the wrong place."
          : "Mini-golf is aboard. I couldn't confirm whether Paradise's was relocated the way Elation's was, so check the current plan rather than assuming they match.",
        "Neither BOLT nor SkyRide is on this class.",
      ],
    },
  };
}

export const carnivalElation = fantasyClassContent("elation");
export const carnivalParadise = fantasyClassContent("paradise");
