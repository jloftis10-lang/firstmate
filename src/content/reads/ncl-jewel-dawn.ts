import type { ShipContent, Source } from "@/lib/types";
import type { ObstructionKind } from "@/lib/obstruction";
import {
  NCL_EMBARKATION,
  NCL_FLEET_TRAPS,
  NCL_FREESTYLE,
  NCL_HAVEN_WARNING,
  NCL_KIDS_RULES,
  NCL_MINOR_PLACEMENT,
  NCL_MONEY,
  NCL_SOURCES,
} from "./ncl-common";
import {
  CONNECTING_RULE,
  MOTION_RULE,
  QUIET_DEFAULT_RULE,
  VIBRATION_RULE,
  withShipNote,
} from "./operator-rules";

/**
 * Jewel class: Jewel (2005), Jade (2006), Pearl (2006), Gem (2007).
 * Dawn class: Dawn (2002), Star (2001).
 *
 * CABIN AND TRAPS SIGNED OFF by Jimmy, 2026-08-19. Fourth Norwegian unit.
 * MONEY STILL UNSIGNED line-wide.
 *
 * ONE FILE, TWO SIBLING GEOMETRIES — and the distinction is the point:
 *
 *     NCL older-midsize shared policy and traps
 *       -> Jewel-class geometry   -> Jewel / Jade / Pearl / Gem overlays
 *       -> Dawn-class geometry    -> Dawn / Star overlays
 *
 * The two geometry nodes are SIBLINGS, not one inherited from the other.
 * Jimmy was explicit about that and the reason is deck 12: on Jewel class
 * it's public Lido territory above the deck 11 cabins, while on Dawn
 * class deck 12 itself mixes staterooms with the pool, the Garden Café,
 * kids' facilities and the library. Two related families answering the
 * same question in opposite directions is exactly the case where a
 * shared geometry layer would quietly poison one of them.
 *
 * DAWN DECK 12 IS THE REVERSE-SCAN CASE. A cabin there can be affected by
 * SAME-DECK activity, not just by what's overhead. That's the Fantasy
 * class shape and it's the second time it's come up.
 *
 * THE SCHEMA DEFECT IS FIXED, AND CONSERVATIVELY. The old file gave Jewel
 * `obstructionKinds: ["lifeboat-davit"]` and Dawn nothing, while both
 * shared the same deck 8 obstruction text — inconsistent either way.
 * Jimmy's rule: both carry a kind, or neither does until the mechanism is
 * confirmed. It isn't confirmed. NCL sells the CATEGORY (obstructed
 * oceanview, picture window or porthole) without publishing the cause, so
 * both records now carry NO kind and the prose says why. Same call as
 * Vision class.
 *
 * Corrections his pass made:
 *   - The quiet defaults SPLIT BY CLASS and must not share a field. Dawn
 *     is deck 9 midship, and it's strong — deck-plan data says those
 *     cabins have cabins above and below. Jewel's 9-or-10 stays
 *     RESEARCHED until the real vertical geometry is extracted.
 *   - "Deck 12 is pure Lido with no cabins" on Jewel is NOT hard-coded.
 *     NCL's own guarantee-assignment output can list deck 12, which
 *     either means accommodation there or generic assignment logic —
 *     either way it isn't a text-summary claim to freeze. The behavioural
 *     rule survives: deck 11 checks what's above it.
 *   - Deck 11 is a venue-above CHECK, not a steer-off. Not every deck 11
 *     cabin has the same thing overhead; passenger reports distinguish
 *     the quieter positions under the library and card room from the
 *     aft ones under active space.
 *   - "Mostly gone" is deleted as an obstruction severity. Splitting the
 *     difference between 50-75% and 90% in prose is worse than saying
 *     the view is materially obstructed and the extent varies by cabin.
 *   - The Haven dining pattern is NOT frozen. The courtyard, private
 *     pool, hot tub and sundeck are real on Jewel class; the specific
 *     "Moderno for breakfast, Cagney's for lunch, nothing for dinner"
 *     service pattern is current operations, which change far faster
 *     than deck geometry.
 *   - "No solo studios on this class" is WRONG as written. NCL currently
 *     sells Solo Oceanview on Dawn. The useful distinction survives —
 *     an older ship's Solo category is not a purpose-built Studio — but
 *     the claim that they lack Studio Lounge access is dropped, because
 *     NCL's current program says Solo rooms include lounge access where
 *     one exists.
 *   - The Dawn family suite is ~361 to 368 sq ft, not "over 400", and
 *     the useful part was never the number. AND IT IS SHIP-SPECIFIC:
 *     Star has large deck 12 family suites WITH balconies, so the
 *     no-balcony trap must not be shared across the class.
 *   - The Pearl aft-lift-stops-at-deck-7 report is not promoted to class
 *     logic. Jewel's ~12 lifts stay researched.
 *   - Dawn's elevator reasoning chain is deleted outright: few lifts ->
 *     big ship -> expect waits is unmeasured inference, and it must not
 *     generate a mobility warning.
 *   - NCL_HAVEN_WARNING is added to BOTH line-policy blocks. It was
 *     missing on the two classes where the Haven is most likely to be
 *     mis-sold, which was backwards.
 *
 * Deliberately NOT encoded: the deck 8 obstruction severity; the ninth
 * cabin deck on Dawn and Star, which I could not identify; Norwegian
 * Star's azipod failures, which are propulsion history rather than cabin
 * advice; and the Jewel-class Haven dinner arrangement.
 */

type JewelShip = "jewel" | "jade" | "pearl" | "gem";
type DawnShip = "dawn" | "star";

const JEWEL_DAWN_SOURCES: Source[] = [
  {
    label:
      "Official Jewel deck plans — deck 12 carries the Garden Café and public venues over the deck 11 cabins (checked by Jimmy)",
    url: "https://www.ncl.com/cruise-ships/norwegian-jewel/deck-plans",
    checked: "2026-08-19",
  },
  {
    label:
      "Official Dawn deck plans — deck 12 mixes staterooms with the Oasis Pool, Garden Café, kids' facilities and library",
    url: "https://www.ncl.com/cruise-ships/norwegian-dawn/deck-plans",
    checked: "2026-08-19",
  },
  {
    label: "Dawn deck 9 cabins have cabins above and below",
    url: "https://www.cruisedeckplans.com/ships/deckbydeck.php?deck=9&ship=Norwegian-Dawn",
    checked: "2026-08-19",
  },
  {
    label:
      "NCL sells Obstructed Oceanview on both classes — picture window or porthole, obstructed view",
    url: "https://www.ncl.com/cruise-ships/norwegian-dawn/deck-plans",
    checked: "2026-08-19",
  },
  {
    label:
      "Guarantee categories may be fully or partially obstructed, any deck, assigned as late as one day before embarkation",
    url: "https://www.ncl.com/cruise-ships/norwegian-jewel/staterooms/options",
    checked: "2026-08-19",
  },
  {
    label: "NCL solo program — Solo staterooms are priced for one, with Studio Lounge access where available",
    url: "https://www.ncl.com/staterooms/studio-and-solo",
    checked: "2026-08-19",
  },
  {
    label: "Dawn Family Suite — floor-to-ceiling windows, no balcony, around 361-368 sq ft",
    url: "https://www.ncl.com/uk/en/cruise-ship/dawn/deck-plans",
    checked: "2026-08-19",
  },
  {
    label: "Star deck 12 family suites DO have balconies — the no-balcony trap is Dawn-specific",
    url: "https://www.ncl.com/nz/en/cruise-ship/star/deck-plans",
    checked: "2026-08-19",
  },
  {
    label: "Jewel-class Haven Courtyard — private courtyard, pool, hot tub and sundeck on deck 14",
    url: "https://www.ncl.com/cruise-ships/norwegian-jewel/whats-on-board/specialty-dining",
    checked: "2026-08-19",
  },
];

/* ------------------------------------------------------------------ *
 * SHARED LAYER — policy and traps common to these older mid-size hulls.
 * Deliberately contains NO deck geometry. See the file header.
 * ------------------------------------------------------------------ */

/**
 * The guarantee trap, and it's one of the better ones on this line.
 *
 * The category CODES are deliberately not frozen — NCL has been changing
 * category naming, and a code list ages badly. The behaviour is what
 * matters and the behaviour is stable.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-19).
 */
const GUARANTEE_WARNING =
  "Watch the guarantee categories on these ships. A guarantee means NCL picks the exact cabin, possibly as late as the day before embarkation, on any deck — and NCL's own terms say plainly that the room may be fully or partially obstructed, and that an oceanview guarantee can land as a porthole rather than a picture window. They're genuinely cheap and genuinely a gamble. If cabin position or the view matters to this client, the saving is not free money. I'm not giving you the category codes: NCL has been changing them, and a stale code list is worse than none.";

/**
 * Deck 8 obstruction. NCL sells the CATEGORY openly; it does not publish
 * the CAUSE, which is why no obstruction kind is set on either class.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-19).
 */
const DECK_8_OBSTRUCTION =
  "Deck 8 is where the obstructed oceanviews are on both these classes, and NCL sells that openly as its own category rather than hiding it — an oceanview with a picture window or a porthole, described as obstructed. Two things to be careful about. First, the extent: sources give figures from around half the view to nearly all of it, and splitting that difference would be inventing precision, so treat it as materially obstructed with the exact extent varying by cabin, and check the specific room. Second, the cause: the mechanism is widely assumed to be lifeboat and tender structure and NCL doesn't publish it, so don't tell a client WHAT is in the way until you've confirmed it for that cabin — the category is the reliable part.";

/**
 * The solo distinction, corrected. The old record said this class has no
 * solo product at all, which is wrong — NCL currently sells Solo
 * Oceanview on Dawn. The valuable distinction is a different one.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-19).
 */
const SOLO_DISTINCTION =
  "Be precise about \"solo\" on these older hulls, because the word covers two different products. NCL does currently sell Solo categories here — Solo Oceanview on Dawn, for instance — but those are standard cabins priced for one person, not the purpose-built Studios you get on Epic, Breakaway or Prima. NCL's current program says solo staterooms include Studio Lounge access WHERE ONE EXISTS, which on a ship without a Studio Lounge means there's nothing to access. So the honest line is: they can book a room priced for one, and they won't get the studio experience. Check what this specific hull actually offers rather than assuming either way.";

/* ------------------------------------------------------------------ *
 * JEWEL-CLASS GEOMETRY — sibling of the Dawn node, not its parent.
 * ------------------------------------------------------------------ */

/**
 * RESEARCHED, not settled. Deck 11 clearly fails above; 9 and 10 are the
 * likely band and the full vertical map hasn't been extracted.
 */
const JEWEL_QUIET_DEFAULT = `Midship on deck 9 or 10, and I want to be straight that this one is researched rather than settled. ${QUIET_DEFAULT_RULE} What IS clear is the top of the stack: deck 11 fails above, because deck 12 carries the pools, the Garden Café, the kids' clubs and the spa. What hasn't been extracted from the official plan is the full above-and-below picture for 9 and 10 themselves, so treat this as the likely answer and run the scan on the specific cabin rather than trusting the band.`;

/**
 * Deck 11 as a venue check. Not every cabin there has the same thing
 * overhead — under the library reads very differently from under the
 * pool.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-19).
 */
const JEWEL_DECK_11 =
  "Deck 11 needs a check of WHICH venue sits above the specific cabin, rather than a blanket steer away. Deck 12 above it carries a lot — two pools, a slide, the Garden Café, both kids' clubs, the spa — but passenger reports distinguish the quieter positions, under the library and card room, from the ones further aft under genuinely active space. So it's a venue-above question, and a client who lands under the quiet end is fine.";

/* ------------------------------------------------------------------ *
 * DAWN-CLASS GEOMETRY — sibling of the Jewel node.
 * ------------------------------------------------------------------ */

/**
 * DECK 9 MIDSHIP, and this one is strong: deck-plan data says those
 * cabins have cabins above and cabins below.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-19).
 */
const DAWN_QUIET_DEFAULT = `Midship on deck 9. ${QUIET_DEFAULT_RULE} Deck 9 passes it cleanly on this class — cabins above and cabins below — which makes it the automatic answer. Deck 10 looks good in parts too, but it stays a check rather than a default until the full vertical map is imported.`;

/**
 * THE REVERSE SCAN. Deck 12 mixes cabins with the pool, the buffet, the
 * kids' facilities and the library, so a cabin there is affected by what
 * is BESIDE it, not only what is above it.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-19).
 */
const DAWN_DECK_12_MIXED =
  "Deck 12 on this class is a mixed cabin-and-public deck, and that's the single most important thing to know about these two hulls. Staterooms sit on the SAME deck as the Oasis Pool, the Garden Café, the kids' facilities and the library — not safely above or below them. So the usual question, what's overhead, is the wrong question here: a deck 12 cabin is beside the activity. This is the exact opposite of the Jewel-class ships, where 12 is public territory over the cabins on 11, and if you've learned one family you must not apply it to the other.";

/* ------------------------------------------------------------------ *
 * PER-SHIP OVERLAYS.
 * ------------------------------------------------------------------ */

const JEWEL_SHIP_NOTES: Partial<Record<JewelShip, string>> = {
  jade:
    "Jade was built as Pride of Hawaii for the US-flagged NCL America operation and converted in 2008. Same hull as its sisters, but it carries a slightly different stateroom count and nobody publishes why — so never import a cabin-number finding from Jewel, Pearl or Gem onto this ship without checking Jade's own current plan.",
};

const DAWN_SHIP_NOTES: Record<DawnShip, string> = {
  dawn: "On this ship the Family Suites are the expectation trap: they're large, with floor-to-ceiling windows and NO balcony, at roughly 361 to 368 square feet depending on category. The number isn't the point — the point is that \"Suite\" plus that square footage makes people assume private outdoor space, and there isn't any. Check the category before you let a client picture a balcony.",
  star: "Do NOT carry Dawn's no-balcony Family Suite warning onto this ship. Star's current inventory includes large deck 12 family suites that DO have balconies, so the trap that applies to its sister doesn't apply here — which is exactly why that one lives per ship rather than in the class rule.",
};

function sharedTraps(other: string[]): ShipContent["traps"] {
  return {
    // Signed off by Jimmy, 2026-08-19.
    verified: true,
    kidAgeHeightRules: NCL_KIDS_RULES,
    obstructedBalconyDecks:
      "the obstructed oceanview category on deck 8 — the category is published, the cause isn't",
    embarkationNote: NCL_EMBARKATION,
    other,
    // NCL_HAVEN_WARNING was missing from both classes, which was
    // backwards: these are the hulls where the Haven is most likely to
    // be mis-sold against a Prima or Bliss expectation.
    linePolicy: [NCL_HAVEN_WARNING, NCL_FREESTYLE, ...NCL_FLEET_TRAPS],
  };
}

// No kind on either class: NCL publishes the category and not the cause.
// Both records agree, which the old file didn't. See the header.
const NO_CONFIRMED_MECHANISM: ObstructionKind[] = [];

function jewelClassContent(ship: JewelShip): ShipContent {
  return {
    reviewDue: "2027-02-01",
    sources: [...NCL_SOURCES, ...JEWEL_DAWN_SOURCES],

    cabin: {
      // Signed off by Jimmy, 2026-08-19. Corrections at the top of the file.
      verified: true,
      placementNote: `${JEWEL_QUIET_DEFAULT} ${JEWEL_DECK_11} Deck 8 is where the obstructed oceanviews are, and deck 14 is The Haven.`,
      motionAvoid: withShipNote(
        MOTION_RULE,
        "Nothing hull-specific is documented for this class, so that's the general rule.",
      ),
      vibrationNote: VIBRATION_RULE,
      categoryWarnings: [
        GUARANTEE_WARNING,
        SOLO_DISTINCTION,
        ...(JEWEL_SHIP_NOTES[ship] ? [JEWEL_SHIP_NOTES[ship] as string] : []),
      ],
      hazardsAboveBelow: [
        {
          source: "lido",
          where:
            "deck 12 — two pools and a waterslide, over the deck 11 cabins, though which venue sits over the specific cabin varies",
        },
        {
          source: "buffet",
          where: "the Garden Café, also on 12 above those same cabins",
        },
        {
          source: "kids",
          where: "Splash Academy and the teen club, again on 12",
        },
      ],
      obstructedViewNotes: DECK_8_OBSTRUCTION,
      obstructionKinds: NO_CONFIRMED_MECHANISM,
      connectingNote: CONNECTING_RULE,
      minorPlacementRule: NCL_MINOR_PLACEMENT,
      elevatorNote:
        "Around twelve lifts on this class, which is reasonable for the size — that figure is researched rather than confirmed and the bank layout is unknown. One thing I've deliberately NOT turned into a class rule: a report that the aft lifts on Pearl only run down as far as deck 7. It's one ship and one report, and service limits per bank aren't established here, so check the plan rather than carrying that across.",
      accessibilityNote:
        "A smaller, simpler ship than the modern hulls, so distances are short and the layout is easy to learn — that's a real advantage for a slower traveller. What I can't give you is the lift layout or any per-bank service limits, so work the route out from the deck plan for the specific cabin and confirm it against the accessible plan.",
    },

    money: NCL_MONEY,

    traps: sharedTraps([
      "Be careful how you describe The Haven on this class. The courtyard is real — deck 14, keycard access, a private courtyard with a pool and hot tub, and a private sundeck. What it is NOT is the self-contained complex a client will have read about on Prima or Bliss, with its own full restaurant and bar product. That difference is the whole conversation. I'm deliberately not encoding the current dining arrangement for Haven guests here: dining operations change far faster than deck geometry, so confirm what this specific ship offers right now rather than quoting a pattern from a review.",
      "The absence list on this class: no go-karts, no Waterfront promenade, no Ocean Boulevard, no ropes course, no laser tag, no big waterslide complex. There is a modest family pool slide on 12. And there IS a forward observation lounge — the Spinnaker — so don't tell a client the ship has no view lounge.",
      "Jewel class and Dawn class answer deck 12 in opposite ways: public Lido here, mixed cabins-and-pool there. These families get quoted interchangeably and they shouldn't be.",
    ]),
  };
}

function dawnClassContent(ship: DawnShip): ShipContent {
  return {
    reviewDue: "2027-02-01",
    sources: [...NCL_SOURCES, ...JEWEL_DAWN_SOURCES],

    cabin: {
      // Signed off by Jimmy, 2026-08-19. Corrections at the top of the file.
      verified: true,
      placementNote: `${DAWN_QUIET_DEFAULT} ${DAWN_DECK_12_MIXED} Deck 11 carries the bridge and the spa as well as cabins, and deck 8 is where the obstructed oceanviews are.`,
      motionAvoid: withShipNote(
        MOTION_RULE,
        "Nothing hull-specific is documented for this class.",
      ),
      vibrationNote: VIBRATION_RULE,
      categoryWarnings: [
        GUARANTEE_WARNING,
        SOLO_DISTINCTION,
        DAWN_SHIP_NOTES[ship],
      ],
      hazardsAboveBelow: [
        {
          source: "lido",
          where:
            "deck 12 — the pools are on the SAME deck as the cabins there, and over the deck 11 cabins below",
        },
        {
          source: "kids",
          where: "the children's area, also up on 12 alongside cabins",
        },
        {
          source: "spa",
          where: "the spa on deck 11, alongside the cabins on that deck",
        },
      ],
      obstructedViewNotes: DECK_8_OBSTRUCTION,
      obstructionKinds: NO_CONFIRMED_MECHANISM,
      connectingNote: CONNECTING_RULE,
      minorPlacementRule: NCL_MINOR_PLACEMENT,
      accessibilityNote:
        "This is a compact ship that's easy to learn, which is the real advantage here. I'm deliberately giving you no lift count and no waiting-time expectation: an earlier version of this record reasoned from a low lift count to a big hull to peak-time queues, and that chain was never measured. Work the route out from the deck plan for the specific cabin and confirm it against the accessible plan.",
    },

    money: NCL_MONEY,

    traps: sharedTraps([
      "Do not promise a Haven complex on this ship. Deck 14 holds the two Garden Villas — genuinely spectacular rooms with private gardens and hot tubs — but there's no confirmation of the shared Haven courtyard that the Jewel-class ships have, and the courtyard material online attaches to those ships rather than these. Treat it as unestablished rather than absent, and verify what this hull actually offers before you take a deposit from anyone buying for The Haven.",
      "Deck 12 puts cabins on the pool deck itself. If a client is noise-sensitive, that's the deck to ask about — and the question is what's NEXT to them, not what's above them.",
      ship === "dawn"
        ? "The absence list: no go-karts, no Waterfront, no Ocean Boulevard, no ropes course, no laser tag, no big waterslide complex. There is a forward lounge, and on this ship it's the Bliss Ultra Lounge rather than the Spinnaker — a rename worth knowing, because older deck plans and reviews use the old name and a client reading one will be looking for a venue that isn't listed under that name any more."
        : "The absence list: no go-karts, no Waterfront, no Ocean Boulevard, no ropes course, no laser tag, no big waterslide complex. There is a forward lounge, so don't tell a client the ship has no view bar — but check its current name on this hull rather than a review's, because venues on these older ships have been renamed.",
      "Jewel class and Dawn class answer deck 12 in opposite ways: mixed cabins-and-pool here, public Lido there. These families get quoted interchangeably and they shouldn't be.",
    ]),
  };
}

export const norwegianJewel = jewelClassContent("jewel");
export const norwegianJade = jewelClassContent("jade");
export const norwegianPearl = jewelClassContent("pearl");
export const norwegianGem = jewelClassContent("gem");
export const norwegianDawn = dawnClassContent("dawn");
export const norwegianStar = dawnClassContent("star");
