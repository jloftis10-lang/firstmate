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
  QUIET_DEFAULT_RULE,
  VIBRATION_RULE,
  withShipNote,
} from "./operator-rules";

/**
 * Fantasy class: Elation and Paradise (1998) — the last two survivors,
 * the oldest and smallest hulls Carnival still runs.
 *
 * SIGNED OFF by Jimmy, 2026-08-18.
 *
 * THE CLASS INSIGHT, and it is genuinely unusual: on these two ships some
 * cabins sit ABOVE the major Lido activity rather than below it. Deck 10
 * is the Lido; deck 11 (Verandah) carries cabins above portions of that
 * public complex. Deck 14 (Grand) also carries cabins but is NOT directly
 * over the Lido, because deck 12 sits in between.
 *
 * Every other Carnival class in this repo has the pool above or beside
 * the cabins. Here it can be beneath them — which means the vertical
 * scan has to look down as well as up, and an advisor who only ever
 * checks "what's above this cabin" will miss it.
 *
 * Corrections from his pass:
 *   - The quiet default is decks 5 to 6 midship. Deck 7 needs an overhead
 *     check because deck 8 is heavily public.
 *   - The OB junior suites are a DISCRETE SET, not a range. I had written
 *     "V21 to V42", which sweeps in cabins that aren't affected. The real
 *     list is V21, V23, V25, V27, V30, V34, V38 and V42.
 *   - "Under 10% of cabins have balconies" is wrong and is deleted.
 *     Elation is materially above that, and Carnival documents 98
 *     balconies added in its refurbishment. The honest statement is
 *     qualitative: balcony inventory is much more limited than on the
 *     newer classes.
 *   - The letter-prefix cabin numbering is real but not a clean derivable
 *     rule — refurbishment-created inventory complicates it. The record
 *     no longer implies you can read the deck off the prefix.
 *
 * On the obstruction kind: the OB suites are blocked by rescue-boat
 * structures and davits. Jimmy deliberately did NOT reuse the Spirit-class
 * lifeboat-below-the-railing wording here, because nobody has established
 * that the visual effect is the same. "Lifeboat and davit obstruction" is
 * what the evidence supports, so that is what it says.
 */

const FANTASY_SOURCES: Source[] = [
  {
    label:
      "Carnival Fantasy-class deck plan — Lido on 10, cabins on Verandah 11 and Grand 14",
    url: "https://www.carnival.com/-/media/372abbc3c57f43d8b96710c8a14613c0.ashx",
    checked: "2026-08-18",
  },
  {
    label:
      "Fantasy-class suite accommodations — the discrete OB obstructed set",
    url: "https://help.goccl.com/app/answers/detail/a_id/1521/~/fantasy-class-suite-accommodations",
    checked: "2026-08-18",
  },
  {
    label: "Elation ship data — 98 balconies added at refurbishment",
    url: "https://www.cruisedeckplans.com/ships/info.php?ship=Carnival-Elation",
    checked: "2026-08-18",
  },
  {
    label: "Mini-golf availability — both Elation and Paradise",
    url: "https://www.carnival.com/onboard/mini-golf",
    checked: "2026-08-18",
  },
];

/**
 * Decks 5 and 6 midship. Deck 7 fails the test because deck 8 above it is
 * heavily public.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-18). Inference from Carnival's deck
 * geometry, not a Carnival recommendation.
 */
const FANTASY_QUIET_DEFAULT = `Midship on deck 5 or 6. ${QUIET_DEFAULT_RULE} Deck 7 doesn't quite make it — deck 8 above is heavily public, so 7 needs the overhead check rather than a blanket yes.`;

/**
 * The reverse-Lido case. This is the one structural fact on these ships
 * that contradicts how every other Carnival hull in the repo behaves.
 */
const REVERSE_LIDO =
  "Here's what's different about these two, and it catches people who know Carnival: some cabins sit ABOVE the Lido rather than below it. Deck 10 is the Lido, and deck 11 — Verandah — carries cabins over portions of that public complex. Deck 14, Grand, carries cabins too but sits clear of the Lido because deck 12 is in between. So the usual habit of checking what's above a cabin isn't enough on this class; check what's underneath it as well.";

function fantasyClassContent(ship: "elation" | "paradise"): ShipContent {
  return {
    reviewDue: "2027-02-01",
    sources: [...CARNIVAL_SOURCES, ...FANTASY_SOURCES],

    cabin: {
      // Signed off by Jimmy, 2026-08-18.
      verified: true,
      placementNote: `${FANTASY_QUIET_DEFAULT} ${REVERSE_LIDO}`,
      motionAvoid: withShipNote(
        MOTION_RULE,
        "This is a small, old hull — the midship rule matters more here, not less.",
      ),
      vibrationNote: VIBRATION_RULE,
      categoryWarnings: [
        "Balcony inventory is much more limited than on the newer Carnival classes. If a balcony is part of the client's picture of a cruise, price it early, because there isn't a fallback deck full of them the way there is on a Vista or an Excel ship.",
        "Cabin numbers here are letter-prefixed by deck rather than the four-digit scheme the rest of the fleet uses. Don't try to derive the deck from the prefix though — refurbishment added inventory that complicates the neat pattern. Work from the actual cabin identifier on the plan.",
        "This is a 1998 ship at around 70,000 tons, less than half the size of the newest hulls. It's a perfectly good ship — it just isn't the one in the Mardi Gras advert, and closing that gap before deposit is the whole job here.",
      ],
      hazardsAboveBelow: [
        {
          source: "lido",
          where:
            "deck 10 — and note this one sits BELOW the Verandah cabins on 11 rather than above them",
        },
        {
          source: "kids",
          where:
            "Camp Ocean and the WaterWorks complex sharing deck 11 with the cabins there",
        },
        {
          source: "sports",
          where: "the sports deck on 12, over the deck 11 cabins",
        },
      ],
      obstructedViewNotes:
        "Category OB, and it's a discrete set rather than a range: junior suites V21, V23, V25, V27, V30, V34, V38 and V42. The obstruction is rescue-boat structures and davits. Note those are specific cabins with gaps between them — don't sweep in everything from V21 to V42, because most of that run is unaffected. I'm not going to claim the visual effect matches the lifeboat obstructions on the Spirit class, because nobody has established that it does; what's documented is that boats and davits are in the way.",
      connectingNote: CONNECTING_RULE,
      minorPlacementRule: CARNIVAL_MINOR_PLACEMENT,
      accessibilityNote:
        "A small hull, so distances are short — that part helps. What doesn't is the age: this class predates most of the accessible-design conventions the newer ships were built to, and I found nothing reliable on the elevator layout. Treat a mobility booking here as needing the accessible deck plan checked cabin by cabin rather than reasoned from a rule.",
    },

    money: CARNIVAL_MONEY,

    traps: {
      // Signed off by Jimmy, 2026-08-18.
      verified: true,
      kidAgeHeightRules: `${CARNIVAL_SLIDE_RULES} The Twister slide runs a 42-inch minimum. ${CARNIVAL_KIDS_RULES}`,
      obstructedBalconyDecks:
        "the category OB junior suites V21, V23, V25, V27, V30, V34, V38 and V42, blocked by rescue boats and davits",
      embarkationNote: CARNIVAL_EMBARKATION,
      other: [
        "Mini-golf is on both these ships — Carnival's current availability list names them, so that one you can promise.",
        "Neither BOLT nor SkyRide is on this class, and there's no SportSquare. What's here is the traditional water-play offering, which is a different pitch from the newer ships.",
        ship === "elation"
          ? "Elation's mini-golf was relocated in refit and gained a bocce court, so older deck plans put it in the wrong place."
          : "Mini-golf is aboard. I couldn't confirm whether this ship's was relocated the way Elation's was, so check the current plan rather than assuming they match.",
      ],
    },
  };
}

export const carnivalElation = fantasyClassContent("elation");
export const carnivalParadise = fantasyClassContent("paradise");
