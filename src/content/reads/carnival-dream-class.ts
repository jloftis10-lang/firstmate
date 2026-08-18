import type { ShipContent, Source } from "@/lib/types";
import {
  CARNIVAL_EMBARKATION,
  CARNIVAL_KIDS_RULES,
  CARNIVAL_MINOR_PLACEMENT,
  CARNIVAL_MONEY,
  CARNIVAL_ROPES_COURSE_RULES,
  CARNIVAL_SLIDE_RULES,
  CARNIVAL_SOURCES,
} from "./carnival-common";
import {
  BOTTOM_DECK_NOTE,
  CONNECTING_RULE,
  MOTION_RULE,
  PORTHOLE_STEER,
  VIBRATION_RULE,
} from "./operator-rules";

/**
 * Dream class: Dream, Magic, Breeze (2009–2012).
 *
 * SIGNED OFF by Jimmy, 2026-08-18, after he checked my workup against
 * Carnival's own current deck-plan PDFs and advisor knowledge base. That
 * pass corrected six things and upgraded two more from "researched" to
 * primary-sourced, so this record is materially different from what I
 * first wrote:
 *
 *   - Deck 10 is mixed-use, not simply "a cabin deck beside the pool".
 *     The cabins concentrate FORWARD; the Lido, pool and buffet take more
 *     of the midship and aft space.
 *   - The cabin decks are 1, 2, 6, 7, 8, 9, 10, 11 and 12 — not a
 *     continuous run from 1 to 12, which is what I had.
 *   - The quiet default is decks 7 and 8, NOT 7 to 9. Deck 9 needs a
 *     vertical check because deck 10 above it turns into Lido space
 *     through much of the ship. This was the biggest placement fix.
 *   - Deck 12's spa cabins sit BESIDE the upper recreation areas, not
 *     under them. On Magic and Breeze deck 12 itself carries the Spa,
 *     Sports, SkyCourse and WaterWorks areas. What actually sits under
 *     recreation is part of deck 11.
 *   - 9205 and 9206 are obstructed on ALL THREE ships, published by
 *     Carnival, obstructed by steel bulkhead and ship structure. I had
 *     recorded it as a Breeze-only claim from traveler write-ups and
 *     flagged it as possibly contaminated from the Vista-class list.
 *     It isn't contamination — it's a recurring Carnival design pattern
 *     across classes, and Vista carries the same numbers legitimately.
 *   - Carnival DOES publish obstruction lists for Dream and Magic. My
 *     record said none existed, which was flatly wrong.
 *
 * Deliberately still absent: the elevator bank split. Eighteen cars is
 * corroborated, but there is no reliable bank layout or recurring
 * congestion pattern, so the record stores the count and refuses to
 * recommend a bank.
 */

const DREAM_CLASS_SOURCES: Source[] = [
  {
    label:
      "Carnival Dream deck plan — obstructed-view list and deck 10 mixed use (checked by Jimmy against Carnival's own PDF)",
    url: "https://www.carnival.com/cruise-ships/carnival-dream",
    checked: "2026-08-18",
  },
  {
    label:
      "Carnival Magic deck plan — obstructed-view list, deck 12 Spa/Sports/SkyCourse (checked by Jimmy)",
    url: "https://www.carnival.com/cruise-ships/carnival-magic",
    checked: "2026-08-18",
  },
  {
    label:
      "Carnival Breeze deck plan and advisor cabin data — 7C cove 185+45 sq ft, 9205/9206 obstructed (checked by Jimmy)",
    url: "https://www.carnival.com/cruise-ships/carnival-breeze",
    checked: "2026-08-18",
  },
  {
    label: "SportSquare and ropes-course availability — Magic and Breeze, not Dream",
    url: "https://help.carnival.com/app/answers/detail/a_id/1158",
    checked: "2026-08-18",
  },
  {
    label: "Elevator count corroboration — 18 on all three hulls",
    url: "https://www.cruisemapper.com/deckplans/Carnival-Dream-680",
    checked: "2026-08-18",
  },
];

/**
 * The class placement default, as a named rule because it is the single
 * most useful thing in this record and it is NOT the obvious answer.
 *
 * Decks 7 and 8 are the clean sandwich — cabins above and below. Deck 9
 * looks like it belongs in that band and does not, because deck 10 above
 * it becomes Lido, pool and buffet space through much of the ship.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-18). His conclusion is an inference
 * from Carnival's official deck geometry, not something Carnival
 * recommends — recorded that way on purpose.
 */
const DREAM_CLASS_QUIET_DEFAULT =
  "Midship on deck 7 or 8. Those two are the clean sandwich on this class — cabins above and below, no public rooms either way. Deck 9 looks like it belongs with them and doesn't: deck 10 above turns into Lido, pool and buffet space through much of the ship, so 9 needs a vertical check on the specific cabin rather than a blanket yes. That's read off Carnival's deck geometry rather than anything Carnival recommends.";

/**
 * Deck 10 is mixed-use and the distinction matters. Cabins concentrate
 * forward; the pool, Lido and buffet take more of the midship and aft.
 * So the useful instruction is "check same-deck traffic", not "you'll be
 * beside the pool" — which was my original over-broad wording.
 */
const DECK_10_MIXED_USE =
  "Deck 10 is mixed-use, and that's the thing to understand before you book it. The cabins concentrate forward while the Lido, pool and buffet take more of the midship and aft space — so a deck 10 cabin isn't automatically beside the pool, but it isn't a normal cabin deck either. Check what shares the deck alongside the specific cabin rather than treating 10 the way you'd treat 8.";

/**
 * A separate rule from the balcony obstruction, on purpose. Carnival
 * calls these "Interior with Picture Window (Walkway View)" and says
 * outright that the outdoor observation deck and walkway partially
 * obstruct the view. It is a different category, a different cause, and
 * a privacy question as much as a view one — lumping it in with the
 * obstructed balconies was wrong.
 */
const FORWARD_WALKWAY_VIEW =
  "Separate from the obstructed balconies: the forward interiors sold as \"Interior with Picture Window (Walkway View)\". Carnival says plainly that the outdoor observation deck and walkway partially obstruct the view — and it cuts both ways, because people on the walkway are looking back. Fine for a client who wants light and doesn't care; wrong for anyone expecting a sea view or privacy.";

/** Carnival's own published obstructed-view accommodations, per hull. */
const OBSTRUCTED: Record<"dream" | "magic" | "breeze", string> = {
  dream:
    "Carnival's current deck plan lists 1432, 1447, 2448, 2473, 9205 and 9206 as obstructed-view accommodations on this ship.",
  magic:
    "Carnival's current deck plan lists 1440, 1459, 2448, 2473, 9205 and 9206 as obstructed-view accommodations on this ship.",
  breeze:
    "Carnival's current deck plan lists 9205 and 9206 as obstructed-view Junior Suites on this ship; the lower-deck entries weren't enumerated in this review, so check the plan for the specific cabin.",
};

/** Magic and Breeze only. Dream is not on Carnival's ropes-course list. */
const SPORTSQUARE_SHIPS = new Set(["magic", "breeze"]);

function dreamClassContent(ship: "dream" | "magic" | "breeze"): ShipContent {
  const hasSportSquare = SPORTSQUARE_SHIPS.has(ship);

  return {
    reviewDue: "2027-02-01",
    sources: [...CARNIVAL_SOURCES, ...DREAM_CLASS_SOURCES],

    cabin: {
      // Signed off by Jimmy, 2026-08-18, against Carnival's own deck
      // plans. The corrections he made are listed at the top of the file.
      verified: true,
      placementNote: `${DREAM_CLASS_QUIET_DEFAULT} Cabins on this class sit on decks 1, 2, 6, 7, 8, 9, 10, 11 and 12 — not a continuous run, so don't reason from "deck 4" or "deck 5" existing as cabin decks here. ${DECK_10_MIXED_USE}`,
      motionAvoid: MOTION_RULE,
      vibrationNote: VIBRATION_RULE,
      categoryWarnings: [
        PORTHOLE_STEER,
        BOTTOM_DECK_NOTE,
        ship === "breeze"
          ? "The cove balconies are worth pricing properly rather than dismissing — category 7C runs about 185 square feet inside plus a 45-square-foot cove balcony, 230 total, and on this ship Carnival describes the cove experience as unusually close to the waterline. That's a genuine selling point for someone who wants the sea rather than the view down onto it."
          : "The cove balconies are worth pricing properly rather than dismissing — about 185 square feet inside plus a 45-square-foot cove balcony, 230 total, the same configuration across the class. Low, sheltered, and closer to the water than a standard balcony.",
        "The aft-view extended balconies look straight down the wake, and Carnival markets them on exactly that — so treat the wake as the selling point rather than something to warn about. Price them against a standard balcony rather than assuming the standard one wins.",
        FORWARD_WALKWAY_VIEW,
        ...(hasSportSquare
          ? [
              "Deck 12 on this ship carries the Spa, Sports, SkyCourse and WaterWorks areas alongside its cabins. The spa cabins up there are beside that activity rather than beneath it — it's the portions of deck 11 underneath deck 12 that take recreation noise from above.",
            ]
          : []),
      ],
      hazardsAboveBelow: [
        {
          source: "lido",
          where:
            "deck 10, mixed in with the cabins on that deck rather than sitting above them — a same-deck traffic problem, concentrated midship and aft",
        },
        {
          source: "buffet",
          where: "also on deck 10, in the same midship and aft space",
        },
        {
          source: "sports",
          where:
            "the deck 12 recreation areas, over the portions of deck 11 beneath them — not over the deck 12 spa cabins, which sit alongside",
        },
        {
          source: "kids",
          where:
            "WaterWorks up on 12 on the ships that carry it, again over parts of deck 11 rather than the cabins sharing deck 12 with it",
        },
      ],
      obstructedViewNotes: `Junior Suites 9205 and 9206 are obstructed on all three ships in this class — Carnival publishes it, and the obstruction is a steel bulkhead and ship structure rather than a lifeboat. Worth knowing that the same two numbers come up as obstructed on the Vista class too; it's a recurring Carnival design pattern across classes, not a coincidence or a bad source. ${OBSTRUCTED[ship]}`,
      obstructionKinds: ["solid-structure", "outdoor-walkway"],
      connectingNote: CONNECTING_RULE,
      minorPlacementRule: CARNIVAL_MINOR_PLACEMENT,
      elevatorNote:
        "Eighteen elevators on this class, corroborated across sources — but there's no reliable bank split and no recurring congestion pattern, so don't steer anyone forward or aft on my say-so. The rule that still holds: pick the end of the ship where they'll actually spend the week.",
      accessibilityNote:
        "Deck 10 being mixed-use cuts the vertical trip for some high-deck guests — they reach the Lido along the deck rather than taking the big jump the Excel ships force. But that only helps if they're already up there: anyone on the lower cabin decks still has substantial travel to reach 10 through 12. So it's less pronounced than Excel class rather than solved, and that comparison is our inference from the deck geometry rather than a Carnival statement. Confirm scooter clearance against Carnival's accessible deck plan as usual.",
    },

    money: CARNIVAL_MONEY,

    traps: {
      // Signed off by Jimmy, 2026-08-18, after the ropes-course
      // restrictions were added — my "none published" note was stale.
      verified: true,
      kidAgeHeightRules: `${CARNIVAL_SLIDE_RULES} The Twister slide runs a 42-inch minimum.${
        hasSportSquare ? ` ${CARNIVAL_ROPES_COURSE_RULES}` : ""
      } ${CARNIVAL_KIDS_RULES}`,
      obstructedBalconyDecks:
        ship === "breeze"
          ? "Junior Suites 9205 and 9206"
          : ship === "dream"
            ? "1432, 1447, 2448, 2473 and Junior Suites 9205 and 9206"
            : "1440, 1459, 2448, 2473 and Junior Suites 9205 and 9206",
      embarkationNote: CARNIVAL_EMBARKATION,
      other: [
        "Neither BOLT nor SkyRide is on this class — those are the Excel and Vista ships. Don't let a client arrive expecting the rollercoaster or the sky ride.",
        hasSportSquare
          ? "SportSquare and the SkyCourse ropes course are here. The restrictions are published and worth quoting up front: included in the fare, 52 to 77 inches, 300 pounds, and closed-toe athletic shoes required."
          : "No SportSquare or ropes course on this one — Magic and Breeze have it, Dream doesn't appear on Carnival's current availability list. Don't promise the ropes course.",
      ],
    },
  };
}

export const carnivalDream = dreamClassContent("dream");
export const carnivalMagic = dreamClassContent("magic");
export const carnivalBreeze = dreamClassContent("breeze");
