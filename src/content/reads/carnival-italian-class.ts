import type { ShipContent, Source } from "@/lib/types";
import {
  CARNIVAL_EMBARKATION,
  CARNIVAL_KIDS_RULES,
  CARNIVAL_MINOR_PLACEMENT,
  CARNIVAL_MONEY,
  CARNIVAL_ROPES_COURSE_RULES,
  CARNIVAL_SLIDE_RULES,
  CARNIVAL_SOURCES,
  ITALIAN_SLIDE_RULES,
} from "./carnival-common";
import {
  BOTTOM_DECK_NOTE,
  MOTION_RULE,
  PORTHOLE_STEER,
  QUIET_DEFAULT_RULE,
  VIBRATION_RULE,
} from "./operator-rules";

/**
 * Venezia and Firenze — the "Fun Italian Style" hulls, built as Costa
 * Venezia (2019) and Costa Firenze (2021), transferred 2023 and 2024.
 *
 * SIGNED OFF by Jimmy, 2026-08-18, against Carnival's own current deck-plan
 * PDFs for both ships. This pair turned out FAR more standardised than my
 * workup assumed, and the best surprise is that Firenze doesn't need to
 * inherit anything by sistership inference: Carnival independently
 * publishes the identical obstruction list for both hulls.
 *
 * The single most valuable find is a booking constraint, not a layout
 * fact: **every guest in a Terrazza stateroom must be 12 or older.**
 * Carnival states it for both ships. A family with an eight-year-old
 * cannot be put in one, and that is exactly the kind of expensive
 * mistake this product exists to catch.
 *
 * What his pass corrected in my version:
 *
 *   - The quiet default was "decks 11 to 14", which I couldn't justify
 *     under the cabins-above-and-below test and said so. It's decks 7
 *     and 8 midship.
 *   - **Deck 8 is a cabin deck, not the promenade.** Deck 5 carries the
 *     large public promenade strip. I had this squarely wrong and it was
 *     load-bearing for the whole placement note.
 *   - Deck 12 is recreation and carries NO cabins. I had it as one of
 *     three mixed cabin decks. There is a separate forward cabin section
 *     on deck 14.
 *   - The Venezia obstruction list I had — deck 3 oceanviews 3219 to
 *     3242 under the lifeboats — is NOT Carnival's official set and is
 *     removed. Carnival's actual list is Ocean Suites 9205 and 9206 plus
 *     6L/6M Deluxe Ocean Views 1460, 1473, 2452 and 2475.
 *   - "No obstruction list for Firenze" was wrong. Same list, published
 *     independently.
 *   - "Small Interior" is not a current Carnival category — it looks like
 *     legacy Costa or third-party terminology. Removed, along with the
 *     unattached ~150 sq ft interior figure.
 *   - SkyRide is RESOLVED, not unresolved: Carnival's SkyRide page lists
 *     Vista, Horizon and Panorama only. Neither of these has it. Both DO
 *     have SportSquare and a ropes course.
 *   - The legacy-Costa deck-numbering warning is dropped. Carnival and
 *     the major deck-plan sites now all use decks 1-12, 14 and 15, and
 *     the "decks into the twenties" problem couldn't be reproduced. If
 *     the offending source turns up it can come back.
 *
 * Note what is deliberately NOT claimed about 1460, 1473, 2452 and 2475:
 * Carnival says they're obstructed and does not say by what. The record
 * repeats the fact and invents no mechanism.
 */

const ITALIAN_SOURCES: Source[] = [
  {
    label:
      "Carnival Venezia deck plan (PDF) — obstruction list, deck 5 promenade, deck 12 recreation",
    url: "https://www.carnival.com/-/media/64a4430808b84b98a70a95d379f713ff.ashx",
    checked: "2026-08-18",
  },
  {
    label:
      "Carnival Firenze deck plan (PDF) — the same published obstruction list",
    url: "https://www.carnival.com/-/media/ab149f1c2d2b4688b2aa8898dc19e522.ashx",
    checked: "2026-08-18",
  },
  {
    label: "Terrazza staterooms require every guest to be 12 or older",
    url: "https://www.carnival.com/cruise-ships/carnival-firenze",
    checked: "2026-08-18",
  },
  {
    label: "SkyRide ship list — Vista, Horizon and Panorama only",
    url: "https://www.carnival.com/onboard/skyride",
    checked: "2026-08-18",
  },
  {
    label: "Ropes course ship list — both Italian hulls carry one",
    url: "https://www.carnival.com/onboard/ropes-course",
    checked: "2026-08-18",
  },
];

/**
 * Decks 7 and 8 midship — the same cabin-sandwich logic that has now held
 * across five Carnival classes.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-18).
 */
const ITALIAN_CLASS_QUIET_DEFAULT = `Midship on deck 7 or 8. ${QUIET_DEFAULT_RULE} Those two are the clean band here: deck 6 needs a check below it because deck 5 is heavily public, and deck 9 needs a check above it because deck 10 turns into mixed Lido and public territory.`;

/**
 * The upper decks, corrected. Deck 12 carries no cabins; deck 14 has a
 * separate forward section that needs an activity check.
 */
const ITALIAN_UPPER_DECKS =
  "Above deck 9 it gets busy: decks 10 and 11 mix cabins in with major public activity, deck 12 is recreation and carries no cabins at all, and there's a separate forward cabin section up on 14 that needs its own check against what's around it. Deck 5, not deck 8, is where the big public promenade strip runs.";

/**
 * The Terrazza occupancy rule. This is a hard constraint, not a
 * preference — a booking that breaks it fails.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-18). Carnival states it for both
 * ships.
 */
const TERRAZZA_RULE =
  "**Every guest in a Terrazza stateroom has to be 12 or older.** That's Carnival's rule on both these ships, and it is a hard stop — a family with an eight-year-old cannot book one at any price. Terrazza plays a similar role to Havana on the rest of the fleet, but it's its own Italian-style accommodation family rather than a rename, so check what's actually included rather than assuming Havana's perks transfer.";

/** Carnival publishes the same obstruction set for both ships. */
const ITALIAN_OBSTRUCTION =
  "Carnival publishes the same list for both ships, which is worth knowing because it means you don't have to reason from one to the other: Ocean Suites 9205 and 9206, plus the 6L and 6M Deluxe Ocean Views 1460, 1473, 2452 and 2475. Carnival says those four are obstructed and doesn't say by what, so I'm not going to guess a mechanism for you. Worth noting 9205 and 9206 turn up as obstructed on the Dream and Vista classes too — it's a recurring Carnival structural pattern rather than a coincidence.";

function italianClassContent(ship: "venezia" | "firenze"): ShipContent {
  const isVenezia = ship === "venezia";

  return {
    reviewDue: "2027-02-01",
    sources: [...CARNIVAL_SOURCES, ...ITALIAN_SOURCES],

    cabin: {
      // Signed off by Jimmy, 2026-08-18, against Carnival's own deck-plan
      // PDFs for both hulls. Corrections listed at the top of the file.
      verified: true,
      placementNote: `${ITALIAN_CLASS_QUIET_DEFAULT} ${ITALIAN_UPPER_DECKS}`,
      motionAvoid: MOTION_RULE,
      vibrationNote: VIBRATION_RULE,
      categoryWarnings: [
        TERRAZZA_RULE,
        PORTHOLE_STEER,
        BOTTOM_DECK_NOTE,
        "Bathrooms have glass shower doors rather than the curtain the rest of the fleet uses. Small thing, reads as an upgrade, worth mentioning to a client who's sailed Carnival before.",
        "This is an Italian-concept ship and the category names follow that rather than Carnival's usual set. Read the category description on the booking screen rather than assuming you know what a code means from another hull.",
      ],
      hazardsAboveBelow: [
        {
          source: "lido",
          where:
            "the deck 10 and 11 band, where cabins are mixed in with the pools and public space rather than sitting below them",
        },
        {
          source: "kids",
          where:
            "the WaterWorks and recreation complex up on deck 12, above the deck 11 cabins",
        },
        {
          source: "sports",
          where:
            "SportSquare and the ropes course in that same upper recreation area",
        },
        {
          source: "bar",
          where:
            "the big public promenade strip on deck 5, under the deck 6 cabins",
        },
      ],
      obstructedViewNotes: ITALIAN_OBSTRUCTION,
      minorPlacementRule: CARNIVAL_MINOR_PLACEMENT,
      elevatorNote: isVenezia
        ? "Sixteen elevators — researched rather than confirmed off Carnival's own material, so treat the count as indicative. What matters more is that they're destination-dispatch: you pick your deck on a panel outside and the system assigns you a car, with no buttons inside. The instruction that actually saves grief is to enter a destination for EVERY person in the group rather than once for the whole party — entering it once is the reported cause of most of the crowding and confusion."
        : "The elevators here are destination-dispatch — you pick your deck on a panel outside and the system assigns a car, with no buttons inside. Enter a destination for EVERY person in the group rather than once for the party; doing it once is the reported cause of most of the crowding. I have no reliable car count for this ship and I'm not going to assume it matches Venezia just because they're sisters.",
      accessibilityNote:
        "The destination-dispatch elevators are the thing to prepare a slower traveller for — a system that assigns you a car is harder to improvise with if someone is slow to board, and the whole group needs to enter destinations individually. Beyond that, the dining and theatre core is low while the outdoor attractions are high, so there's a real vertical trip in the day. Confirm scooter clearance against Carnival's accessible deck plan as usual.",
    },

    money: CARNIVAL_MONEY,

    traps: {
      // Signed off by Jimmy, 2026-08-18, after resolving SkyRide and
      // correcting the slide exception.
      verified: true,
      kidAgeHeightRules: `${ITALIAN_SLIDE_RULES} ${CARNIVAL_SLIDE_RULES} ${CARNIVAL_ROPES_COURSE_RULES} ${CARNIVAL_KIDS_RULES}`,
      obstructedBalconyDecks:
        "Ocean Suites 9205 and 9206, plus Deluxe Ocean Views 1460, 1473, 2452 and 2475",
      embarkationNote: CARNIVAL_EMBARKATION,
      other: [
        "Terrazza staterooms require every guest to be 12 or older. If there's a younger child in the party, that category is off the table entirely — check it before you quote, not after.",
        "No SkyRide on this ship. Carnival's own SkyRide list is Vista, Horizon and Panorama, and that's the whole list. Both of these hulls do have SportSquare and a ropes course, so sell those instead.",
        "This is an Italian-concept ship rather than a standard Carnival one, and that's the expectation to set before they board. The pool deck is smaller with less lounger space, the main pool is covered, and sail-away is more subdued. A client who booked expecting the usual Carnival deck party will be disappointed by something that isn't a fault.",
        "The Guy's Burger and BlueIguana counters a repeat Carnival client will look for aren't here — the food concepts are Italian equivalents. Name the venues that are actually onboard rather than letting them assume.",
        "The casino is laid out around smoking with only a small non-smoking alternative. If anyone in the party is sensitive to it, raise it before deposit rather than at the pier.",
      ],
    },
  };
}

export const carnivalVenezia = italianClassContent("venezia");
export const carnivalFirenze = italianClassContent("firenze");
