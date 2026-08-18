import type { ShipContent, Source } from "@/lib/types";
import {
  ROYAL_ATTRACTION_RULES,
  ROYAL_DECK_12_NUMBERING,
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
  QUIET_DEFAULT_RULE,
  VIBRATION_RULE,
  withShipNote,
} from "./operator-rules";

/**
 * Oasis class: Oasis (2009), Allure (2010), Harmony (2016), Symphony
 * (2018), Wonder (2022), Utopia (2024).
 *
 * SIGNED OFF by Jimmy, 2026-08-19. First Royal Caribbean class reviewed.
 *
 * The class-level core he promoted:
 *   - Decks 9 to 11 midship is the quiet default.
 *   - Deck 12 needs a check of deck 14 above it — Royal skips the NUMBER
 *     13, so the physical deck over 12 is numbered 14, and 14 mixes
 *     cabins with Adventure Ocean and other spaces.
 *   - Deck 14 carries pool and sports overhead from 15.
 *   - Deck 6 is a lifeboat band that takes the DOWNWARD view, with real
 *     hump exemptions.
 *   - Boardwalk is an entertainment tradeoff, not a defect.
 *   - Central Park is quieter but not silent.
 *   - Inward balconies have reduced privacy.
 *   - 24 main lifts, forward and aft only, no midship bank.
 *   - Cabin-size anomalies are ship and cabin specific.
 *
 * What his pass corrected in my version:
 *   - My placement note had no actual default in it — only "rule out deck
 *     14", which is an exclusion. I flagged that myself before the review
 *     and he supplied the band.
 *   - "Rule out deck 14" is too strong anyway. For a family who wants the
 *     pool two minutes away and doesn't care about 6am chair-dragging, it
 *     is a rational trade. For a light sleeper it's a strong negative.
 *     The record now frames it that way rather than as a veto.
 *   - The deck 14 cabin RANGES I had are published for Wonder
 *     specifically. They are not a six-ship constant and no longer
 *     presented as one.
 *   - What I called a "Boardwalk obstruction group" on deck 14 is
 *     actually two different problems: Central Park balconies affected by
 *     the cross-ship walkway structure from the pool deck above, and
 *     Boardwalk balconies whose aft sightline is narrowed by upper-deck
 *     structure. Different causes, different cabins, now separate.
 *   - "Shows run as late as 10:30" is deleted. Show times vary by
 *     sailing, so encoding a time makes the record wrong on most of them.
 *   - "Nothing is staged in Central Park" was too absolute. It is the
 *     quieter inward choice, not a silent one — higher Central Park
 *     cabins can take pool-deck noise from above, particularly on 14.
 *   - Harmony's 2026 amplification added 91 cabins, not the ~105 I had.
 *     That figure came from pre-refit sources; she returned to service on
 *     21 May 2026.
 *
 * The 96-square-foot interior I said I trusted least turns out to be
 * real — Royal's own Harmony material lists a 96 sq ft Studio Interior.
 * But the sizes differ ship to ship, so the record teaches the check
 * rather than publishing a class-wide range.
 */

const OASIS_SOURCES: Source[] = [
  {
    label:
      "Deck 6 lifeboat geometry — same on all six hulls, hump cabins exempt",
    url: "https://www.cruisedeckplans.com/ships/deckbydeck.php?deck=6&ship=Wonder-of-the-Seas",
    checked: "2026-08-19",
  },
  {
    label:
      "Oasis Central Park balconies affected by the cross-ship walkway above",
    url: "https://www.royalcaribbeanblog.com/2024/01/19/oasis-of-the-seas-cabins-avoid",
    checked: "2026-08-19",
  },
  {
    label: "Utopia deck 14 — Boardwalk aft sightline and Central Park cabins",
    url: "https://www.cruisedeckplans.com/ships/deckbydeck.php?deck=14&ship=Utopia-of-the-Seas",
    checked: "2026-08-19",
  },
  {
    label:
      "24 main lifts, 12 forward and 12 aft through deck 16, six more for 17-18",
    url: "https://www.cruisemapper.com/deckplans/Utopia-Of-The-Seas-2180/deck12-7762",
    checked: "2026-08-19",
  },
  {
    label: "Royal Suite Class — Genie is the Star Class benefit",
    url: "https://www.royalcaribbean.com/cruise-rooms/royal-suite-class",
    checked: "2026-08-19",
  },
  {
    label: "Harmony's 2026 amplification — 91 new cabins, back in service 21 May",
    url: "https://www.royalcaribbeanblog.com/2026/05/22/royal-caribbean-harmony-of-the-seas-upgrades-photos",
    checked: "2026-08-19",
  },
];

type OasisShip =
  | "oasis"
  | "allure"
  | "harmony"
  | "symphony"
  | "wonder"
  | "utopia";

/**
 * Decks 9 to 11 midship.
 *
 * Deck 8 carries Central Park and public space, so it fails below. Deck
 * 12 is often fine but doesn't get an automatic yes: Royal skips the
 * NUMBER 13, so the physical deck above 12 is numbered 14, and 14 mixes
 * cabins with Adventure Ocean and other spaces.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-19).
 */
const OASIS_QUIET_DEFAULT = `Midship on decks 9, 10 or 11. ${QUIET_DEFAULT_RULE} Deck 8 fails below — that's Central Park and public space. ${ROYAL_DECK_12_NUMBERING}, and 14 mixes cabins with Adventure Ocean and other spaces. Check 14 before you bless 12.`;

/**
 * Deck 14 as a tradeoff rather than a veto. The exact affected cabins are
 * ship-specific — the ranges that circulate are published for Wonder.
 */
const DECK_14_POOL_OVERHEAD =
  "Deck 14 sits directly under the deck 15 pool and sports deck, and the documented complaint is chair movement and early setup rather than anything at night. That's not an automatic no. For a family who wants the pool two minutes away and sleeps through anything, it's a rational trade. For a light sleeper it's a strong negative. The exact cabins affected differ by ship — the ranges you'll see quoted are published for Wonder, so don't apply them to the other five.";

/**
 * Two different deck 14 obstructions with two different causes. I had
 * them merged as one "Boardwalk group", which was wrong.
 */
const CENTRAL_PARK_WALKWAY =
  "Central Park balconies on deck 14 can have the view cut by the cross-ship walkway structure coming off the pool deck above.";

const BOARDWALK_AFT_SIGHTLINE =
  "Separately, Boardwalk balconies on 14 can have their aft and ocean sightline narrowed by upper-deck structure — a different problem in a different place, and it stacks with the pool-overhead and privacy issues those cabins already have.";

/** Ship-specific Central Park cabins. Explicitly NOT a class constant. */
const CENTRAL_PARK_CABINS: Partial<Record<OasisShip, string>> = {
  oasis:
    "On this ship the cabins to check are 14207 to 14217 and 14607 to 14617, plus 14229 to 14235 and 14629 to 14635.",
  utopia:
    "This ship has its own list and it is NOT Oasis's — 14217 is a documented example here, but check the current plan rather than transferring numbers between hulls.",
};

/** When each hull was amplified — reviews predating it describe a different ship. */
const AMPLIFIED: Partial<Record<OasisShip, string>> = {
  oasis:
    "Oasis was amplified in November 2019, gaining the Ultimate Abyss, the Perfect Storm slides and a redesigned pool deck. Anything written before then describes a different ship.",
  allure:
    "Allure was amplified in 2025 and now carries most of what the newer hulls have. Reviews and photos from before that are out of date, and there are a lot of them.",
  harmony:
    "Harmony came out of its amplification and back into service on 21 May 2026, with 91 new staterooms added. Any deck plan older than that is stale — and note the figure, because pre-refit sources circulate a higher one.",
};

function oasisClassContent(ship: OasisShip): ShipContent {
  const amplified = AMPLIFIED[ship];
  const parkCabins = CENTRAL_PARK_CABINS[ship];

  return {
    reviewDue: "2027-02-01",
    sources: [...ROYAL_SOURCES, ...OASIS_SOURCES],

    cabin: {
      // Signed off by Jimmy, 2026-08-19. Corrections at the top of the file.
      verified: true,
      placementNote: `${OASIS_QUIET_DEFAULT} ${DECK_14_POOL_OVERHEAD}`,
      motionAvoid: MOTION_RULE,
      vibrationNote: withShipNote(
        VIBRATION_RULE,
        "These hulls carry four stabilisers rather than the usual two and the sheer size damps a lot — the low-and-midship rule still applies, it just starts from a calmer baseline.",
      ),
      categoryWarnings: [
        "The neighbourhood balconies are the decision on this class, and the two are not the same product. Boardwalk faces the open-air AquaTheater and the activity of that whole space — that's a trade, not a defect. A client who wants to watch the neighbourhood from their own balcony will love it; a light sleeper will not, and the further aft and the closer vertically to the Boardwalk, the more it carries. Show times vary by sailing, so don't quote one.",
        "Central Park is the quieter inward choice — but quieter is not silent. Nothing is staged there the way it is on the Boardwalk, and Royal itself sells it as the low-key neighbourhood, but there's evening music and ambient activity, and the higher Central Park cabins can take pool-deck noise from above, deck 14 especially.",
        "You'll hear that Central Park cabins get restaurant noise from the park below. I could not find a single source that documents it, and neither could Jimmy — so stop repeating it. Talking a client out of a good cabin on a rumour costs them the booking they wanted.",
        "Any inward-facing balcony on this class has reduced privacy, and this one IS documented rather than folklore: Central Park and Boardwalk balconies can be seen from the balconies across the neighbourhood. That's a materially different product from an ocean-facing balcony and it needs disclosing before booking, not after.",
        "Promenade-view interiors are a separate privacy question from the neighbourhood balconies — those are bay windows onto the Royal Promenade, and the Promenade can see in. Don't lump the two together when you're explaining them.",
        "Interior square footage varies far more on this class than the category name suggests, and it varies BY SHIP. There are 96-square-foot studio interiors in Royal's own current material, and 140 and 149 square foot rooms among the older layouts, alongside standard interiors that are much bigger. Check the actual number for the specific cabin on the specific ship — this is exactly what a category filter misses.",
        "Royal Suite Class splits into Star, Sky and Sea, and the Royal Genie comes with Star only. Promising genie service to a Sky or Sea client is the easiest way to lose one on this class. Royal has also started selling a separate Genie package on some ships where Star Class isn't offered — that's a different product and doesn't change the rule here.",
      ],
      hazardsAboveBelow: [
        {
          source: "lido",
          where:
            "the deck 15 pool, directly over the deck 14 cabins — chair movement and early setup are the documented complaint",
        },
        {
          source: "theater",
          where:
            "the AquaTheater, open-air at the aft end and facing the Boardwalk balconies",
        },
        {
          source: "sports",
          where:
            "the FlowRiders, zip line and Ultimate Abyss entrance on deck 16, above the deck 14 cabins",
        },
      ],
      obstructedViewNotes: `Deck 6 is the lifeboat band and the geometry is consistent across all six ships: six boats a side forward affecting roughly 6136 to 6224 on port and 6536 to 6624 on starboard, and three a side aft affecting 6282 and aft on port, 6682 and aft on starboard. The hump cabins are exempt, and that exemption is real and worth using. Important on what this actually costs the client: the lifeboats take the view straight DOWN to the water — the outward horizon is often still fine. Separately and higher up, there are two different deck 14 problems. ${CENTRAL_PARK_WALKWAY} ${
        parkCabins ?? "The affected cabins differ by ship, so check the current plan for this hull rather than transferring numbers from a sister."
      } ${BOARDWALK_AFT_SIGHTLINE}`,
      obstructionKinds: ["lifeboat-davit", "solid-structure", "overlooked"],
      connectingNote: CONNECTING_RULE,
      minorPlacementRule: ROYAL_MINOR_PLACEMENT,
      elevatorNote:
        "Twenty-four main lifts — twelve forward and twelve aft, running through deck 16, with another six serving the suite decks on 17 and 18. There is no midship passenger bank at all. That inverts the usual advice: on this class midship still reduces motion, but it INCREASES walking, because all the vertical circulation is concentrated at the two ends. Book near the end of the ship they'll actually use.",
      accessibilityNote:
        "The no-midship-bank fact is the one that matters for a mobility booking, and it cuts against the instinct. A midship cabin here means walking to one end of an 1,100-foot ship every single time. Pick the end that matches their week and book close to it, rather than defaulting to the middle. The neighbourhood layout also means more horizontal distance than a conventional ship of the same size, so map the actual daily route before committing, and confirm the accessible deck plan for the specific room.",
    },

    money: ROYAL_MONEY,

    traps: {
      // Signed off by Jimmy, 2026-08-19.
      verified: true,
      kidAgeHeightRules: `The Ultimate Abyss needs 44 inches and caps at 300 pounds, and the zip line needs 52 inches with a 75 to 275 pound range. ${ROYAL_ATTRACTION_RULES} ${ROYAL_KIDS_RULES} ${ROYAL_KIDS_COST}`,
      obstructedBalconyDecks:
        "deck 6, where the lifeboats sit — roughly 6136 to 6224 and 6536 to 6624 forward, plus 6282 and aft on each side, with the hump cabins exempt",
      embarkationNote: ROYAL_EMBARKATION,
      other: [
        ...(amplified ? [amplified] : []),
        "A balcony on this class can face inward rather than out to sea. That is the single thing to check before you quote a balcony price here — the category name won't always tell you, and an inward balcony is a different product with reduced privacy.",
        "Royal Genie service is Star Class only within Royal Suite Class. Sky and Sea Class get a smaller set of perks, and the tier names are close enough that clients conflate them.",
        ...ROYAL_FLEET_TRAPS,
      ],
    },
  };
}

export const oasisOfTheSeas = oasisClassContent("oasis");
export const allureOfTheSeas = oasisClassContent("allure");
export const harmonyOfTheSeas = oasisClassContent("harmony");
export const symphonyOfTheSeas = oasisClassContent("symphony");
export const wonderOfTheSeas = oasisClassContent("wonder");
export const utopiaOfTheSeas = oasisClassContent("utopia");
