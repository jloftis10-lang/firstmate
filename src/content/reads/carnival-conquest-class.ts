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
  QUIET_DEFAULT_RULE,
  VIBRATION_RULE,
} from "./operator-rules";

/**
 * Conquest class: Conquest, Glory, Valor, Liberty, Freedom (2002–2007).
 *
 * SIGNED OFF by Jimmy, 2026-08-18, against Carnival's current deck plans
 * and facility lists. This class came out cleaner than the Sunshine one.
 *
 * What his pass changed:
 *
 *   - Quiet default is deck 7 midship alone, not "7 or 8". Same geometry
 *     as Sunshine class: the public Promenade sits on 5 under deck 6, and
 *     Lido sits on 9 over deck 8. I flagged this as probably wrong before
 *     the review and it was.
 *   - Cabins reach deck 11 forward. I had the range ending at 10.
 *   - The obstruction rule is the 4J walkway-view CATEGORY, which appears
 *     in several places in the class geometry — not a deck 6 phenomenon,
 *     which is how I had it. Plus two officially named ocean views.
 *   - The outdoor screen is not pinned to a deck. Carnival's own Conquest
 *     material puts Seaside Theatre with Lido deck 9 while deck-plan
 *     sources treat it as part of deck 10's Panorama area; it faces
 *     across a multi-level space, so the record describes the complex
 *     rather than picking a deck.
 *
 * What survived unchanged, including one thing I said I trusted least:
 * the activity list. Carnival's current facility pages confirm mini-golf
 * on all five and confirm that none of the five carries SportSquare, the
 * ropes course, SkyRide or BOLT. The advisor-facing distinction — a
 * traditional sports deck is not SportSquare — is exactly right.
 */

const CONQUEST_CLASS_SOURCES: Source[] = [
  {
    label:
      "Carnival Conquest deck plan — cabin decks 1, 2, 6-11 forward; 4J and 6B obstructed categories (checked by Jimmy)",
    url: "https://www.carnival.com/cruise-ships/carnival-conquest",
    checked: "2026-08-18",
  },
  {
    label:
      "Conquest-class obstructed-view and porthole record (CQ/GL/VA/LI/FD)",
    url: "https://help.goccl.com/app/answers/detail/a_id/5523",
    checked: "2026-08-18",
  },
  {
    label:
      "8M/8N Aft-View Extended Balcony dimensions — confirmed on Liberty and Freedom",
    url: "https://www.carnival.com/cruise-ships/carnival-liberty",
    checked: "2026-08-18",
  },
  {
    label: "Mini-golf availability list — all five Conquest-class ships",
    url: "https://www.carnival.com/onboard/mini-golf",
    checked: "2026-08-18",
  },
  {
    label: "SportSquare and ropes-course lists — none of the five appear",
    url: "https://help.carnival.com/app/answers/detail/a_id/1158",
    checked: "2026-08-18",
  },
];

/**
 * Deck 7 midship, and only deck 7.
 *
 * Identical geometry to the Sunshine class and for the same reason: the
 * public Promenade sits on 5 and the Lido on 9, which squeezes the clean
 * cabins-above-and-below band down to a single deck.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-18). Read off Carnival's own deck
 * geometry, not a Carnival recommendation.
 */
const CONQUEST_CLASS_QUIET_DEFAULT = `Midship on deck 7. ${QUIET_DEFAULT_RULE} On this class deck 7 is the one that passes: deck 6 sits over the public-heavy Promenade on 5, and deck 8 sits directly under Lido deck 9. Book 6 and you check what's below, book 8 and you check what's above, book 7 and you're between cabins both ways. The same geometry holds across all five ships.`;

/**
 * Decks 9 and 10 are one multi-level Lido and public complex with
 * forward staterooms mixed into both — not two separately classifiable
 * decks. The outdoor screen deliberately isn't pinned to either: it
 * faces across the space and Carnival's own material and the deck plans
 * disagree about which deck to file it under.
 */
const LIDO_PUBLIC_COMPLEX =
  "Decks 9 and 10 work as one multi-level Lido and public complex, and both carry forward staterooms mixed into it — pool, dining, the water features and the outdoor screen all face across that space rather than sitting neatly on one deck. So a cabin on 9 or 10 is a same-deck traffic question, not just an overhead one, and it needs the specific cabin checked rather than a rule about the deck.";

/**
 * The obstruction rule is a category, not a deck. 4J is Carnival's
 * interior-with-picture-window sold as obstructed or walkway view, and
 * it turns up in several positions in this class's geometry.
 *
 * Two ocean views are named officially. GoCCL maintains a dedicated
 * Conquest-class obstructed-view record that would be worth importing
 * cabin-by-cabin — that import hasn't happened yet and the record says so.
 */
const CONQUEST_OBSTRUCTION =
  "Read the category, not the deck. 4J is the interior with a picture window that Carnival sells as obstructed or walkway view, and it appears in several places in this class's layout rather than being a deck 6 thing — which is how I originally had it, wrongly. Two ocean views are named outright on the current plans: 6B cabins 2446 and 2449, both obstructed. Carnival's advisor knowledge base keeps a dedicated obstructed-view record for the whole class that hasn't been imported here cabin-by-cabin yet, so for anything outside those two, check the code on the specific cabin.";

function conquestClassContent(): ShipContent {
  return {
    reviewDue: "2027-02-01",
    sources: [...CARNIVAL_SOURCES, ...CONQUEST_CLASS_SOURCES],

    cabin: {
      // Signed off by Jimmy, 2026-08-18. One claim inside this block is
      // marked in its own text as researched rather than confirmed — the
      // glass-elevator behaviour. Everything else is off Carnival's plans.
      verified: true,
      placementNote: `${CONQUEST_CLASS_QUIET_DEFAULT} Cabins sit on decks 1, 2, 6, 7, 8, 9, 10 and forward on 11 — not a continuous run, so don't reason from decks 3 to 5 existing as cabin decks here. ${LIDO_PUBLIC_COMPLEX}`,
      motionAvoid: MOTION_RULE,
      vibrationNote: VIBRATION_RULE,
      categoryWarnings: [
        PORTHOLE_STEER,
        BOTTOM_DECK_NOTE,
        "There are no Cove balconies on this class — that's a Dream, Vista and Excel category, and this one doesn't have it. If a client has seen one and wants it, the nearest thing here is the aft-view extended balcony in the 8M and 8N categories: about 185 square feet inside with a 60-foot balcony, 245 total, with the wake behind them. Good cabin, different product, and it's aft — so weigh it against vibration if they're sensitive. Those dimensions are confirmed on Liberty and Freedom and taken as class-wide pending a per-ship check.",
        "Deck 8 is the one that looks safe and isn't quite. It's a fine cabin deck, but Lido sits directly above it, so it needs the same overhead check you'd give any deck under a pool — it just doesn't advertise the problem the way deck 9 does.",
      ],
      hazardsAboveBelow: [
        {
          source: "lido",
          where:
            "the deck 9 and 10 complex — pool and public space on both, with forward cabins mixed into each, and deck 8 sitting underneath it all",
        },
        {
          source: "buffet",
          where: "the dining in that same multi-level deck 9 and 10 space",
        },
        {
          source: "kids",
          where: "Camp Ocean forward on the sun deck, up on 12",
        },
        {
          source: "sports",
          where: "mini-golf aft on 12, on the same sun deck as Camp Ocean",
        },
      ],
      obstructedViewNotes: CONQUEST_OBSTRUCTION,
      connectingNote: CONNECTING_RULE,
      minorPlacementRule: CARNIVAL_MINOR_PLACEMENT,
      elevatorNote:
        "Eighteen elevators, corroborated across current deck-plan sources — but no reliable bank split, so no forward-or-aft recommendation from me. One nuance worth carrying, and this part is researched rather than confirmed off Carnival's plan: the four glass atrium cars run from deck 2 upward, so a client on deck 1 can't use them. Deck 1 is NOT cut off — the regular banks serve it — but somebody on 1 shouldn't assume every midship lift they see on the map reaches their deck.",
      accessibilityNote:
        "The glass-atrium detail is the one to check first for a mobility booking: those four cars start at deck 2, so a deck 1 cabin means using the regular banks rather than the ones people navigate by. Deck 1 does have service — it just isn't the obvious service. Otherwise the layout is less vertically split than the Excel ships, with pool, dining and cabins sharing the upper decks rather than sitting at opposite ends of the ship; that comparison is our inference from the deck contents rather than a Carnival statement. Confirm scooter clearance against Carnival's accessible deck plan as usual.",
    },

    money: CARNIVAL_MONEY,

    traps: {
      // Signed off by Jimmy, 2026-08-18, unchanged from my workup —
      // Carnival's current facility lists confirm all of it.
      verified: true,
      kidAgeHeightRules: `${CARNIVAL_SLIDE_RULES} The Twister slide runs a 42-inch minimum and a 300-pound maximum. ${CARNIVAL_KIDS_RULES}`,
      obstructedBalconyDecks:
        "the 4J walkway-view interiors wherever they appear in the layout, plus ocean views 2446 and 2449",
      embarkationNote: CARNIVAL_EMBARKATION,
      other: [
        "Don't confuse this class's sports deck with SportSquare. These ships have traditional recreation — mini-golf aft on 12, court-type games, Camp Ocean forward — and Carnival's current facility lists confirm that none of the five carries SportSquare, the ropes course, SkyRide or BOLT. A newer advisor looking at a sun deck full of activity can easily assume the branded complex is there. It isn't.",
        "Mini-golf is on all five ships — Carnival's own availability list names Conquest, Freedom, Glory, Liberty and Valor. That one you can promise.",
      ],
    },
  };
}

export const carnivalConquest = conquestClassContent();
export const carnivalGlory = conquestClassContent();
export const carnivalValor = conquestClassContent();
export const carnivalLiberty = conquestClassContent();
export const carnivalFreedom = conquestClassContent();
