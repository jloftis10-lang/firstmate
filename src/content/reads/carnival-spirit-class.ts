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
  MOTION_RULE,
  PORTHOLE_STEER,
  QUIET_DEFAULT_RULE,
  VIBRATION_RULE,
} from "./operator-rules";

/**
 * Spirit class: Spirit, Pride, Legend, Miracle (2001–2004).
 *
 * SIGNED OFF by Jimmy, 2026-08-18, against Carnival's current deck plans
 * and the GoCCL Spirit-class obstructed-view record.
 *
 * LUMINOSA IS DELIBERATELY NOT IN THIS FACTORY. It's routinely listed as
 * Spirit class and it isn't one: built as Costa Luminosa in 2009 to a
 * Vista/Spirit hybrid design, bigger in tonnage and beam than these four.
 * It gets its own file.
 *
 * The headline from this review is the obstruction model, and it's the
 * most useful thing to come out of any of these passes. Carnival sells
 * THREE obstructed categories on these ships — 4K interior with window,
 * 7A balcony, 9A premium balcony — and the obstruction is lifeboats,
 * tender boats and davits on Main Deck 4. That is a materially different
 * defect from the solid steel railing on the Excel, Vista and Dream
 * hulls: it compromises the view DOWNWARD while often leaving the
 * outward horizon usable. Selling both as "obstructed" loses a booking
 * that would have worked, so the record says which kind it is.
 *
 * Corrections his pass made to my workup:
 *   - Cabins are on deck 1, then decks 4 to 8 — not a run from 1 to 8.
 *   - Deck 2 does NOT carry cabins. It's predominantly public space. The
 *     useful fact is the other way round: deck 1 has cabins AND an aft
 *     galley and service block, with the public weight sitting above on 2.
 *   - The nightclub-over-deck-1 claim is NOT class-wide and is now
 *     per-ship. Spirit's lower Dancin' level was replaced in its 2025
 *     refurbishment and Pride's lower dance-club area was converted;
 *     Legend and Miracle still show lower-level arrangements. I had it as
 *     one shared claim with a "forward end" location that doesn't
 *     describe the geometry cleanly.
 *   - The quiet default stays at decks 5 to 7 midship. This is the one
 *     class where narrowing to deck 7 would have been WRONG: deck 5 has
 *     cabin territory on deck 4 beneath it, so it passes the test.
 *
 * Deliberately still absent: elevator counts and banks. Secondary sources
 * report 15 on several ships but it yields no defensible preferred-bank
 * rule, so it stays out. And no claim that the narrow Panamax hull rides
 * differently — the hull is documented, the effect is not.
 */

const SPIRIT_CLASS_SOURCES: Source[] = [
  {
    label:
      "Carnival Spirit deck plan — cabin decks 1 and 4-8, Lido on 9, 4K/7A/9A obstructed categories (checked by Jimmy)",
    url: "https://www.carnival.com/cruise-ships/carnival-spirit",
    checked: "2026-08-18",
  },
  {
    label:
      "Spirit-class staterooms with obstructed views — lifeboats and davits on Main Deck 4, with cabin numbers",
    url: "https://help.goccl.com/app/answers/detail/a_id/5523",
    checked: "2026-08-18",
  },
  {
    label:
      "Waterslide policy — Twister 42in/300lb, Green Thunder 48in/300lb, Mini Racer",
    url: "https://help.carnival.com/app/answers/detail/a_id/1122/~/policies-for-shipboard-water-sports",
    checked: "2026-08-18",
  },
  {
    label: "Carnival Pride deck plan — lower dance-club area converted",
    url: "https://www.carnival.com/cruise-ships/carnival-pride",
    checked: "2026-08-18",
  },
];

/**
 * Decks 5 to 7 midship, and this is the class where the deck-7-only
 * answer would have been wrong.
 *
 * Deck 8 fails the test — Lido sits directly on 9 above it. But deck 5
 * passes, because deck 4 beneath it is cabin territory. So the band is
 * genuinely three decks wide here, unlike Sunshine and Conquest.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-18).
 */
const SPIRIT_CLASS_QUIET_DEFAULT = `Midship on decks 5, 6 or 7. ${QUIET_DEFAULT_RULE} On this class that band is genuinely three decks wide — deck 4 beneath 5 is cabin territory, so 5 passes where it wouldn't on a hull with public space under it. Deck 8 is the one that fails: Lido sits directly above it on 9. Still run the vertical scan on the specific cabin rather than blessing everything on 5 to 7.`;

/**
 * Deck 1's real issue is not a nightclub — it's the aft galley and
 * service block on its own deck, with the public weight of deck 2 above.
 */
const DECK_1_SERVICE_CHECK =
  "Deck 1 carries cabins and needs a check of what shares and sits above it: there's an aft galley and service zone on deck 1 itself, and deck 2 above is predominantly public space rather than cabins. That's the opposite of how I'd describe most hulls, and it's the useful shape here.";

/**
 * The nightclub arrangement is NOT shared across the class any more —
 * two of the four have had their lower dance-club levels converted, so
 * this is stored per ship with the refit date attached.
 */
const NIGHTCLUB: Record<"spirit" | "pride" | "legend" | "miracle", string | null> = {
  spirit:
    "The lower level of the Dancin' nightclub was reportedly replaced in this ship's 2025 refurbishment, so older warnings about a two-level club over the lower cabins are out of date here. Check the current plan rather than a review.",
  pride:
    "The lower dance-club area on this ship was converted, so older warnings about a two-level club over the lower cabins don't describe it any more. Check the current plan rather than a review.",
  legend:
    "Current references still show a lower-level nightclub arrangement on this ship. Two of its sisters have had theirs converted and this one hasn't, so don't reason across the class — check where it actually sits before placing anyone low.",
  miracle:
    "Current references still show a lower-level nightclub arrangement on this ship. Two of its sisters have had theirs converted and this one hasn't, so don't reason across the class — check where it actually sits before placing anyone low.",
};

function spiritClassContent(
  ship: "spirit" | "pride" | "legend" | "miracle",
): ShipContent {
  const nightclub = NIGHTCLUB[ship];
  const clubStillLow = ship === "legend" || ship === "miracle";

  return {
    reviewDue: "2027-02-01",
    sources: [...CARNIVAL_SOURCES, ...SPIRIT_CLASS_SOURCES],

    cabin: {
      // Signed off by Jimmy, 2026-08-18, against Carnival's deck plans
      // and the GoCCL Spirit-class obstruction record.
      verified: true,
      placementNote: `${SPIRIT_CLASS_QUIET_DEFAULT} Cabins sit on deck 1 and then decks 4 through 8 — decks 2 and 3 aren't cabin decks here. The Lido on 9 sits cleanly above deck 8 rather than carrying cabins itself, which is the opposite of the Conquest and Sunshine hulls and makes deck 8 the straightforward pool-overhead case. ${DECK_1_SERVICE_CHECK}`,
      motionAvoid: MOTION_RULE,
      vibrationNote: VIBRATION_RULE,
      categoryWarnings: [
        PORTHOLE_STEER,
        BOTTOM_DECK_NOTE,
        "Deck 8 is the top cabin deck and the pool deck is directly above it, with no cabins in between to absorb anything. A client asking for a high deck is asking for the noisiest one on this ship — offer them midship on 6 or 7 instead and tell them why.",
        "These are narrow hulls, built to the original Panama Canal locks. That's a real difference from the rest of the fleet, but I have no evidence it changes how the ship rides or how big the cabins are — so don't sell it as an advantage or warn about it as a drawback. It's context, not a recommendation.",
        ...(nightclub ? [nightclub] : []),
      ],
      hazardsAboveBelow: [
        {
          source: "lido",
          where:
            "deck 9, directly over the deck 8 cabins — the clean overhead case on this class, since the pool deck carries no cabins of its own",
        },
        {
          source: "galley",
          where:
            "an aft galley and service block on deck 1 itself, alongside the cabins there",
        },
        ...(clubStillLow
          ? [
              {
                source: "nightclub",
                where:
                  "a lower-level nightclub arrangement still shown on this ship, unlike two of its sisters — check the current plan for where it sits",
              },
            ]
          : []),
      ],
      obstructedViewNotes: `Carnival sells three obstructed categories on this class rather than hiding them: 4K interior with window, 7A balcony and 9A premium balcony. The cause is the lifeboats, tender boats and davits on Main Deck 4. Named examples from the published list include 9A cabins 5241 and 5243 and a large run of 7A cabins starting around 5142 to 5191 with more further aft — that list hasn't been imported here cabin-by-cabin, so read the category code on the specific cabin.`,
      obstructionKinds: ["lifeboat-davit"],
      minorPlacementRule: CARNIVAL_MINOR_PLACEMENT,
      accessibilityNote:
        "A smaller hull with a single Lido deck, so much less of the Excel-class problem where dining is low and the pool is eight decks up — though that comparison is our inference from the layout rather than a sourced claim. Secondary sources report around fifteen lifts but nothing establishes a bank layout, and a count with no layout gives you no useful advice, so check the deck plan for the specific cabin and confirm scooter clearance against Carnival's accessible deck plan.",
    },

    money: CARNIVAL_MONEY,

    traps: {
      // Signed off by Jimmy, 2026-08-18, with the slide record made
      // precise — Green Thunder by name rather than "a thrill slide".
      verified: true,
      kidAgeHeightRules: `${CARNIVAL_SLIDE_RULES} On this class specifically: the Twister slide needs 42 inches and caps at 300 pounds, while Green Thunder needs 48 inches and the same 300-pound cap. That gap is the one to head off — a child between 42 and 47 inches clears Twister and gets turned away from Green Thunder, and finding that out at the top of the stairs ruins an afternoon. There are Mini Racer slides too for the smaller ones. ${CARNIVAL_KIDS_RULES}`,
      obstructedBalconyDecks:
        "the 4K, 7A and 9A categories — 9A cabins 5241 and 5243 and a long 7A run from around 5142 to 5191 are the named examples",
      embarkationNote: CARNIVAL_EMBARKATION,
      other: [
        "Neither BOLT nor SkyRide is on this class — those are the Excel and Vista ships. Don't let a client arrive expecting the rollercoaster or the sky ride.",
        "Green Thunder is on all four ships in this class, and it's the one worth naming to a family rather than saying \"there's a thrill slide\" — that way you can explain exactly which child can ride what.",
      ],
    },
  };
}

export const carnivalSpirit = spiritClassContent("spirit");
export const carnivalPride = spiritClassContent("pride");
export const carnivalLegend = spiritClassContent("legend");
export const carnivalMiracle = spiritClassContent("miracle");
