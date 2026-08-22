import type { ShipContent, Source } from "@/lib/types";
import type { Deck } from "@/lib/decks";
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
import { attractionNames, attractionRules, type AttractionId } from "./royal-attractions";
import {
  MOTION_RULE,
  QUIET_DEFAULT_RULE,
  VIBRATION_RULE,
  withShipNote,
} from "./operator-rules";

/**
 * Radiance class: Radiance (2001), Brilliance (2002), Serenade (2003),
 * Jewel (2004).
 *
 * SIGNED OFF by Jimmy, 2026-08-19. Fifth Royal unit, and the cleanest
 * one — the quiet default survived the review unchanged, which is a
 * first.
 *
 * These are the scenic-cruising ships: three acres of glass, panoramic
 * glass lifts on the outside of the hull, a glass-walled two-level dining
 * room, a retractable roof over the Solarium. The single most useful
 * sentence about them is a positioning one rather than a warning —
 * SCENERY-FIRST, NOT ATTRACTION-FIRST. That is a different product, not a
 * smaller version of the big ships, and the old record framed the absence
 * of a FlowRider as a deficiency instead.
 *
 * IT ADDED TWO OBSTRUCTION KINDS AND AN AXIS. The deck 7 lifeboat roof
 * fit neither `solid-structure` (right cause, wrong advice — it implies
 * the view is lost) nor `lifeboat-davit` (right advice, wrong cause —
 * you see a roof, not boats). Jimmy's answer was to stop making one enum
 * carry both jobs: an obstruction has a CAUSE and an EFFECT, and the
 * recommendation keys off the effect. `lifeboat-roof` and
 * `window-washing-platform` are now their own kinds, and every kind
 * carries a typed `effect`. See `src/lib/obstruction.ts`.
 *
 * The practical payoff on this class: the deck 7 roof blocks the view
 * STRAIGHT DOWN while leaving the horizon essentially intact. Disclose
 * it; don't steer a scenic-view client away over it. Converting "cannot
 * look straight down" into "obstructed balcony" is what the blogs do,
 * and it costs a booking that would have been perfectly happy.
 *
 * Corrections his pass made:
 *   - Deck 10 is a tradeoff, not an avoid. Fourth class running.
 *   - 7170 and 7670 are NOT a class constant. Radiance has them,
 *     Brilliance has them plus others, Jewel's data doesn't cleanly
 *     reproduce the pair. Structural-obstruction cabins are ship-specific
 *     and need importing from each current plan.
 *   - 9252 and 9652 DO hold across all four, and the window-washing
 *     platform is its own mechanism.
 *   - The hump principle is signed; the Serenade numbers stay researched
 *     and aren't inherited by the other three. And "wider deck" is the
 *     wrong description — it's the outward bulge of the hull. Don't
 *     promise a bigger balcony either: 7596 and 7606 can be ordinary
 *     size with excellent view geometry.
 *   - The propulsion facts stay; the low-vibration CLAIM is quarantined
 *     as manufacturer material and must never become placement logic.
 *     "Book aft, this class doesn't vibrate" is exactly the leap this
 *     product refuses.
 *   - The elevator COUNT drops to researched and the "port side" detail
 *     is not encoded class-wide. The panoramic glass lifts themselves are
 *     signed — on Alaska they're part of the experience, not transport.
 *   - The aft-balcony recommendation is reframed as FIT rather than
 *     cabin quality. It's right for a client who wants wake views and
 *     long outdoor viewing on a scenic itinerary, and wrong for one who
 *     needs a short walk to a lift.
 *   - The balcony-percentage note is DELETED. "I found three conflicting
 *     figures" is a researcher's audit trail, not advice, and no client
 *     decision turns on it.
 *   - "Serenade is the stretched one" is dropped before it was ever
 *     encoded. No evidence supports it; all four cluster around the same
 *     length. There is no Serenade structural inheritance break.
 *
 * Deliberately NOT encoded: the deck-10 cabin ranges (unreliable source);
 * the circulating claim that deck 7 cabins 7000 to 7100 are lifeboat-
 * obstructed — the real deck 7 issue is the roof and the downward view,
 * which is a different thing; and any claim that the slim hull rides
 * worse, which nothing documents.
 */

type RadianceShip = "radiance" | "brilliance" | "serenade" | "jewel";

const RADIANCE_SOURCES: Source[] = [
  {
    label:
      "Official Radiance deck plans — cabins on 2-4 and 7-10, pool/Solarium/Windjammer on 11 (checked by Jimmy)",
    url: "https://www.royalcaribbean.com/cruise-ships/radiance-of-the-seas/deck-plans",
    checked: "2026-08-19",
  },
  {
    label:
      "Deck 7 lifeboat roof extends 8-10ft from below the balcony; downward view blocked, horizon open",
    url: "https://www.cruisedeckplans.com/ships/deckbydeck.php?deck=7&ship=Radiance-of-the-Seas",
    checked: "2026-08-19",
  },
  {
    label: "9252 and 9652 obstructed by the window-washing platform on all four hulls",
    url: "https://www.cruisedeckplans.com/ships/stateroom-details.php?cabin=9652&ship=Radiance-of-the-Seas",
    checked: "2026-08-19",
  },
  {
    label: "Serenade hump cabins 7596-7606 — good down and side sightlines",
    url: "https://www.cruisedeckplans.com/ships/deckbydeck.php?deck=7&ship=Serenade-of-the-Seas",
    checked: "2026-08-19",
  },
  {
    label: "Hump balconies can be ordinary size despite the view geometry",
    url: "https://boards.cruisecritic.com/topic/2266130-radiance-class-balcony-cabin-7596/",
    checked: "2026-08-19",
  },
  {
    label: "Gas-turbine electric propulsion with Azipods; low-vibration marketing claim",
    url: "https://www.marinelink.com/news/radiance-delivery-first325279",
    checked: "2026-08-19",
  },
  {
    label: "Rock wall, nine-hole mini-golf and sports court are what's actually aboard",
    url: "https://www.royalcaribbean.com/guides/what-is-included-on-radiance-of-the-seas",
    checked: "2026-08-19",
  },
];

/**
 * Decks 8 and 9 midship. The one quiet default that came out right first
 * time — deck 7 fails below (deck 6 is public), deck 10 fails above (the
 * pool complex on 11), leaving a clean two-deck band.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-19).
 */
const RADIANCE_QUIET_DEFAULT = `Midship on decks 8 or 9. ${QUIET_DEFAULT_RULE} Here that lands on a narrow two-deck band and the working is worth knowing: cabins run 2 to 4 and then 7 to 10, so deck 7 fails BELOW — deck 6 under it is public space — and deck 10 fails ABOVE, with the pool, Solarium and Windjammer directly over it on 11. Everything in between is genuinely sandwiched.`;

/**
 * THE DECK STACK, transcribed from this file's own signed placement note
 * rather than researched afresh. Every fact here is already in
 * `RADIANCE_QUIET_DEFAULT` and `hazardsAboveBelow` above, in words:
 *
 *   "cabins run 2 to 4 and then 7 to 10, so deck 7 fails BELOW — deck 6
 *    under it is public space — and deck 10 fails ABOVE, with the pool,
 *    Solarium and Windjammer directly over it on 11"
 *   "the sports court on 12 and the rock wall and mini-golf on 13"
 *
 * NOTHING NEW IS ASSERTED. Deck 5 is recorded as carrying no cabins
 * because the signed sentence runs "2 to 4 and then 7 to 10", which
 * excludes it; its venues are unknown and the list is left empty with a
 * note rather than invented.
 *
 * DECK 1 IS DELIBERATELY ABSENT. The signed prose does not say what is
 * on it, so it is not in the stack — which makes deck 2 come out
 * `undetermined` rather than passing or failing. That is the correct
 * answer and the reason `deckRows()` has an undetermined state at all:
 * "we don't know what's under deck 2" is not "deck 2 is fine".
 *
 * The transcription is checked, not trusted — `quietBandHolds()` asserts
 * that decks 8 and 9, the signed answer, both survive the arithmetic.
 * See the deck test.
 */
const RADIANCE_DECKS: Deck[] = [
  { deck: 2, carriesCabins: true, publicSpace: [] },
  { deck: 3, carriesCabins: true, publicSpace: [] },
  { deck: 4, carriesCabins: true, publicSpace: [] },
  {
    deck: 5,
    carriesCabins: false,
    publicSpace: [],
    note: "Not a cabin deck — the signed stack runs 2 to 4 and then 7 to 10. What's on it isn't recorded.",
  },
  {
    deck: 6,
    carriesCabins: false,
    publicSpace: ["public space"],
    note: "Named in the signed note as the public space that makes deck 7 fail below. The specific venues aren't recorded.",
  },
  { deck: 7, carriesCabins: true, publicSpace: [] },
  { deck: 8, carriesCabins: true, publicSpace: [] },
  { deck: 9, carriesCabins: true, publicSpace: [] },
  { deck: 10, carriesCabins: true, publicSpace: [] },
  {
    deck: 11,
    carriesCabins: false,
    publicSpace: ["the pool", "the Solarium", "the Windjammer buffet"],
  },
  { deck: 12, carriesCabins: false, publicSpace: ["the sports court"] },
  { deck: 13, carriesCabins: false, publicSpace: ["the rock wall", "mini-golf"] },
];

/** The band the signed placement note names. Checked against the stack. */
export const RADIANCE_SIGNED_BAND = [8, 9];

/**
 * Deck 10 as a tradeoff. Fourth class running where I wrote a blanket
 * avoid and it needed softening.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-19).
 */
const RADIANCE_DECK_10 =
  "Every deck 10 cabin needs an overhead check rather than a blanket no: deck 11 above it is the pool, the Solarium and the Windjammer, so identify which venue actually sits over the specific cabin. For a light sleeper that's a strong negative. For someone who wants one deck's access to the pool and the buffet it can be a perfectly good trade. The aft end under the buffet is the most-complained-about spot, but that's passenger judgment rather than anything measured.";

/**
 * THE DECK 7 ROOF. The reason the taxonomy grew a cause/effect split.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-19).
 */
const DECK_7_LIFEBOAT_ROOF =
  "The deck 7 balconies have a quirk that's worth explaining rather than avoiding, and it's the thing most likely to be mis-sold on this class. On the indented sections, a metal roof covering the lifeboats extends roughly eight to ten feet outward from below the balcony. What that costs you is the view STRAIGHT DOWN at the water. What it does not cost you is the horizon — the outward sea view stays substantially open. So disclose it and let them decide. Don't turn \"can't look straight down\" into \"obstructed balcony\", which is what the blogs do; a client who wants to sit with the sea in front of them will be perfectly happy here, often at a lower price.";

/**
 * The hump PRINCIPLE is class-wide. The Serenade NUMBERS are researched
 * and stay on Serenade — the other three need their own plans read.
 */
const HUMP_PRINCIPLE =
  "Ask about the hump cabins rather than avoiding them. These sit on the outward bulge of the hull, which is where the deck 7 lifeboat-roof problem disappears and where the angled position gives better views both down and along the side of the ship. One thing not to promise: the balcony isn't necessarily bigger. Reports show hump cabins with ordinary-size balconies and excellent view geometry, which are different things.";

const HUMP_NUMBERS: Partial<Record<RadianceShip, string>> = {
  serenade:
    "On this ship the hump cabins that come up by name are 7596 to 7606 — that's researched rather than confirmed, so read it off the plan before you promise a specific number.",
};

/**
 * Structural obstructions are SHIP-SPECIFIC. Radiance has 7170 and 7670;
 * Brilliance has those plus more; Jewel's data doesn't cleanly reproduce
 * the pair. Inheriting one hull's list across four was the error.
 */
const STRUCTURAL_CABINS: Partial<Record<RadianceShip, string>> = {
  radiance:
    "On this ship 7170 and 7670 are identified as partially blocked by the ship's own structure.",
  brilliance:
    "On this ship 7170 and 7670 come up as partially blocked by structure, and the published list here runs longer than Radiance's — so read the whole plan rather than assuming it's the same two.",
  jewel:
    "The 7170 and 7670 pair that's documented on Radiance does NOT cleanly reproduce on this ship — sources here name different cabins. Don't transfer them; read this hull's own plan.",
  serenade:
    "The structural pair documented on Radiance isn't established for this hull. Read this ship's own plan rather than inheriting Radiance's numbers.",
};

/** Scenery-first. This is most of what's actually aboard. */
const RADIANCE_ATTRACTIONS: AttractionId[] = ["rock-wall", "mini-golf", "sports-court"];

function radianceClassContent(ship: RadianceShip): ShipContent {
  // No lifeboat-davit here: the boats are covered, and what the client
  // meets is the roof. Structural obstruction is ship-specific, so
  // solid-structure only where a hull actually documents it.
  const kinds: ObstructionKind[] = [
    "lifeboat-roof",
    "window-washing-platform",
    ...(ship === "radiance" || ship === "brilliance"
      ? (["solid-structure"] as ObstructionKind[])
      : []),
  ];

  return {
    reviewDue: "2027-02-01",
    sources: [...ROYAL_SOURCES, ...RADIANCE_SOURCES],

    // Class-level geometry, shared by all four hulls. This is the deck
    // STACK, not cabin numbers — the inheritance rule bars propagating
    // exact cabins between sisters and expressly allows class geometry,
    // which is what the whole class-factory architecture rests on.
    decks: RADIANCE_DECKS,

    cabin: {
      // Signed off by Jimmy, 2026-08-19. Corrections at the top of the file.
      verified: true,
      placementNote: `${RADIANCE_QUIET_DEFAULT} ${RADIANCE_DECK_10} The good news structurally is that the pool deck sits ABOVE the cabins rather than among them, which is the older and cleaner arrangement — below deck 10 you're between cabin decks the whole way.`,
      motionAvoid: MOTION_RULE,
      vibrationNote: withShipNote(
        VIBRATION_RULE,
        "A fact and a claim about this class, and keep them apart. The fact: these are gas-turbine electric ships driving Azipod propulsion, which is unusual in the fleet. The claim: the builders marketed that as producing much less noise and vibration than conventional diesel machinery. That's manufacturer material, not a measured passenger outcome, so do NOT turn it into a placement rule — \"book aft, this class doesn't vibrate\" is exactly the leap to avoid. Apply the general rule and treat the propulsion as context.",
      ),
      categoryWarnings: [
        DECK_7_LIFEBOAT_ROOF,
        `${HUMP_PRINCIPLE}${HUMP_NUMBERS[ship] ? ` ${HUMP_NUMBERS[ship]}` : " The specific hump cabin numbers for this hull need reading off its own plan — don't inherit another ship's."}`,
        "This class is built for looking at things — three acres of glass, panoramic lifts on the outside of the hull, a two-level glass-walled dining room, a retractable roof over the Solarium. On an Alaska or Panama Canal itinerary that IS the product, and it beats the big ships outright. On a Caribbean sea-day run it doesn't.",
        "Aft-facing balconies are a FIT question rather than a quality one. For a client on a scenic itinerary who wants wake views and long stretches of outdoor time, the view astern is the whole reason to be on this ship and the aft balcony is the cabin to push. For a client who's motion-sensitive, or slower on their feet, or who'll resent the corridor walk, it's the wrong room regardless of the view. Ask which one you have before you recommend it.",
      ],
      hazardsAboveBelow: [
        {
          source: "lido",
          where:
            "the pool and Solarium on deck 11, over the whole of deck 10 — chair-scraping early is the standing complaint",
        },
        {
          source: "buffet",
          where:
            "the buffet aft on 11, over the aft deck 10 cabins — the most-complained-about spot, though that's passenger judgment",
        },
        {
          source: "sports",
          where:
            "the sports court on 12 and the rock wall and mini-golf on 13, all well above the cabin decks",
        },
      ],
      obstructedViewNotes: `Two mechanisms here and they call for opposite advice. The first is the deck 7 lifeboat roof on the indented sections — it takes the downward view and leaves the horizon, so it's a disclosure, not a veto. The second is genuinely blocking and it's specific: 9252 and 9652 are obstructed by the ship's window-washing platform, and that pair holds across all four hulls, which is unusual enough to be worth knowing by cabin number. Structural obstructions are the ship-specific part. ${STRUCTURAL_CABINS[ship] ?? ""} A much broader claim circulates that a long run of deck 7 cabins is lifeboat-obstructed; it comes from a low-quality source and it confuses the roof issue with a blocked horizon, so read the current plan rather than believing it.`,
      obstructionKinds: kinds,
      minorPlacementRule: ROYAL_MINOR_PLACEMENT,
      elevatorNote:
        "The panoramic glass lifts are a genuine feature rather than transport — they run on the outside of the hull looking out over the ocean, and on an Alaska or Panama sailing riding them is part of the trip. Worth mentioning to a client who'd enjoy it. What I can't give you firmly is the count: nine is the figure that circulates and I couldn't confirm it against Royal's own material, so treat it as approximate. I'm also not telling you which side they're on — that's documented for one hull and I won't assume it holds for four.",
      accessibilityNote:
        "A smaller hull with the pool deck cleanly above the cabins, so distances are short and nobody walks through a pool crowd to get home — that's a real advantage over the big ships for a slower traveller. The lift count is uncertain and I found nothing on how the banks are distributed, so check the deck plan for the specific cabin and confirm it against the accessible plan. And note the aft-balcony tradeoff above: on this class the best view and the shortest walk are usually not the same room.",
    },

    money: ROYAL_MONEY,

    traps: {
      // Signed off by Jimmy, 2026-08-19, with the attraction inventory
      // migrated onto royal-attractions.ts.
      verified: true,
      kidAgeHeightRules: `${attractionRules(RADIANCE_ATTRACTIONS)} There's no FlowRider and there are no waterslides on this class, so most of the fleet's height rules simply don't come up here — which is worth saying to a parent up front rather than letting them discover it. ${ROYAL_KIDS_RULES} ${ROYAL_KIDS_COST}`,
      obstructedBalconyDecks:
        "cabins 9252 and 9652 on every hull in the class, blocked by the window-washing platform — plus the deck 7 lifeboat roof, which is a downward-view issue rather than a blocked one",
      embarkationNote: ROYAL_EMBARKATION,
      other: [
        `This class is a SCENERY-FIRST Royal Caribbean product, not an attraction-first one, and that's the sentence to lead with rather than a list of what's missing. What's aboard: ${attractionNames(RADIANCE_ATTRACTIONS)}, an arcade and Adventure Ocean. What isn't: FlowRider, ice rink, waterslides, bumper cars, North Star, Central Park or Boardwalk. A family who booked Royal Caribbean expecting the advertising will be disappointed by a ship that isn't trying to be that — so set the frame before they book, and sell the glass, the Solarium roof and the itinerary instead.`,
        "On the right itinerary these ships beat the big ones outright — Alaska, the Panama Canal, Europe. On a Caribbean sea-day run they don't. That's the single best matching question on this class, and it's an itinerary question rather than a ship one.",
        "Don't repeat the claim that a long run of deck 7 cabins here is lifeboat-obstructed. The real deck 7 issue is a roof that blocks the view downward while leaving the horizon open, which is a different thing and a much smaller problem. Being able to correct that is worth a booking.",
      ],
      linePolicy: [...ROYAL_FLEET_TRAPS],
    },
  };
}

export const radianceOfTheSeas = radianceClassContent("radiance");
export const brillianceOfTheSeas = radianceClassContent("brilliance");
export const serenadeOfTheSeas = radianceClassContent("serenade");
export const jewelOfTheSeas = radianceClassContent("jewel");
