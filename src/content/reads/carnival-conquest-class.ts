import type { ShipContent, Source } from "@/lib/types";
import {
  CARNIVAL_EMBARKATION,
  CARNIVAL_KIDS_RULES,
  CARNIVAL_MINOR_PLACEMENT,
  CARNIVAL_MONEY,
  CARNIVAL_SLIDE_RULES,
  CARNIVAL_SOURCES,
} from "./carnival-common";

/**
 * Conquest class: Conquest, Glory, Valor, Liberty, Freedom (2002–2007).
 *
 * MY RESEARCH, NOT OPERATOR-CONFIRMED. Cabin and traps are both
 * `verified: false`.
 *
 * Two things worth an operator's attention when this gets reviewed:
 *
 *   1. There are no Cove balconies on this class. That's a Dream, Vista
 *      and Excel category. What this class has instead is the aft-view
 *      extended balcony on decks 6 to 8 — a different cabin with a
 *      different pitch (the wake, not the low-and-sheltered feel).
 *   2. The atrium's four glass elevators reach deck 2, not deck 1. If a
 *      client is booked on deck 1 and mobility matters, the pretty
 *      elevators don't get them home.
 *
 * Deliberately NOT encoded:
 *   - the forward/midship/aft elevator split. Eighteen cars total is all
 *     that surfaced.
 *   - any cabin-number obstruction roster. Only the category-level fact
 *     surfaced (deck 6 carries an explicitly obstructed inside-with-window
 *     category), which is enough to warn on and not enough to name cabins.
 */

const CONQUEST_CLASS_SOURCES: Source[] = [
  {
    label: "Conquest deck plans — cabins mixed onto the Lido and Panorama decks",
    url: "https://www.cruisemapper.com/deckplans/Carnival-Conquest-616/deck09-1748",
    checked: "2026-08-18",
  },
  {
    label: "Elevators — 18 total, four glass at the atrium reaching deck 2",
    url: "https://www.cruisecritic.com/cruise/carnival/carnival-conquest",
    checked: "2026-08-18",
  },
  {
    label: "Aft-view extended balconies, decks 6 to 8",
    url: "https://www.shermanstravel.com/advice/how-to-choose-a-cabin-on-carnival-conquest",
    checked: "2026-08-18",
  },
  {
    label: "Twister waterslide — 42 inch minimum, 300 pound maximum",
    url: "https://www.carnival.com/onboard/waterworks",
    checked: "2026-08-18",
  },
];

function conquestClassContent(): ShipContent {
  return {
    reviewDue: "2027-02-01",
    sources: [...CARNIVAL_SOURCES, ...CONQUEST_CLASS_SOURCES],

    cabin: {
      // MY RESEARCH. Not signed off.
      verified: false,
      placementNote:
        "Midship on decks 7 or 8 is the default here, and it's the one travelers keep landing on independently — away from the engines, away from the pool, away from the atrium. Cabins run from deck 1 up to deck 10, and both of the top two carry public space alongside the staterooms: the Lido on 9, and the Twister slide and the outdoor screen on 10. So a cabin on 9 or 10 is either beside or beneath something loud depending where it sits — that one needs the deck plan, not a rule.",
      motionAvoid:
        "Push hard for midship. Extreme forward is the one to rule out; extreme aft is a negative when there's comparable midship inventory, and more so if vibration also matters to them.",
      vibrationNote:
        "Lower decks are generally better for motion, not worse — closer to the waterline. The catch is vibration: a low cabin at the back can still pick up the propulsion, so \"go low\" isn't automatically the right call for a sensitive traveller.",
      categoryWarnings: [
        "I'd steer them off a porthole room — it's the cheapest category and they've felt small to me. Check the actual square footage for the specific cabin before you rule it in or out.",
        "The bottom deck is fine if they're on a budget — that's where the cheap interiors are, and low is generally kinder for motion, not harsher.",
        "There are no Cove balconies on this class — that's a Dream, Vista and Excel category. If a client has seen one and wants it, the nearest thing here is an aft-view extended balcony on decks 6 to 8, about 185 square feet inside with a 60-foot balcony and the wake behind them. It's a good cabin, it's just not the same cabin, and it's aft — so weigh it against vibration if they're sensitive.",
        "Deck 6 carries a category that Carnival sells as obstructed outright. Read the category letter, not just the deck.",
      ],
      hazardsAboveBelow: [
        {
          source: "lido",
          where:
            "deck 9 — the pool deck also carries cabins, so depending on the cabin it's overhead noise, next-door noise, or both",
        },
        {
          source: "kids",
          where: "Camp Ocean and mini-golf up on the sun deck",
        },
        {
          source: "theater",
          where:
            "the outdoor screen on deck 10, alongside the cabins on that deck rather than above them",
        },
      ],
      obstructedViewNotes:
        "Deck 6 has an inside-with-window category that Carnival sells as obstructed, and the balcony obstructions on this class are lifeboats and structure sitting at railing height on the indented sections of the hull. No cabin-by-cabin list surfaced, so the honest instruction is to read the category code on the specific cabin rather than trusting the deck.",
      connectingNote:
        "Never read connecting status off the category or off two cabin numbers being next to each other — only an explicit connecting pair counts.",
      minorPlacementRule: CARNIVAL_MINOR_PLACEMENT,
      elevatorNote:
        "Eighteen elevators, including four glass ones at the atrium — and those four stop at deck 2, not deck 1. That's the one to remember: a client on deck 1 has to use a different bank. I couldn't establish how the rest split forward, midship and aft, so don't steer anyone to a bank on my say-so.",
      accessibilityNote:
        "The deck-1 elevator gap is the thing to check first — the atrium's glass cars don't reach it, so a deck 1 cabin is the wrong pick for anyone who tires on stairs or uses a scooter. Otherwise the layout is less vertically split than the Excel ships: pool, dining and cabins share the upper decks rather than sitting at opposite ends of the ship. That last part is my read of the deck contents, not a sourced claim. Confirm scooter clearance against Carnival's accessible deck plan as usual.",
    },

    money: CARNIVAL_MONEY,

    traps: {
      // MY RESEARCH. Not signed off.
      verified: false,
      kidAgeHeightRules: `${CARNIVAL_SLIDE_RULES} The Twister slide runs a 42-inch minimum and a 300-pound maximum. ${CARNIVAL_KIDS_RULES}`,
      obstructedBalconyDecks:
        "the obstructed inside-with-window category on deck 6, plus balconies on the indented hull sections where lifeboats and structure sit at railing height",
      embarkationNote: CARNIVAL_EMBARKATION,
      other: [
        "None of BOLT, SkyRide, SkyCourse or SportSquare is on this class — those are the Excel, Vista and Dream ships. There is a basic mini-golf course, not the two-level sports complex. Set that expectation before a family books it for the kids.",
      ],
    },
  };
}

export const carnivalConquest = conquestClassContent();
export const carnivalGlory = conquestClassContent();
export const carnivalValor = conquestClassContent();
export const carnivalLiberty = conquestClassContent();
export const carnivalFreedom = conquestClassContent();
