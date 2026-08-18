import type { ShipContent, Source } from "@/lib/types";
import type { ActivityAvailability } from "@/lib/availability";
import type { ObstructionKind } from "@/lib/obstruction";
import {
  ROYAL_EMBARKATION,
  ROYAL_FLEET_TRAPS,
  ROYAL_KIDS_COST,
  ROYAL_KIDS_RULES,
  ROYAL_MINOR_PLACEMENT,
  ROYAL_MONEY,
  ROYAL_SOURCES,
} from "./royal-common";
import { attractionRules, type AttractionId } from "./royal-attractions";
import {
  CONNECTING_RULE,
  MOTION_RULE,
  QUIET_DEFAULT_RULE,
  VIBRATION_RULE,
  withShipNote,
} from "./operator-rules";

/**
 * Voyager class (Voyager, Explorer, Adventure, Navigator, Mariner) and
 * Freedom class (Freedom, Liberty, Independence).
 *
 * SIGNED OFF by Jimmy, 2026-08-19. Fourth Royal unit reviewed, and the
 * one that changed the shape of a record rather than just its contents.
 *
 * ONE FILE, BUT HIERARCHICAL — his call, and the structure is the point:
 *
 *     shared Voyager/Freedom geometry
 *       -> Voyager-class structural exceptions
 *          / Freedom-class structural exceptions
 *          -> individual ship current-feature + refit + availability
 *
 * Eight independent geometry files would duplicate the Promenade and
 * quiet-deck rules eight times and let them drift. But a flat shared
 * record would pretend eight independently refitted twenty-year-old ships
 * carry the same product, which is false in a way that loses bookings.
 * Freedom's stretch does introduce real structural differences — the
 * cantilevered whirlpools most of all — and those live in the Freedom
 * overlay rather than being smeared across all eight.
 *
 * THE BIG CORRECTION: THERE IS NO DECK 6 LIFEBOAT BAND HERE. I had it as
 * the class's headline obstruction and it is an inheritance error —
 * borrowed from Oasis and Quantum, where the lifeboat rule is real.
 * On these hulls the boats sit lower, tucked beneath, and deck 6 ocean
 * balconies are reported unobstructed. `lifeboat-davit` is gone from this
 * file entirely. Not every Royal class has an Oasis-shaped obstruction
 * problem, and assuming one produced a warning about a defect that isn't
 * there.
 *
 * THE PROMENADE GLASS IS RESOLVED, AND THE ANSWER IS NOT PRIVATE. I had
 * it as an open question the advisor should raise at check-in. Jimmy
 * closed it: people on the Promenade and in the cabins opposite can see
 * in when the curtains are open, especially with the cabin lit. Curtains
 * are the privacy mechanism, and that is what to tell a client. "Ask
 * someone onboard" is not an answer a confidence product gets to give.
 *
 * Other corrections:
 *   - Deck 10 is a tradeoff, not an avoid. Third class running.
 *   - Deck 11 and 12 cabins are PER SHIP, not class-wide. Freedom and
 *     Independence have cabins mixed into 11, Independence has more on
 *     12, and Liberty's 11 is essentially public Lido. I had it as one
 *     vague class-wide aside, which is the worst of both.
 *   - Deck 2 and 3 adjacency is signed; the venue LABELS are softened.
 *     "Deck 3 = disco" is not a shared constant — refits changed those
 *     spaces ship by ship and Independence converted former nightclub
 *     space outright.
 *   - Promenade noise keeps deck 8 > 7 > 6 as a researched tendency.
 *     "First night is the loudest" and "the lighting never really goes
 *     off" are deleted — folklore I couldn't source.
 *   - The aft-balcony claim is NOT a shared rule. Some are excellent and
 *     oversized; others look through substantial aft superstructure, and
 *     Freedom's geometry differs from Voyager's again. "Deck 10
 *     aft-facing is unobstructed" is deleted as a family claim.
 *   - The 150 to 190 square foot interior range is deleted. A 40-square-
 *     foot spread across eight refitted hulls describes nothing.
 *   - Attraction restrictions moved OUT of this file into
 *     `royal-attractions.ts` as constants, with each ship listing which
 *     rides it currently has. Navigator vs Adventure is why.
 *   - Sky Pad is GONE from Mariner and Independence. Royal retired the
 *     bungee experience fleetwide from 2023; the domes stayed and the
 *     attraction didn't. I was selling a ride that no longer exists.
 *   - Liberty's amplification is FINISHED, not pending. It completed
 *     29 May 2026. I had it as work to verify.
 *   - Voyager's 2019 work added far more than the "~19 new interiors" I
 *     recorded — around 72 staterooms across its modifications.
 *   - Explorer currently advertises FlowRider and the Perfect Storm.
 *     "Never fully amplified" is history; what's aboard now is the thing
 *     an advisor sells.
 *
 * Deliberately NOT encoded: any obstructed-cabin number list (the two
 * that circulate contradict each other AND rest on the deck 6 lifeboat
 * premise that doesn't survive); exact interior or oceanview dimensions
 * as class constants; and the elevator BANK LABELS — see the
 * accessibility note for why the naming itself is the problem.
 */

const VOYAGER_SOURCES: Source[] = [
  {
    label:
      "Official Voyager deck plans — core stateroom stack and Royal Promenade concept shared across both families (checked by Jimmy)",
    url: "https://www.royalcaribbean.com/cruise-ships/voyager-of-the-seas/deck-plans",
    checked: "2026-08-19",
  },
  {
    label:
      "Promenade-view staterooms — the Promenade can see back into the room; curtains are the privacy mechanism",
    url: "https://www.royalcaribbeanblog.com/2014/08/05/everything-about-royal-caribbeans-promenade-view-staterooms",
    checked: "2026-08-19",
  },
  {
    label:
      "Deck 6 balconies are NOT lifeboat-obstructed on these hulls — the boats sit lower",
    url: "https://boards.cruisecritic.com/topic/801482-rccl-voyager-of-the-seas-deck-6-balcony/",
    checked: "2026-08-19",
  },
  {
    label:
      "Freedom deck 10 — Grand Suites 1260/1264/1268 and 1560/1564/1568 under the cantilevered whirlpools",
    url: "https://www.cruisemapper.com/deckplans/Freedom-Of-The-Seas-654/deck10-718",
    checked: "2026-08-19",
  },
  {
    label: "Freedom and Independence carry cabins on deck 11; Liberty's 11 is public Lido",
    url: "https://www.cruisemapper.com/deckplans/Freedom-Of-The-Seas-654/deck11-719",
    checked: "2026-08-19",
  },
  {
    label: "Sky Pad retired fleetwide from 2023 — the domes remained, the attraction did not",
    url: "https://www.royalcaribbeanblog.com/2023/03/22/royal-caribbean-getting-rid-of-the-sky-pad-all-of-its-ships",
    checked: "2026-08-19",
  },
  {
    label: "Liberty completed its Royal Amplification on 29 May 2026",
    url: "https://www.royalcaribbeanblog.com/2026/06/01/royal-caribbean-liberty-of-the-seas-finished-upgrades",
    checked: "2026-08-19",
  },
  {
    label: "Navigator currently has The Blaster and Riptide; Adventure has Typhoon and Cyclone",
    url: "https://www.royalcaribbean.com/cruise-ships/navigator-of-the-seas/things-to-do",
    checked: "2026-08-19",
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

const FREEDOM_SHIPS = new Set<VoyagerShip>(["freedom", "liberty", "independence"]);

/* ------------------------------------------------------------------ *
 * LAYER 1 — shared Voyager/Freedom geometry.
 * True of all eight hulls. Nothing ship-specific belongs here.
 * ------------------------------------------------------------------ */

/**
 * Decks 7 to 9 midship. Sandwiched between cabin decks with no public
 * rooms above or below — the cleanest shared default in the family.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-19).
 */
const VF_QUIET_DEFAULT = `Midship on decks 7, 8 or 9. ${QUIET_DEFAULT_RULE} On this family that band is the cleanest shared answer there is: 7 to 9 sit between other cabin decks with no public rooms above or below them.`;

/**
 * Deck 10 as a tradeoff. Third Royal class running where I had written
 * a blanket avoid and it needed softening.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-19).
 */
const VF_DECK_10 =
  "Deck 10 sits under deck 11's pool, Solarium, Windjammer and gym complex, so a noise-sensitive client should take a lower alternative — but it is not unbookable, and calling it an avoid loses a booking that would have been fine for someone who wanted the pool close.";

/**
 * THE PROMENADE GLASS IS NOT A PRIVACY BARRIER. Resolved, not raised.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-19), closing a question the record
 * previously punted to check-in.
 */
const PROMENADE_WINDOW_PRIVACY =
  "Be straight with them about the privacy, because this is the part people don't expect and it is NOT an open question: the bay window is not one-way glass and it is not a privacy barrier. People on the Promenade and in the cabins opposite can see into the room when the curtains are open, and much more so when the cabin is lit. Curtains are the privacy mechanism — that's the whole answer, and a client told in advance is fine with it.";

const PROMENADE_VIEW =
  "The Promenade-view interiors are the category to explain properly. They're on decks 6, 7 and 8 with large bay windows looking down onto the Royal Promenade — no sea view, but real light and a view of something, which beats an inside cabin for a lot of people. The glass isn't soundproof, so event and party noise reaches them. Height helps: deck 8 over 7 over 6 is a sensible tendency rather than a measured rule, and it follows simply from distance off the Promenade floor.";

/**
 * Cabins low down, next to public rooms — signed as adjacency, softened
 * on the venue names. Refits moved those spaces around ship by ship, so
 * "deck 3 is the disco" is not a thing this file gets to say.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-19).
 */
const VF_LOW_DECKS =
  "Low down, decks 2 and 3 also carry cabins, and they sit right up against public space — deck 2 around the ice rink and Studio B, deck 3 around entertainment and dining rooms. That adjacency is unusual enough to be worth a deliberate check on any low cabin here. What this record deliberately won't tell you is which venue: these eight were refitted at different times and those spaces moved, with Independence converting former nightclub space outright. Check the current plan for the specific hull rather than trusting a class-level venue name.";

/* ------------------------------------------------------------------ *
 * LAYER 2 — class overlays.
 * ------------------------------------------------------------------ */

/**
 * FREEDOM ONLY. The cantilevered whirlpools are the single strongest
 * argument against a flat shared record — six named Grand Suites sit
 * directly under them, and it is a structure-and-shade problem with
 * people overhead, not a blocked horizon.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-19).
 */
const FREEDOM_WHIRLPOOLS =
  "Freedom-class geometry adds something Voyager doesn't have: whirlpools cantilevered out from deck 11, with six Grand Suites sitting directly beneath them — 1260, 1264 and 1268 on one side, 1560, 1564 and 1568 on the other. What that means is overhead structure, shade and the pool deck's activity immediately above, NOT a blocked view out. Those are different conversations and they lead to different clients.";

/** VOYAGER ONLY. There is an overhang, but not the whirlpool geometry. */
const VOYAGER_OVERHANG =
  "Voyager-class hulls have a deck 11 overhang shading some deck 10 balconies too, but not Freedom's cantilevered-whirlpool arrangement — so don't transfer Freedom's named suite numbers onto these five.";

/**
 * Deck 11 and 12 cabins, PER SHIP. Refits put cabins on decks that were
 * pure Lido on the original design, which is exactly the both-ways scan
 * the Fantasy class taught. Absent means the deck is public space here.
 */
const UPPER_DECK_CABINS: Partial<Record<VoyagerShip, string>> = {
  freedom:
    "This ship has cabins mixed into deck 11 itself, alongside the pool complex rather than below it — so the class reassurance that everything above deck 10 is public space does NOT hold here. Run the scan both ways on any deck 11 cabin.",
  independence:
    "This ship has cabins mixed into deck 11 alongside the pool complex, and more again on deck 12. The class reassurance that everything above deck 10 is public space does NOT hold here, and deck 12 needs its own check of what sits over it.",
  liberty:
    "Unlike its two sisters, this ship's deck 11 is essentially public Lido with no cabins mixed in — which makes the plain deck 10 rule work cleanly here.",
};

/* ------------------------------------------------------------------ *
 * LAYER 3 — per-ship current features, refit history and availability.
 * ------------------------------------------------------------------ */

/** What each hull actually has TODAY. History goes in REFIT, not here. */
const ATTRACTIONS: Record<VoyagerShip, AttractionId[]> = {
  voyager: ["flowrider", "perfect-storm", "rock-wall"],
  explorer: ["flowrider", "perfect-storm", "rock-wall"],
  adventure: ["flowrider", "perfect-storm", "rock-wall"],
  navigator: ["flowrider", "blaster", "riptide", "rock-wall"],
  mariner: ["flowrider", "perfect-storm", "rock-wall"],
  freedom: ["flowrider", "perfect-storm", "rock-wall"],
  liberty: ["flowrider", "perfect-storm", "tidal-wave", "rock-wall"],
  independence: ["flowrider", "perfect-storm", "rock-wall"],
};

/** Refit HISTORY — context for why two sisters feel different. */
const REFIT: Record<VoyagerShip, string> = {
  voyager:
    "Voyager was amplified in October 2019 — the Perfect Storm slides, laser tag, refreshed spa and kids' spaces, and a substantial accommodation expansion of roughly 72 staterooms across its modifications, not the handful that sometimes gets quoted.",
  explorer:
    "Explorer never got a full Royal Amplified refit — it was postponed indefinitely, and its dining and venue lineup is older than the amplified hulls. But don't lead with that: Royal currently advertises both a FlowRider and the Perfect Storm slides on this ship, and what's aboard now is what you're selling. Check the current ship page for venues rather than a class summary.",
  adventure:
    "Adventure never got a full Royal Amplified refit either — postponed indefinitely. Its 2016 refurbishment swapped the roller-skating track for a FlowRider and the Typhoon and Cyclone slides, which it still has, but the rest of the ship is older than the amplified hulls. Don't quote its venues off a class summary.",
  navigator:
    "Navigator was amplified in February 2019, and its slides are the Blaster and the Riptide — an aqua coaster and a head-first mat racer — NOT the Perfect Storm pair that gets quoted for this family generically. Different rides and different height minimums, so promising a family Cyclone and Typhoon on this ship is wrong twice over.",
  mariner:
    "Mariner was amplified in June 2018 — the Perfect Storm slides, a FlowRider, Playmakers, laser tag and around forty new cabins. The Sky Pad that came with that refit is GONE: Royal retired the bungee experience fleetwide from 2023 and the dome stayed up after the attraction inside it was removed. Don't sell it.",
  freedom:
    "Freedom was amplified in March 2020 — the Perfect Storm racers, Splashaway Bay, the Lime & Coconut bar, poolside casitas, El Loco Fresh, Playmakers, Izumi and a rebuilt Adventure Ocean.",
  liberty:
    "Liberty's Royal Amplification is FINISHED, not pending — it completed on 29 May 2026 and the ship is back in service with a revamped pool deck, a new escape room, El Loco Fresh and Izumi Hibachi & Sushi. It kept the Tidal Wave boomerang slide alongside the Typhoon and Cyclone racers, which makes it the only hull in the family with all three.",
  independence:
    "Independence was the first Royal Amplified ship, in May 2018 — the Perfect Storm slides, laser tag in Studio B, an escape room, a kids' aqua park and around 107 new cabins. Its Sky Pad is GONE: Royal retired the bungee experience fleetwide from 2023 and the dome outlived the attraction. Don't sell it.",
};

/** Nothing currently out of service across these eight. Empty means nobody checked. */
const AVAILABILITY: Partial<Record<VoyagerShip, ActivityAvailability[]>> = {};

function voyagerFamilyContent(ship: VoyagerShip): ShipContent {
  const isFreedom = FREEDOM_SHIPS.has(ship);
  const upper = UPPER_DECK_CABINS[ship];
  const availability = AVAILABILITY[ship];

  // Freedom's cantilevered whirlpools are a distinct mechanism from a
  // plain overhang, and neither is "overlooked" — that word is reserved
  // for a privacy problem. No lifeboat-davit anywhere in this family.
  const kinds: ObstructionKind[] = isFreedom
    ? ["cantilevered-whirlpool", "pool-deck-overhang", "aft-superstructure"]
    : ["pool-deck-overhang", "aft-superstructure"];

  return {
    reviewDue: "2027-02-01",
    sources: [...ROYAL_SOURCES, ...VOYAGER_SOURCES],
    ...(availability ? { availability } : {}),

    cabin: {
      // Signed off by Jimmy, 2026-08-19. Corrections at the top of the file.
      verified: true,
      placementNote: `${VF_QUIET_DEFAULT} ${VF_DECK_10} ${upper ?? "On this ship deck 11 is the pool complex rather than a cabin deck."} ${VF_LOW_DECKS}`,
      motionAvoid: MOTION_RULE,
      vibrationNote: withShipNote(
        VIBRATION_RULE,
        "Aft vibration gets reported on these hulls, particularly under the Windjammer, but only by sources I wouldn't lean on — treat it as the general rule, not a measured fact about these ships.",
      ),
      categoryWarnings: [
        PROMENADE_VIEW,
        PROMENADE_WINDOW_PRIVACY,
        "The forward-facing panoramic oceanviews are the value pick on these ships — floor-to-ceiling wraparound windows for oceanview money rather than suite money. There's also a much larger panoramic suite version. I'm not giving you a class square footage: the sizes differ by ship and category, and \"Panoramic\", \"Spacious\" and \"Ultra Spacious\" are marketing adjectives Royal reuses across room families, so they carry no size information. Read the actual dimensions for the ship and category on the booking screen.",
        "Aft-facing balconies here are a check, not a recommendation. Some are genuinely excellent with oversized outdoor space, and that's what sells them — but others look through or over substantial aft superstructure, and Freedom-class geometry differs from Voyager's again. This is the category where the client's expectation and the reality diverge most, so confirm the specific cabin rather than trusting the aft-balcony reputation.",
        ...(isFreedom ? [FREEDOM_WHIRLPOOLS] : [VOYAGER_OVERHANG]),
      ],
      hazardsAboveBelow: [
        {
          source: "lido",
          where: `the pool and Solarium complex on deck 11, over the deck 10 cabins${upper && ship !== "liberty" ? " — and on this ship there are cabins on 11 itself, beside it" : ""}`,
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
            "the ice rink and Studio B low down on deck 2 — cabins share that deck with it, which is unusual and worth checking",
        },
      ],
      obstructedViewNotes: `There is NO deck 6 lifeboat band on these ships, and that's worth saying explicitly because it's what everyone expects from other Royal classes. The boats sit lower here, tucked beneath, and deck 6 ocean balconies are reported unobstructed. Don't warn a client off deck 6 on this family. What IS real is overhead rather than outward: the deck 11 pool complex overhangs and shades some deck 10 balconies.${isFreedom ? " On this class specifically, six Grand Suites sit directly under whirlpools cantilevered out from deck 11 — 1260, 1264, 1268, 1560, 1564 and 1568." : ""} Aft balconies are a separate check again, because some look through the ship's own superstructure. Cabin-number lists circulate for this family; they contradict each other and they rest on the deck 6 lifeboat premise that doesn't survive, so none of their numbers are here. If an individual cabin really is flagged, it will be marked on Royal's own current deck plan.`,
      obstructionKinds: kinds,
      connectingNote: CONNECTING_RULE,
      minorPlacementRule: ROYAL_MINOR_PLACEMENT,
      accessibilityNote:
        "Around fourteen lifts on these hulls, and the layout is best described as two major passenger elevator-and-stair cores rather than three. I'm deliberately NOT labelling them: some cruisers call them forward and midship, others forward and aft, because the rear core is aft relative to the forward one while still sitting well forward of the stern. Those labels contradict each other and encoding either would mislead. What IS decision-relevant, and what to actually plan around: there is no lift core at the extreme aft end, so a true aft cabin means a long horizontal walk to the rear core before any vertical trip starts. The dining and entertainment core is low and the pool is on 11, so there's a real vertical journey in the day too. Confirm the accessible deck plan for the specific cabin.",
    },

    money: ROYAL_MONEY,

    traps: {
      // Signed off by Jimmy, 2026-08-19. Attraction restrictions now come
      // from royal-attractions.ts, mapped per hull — see ATTRACTIONS.
      verified: true,
      kidAgeHeightRules: `${attractionRules(ATTRACTIONS[ship])} ${ROYAL_KIDS_RULES} ${ROYAL_KIDS_COST}`,
      obstructedBalconyDecks: isFreedom
        ? "the deck 10 balconies shaded by the pool-deck overhang, and specifically Grand Suites 1260, 1264, 1268, 1560, 1564 and 1568 under the cantilevered whirlpools — not deck 6, which is fine on this family"
        : "the deck 10 balconies shaded by the deck 11 overhang — not deck 6, which is fine on this family",
      embarkationNote: ROYAL_EMBARKATION,
      other: [
        REFIT[ship],
        "These eight ships were refitted at different times to different specifications, so the class name tells you very little about what's actually aboard. This is the single most common way to be wrong about them: Navigator has the Blaster and the Riptide while Adventure has Typhoon and Cyclone, and those are different rides with different height minimums. Check the specific hull, never the class.",
        "Don't warn anyone off a deck 6 balcony on these ships on lifeboat grounds. That's a real rule on the Oasis and Quantum hulls and it does not apply here — the boats sit lower and deck 6 is reported clear. Being able to kill a false warning is worth as much as finding a real one.",
      ],
      linePolicy: [...ROYAL_FLEET_TRAPS],
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
