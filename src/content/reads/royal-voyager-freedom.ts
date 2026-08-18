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

/**
 * Voyager class (Voyager, Explorer, Adventure, Navigator, Mariner) and
 * Freedom class (Freedom, Liberty, Independence).
 *
 * MY RESEARCH, NOT OPERATOR-CONFIRMED. Cabin and traps are `verified: false`.
 *
 * One file, because Freedom is an enlarged Voyager and the cabin rules
 * genuinely are one family: same Royal Promenade with interior cabins
 * looking onto it, same lifeboat band on deck 6, same pool-and-buffet
 * deck 11 sitting over the deck 10 cabins, same quiet band on 7 to 9.
 *
 * What is NOT one family is what's actually onboard. These eight ships
 * were refitted at different times to different specifications, and the
 * gap is wide enough to make a facilities pitch simply wrong:
 *
 *   - Navigator's slides are the Blaster and Riptide, NOT the Perfect
 *     Storm pair everyone quotes for this class.
 *   - Explorer and Adventure never got a full amplification. They have
 *     slides, but their dining and venue lineups are materially older
 *     than Mariner's, Navigator's or Voyager's.
 *   - Liberty's 2016 work was a refurbishment, not a Royal Amplified
 *     refit, and it went back into drydock again in spring 2026.
 *
 * Deliberately NOT encoded: the deck 6 obstructed-cabin ranges. Two
 * sources publish them and they contradict each other on whether the
 * affected sections are forward or aft while sharing one range in the
 * middle — and both are content-farm sites. The deck is reliable; their
 * numbers are not.
 *
 * Also not resolved, and flagged as unresolved in the content: whether
 * the Promenade-view bay windows are one-way glass. One source says the
 * Promenade can see straight in; another says the glass is one-way. They
 * cannot both be right and a client's comfort depends on which it is.
 */

const VOYAGER_SOURCES: Source[] = [
  {
    label: "Deck 11 carries cabins alongside the pool, Windjammer and gym",
    url: "https://www.cruisedeckplans.com/ships/deckbydeck.php?ship=Freedom-of-the-Seas&deck=11",
    checked: "2026-08-18",
  },
  {
    label: "Deck 10 pool-deck overhang and whirlpool obstructions",
    url: "https://www.cruisedeckplans.com/ships/deckbydeck.php?ship=Freedom-of-the-Seas&deck=10",
    checked: "2026-08-18",
  },
  {
    label: "Promenade-view staterooms — noise, light and the privacy question",
    url: "https://www.royalcaribbeanblog.com/2014/08/05/everything-about-royal-caribbeans-promenade-view-staterooms",
    checked: "2026-08-18",
  },
  {
    label: "Voyager deck plans — cabins on deck 2 by the ice rink and deck 3 by Studio B",
    url: "https://www.cruisemapper.com/deckplans/Voyager-Of-The-Seas-541",
    checked: "2026-08-18",
  },
  {
    label: "Royal Amplified schedule and per-ship refit contents",
    url: "https://www.royalcaribbeanblog.com/2025/09/17/royal-caribbean-amplification-schedule",
    checked: "2026-08-18",
  },
];

type VoyagerShip =
  | "voyager"
  | "explorer"
  | "adventure"
  | "navigator"
  | "mariner"
  | "freedom"
  | "liberty"
  | "independence";

/** What each hull actually got, and when. Quoting the wrong one is the trap. */
const REFIT: Record<VoyagerShip, string> = {
  voyager:
    "Voyager was amplified in October 2019 — Perfect Storm slides, laser tag, refreshed spa and kids' spaces, and about nineteen new interior cabins added on deck 3.",
  explorer:
    "Explorer never got a full amplification — it was postponed indefinitely. It has a FlowRider and slides from earlier work, but the dining and venue lineup is materially older than Mariner's or Navigator's. Sources also disagree on when its slides went in. Don't quote this ship's venues off a class summary.",
  adventure:
    "Adventure never got a full amplification either — postponed indefinitely. Its 2016 refurbishment swapped the roller-skating track for a FlowRider and the Cyclone and Typhoon slides, but the rest of the ship is older than the amplified hulls. Don't quote its venues off a class summary.",
  navigator:
    "Navigator was amplified in February 2019, and its slides are the Blaster and the Riptide — an aqua coaster and a head-first mat racer — NOT the Perfect Storm pair that gets quoted for this class generically. If you promise a family Cyclone and Typhoon on this ship you'll be wrong.",
  mariner:
    "Mariner was amplified in June 2018 — Sky Pad, Perfect Storm slides, a FlowRider, Playmakers, laser tag and about forty new cabins.",
  freedom:
    "Freedom was amplified in March 2020 — Perfect Storm racing slides, Splashaway Bay, the Lime & Coconut bar, poolside casitas, El Loco Fresh, Playmakers, Izumi and a rebuilt Adventure Ocean.",
  liberty:
    "Liberty's 2016 work was a refurbishment rather than a Royal Amplified refit — it added the Tidal Wave boomerang slide plus the Cyclone and Typhoon racers, Splashaway Bay, Sabor and Giovanni's Table. It went back into drydock in spring 2026 for new restaurants, more cabins and a revamped pool deck; that work is recent enough that I'd verify what's actually aboard before quoting it.",
  independence:
    "Independence was the first Royal Amplified ship, in May 2018 — Sky Pad, Perfect Storm slides, laser tag in Studio B, an escape room, a kids' aqua park and about 107 new cabins.",
};

const FREEDOM_SHIPS = new Set<VoyagerShip>([
  "freedom",
  "liberty",
  "independence",
]);

function voyagerFamilyContent(ship: VoyagerShip): ShipContent {
  const isFreedom = FREEDOM_SHIPS.has(ship);

  return {
    reviewDue: "2027-02-01",
    sources: [...ROYAL_SOURCES, ...VOYAGER_SOURCES],

    cabin: {
      // MY RESEARCH. Not signed off.
      verified: false,
      placementNote: `Decks 7, 8 and 9 midship — every source I found converges on that band, and the reason is structural: they're sandwiched between other cabin decks with no public rooms above or below. Deck 10 is the one to avoid, because deck 11 above it is the pool, the Windjammer and the gym. Note that deck 11 carries a few cabins of its own rather than being pure pool deck, and there are more forward on 12. Low down, decks 2 and 3 also carry cabins — right by the ice rink on 2 and the theatre balcony and disco on 3. ${
        isFreedom ? "Freedom class is the enlarged version of this hull, but the deck logic is the same." : ""
      }`,
      motionAvoid:
        "Push hard for midship. Extreme forward is the one to rule out; extreme aft is a negative when there's comparable midship inventory, and more so if vibration also matters to them.",
      vibrationNote:
        "Lower decks are generally better for motion, not worse — closer to the waterline. The catch is vibration: a low cabin at the back can still pick up the propulsion, so \"go low\" isn't automatically the right call for a sensitive traveller. Aft vibration gets reported on these hulls, particularly under the Windjammer, but only by sources I wouldn't lean on — treat it as the general rule, not a measured fact about these ships.",
      categoryWarnings: [
        "The Promenade-view interiors are the category to explain properly. They're on decks 6, 7 and 8, with bay windows looking down onto the Royal Promenade — no sea view, but light and a view of something. The downsides are noise from parades and events below, and the Promenade lighting never really going off. The first night is the loudest, and higher is better: deck 8 beats 7 beats 6.",
        "One thing about those cabins I could not resolve, and you should raise it rather than guess: sources disagree on whether the bay window is one-way glass or whether the Promenade can see straight in. They can't both be right. If your client would care, have them ask at check-in rather than find out.",
        "The forward-facing panoramic oceanviews are the value pick on these ships — around 215 square feet with floor-to-ceiling wraparound windows, for oceanview money rather than suite money.",
        "Aft-facing balcony cabins are prized here and the reason is the balcony rather than the room: the interior is a standard balcony cabin, but the outdoor space is much larger. The deck 10 aft-facing ones are reported unobstructed, unlike some lower down.",
        "Interiors run small on this class, roughly 150 to 190 square feet. Check the specific number rather than the category.",
      ],
      hazardsAboveBelow: [
        {
          source: "lido",
          where:
            "deck 11 — the pool deck, over the deck 10 cabins, and it carries a handful of cabins itself",
        },
        {
          source: "buffet",
          where: "the Windjammer, also on deck 11 above the deck 10 cabins",
        },
        {
          source: "gym",
          where: "also on deck 11, on the same deck as the pool and buffet",
        },
        {
          source: "sports",
          where:
            "the ice rink on deck 2 — cabins share that deck with it, which is unusual and worth checking",
        },
        {
          source: "nightclub",
          where:
            "the disco and the theatre's upper level on deck 3, alongside the cabins there",
        },
      ],
      obstructedViewNotes:
        "Deck 6 is the lifeboat band on both classes — that much is consistent. What isn't consistent is which cabins: the two published lists contradict each other on whether the affected sections are forward or aft, and neither source is one I'd rely on, so I'm not repeating their numbers. Read the category on the specific cabin. Separately and better sourced, there's a second kind of obstruction on deck 10 that isn't lifeboats at all: the pool deck above overhangs some cabins and shades them, and a few sit directly beneath whirlpools that extend out over the ship's side. Those are worth checking on the deck plan before you place anyone on 10.",
      connectingNote:
        "Never read connecting status off the category or off two cabin numbers being next to each other — only an explicit connecting pair counts.",
      minorPlacementRule: ROYAL_MINOR_PLACEMENT,
      accessibilityNote:
        "Around fourteen elevators on these hulls. One source claims there are only two banks, forward and midship, with no aft bank at all — that would matter enormously for a mobility booking, and I could not verify it against a deck plan, so check it for the specific ship rather than taking my word either way. The dining and entertainment core is low and the pool is on 11, so there's a real vertical trip in the day. Confirm the accessible deck plan for the specific cabin.",
    },

    money: ROYAL_MONEY,

    traps: {
      // MY RESEARCH. Not signed off.
      verified: false,
      kidAgeHeightRules: `${ROYAL_ATTRACTION_RULES} ${ROYAL_KIDS_RULES} ${ROYAL_KIDS_COST}`,
      obstructedBalconyDecks:
        "deck 6, where the lifeboats sit, plus the deck 10 cabins shaded by the pool-deck overhang or sitting under a whirlpool that extends over the side",
      embarkationNote: ROYAL_EMBARKATION,
      other: [
        REFIT[ship],
        "These eight ships were refitted at different times to different specifications, so the class name tells you very little about what's actually aboard. Check the specific hull's facilities rather than quoting the class — this is the single most common way to be wrong about these ships.",
        ...ROYAL_FLEET_TRAPS,
      ],
    },
  };
}

export const voyagerOfTheSeas = voyagerFamilyContent("voyager");
export const explorerOfTheSeas = voyagerFamilyContent("explorer");
export const adventureOfTheSeas = voyagerFamilyContent("adventure");
export const navigatorOfTheSeas = voyagerFamilyContent("navigator");
export const marinerOfTheSeas = voyagerFamilyContent("mariner");
export const freedomOfTheSeas = voyagerFamilyContent("freedom");
export const libertyOfTheSeas = voyagerFamilyContent("liberty");
export const independenceOfTheSeas = voyagerFamilyContent("independence");
