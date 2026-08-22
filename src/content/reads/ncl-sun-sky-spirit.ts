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
  MOTION_RULE,
  PUBLIC_SPACE_SANDWICH,
  QUIET_DEFAULT_RULE,
  VIBRATION_RULE,
  withShipNote,
} from "./operator-rules";

/**
 * The three NCL singletons: Sun (2001), Sky (1999), Spirit (1998).
 *
 * CABIN AND TRAPS SIGNED OFF by Jimmy, 2026-08-19. Last Norwegian unit,
 * and the last researched records in the catalog. MONEY STILL UNSIGNED
 * line-wide.
 *
 * THREE SIBLING NODES, NO SHARED GEOMETRY:
 *
 *     NCL singleton shared policy   (Solo, Haven, guarantee logic only)
 *       -> Norwegian Sun
 *       -> Norwegian Sky
 *       -> Norwegian Spirit
 *
 * Each came from a different place — Sun purpose-built, Sky an
 * unfinished Costa hull, Spirit a Star Cruises ship — so there is no
 * cabin or deck inheritance between them at all.
 *
 * IT PROMOTED A CONCEPT TO THE OPERATOR RULES. Sun's deck 11 is the
 * worst instance yet of a cabin deck that also carries public space
 * while a second active deck sits above it. Jimmy named the pattern:
 * `PUBLIC_SPACE_SANDWICH`, now in `operator-rules.ts` alongside the
 * quiet-default rule. It has appeared four times — Fantasy class, Dawn
 * class, Breakaway/Getaway, and Sun — and the advice it produces is
 * genuinely different from an overhead warning, because on a mixed-use
 * deck "what's above this cabin" is the wrong question.
 *
 * THE SOLO SENTENCE WAS WRONG ON ALL THREE. "There are no purpose-built
 * solo studios on this ship" — I wrote that in four files, Jimmy caught
 * it on Jewel and Dawn, and I flagged the remaining three myself before
 * he had to. NCL currently advertises Solo staterooms on Sun, Sky AND
 * Spirit. The shared distinction replaces it.
 *
 * Corrections his pass made:
 *   - SUN: quiet default tightens from "9 or 10" to DECK 9 MIDSHIP, with
 *     deck 10 a check because it sits under the deck 11 activity. Deck
 *     11 is the named sandwich case.
 *   - SKY: quiet default tightens from "8 or 9" to DECK 8 MIDSHIP.
 *   - SKY'S HISTORY IS CORRECTED IN A WAY THAT MATTERS. I had her
 *     "launched with 812 staterooms and zero balconies". The zero-balcony
 *     configuration was the ORIGINAL COSTA DESIGN, not the ship NCL
 *     delivered — NCL redesigned the unfinished hull and added two decks
 *     of balcony cabins BEFORE she entered service. So "the balconies
 *     were retrofitted" is also wrong. That's a false fact about a
 *     delivered ship, built out of a true fact about a cancelled one.
 *   - SKY: the Spinnaker deck placement is demoted to researched. I had
 *     it as deck 11 over the deck 10 cabins and hadn't extracted that
 *     from a current plan.
 *   - SPIRIT: quiet default tightens to DECK 9 MIDSHIP, because deck 10
 *     now carries Spice H2O alongside cabins — another same-deck check
 *     rather than a vertical one.
 *   - SPIRIT'S 2020 REFIT: delete "the rooms are still the 1998 rooms
 *     with new décor". NCL says every stateroom was renovated. What's
 *     true is the underlying footprint, not untouched cabins. The "only
 *     16 cabins added" figure isn't in the primary source and is out.
 *   - SPICE H2O IS COMPLIMENTARY, not extra-fee. I had it as a paid
 *     adults-only space. The children's water park removal is real and
 *     confirmed; the fee was invented.
 *   - SPIRIT: the cabin size range goes, sixth time. Exact category
 *     dimensions instead, with the older-footprint concept kept.
 *   - SPIRIT: the wheelchair-turning-room inference from square footage
 *     is DELETED. Intuitive and exactly the sort of accessibility claim
 *     that must come from accessible-cabin geometry, not from arithmetic.
 *   - Elevator counts are uncharted on all three, and Sun's "put a
 *     slower traveller lower and midship" is deleted where it was
 *     derived from an unverified lift count.
 *
 * AND A HAVEN INGESTION RULE: generic NCL Haven marketing or navigation
 * text is not evidence that a ship HAS Haven accommodation. The ship's
 * own current stateroom inventory controls. That resolves the Sun
 * booking-screen conflict cleanly and explains the Sky search result.
 *
 * Deliberately NOT encoded: obstructed cabin numbers, and no
 * `obstructionKinds` on any of the three. IMPORTANT — that absence means
 * "no verified obstructed-deck rule exists", NOT "no obstructions
 * exist". No kind is invented just because other ships have one.
 * Also not encoded: any motion claim, since these are exactly the hulls
 * where inferring from tonnage would be tempting and wrong; and whether
 * Spirit skips a deck number, which I could not confirm.
 */

const SINGLETON_SOURCES: Source[] = [
  {
    label:
      "NCL solo program — Solo Balcony, Oceanview, Inside and Studio products; Solo staterooms sold on Sun, Sky and Spirit (checked by Jimmy)",
    url: "https://www.ncl.com/staterooms/studio-and-solo",
    checked: "2026-08-19",
  },
  {
    label: "Sun deck plans — deck 11 carries cabins with pools and gym; deck 12 restaurants and sports",
    url: "https://www.ncl.com/cruise-ships/norwegian-sun/deck-plans",
    checked: "2026-08-19",
  },
  {
    label:
      "Sky began as the unfinished Costa Olympia; NCL's redesign ADDED two decks of balcony cabins before service",
    url: "https://en.wikipedia.org/wiki/Norwegian_Sky",
    checked: "2026-08-19",
  },
  {
    label: "Sky current inventory — 245 balcony cabins",
    url: "https://www.cruisemapper.com/cabins/Norwegian-Sky-543",
    checked: "2026-08-19",
  },
  {
    label: "Spirit was built as SuperStar Leo for Star Cruises",
    url: "https://en.wikipedia.org/wiki/Norwegian_Spirit",
    checked: "2026-08-19",
  },
  {
    label:
      "Spirit's 2020 revitalization — over $100M, 14 new venues, children's waterpark replaced by Spice H2O, EVERY stateroom renovated",
    url: "https://www.nclhltd.com/news-media/press-releases/detail/284",
    checked: "2026-08-19",
  },
  {
    label: "Spirit venue listing — Spice H2O is marked complimentary",
    url: "https://www.ncl.com/in/en/cruise-ship/spirit/whats-on-board/Bars-%26-Lounges",
    checked: "2026-08-19",
  },
  {
    label: "Spirit deck 8 forward — cabins reported above casino and nightclub space",
    url: "https://www.cruisedeckplans.com/ships/deckbydeck.php?deck=8&ship=Norwegian-Spirit",
    checked: "2026-08-19",
  },
];

/* ------------------------------------------------------------------ *
 * SHARED LAYER — policy only. No deck geometry lives here.
 * ------------------------------------------------------------------ */

/**
 * The corrected solo language. The old sentence was flatly wrong and
 * would have steered a solo client off three ships that sell to them.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-19).
 */
const SOLO_DISTINCTION =
  "NCL currently sells Solo categories on this ship — do not tell a single traveller there's nothing here for them. What you must NOT do is treat that as a purpose-built Studio. \"Solo\" on these older hulls means a stateroom priced for one person; \"Studio\" means the purpose-built cabin with its own keycard-clustered complex, and NCL says solo rooms include Studio Lounge access WHERE ONE EXISTS — which on a ship without a lounge means there's nothing to access. Verify the exact Solo category and whether this hull has a lounge at all before you describe it.";

/**
 * No Haven on any of the three, plus the ingestion rule that stops
 * generic marketing text from being read as ship inventory.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-19).
 */
const NO_HAVEN =
  "There is no Haven on this ship. The top accommodation is an Owner's Suite, and the ship's own current stateroom inventory carries no Haven categories. Here's the trap, and it's a research trap as much as a selling one: NCL's site navigation and search results surface generic Haven wording on pages for ships that have no Haven inventory at all. That wording is marketing furniture, not evidence. The ship's actual stateroom inventory is what controls — so if a booking screen or a search result shows Haven language here, resolve it against the inventory before you promise anything, because there's no private complex to deliver.";

/**
 * The guarantee behaviour, shared. Same reasoning as Jewel/Dawn: encode
 * the behaviour, not the category codes.
 */
const GUARANTEE_WARNING =
  "No obstructed-cabin list is published for this ship, and NCL's generic guarantee language is what stands in its place — a guarantee view may be fully obstructed, partially obstructed, a porthole or a picture window, and NCL picks the room. That's a warning about guarantee bookings rather than a list of cabins to avoid. If the view matters to this client, pick the cabin.";

/**
 * Shared traps. NCL_HAVEN_WARNING is included even though these ships
 * have no Haven: an advisor comparing across NCL still needs the
 * general caution, and the ship-level NO_HAVEN flag is what tells them
 * about this hull.
 */
function singletonTraps(other: string[]): ShipContent["traps"] {
  return {
    // Signed off by Jimmy, 2026-08-19.
    verified: true,
    kidAgeHeightRules: NCL_KIDS_RULES,
    embarkationNote: NCL_EMBARKATION,
    other: [NO_HAVEN, ...other],
    linePolicy: [NCL_HAVEN_WARNING, NCL_FREESTYLE, ...NCL_FLEET_TRAPS],
  };
}

/**
 * Empty on all three, and the emptiness is a statement: no verified
 * obstructed-deck rule exists here. It does NOT mean no obstructions
 * exist, and no kind is invented to match other ships.
 */
const NO_VERIFIED_RULE: ObstructionKind[] = [];

/* ------------------------------------------------------------------ *
 * NORWEGIAN SUN.
 * ------------------------------------------------------------------ */

function sunContent(): ShipContent {
  return {
    reviewDue: "2027-02-01",
    sources: [...NCL_SOURCES, ...SINGLETON_SOURCES],

    cabin: {
      // Signed off by Jimmy, 2026-08-19. Corrections at the top of the file.
      verified: true,
      placementNote: `Midship on deck 9. ${QUIET_DEFAULT_RULE} On this ship the band is one deck, not two: deck 10 sits under the deck 11 activity and needs its own overhead check rather than an automatic yes. And deck 11 is the case worth understanding properly. ${PUBLIC_SPACE_SANDWICH} Deck 11 here is the worst example I've found: it carries cabins beside the pools and the gym on its own deck, AND deck 12 directly above holds the basketball and volleyball court, the golf net, the Spinnaker Lounge and four specialty restaurants. Hit from both directions at once. Cabins run decks 4 to 11.`,
      motionAvoid: withShipNote(
        MOTION_RULE,
        "Nothing is documented about how this hull rides and I'm not going to infer it from the tonnage.",
      ),
      vibrationNote: VIBRATION_RULE,
      categoryWarnings: [
        "Deck 11 is the trap here and it doesn't look like one — it reads as a good high deck with balconies. A client asking for high on this ship is asking for the sandwich, so offer them 9 midship instead and tell them why.",
        SOLO_DISTINCTION,
      ],
      hazardsAboveBelow: [
        {
          source: "sports",
          where:
            "the basketball and volleyball court and the golf net on deck 12, directly over the deck 11 cabins",
        },
        {
          source: "lido",
          where: "the pools on deck 11, on the SAME deck as those cabins",
        },
        { source: "gym", where: "also on deck 11, alongside the cabins" },
        {
          source: "restaurant-quiet",
          where: "four specialty restaurants on deck 12, above deck 11",
        },
      ],
      obstructedViewNotes: GUARANTEE_WARNING,
      obstructionKinds: NO_VERIFIED_RULE,
      minorPlacementRule: NCL_MINOR_PLACEMENT,
      accessibilityNote:
        "A small ship, so distances are genuinely short — that's the real advantage here. I'm giving you no lift count: the figure that circulates isn't confirmed, and an earlier version of this record used it to recommend booking low and midship, which is a recommendation built on an unverified number. Low and midship may well suit them for motion and for walking distance; just don't take it from me as a lifts argument. Confirm the accessible deck plan for the specific cabin.",
    },

    money: NCL_MONEY,

    traps: singletonTraps([
      "Deck 11 on this ship is the clearest mixed-use case in the fleet: cabins sharing their deck with the pools and gym, and a sports deck with four restaurants directly above. If a client asks for a high balcony here, that's what they're being sold — worth one sentence before they book it.",
      "The absence list: no go-karts, no Waterfront, no Ocean Boulevard, no ropes course, no laser tag, no big waterslide complex. There IS a forward observation lounge — the Spinnaker, up on 12 — so the ship isn't short of a view bar.",
    ]),
  };
}

/* ------------------------------------------------------------------ *
 * NORWEGIAN SKY.
 * ------------------------------------------------------------------ */

function skyContent(): ShipContent {
  return {
    reviewDue: "2027-02-01",
    sources: [...NCL_SOURCES, ...SINGLETON_SOURCES],

    cabin: {
      // Signed off by Jimmy, 2026-08-19. Corrections at the top of the file.
      verified: true,
      placementNote: `Midship on deck 8. ${QUIET_DEFAULT_RULE} Deck 8 is the cleaner starting point on this hull; deck 9 wants a check of what's above it, and deck 10 is the upper-public proximity case as the ship runs into its Lido structure. Cabins run decks 4 to 10.`,
      motionAvoid: withShipNote(
        MOTION_RULE,
        "Nothing is documented about how this hull rides.",
      ),
      vibrationNote: VIBRATION_RULE,
      categoryWarnings: [
        "This ship's history is genuinely unusual and it's worth getting right, because the version that circulates is wrong. She was laid down as Costa Olympia, abandoned half-built when the yard collapsed, and bought unfinished by NCL — who substantially redesigned her, including adding two decks of balcony cabins BEFORE she entered service. What you'll read, and what an earlier version of this record said, is that she launched with no balconies at all. That describes the cancelled Costa design, not the ship NCL delivered. Don't repeat it.",
        "Her balcony inventory today is a couple of hundred rooms, and it came out of that redesign rather than a later retrofit — but the practical point survives either way: check the specific cabin's dimensions rather than assuming a standard balcony, because this wasn't a hull designed around them from the start.",
        "Balcony inventory here is more limited than on the newer NCL ships. That's an inventory and planning point rather than a fact about any particular cabin: if a balcony is a must-have for this client, price it and secure it early rather than assuming broad availability. I'm deliberately not giving you a percentage.",
        SOLO_DISTINCTION,
      ],
      hazardsAboveBelow: [
        {
          source: "lido",
          where: "the pool deck up top, over the highest cabin deck",
        },
        {
          source: "buffet",
          where: "the Garden Café and the outdoor café on the same upper deck",
        },
        {
          source: "nightclub",
          where:
            "the Spinnaker Lounge — an observation lounge that also runs as a show and club venue. Which deck it sits on relative to the top cabin deck is researched rather than extracted from a current plan, so check it",
        },
      ],
      obstructedViewNotes: GUARANTEE_WARNING,
      obstructionKinds: NO_VERIFIED_RULE,
      minorPlacementRule: NCL_MINOR_PLACEMENT,
      accessibilityNote:
        "Small and compact, so short distances — and this is a 1999 hull that predates most modern accessible-design conventions, which is the thing to actually plan around. I'm not giving you a lift count or a bank layout. Treat a mobility booking here as needing the accessible deck plan checked cabin by cabin.",
    },

    money: NCL_MONEY,

    traps: singletonTraps([
      "If a client has read that this ship launched without a single balcony, correct it: that was the cancelled Costa design she was rescued from. NCL redesigned the unfinished hull and added balcony decks before she sailed.",
      "The absence list: no go-karts, no Waterfront, no Ocean Boulevard, no ropes course, no laser tag, no big waterslide complex. There is a forward observation lounge, the Spinnaker, which also serves as a show venue.",
      "This is the oldest-feeling ship in the fleet and it started life as somebody else's. That's not a reason to avoid it — it's a reason to set the expectation against the right comparison, which is a small older ship, not a Prima.",
    ]),
  };
}

/* ------------------------------------------------------------------ *
 * NORWEGIAN SPIRIT.
 * ------------------------------------------------------------------ */

function spiritContent(): ShipContent {
  return {
    reviewDue: "2027-02-01",
    sources: [...NCL_SOURCES, ...SINGLETON_SOURCES],

    cabin: {
      // Signed off by Jimmy, 2026-08-19. Corrections at the top of the file.
      verified: true,
      placementNote: `Midship on deck 9. ${QUIET_DEFAULT_RULE} Deck 9 is the cabin-heavy deck that passes it. Deck 10 does NOT get an automatic yes any more, and the reason is a same-deck one rather than a vertical one: Spice H2O now sits on 10 alongside the cabins. Deck 11 needs the check above, with the pool, the Garden Café, the spa and the Spinnaker on 12 — and the Spinnaker runs as a disco at night, which is the part that matters after midnight. Cabins run 5 through 11.`,
      motionAvoid: withShipNote(
        MOTION_RULE,
        "Nothing is documented about how this hull rides.",
      ),
      vibrationNote: VIBRATION_RULE,
      categoryWarnings: [
        "Spirit was built as SuperStar Leo for Star Cruises and the Asian-market origin still shows in the underlying cabin footprint, which is tight by modern standards even after extensive modernisation. Set that expectation explicitly — but do it with the actual dimensions for their category off the booking screen, not a range from me. Square footage is the complaint that follows people home, and a class-style range would give false precision on a ship whose categories differ.",
        "Deck 11 is the one to check: the Spinnaker on 12 runs as a disco at night, directly above those cabins.",
        "Forward cabins on deck 8 are reported to sit above casino and nightclub space — the geometry cited runs around 8025, 8026, 8526 and 8527 and forward. That's researched rather than confirmed, and it's more decision-relevant than the general low-deck adjacencies, so check it on the plan before placing anyone forward on 8.",
        SOLO_DISTINCTION,
      ],
      hazardsAboveBelow: [
        {
          source: "nightclub",
          where:
            "the Spinnaker observation lounge on deck 12, which becomes a disco at night, over the deck 11 cabins",
        },
        {
          source: "lido",
          where: "the pool deck, also on 12 above those cabins",
        },
        { source: "buffet", where: "the Garden Café, on 12 as well" },
        {
          source: "spa",
          where:
            "Spice H2O on deck 10, on the SAME deck as cabins rather than above them",
        },
        {
          source: "theater",
          where:
            "the two-storey Stardust Theater and the Bliss Ultra Lounge low down — the exact cabin adjacencies there are researched rather than mapped",
        },
      ],
      obstructedViewNotes: GUARANTEE_WARNING,
      obstructionKinds: NO_VERIFIED_RULE,
      minorPlacementRule: NCL_MINOR_PLACEMENT,
      accessibilityNote:
        "Compact and short-distanced, which helps. I'm deliberately NOT repeating what an earlier version of this record said — that the small cabins leave little turning room for a wheelchair or scooter. That's intuitive and it's arithmetic, not geometry, and an accessibility recommendation has to come from the accessible-cabin specifications rather than from a square-footage figure. Get the actual dimensions and the accessible deck plan for the specific room.",
    },

    money: NCL_MONEY,

    traps: singletonTraps([
      "The 2020 refit was substantial — over $100 million and around forty days, with fourteen new venues including a third main dining room, the Garden Café, Onda by Scarpetta and a doubled spa. Be accurate about what it did to the cabins: NCL says every stateroom was renovated, so do NOT describe them as untouched 1998 rooms with new décor. What's true is that the underlying cabin geometry is still the 1998 design; the interiors are not.",
      "That refit took something away, and it's the kind of loss an older review hides: the children's water park was removed and the space became Spice H2O, an adults-only retreat. It is COMPLIMENTARY — don't quote a fee for it. If a family is booking this ship off an older review expecting a kids' splash area, it isn't there any more, and that's a conversation to have before deposit.",
      "The absence list: no go-karts, no Waterfront, no Ocean Boulevard, no ropes course, no laser tag, no big waterslide complex. There is a forward observation lounge, the Spinnaker on 12.",
    ]),
  };
}

export const norwegianSun = sunContent();
export const norwegianSky = skyContent();
export const norwegianSpirit = spiritContent();
