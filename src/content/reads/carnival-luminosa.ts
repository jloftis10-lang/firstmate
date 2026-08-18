import type { ShipContent, Source } from "@/lib/types";
import {
  CARNIVAL_EMBARKATION,
  CARNIVAL_KIDS_RULES,
  CARNIVAL_MINOR_PLACEMENT,
  CARNIVAL_MONEY,
  CARNIVAL_SOURCES,
} from "./carnival-common";
import {
  BOTTOM_DECK_NOTE,
  CONNECTING_RULE,
  MOTION_RULE,
  QUIET_DEFAULT_RULE,
  VIBRATION_RULE,
} from "./operator-rules";

/**
 * Carnival Luminosa — its own file, because it's its own thing.
 *
 * SIGNED OFF by Jimmy, 2026-08-18.
 *
 * Built as Costa Luminosa in 2009 to a Vista/Spirit hybrid design and
 * transferred in 2022. It is routinely listed as Spirit class and is not
 * one, and it is NOT the ex-Costa Deliziosa either. Both errors are
 * common enough that the catalog carried the second one until this workup.
 *
 * The trap that matters most: **no waterslides.** Carnival's current
 * WaterWorks availability doesn't include this ship and its deck plan
 * shows pools and Serenity areas with no slide installation. No mini-golf
 * either. A family choosing it expecting the usual Carnival kids' deck
 * needs to know before booking, not at sea.
 *
 * Corrections from his pass:
 *   - Cabins are on deck 1 as well. I had "decks 4 to 8", which misses a
 *     whole cabin deck. Decks 2 and 3 are public-heavy, then accommodation
 *     resumes on 4 through 8.
 *   - The quiet default is decks 5 to 7 midship. Deck 4 needs a check
 *     below it because deck 3 is public; deck 8 needs the Lido-above check.
 *   - There are TWO obstructed categories, not one: 4J interior with
 *     picture window, and 4K interior with window. My record had only 4K.
 *     The four cabins I listed do belong to 4K, so they stay — they just
 *     aren't the whole set.
 *
 * Deliberately still researched rather than verified: what physically
 * causes each obstruction. Carnival names the categories; nobody has
 * published cabin-by-cabin wording tying individual rooms to lifeboats or
 * structure, so the record doesn't invent it.
 *
 * On the "only ship in the fleet without a waterslide" framing — Jimmy's
 * instruction was to state the concrete fact rather than market the
 * uniqueness, because fleet amenities change at refit and that claim
 * would quietly rot. The record says what this ship has and hasn't got.
 */

const LUMINOSA_SOURCES: Source[] = [
  {
    label:
      "Carnival Luminosa deck plan (PDF) — cabins on deck 1 and 4-8, 4J and 4K obstructed categories",
    url: "https://www.carnival.com/-/media/4f1f5be57837446a82fd902eeb2aade2.ashx",
    checked: "2026-08-18",
  },
  {
    label: "Cabin 4282 listed as a 4K inside stateroom",
    url: "https://gangwaze.com/cruise-lines/carnival-cruise-lines/carnival-luminosa/cabins/4282",
    checked: "2026-08-18",
  },
  {
    label: "WaterWorks availability — Luminosa does not appear",
    url: "https://www.carnival.com/onboard/waterworks",
    checked: "2026-08-18",
  },
  {
    label: "Mini-golf availability — Luminosa does not appear",
    url: "https://www.carnival.com/onboard/mini-golf",
    checked: "2026-08-18",
  },
  {
    label: "Built as Costa Luminosa, a Vista/Spirit hybrid — not ex-Deliziosa",
    url: "https://en.wikipedia.org/wiki/Carnival_Luminosa",
    checked: "2026-08-18",
  },
];

/**
 * Decks 5 to 7 midship. Deck 4 fails below (deck 3 is public) and deck 8
 * fails above (Lido on 9).
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-18). Deterministic inference from
 * Carnival's official plan, not an operator recommendation.
 */
const LUMINOSA_QUIET_DEFAULT = `Midship on decks 5, 6 or 7. ${QUIET_DEFAULT_RULE} Deck 4 needs a check below it because deck 3 is public space, and deck 8 needs the Lido-above check. The three in the middle are the clean band.`;

export const carnivalLuminosa: ShipContent = {
  reviewDue: "2027-02-01",
  sources: [...CARNIVAL_SOURCES, ...LUMINOSA_SOURCES],

  cabin: {
    // Signed off by Jimmy, 2026-08-18.
    verified: true,
    placementNote: `${LUMINOSA_QUIET_DEFAULT} The cabin decks are 1, then 4 through 8 — deck 1 carries accommodation too, which is easy to miss, and decks 2 and 3 are public-heavy in between. Deck 9 is the Lido and sits cleanly above deck 8 rather than carrying cabins itself, so deck 8 gets the straightforward pool-overhead scan.`,
    motionAvoid: MOTION_RULE,
    vibrationNote: VIBRATION_RULE,
    categoryWarnings: [
      "This is a European-built hull and the cabins show it — they run larger than the fleet average, with more storage and noticeably better soundproofing. That's a genuine selling point on a ship that's otherwise showing its age, and it's the thing to lead with.",
      "Check the balcony railing before you promise a view. Some cabins here have solid metal railings rather than clear panels, which means a seated client sees metal. It's per-cabin, so it needs the deck plan rather than a rule.",
      "The Cloud 9 Spa cabins are the old Costa Samsara spa cabins renamed. Same location, same rooms — it was a rebrand rather than a rebuild, so don't sell spa perks off what those cabins earn on a newer ship. Check what's actually included on this sailing.",
      BOTTOM_DECK_NOTE,
    ],
    hazardsAboveBelow: [
      {
        source: "lido",
        where:
          "deck 9, directly over the deck 8 cabins — pool, buffet and spa all on that one deck",
      },
      {
        source: "buffet",
        where: "the Lido Marketplace on deck 9, over the same deck 8 cabins",
      },
      {
        source: "nightclub",
        where:
          "the nightclub spanning decks 2 and 3, under the forward deck 4 cabins",
      },
      {
        source: "theater",
        where: "the theatre also spans 2 and 3, below the deck 4 cabins",
      },
      {
        source: "gym",
        where: "the fitness centre on deck 10, above the spa cabins on 8",
      },
    ],
    obstructedViewNotes:
      "Two published categories, not one: 4J is an interior with a picture window sold as obstructed, and 4K is an interior with a window sold as obstructed. Confirmed 4K examples include 4282, 4288, 4296 and 4302 on deck 4 — but those are examples from one of the two categories, not the whole set, so read the code on the specific cabin. What physically does the blocking isn't published cabin-by-cabin, so I'm not going to tell you it's lifeboats when nobody has written that down.",
    connectingNote: CONNECTING_RULE,
    minorPlacementRule: CARNIVAL_MINOR_PLACEMENT,
    accessibilityNote:
      "A compressed stack — entertainment on 2 and 3, cabins on 1 and 4 to 8, everything outdoors on 9 to 11 — so less of the Excel-class problem where dining and the pool sit eight decks apart. I found two irreconcilable elevator counts for this ship and no reliable bank layout, so check the deck plan for the specific cabin rather than trusting a rule, and confirm scooter clearance against Carnival's accessible deck plan.",
  },

  money: CARNIVAL_MONEY,

  traps: {
    // Signed off by Jimmy, 2026-08-18.
    verified: true,
    kidAgeHeightRules: `There are no waterslides on this ship, so the usual height conversation doesn't come up — the conversation to have instead is that there's no waterpark at all. ${CARNIVAL_KIDS_RULES}`,
    obstructedBalconyDecks:
      "the 4J and 4K obstructed interior categories, with 4282, 4288, 4296 and 4302 as confirmed 4K examples on deck 4",
    embarkationNote: CARNIVAL_EMBARKATION,
    other: [
      "Carnival Luminosa has no waterslides and no mini-golf. Neither appears on Carnival's current availability lists for this ship. A family choosing it for the usual Carnival kids' deck experience needs to hear that before deposit — there's a putting green, a sports court and a jogging track instead.",
      "Neither BOLT nor SkyRide nor a ropes course is here either. The thrill inventory on this hull is genuinely thin by Carnival standards, and that's a positioning fact rather than a fault.",
      "The covered midships pool under a sliding glass dome is the thing this ship has that almost nothing else in the fleet does — it makes a cold-weather or shoulder-season itinerary work far better than it would elsewhere. Worth leading with when the itinerary is Alaska or a repositioning.",
      "It came over from Costa in 2022 as a rebrand rather than a rebuild, and reviews note the ex-Costa systems and finishes showing their age. Set the expectation that this is an older ship with good bones, not a refreshed one.",
    ],
  },
};
