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
import { nclAttractionRules, type NclAttractionId } from "./ncl-attractions";
import {
  MOTION_RULE,
  QUIET_DEFAULT_RULE,
  VIBRATION_RULE,
} from "./operator-rules";

/**
 * Breakaway class: Breakaway (2013), Getaway (2014).
 * Breakaway Plus: Escape (2015), Joy (2017), Bliss (2018), Encore (2019).
 *
 * CABIN AND TRAPS SIGNED OFF by Jimmy, 2026-08-19. Third Norwegian unit.
 * MONEY STILL UNSIGNED line-wide, so these six stay part-verified.
 *
 * REBUILT HIERARCHICALLY, which the flat version badly needed:
 *
 *     shared Breakaway-family geometry
 *       -> Breakaway/Getaway overlay
 *       -> Breakaway Plus overlay
 *          -> Escape / Joy / Bliss / Encore ship overlays
 *
 * And Joy gets a CHRONOLOGICAL overlay inside that, which is new:
 * original China configuration -> 2019 westernisation -> 2024 refit.
 * The old record described her through the 2019 lens alone and would
 * have had an advisor quoting a cabin count that changed again five
 * years later.
 *
 * THE QUIET DEFAULT SURVIVED. Decks 10 to 13 midship, unchanged — the
 * first time a band I couldn't show the working for turned out to be
 * right anyway. Worth being honest that this was luck rather than
 * method: I flagged it as probably wrong and it wasn't.
 *
 * THE TAXONOMY GAINED A GENERALISATION RATHER THAN A TYPE. The deck 9
 * aft cabins look down onto the Waterfront's steel ROOF — structure
 * below the balcony, horizon untouched. That is the same shape as
 * Radiance's lifeboat roof with different metal, and Jimmy's call was to
 * stop minting a kind per shipyard decision: `lower-structure` is the
 * reusable concept and the specific structure is a cause named in the
 * ship's prose. See `src/lib/obstruction.ts`.
 *
 * Corrections his pass made:
 *   - The kart-noise FALSE ALARM is not signable as written. "No
 *     cabin-noise complaints surfaced" is an absence claim and absence
 *     isn't evidence — the same trap as the Sunshine SportSquare error.
 *     What survives is the electric-kart fact and the instruction not to
 *     infer conventional engine noise from a go-kart track.
 *   - Speedway adjacency to the Haven is PHYSICAL GEOMETRY, not a noise
 *     verdict. The record says they're next to each other and stops.
 *   - The deck 9 visibility ranges are not promoted. What's supported is
 *     that those cabins have materially larger balconies; the
 *     visible-from-above claim across the whole range isn't.
 *   - Escape's deck 8 lifeboat obstruction stays explicitly researched.
 *     The mechanism is plausible and the exact band isn't extracted.
 *   - The studios are resolved in the record's favour, like Prima and
 *     Epic: NCL states no single supplement and Studio Lounge access on
 *     its own pages. But the DECKS differ between the original pair and
 *     the Plus ships, so that goes in the overlays rather than one rule.
 *   - Kart PRICING is deleted from static ship knowledge. Attraction
 *     prices move faster than anything else here and belong in a dated
 *     layer or nowhere.
 *   - The elevator claims drop to researched, third class running. The
 *     "buffet and theatre are forward therefore the forward bank is
 *     congested therefore book forward" chain is exactly the kind of
 *     plausible reasoning that shouldn't drive a mobility recommendation.
 *
 * AND A DATA-INGESTION RULE came out of this one, which is worth more
 * than any single fact in the file: NEVER propagate exact cabin-number
 * defects across sister ships without independent deck-plan
 * confirmation. A search summary was caught copying Breakaway's numbers
 * onto Escape wholesale, and the two aren't even the same sub-class.
 *
 * Deliberately NOT encoded: obstructed-cabin lists for Getaway, Joy,
 * Bliss and Encore; kart or ropes-course pricing; elevator bank
 * behaviour; and any noise verdict derived from adjacency alone.
 */

type BreakawayShip =
  | "breakaway"
  | "getaway"
  | "escape"
  | "joy"
  | "bliss"
  | "encore";

const PLUS = new Set<BreakawayShip>(["escape", "joy", "bliss", "encore"]);
const KARTS = new Set<BreakawayShip>(["joy", "bliss", "encore"]);
/** Ropes course confirmed on these; the kart ships have a different top-deck mix. */
const ROPES = new Set<BreakawayShip>(["breakaway", "getaway", "escape"]);

const BREAKAWAY_SOURCES: Source[] = [
  {
    label:
      "Breakaway deck 13 described as cabins above and below cabins; core stack 10-13 (checked by Jimmy)",
    url: "https://www.ncl.com/cruise-ship/breakaway/deck-plans",
    checked: "2026-08-19",
  },
  {
    label: "Breakaway deck 8 — balconies overlooked from The Waterfront promenade",
    url: "https://www.cruisedeckplans.com/ships/deckbydeck.php?ship=Norwegian-Breakaway&deck=8",
    checked: "2026-08-19",
  },
  {
    label: "Escape — Haven on decks 17-18 above the deck 16 pool; Club Balcony inventory to deck 15",
    url: "https://www.ncl.com/cruise-ship/escape/deck-plans",
    checked: "2026-08-19",
  },
  {
    label: "Escape Studios on decks 10, 11 and 12 with the Studio Lounge on 11",
    url: "https://www.ncl.com/cruise-ship/escape/staterooms",
    checked: "2026-08-19",
  },
  {
    label:
      "NCL — Studios are priced for solo travellers with Studio Lounge access and no single supplement",
    url: "https://www.ncl.com/cruise-ship/breakaway/staterooms",
    checked: "2026-08-19",
  },
  {
    label: "Joy Speedway on decks 19-20; NCL FAQ 55in-82in, 265lb",
    url: "https://www.ncl.com/faq/size-age-weight-requirements-for-activities",
    checked: "2026-08-19",
  },
  {
    label: "Joy 2019 — 22 of 95 Concierge cabins removed for the Observation Lounge",
    url: "https://www.travelweekly.com/Cruise-Travel/After-China-sojourn-Norwegian-Joy-updated-for-Alaska",
    checked: "2026-08-19",
  },
  {
    label: "Joy 2024 refit — part of the Observation Lounge reduced to add 24 balcony cabins",
    url: "https://www.ncl.com/cruise-ship/joy",
    checked: "2026-08-19",
  },
  {
    label: "Go-karts are electric with the engine sound piped into the driver's helmet",
    url: "https://www.cruzely.com/15-must-know-things-about-norwegians-go-kart-track-at-sea/",
    checked: "2026-08-19",
  },
];

/* ------------------------------------------------------------------ *
 * LAYER 1 — shared Breakaway-family geometry.
 * ------------------------------------------------------------------ */

/**
 * Decks 10 to 13 midship, and this one held. Deck 13 on Breakaway is
 * explicitly cabins above and below cabins, and the core stack runs the
 * same way on the Plus hulls.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-19).
 */
const BREAKAWAY_QUIET_DEFAULT = `Midship on decks 10 to 13. ${QUIET_DEFAULT_RULE} That band is the core cabin stack across this whole family and it passes cleanly — deck 13 in particular sits with cabins above it and cabins below it. Deck 9 needs the check downward, because of what's under it and beside it. From deck 14 up the answer stops being a family rule and becomes ship-specific, so check the overhead on the actual hull rather than the class.`;

/**
 * THE WATERFRONT. The class's best feature and the source of the one
 * cabin problem nothing else in the fleet has.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-19). Exact cabin numbers stay
 * researched; the mechanism is the signed part.
 */
const WATERFRONT_PRIVACY =
  "The Waterfront on deck 8 — the outdoor oceanfront promenade — is the best thing about these ships and it creates a defect nothing else in the fleet has. A small run of deck 8 balconies sits where people walking the promenade have a direct sightline toward the balcony, and into the room when the curtains are open. One passenger called it a fishbowl and kept the curtains shut all week. Crucially this is NOT sold as obstructed, so it's a deck-plan check rather than a category check — and it's a privacy tradeoff rather than a bad cabin. Some clients would happily take promenade proximity; ask before you assume.";

const WATERFRONT_ROOF =
  "A separate and different thing on deck 9 aft: some of those balconies look down onto the Waterfront's steel roof rather than the water. The horizon is untouched and the balcony is fine — what's gone is the straight-down view. Name the roof to the client rather than saying obstructed, because what they pictured, sea in front of them from a chair, is entirely intact.";

/**
 * Resolved in the record's favour, like Prima and Epic — NCL says it on
 * its own pages. The DECKS differ between sub-classes, so they live in
 * the overlays.
 */
const STUDIOS_BASE =
  "The solo studios here are a real product rather than a discounted double: keycard-clustered with a private Studio Lounge, and NCL's own pages state no single supplement is required, so you can say that plainly. I'm not giving you a count — sources differ and inventory moves.";

/* ------------------------------------------------------------------ *
 * LAYER 2 — sub-class overlays.
 * ------------------------------------------------------------------ */

/** Breakaway and Getaway: deck 15 does two jobs at once. */
const ORIGINAL_UPPER_DECKS =
  "The upper decks on this pair are mixed-use in a way the newer sisters aren't: deck 15 is the pool, the Garden Café and the aqua park AND it carries Haven cabins. So the top of this ship is busier than a plan skim suggests, and the cabins directly under that zone want a real overhead check on the specific room rather than a blanket warning about deck 14.";

/** Breakaway Plus: Haven sits ABOVE the Lido, and cabins run higher. */
const PLUS_UPPER_DECKS =
  "The upper decks are arranged the other way round from Breakaway and Getaway: the pool and aqua park sit around deck 16 with The Haven ABOVE them on 17 and 18, rather than sharing a deck. Cabin inventory also runs higher on these hulls — Escape sells Club Balcony rooms as far up as deck 15 — so \"everything above the cabins is public space\" is not a safe assumption here. Check the specific deck on the specific ship.";

/* ------------------------------------------------------------------ *
 * LAYER 3 — per-ship overlays.
 * ------------------------------------------------------------------ */

const STUDIO_DECKS: Partial<Record<BreakawayShip, string>> = {
  escape:
    "On this ship the Studios are on decks 10, 11 and 12 with the Studio Lounge on 11.",
};

const SHIP_OBSTRUCTION: Partial<Record<BreakawayShip, string>> = {
  breakaway:
    "This hull has the most specific published picture in the family, and it's all researched rather than confirmed. The Haven forward penthouses 9106 and 9706 have small side balconies partly blocked by the ship's structure — 9106 in particular comes up in passenger reports, and it's a cabin-specific finding rather than a rule. On deck 8, the balconies flagged as overlooked from The Waterfront are 8176, 8178 and 8180 on port with 8776, 8778 and 8780 on starboard. On deck 9, the run from 9112 to 9134 on port and 9712 to 9734 on starboard is worth knowing for a different reason: those cabins have materially larger balconies, around 70 square feet on 9112. A claim also circulates that the outer part of those balconies is visible from above — that one isn't supported across the whole range and isn't encoded.",
  escape:
    "The deck 8 oceanviews and balconies on this hull are reported to carry partial to full lifeboat obstruction. That is RESEARCHED and the exact band has not been extracted from the current plan, so treat it as a check on the specific cabin rather than a deck to avoid. And be careful with what circulates about this ship: at least one summary was caught copying Breakaway's cabin numbers onto it wholesale, and these two aren't even the same sub-class.",
};

/** Joy's chronology. Three configurations, and reviews exist from all three. */
const JOY_HISTORY = [
  "Joy has been three different ships and an advisor needs the chronology, not just the latest state. She was built for the Chinese market — private karaoke rooms, three casinos, tea rooms, Asian-market restaurants. Reviews and photos from before 2019 describe a materially different product from the one your client will board.",
  "The 2019 westernisation is the change that still shows in the cabin inventory: adding the Observation Lounge meant removing 22 of the original 95 Concierge cabins. Concierge is a Joy-only tier to begin with, so it's thinner than it looks on paper — check availability early if a client wants it.",
  "Then she changed again in 2024, and this is the part an older note will miss: part of the Observation Lounge was itself reduced to add 24 balcony cabins. So don't describe this ship's current layout through the 2019 refit alone — that lens is now two configurations out of date.",
];

const ATTRACTIONS: Record<BreakawayShip, NclAttractionId[]> = {
  breakaway: ["ropes-course"],
  getaway: ["ropes-course"],
  escape: ["ropes-course"],
  joy: ["speedway"],
  bliss: ["speedway"],
  encore: ["speedway"],
};

function breakawayContent(ship: BreakawayShip): ShipContent {
  const isPlus = PLUS.has(ship);
  const hasKarts = KARTS.has(ship);

  // Overlooked = the Waterfront privacy defect. lower-structure = the
  // Waterfront roof under the deck 9 aft balconies. lifeboat-davit only
  // where a hull actually reports it.
  const kinds: ObstructionKind[] = [
    "overlooked",
    "lower-structure",
    ...(ship === "escape" ? (["lifeboat-davit"] as ObstructionKind[]) : []),
  ];

  return {
    reviewDue: "2027-02-01",
    sources: [...NCL_SOURCES, ...BREAKAWAY_SOURCES],

    cabin: {
      // Signed off by Jimmy, 2026-08-19. Corrections at the top of the file.
      verified: true,
      placementNote: `${BREAKAWAY_QUIET_DEFAULT} ${isPlus ? PLUS_UPPER_DECKS : ORIGINAL_UPPER_DECKS}${hasKarts ? " The Speedway go-kart track runs across the top decks immediately beside The Haven on this ship. That's physical adjacency, stated as geometry — it is NOT a noise verdict, and nothing establishes that it carries into the suites." : ""}`,
      motionAvoid: MOTION_RULE,
      vibrationNote: VIBRATION_RULE,
      categoryWarnings: [
        WATERFRONT_PRIVACY,
        WATERFRONT_ROOF,
        `${STUDIOS_BASE}${STUDIO_DECKS[ship] ? ` ${STUDIO_DECKS[ship]}` : " The exact Studio decks differ between the original pair and the Plus ships, so read them off this hull's own plan rather than a class rule."}`,
        "Club Balcony Suite is the renamed mini-suite. It is not a Haven category, carries no Haven access, and sits in the lower service-charge band. Clients hear \"suite\" and picture the private complex — be explicit that it isn't that, especially with anyone coming from another line.",
        ...(ship === "joy" ? [JOY_HISTORY[1]] : []),
      ],
      hazardsAboveBelow: isPlus
        ? [
            {
              source: "lido",
              where:
                "the pool and aqua park around deck 16, with The Haven above them on 17 and 18 rather than alongside",
            },
            {
              source: "buffet",
              where: "the Garden Café, on the same deck as the pool",
            },
            ...(hasKarts
              ? [
                  {
                    source: "sports",
                    where:
                      "the Speedway on the top decks, immediately beside The Haven — adjacency only, with no established noise effect",
                  },
                ]
              : []),
          ]
        : [
            {
              source: "lido",
              where:
                "deck 15 — the pool, Garden Café and aqua park, which on this pair ALSO carries Haven cabins rather than being purely public",
            },
            {
              source: "gym",
              where: "the fitness centre, over a run of starboard cabins on deck 14",
            },
          ],
      obstructedViewNotes: `Two mechanisms run through this whole family and they call for different conversations. The Waterfront promenade on deck 8 overlooks a small run of balconies — that's a privacy defect, not a view one, and it isn't sold as obstructed. And the Waterfront's steel roof sits under some deck 9 aft balconies, taking the downward view while leaving the horizon open. ${SHIP_OBSTRUCTION[ship] ?? "No per-cabin obstruction list is published for this hull. Check both class mechanisms against the current plan for the specific cabin, and do NOT carry a sister ship's cabin numbers across — that mistake has already been made in print about these ships."}`,
      obstructionKinds: kinds,
      minorPlacementRule: NCL_MINOR_PLACEMENT,
      elevatorNote:
        "Around sixteen lifts is the widely reported figure for this design family, and that's as far as I'd go. The bank layout needs verifying per hull, and the story that circulates — that the buffet, theatre and observation lounge all sit forward so the forward bank takes the load — is passenger experience rather than encoded geometry. It may well be right. It is not something to build a cabin recommendation on.",
      accessibilityNote:
        "I'm giving you less here than an earlier version of this record did, deliberately. That version told you to book forward because the forward lift bank serves the busy venues; that chain of reasoning was plausible and unverified, and a mobility recommendation is the worst place for plausible-and-unverified. What's solid: this is a large ship, the lift count is roughly sixteen, and the layout wants checking per hull. Map the actual route from the specific cabin to the main dining room, and confirm it against NCL's accessible deck plan rather than against a rule from me.",
    },

    // STILL UNSIGNED, line-wide. See the file header.
    money: NCL_MONEY,

    traps: {
      // Signed off by Jimmy, 2026-08-19, after the attraction-table
      // migration and the removal of the kart-noise absence claim.
      verified: true,
      kidAgeHeightRules: `${nclAttractionRules(ATTRACTIONS[ship])} ${NCL_KIDS_RULES}`,
      embarkationNote: NCL_EMBARKATION,
      other: [
        "The Waterfront cabins on deck 8 are a genuine tradeoff rather than a trap to avoid: promenade proximity in exchange for people being able to see toward the balcony and into the room with the curtains open. Raise it and let the client choose — the ones who mind, mind a lot.",
        ...(hasKarts
          ? [
              "Don't assume the Speedway means engine noise. These karts are electric and the engine sound is piped into the driver's helmet rather than out across the deck, so the mental image of a racetrack over the cabins is wrong on the mechanics. What I can't tell you is that there's no noise issue at all — nobody has established that either way, so judge it on the actual structural adjacency for the specific cabin rather than on either assumption.",
            ]
          : []),
        ...(ship === "joy" ? [JOY_HISTORY[0], JOY_HISTORY[2]] : []),
        ...(ROPES.has(ship)
          ? [
              "The ropes course is free, which surprises people on a line where most of the headline activities aren't. Worth mentioning to a family pricing the week.",
            ]
          : []),
      ],
      linePolicy: [NCL_HAVEN_WARNING, NCL_FREESTYLE, ...NCL_FLEET_TRAPS],
    },
  };
}

export const norwegianBreakaway = breakawayContent("breakaway");
export const norwegianGetaway = breakawayContent("getaway");
export const norwegianEscape = breakawayContent("escape");
export const norwegianJoy = breakawayContent("joy");
export const norwegianBliss = breakawayContent("bliss");
export const norwegianEncore = breakawayContent("encore");
