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
 * Oasis class: Oasis (2009), Allure (2010), Harmony (2016), Symphony
 * (2018), Wonder (2022), Utopia (2024).
 *
 * MY RESEARCH, NOT OPERATOR-CONFIRMED. Cabin and traps are `verified: false`.
 *
 * The defining feature of this class is the neighbourhood balcony — a
 * balcony facing inward, into Central Park or the Boardwalk, rather than
 * out to sea. That's the whole advisor conversation on these ships, and
 * the evidence divides cleanly:
 *
 *   - **Boardwalk is genuinely noisy** and multiple independent sources
 *     agree on why: the AquaTheater is open-air at the aft end, shows run
 *     as late as 10:30pm, and the bass carries. Lower decks are worse.
 *   - **Central Park is genuinely quieter** — nothing is staged there,
 *     only evening live music.
 *   - **The claim that Central Park cabins get restaurant noise is NOT
 *     supported by anything I could find.** It circulates widely. It is
 *     not encoded here, and the record says so out loud, because talking
 *     a client out of a good cabin on folklore is its own failure.
 *   - **The real Central Park downside is privacy, not noise**, and that
 *     one IS documented: the balconies look across at each other.
 *
 * Deliberately NOT encoded: the Boardwalk "avoid these cabins" number
 * lists, which come only from content-farm sites; Promenade-view and
 * Central Park-view interior deck numbers (not found); whether any of
 * these ships have studio cabins (sources directly conflict); and any
 * cabin-level noise claim about the Ultimate Abyss, where the sources
 * infer the noise rather than reporting it.
 */

const OASIS_SOURCES: Source[] = [
  {
    label: "Deck 6 lifeboat obstruction ranges, hump cabins exempt",
    url: "https://www.cruisedeckplans.com/ships/deckbydeck.php?ship=Oasis-of-the-Seas&deck=6",
    checked: "2026-08-18",
  },
  {
    label: "Neighbourhood balconies — Central Park quiet, Boardwalk not, and the privacy issue",
    url: "https://www.royalcaribbeanblog.com/2016/10/19/what-you-need-know-about-neighborhood-balcony-staterooms-royal-caribbeans-oasis-class",
    checked: "2026-08-18",
  },
  {
    label: "Deck 14 cabins under the deck 15 pool; early-morning chair dragging",
    url: "https://www.royalcaribbeanblog.com/2024/01/19/oasis-of-the-seas-cabins-avoid",
    checked: "2026-08-18",
  },
  {
    label: "Symphony elevators — 24 cars, forward and aft banks, no midship bank",
    url: "https://www.cruisemapper.com/ships/Symphony-Of-The-Seas-1730",
    checked: "2026-08-18",
  },
  {
    label: "Royal Suite Class tiers — Royal Genie is Star tier only",
    url: "https://www.royalcaribbean.com/cruise-rooms/royal-suite-class",
    checked: "2026-08-18",
  },
];

type OasisShip =
  | "oasis"
  | "allure"
  | "harmony"
  | "symphony"
  | "wonder"
  | "utopia";

/** When each hull was amplified — reviews predating it describe a different ship. */
const AMPLIFIED: Partial<Record<OasisShip, string>> = {
  oasis:
    "Oasis was amplified in November 2019, gaining the Ultimate Abyss, the Perfect Storm slides and a redesigned pool deck. Anything written before then describes a different ship.",
  allure:
    "Allure was amplified in 2025 and now carries most of what the newer hulls have. Reviews and photos from before that are out of date, and there are a lot of them.",
  harmony:
    "Harmony was amplified in spring 2026 and gained about 105 new staterooms across interior, oceanview, balcony and suite categories. Any deck plan older than mid-2026 is stale — check you're reading the current one before you place anyone.",
};

function oasisClassContent(ship: OasisShip): ShipContent {
  const amplified = AMPLIFIED[ship];

  return {
    reviewDue: "2027-02-01",
    sources: [...ROYAL_SOURCES, ...OASIS_SOURCES],

    cabin: {
      // MY RESEARCH. Not signed off.
      verified: false,
      placementNote:
        "Midship, and the deck to actually rule out is 14 — it sits directly beneath the deck 15 pool, and crews drag deck chairs across it early. Cabins run from deck 3 up to 12, skip 13 entirely, then pick up again from 14 to 17 where the loft suites are. The pool deck on 15 and the sports and Windjammer deck on 16 sit above the main cabin block but below the suite decks, so \"high up\" means different things on this ship depending which end of it you're on.",
      motionAvoid: MOTION_RULE,
      vibrationNote: withShipNote(VIBRATION_RULE, "These hulls carry four stabilisers rather than the usual two and the sheer size damps a lot — but the low-and-midship rule still applies, it just starts from a calmer baseline."),
      categoryWarnings: [
        "The neighbourhood balconies are the decision on this class, and the two are not the same product. Boardwalk balconies face the open-air AquaTheater — shows run as late as 10:30 and the bass carries, and the lower the deck the worse it is. Central Park is genuinely quieter; nothing is staged there, just evening live music.",
        "About Central Park: you'll hear that those cabins get restaurant noise from the park below. I could not find a single source that documents it, so I'd stop repeating it — talking a client out of a good cabin on a rumour costs them the booking they wanted.",
        "The real catch with any inward-facing balcony is privacy, not noise, and this one IS documented: the balconies look straight across at the ones opposite. Same for the Promenade-view bay windows — the Promenade can see in, and the two sets of curtains are doing a lot of work. Say it before they book, not after.",
        "Watch the interior square footage on this class — it varies far more than the category name suggests. The aft interiors on decks 7 through 14 run about 149 square feet, a couple on deck 11 come in at 140, and at least one cabin is reported at 96. Check the actual number for the specific cabin.",
        "Royal Suite Class splits into Star, Sky and Sea, and the Royal Genie comes with Star only. Promising genie service to a Sky or Sea client is the single easiest way to lose one on this class.",
      ],
      hazardsAboveBelow: [
        {
          source: "lido",
          where:
            "the deck 15 pool, directly over the deck 14 cabins — roughly 14162 to 14240 and 14562 to 14640 are the ranges reported, and the complaint is crew dragging chairs at dawn",
        },
        {
          source: "theater",
          where:
            "the AquaTheater, open-air at the aft end, facing the Boardwalk balconies — shows as late as 10:30pm and bass through the aft of the ship",
        },
        {
          source: "sports",
          where:
            "the FlowRiders, zip line and Ultimate Abyss entrance all on deck 16, above the deck 14 cabins",
        },
      ],
      obstructedViewNotes:
        "Deck 6 is the lifeboat band and it's the best-documented obstruction on the class: six boats a side forward block the downward view from roughly 6136 to 6224 on port and 6536 to 6624 on starboard, and three a side aft affect 6282 and aft on port, 6682 and aft on starboard. The hump cabins are exempt. There's a second group of Boardwalk-side obstructed cabins up on deck 14, but the two published lists of those disagree with each other, so confirm those on the booking screen rather than from me.",
      connectingNote: CONNECTING_RULE,
      minorPlacementRule: ROYAL_MINOR_PLACEMENT,
      elevatorNote:
        "This is the one to plan around on a ship this size: the banks are forward and aft, roughly a dozen cars each, and there is no midship bank at all. On an 1,100-foot hull that means a real walk from a midship cabin to a lift no matter which way they turn. Six more cars serve the top suite decks separately. For anyone slower on their feet, book them near one end and match it to where they'll spend the week.",
      accessibilityNote:
        "No midship elevator bank is the fact that matters here — a midship cabin on this class means walking to one end of a very long ship every time. Pick the end that matches their week and book close to it. The neighbourhoods also mean more horizontal distance than a conventional ship of the same size, so map their daily route before you commit to a cabin, and confirm the accessible deck plan for the specific room.",
    },

    money: ROYAL_MONEY,

    traps: {
      // MY RESEARCH. Not signed off.
      verified: false,
      kidAgeHeightRules: `The Ultimate Abyss needs 44 inches and caps at 300 pounds, and the zip line needs 52 inches with a 75 to 275 pound range. ${ROYAL_ATTRACTION_RULES} ${ROYAL_KIDS_RULES} ${ROYAL_KIDS_COST}`,
      obstructedBalconyDecks:
        "deck 6, where the lifeboats sit — roughly 6136 to 6224 and 6536 to 6624 forward, plus 6282 and aft on each side, with the hump cabins exempt",
      embarkationNote: ROYAL_EMBARKATION,
      other: [
        ...(amplified ? [amplified] : []),
        "Royal Genie service is Star Class only. Sky and Sea Class get a different and smaller set of perks, and the tier names are close enough that clients conflate them constantly. Be explicit about which one they've actually bought.",
      ],
      linePolicy: [...ROYAL_FLEET_TRAPS],
    },
  };
}

export const oasisOfTheSeas = oasisClassContent("oasis");
export const allureOfTheSeas = oasisClassContent("allure");
export const harmonyOfTheSeas = oasisClassContent("harmony");
export const symphonyOfTheSeas = oasisClassContent("symphony");
export const wonderOfTheSeas = oasisClassContent("wonder");
export const utopiaOfTheSeas = oasisClassContent("utopia");
