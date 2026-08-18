import type { ShipContent, Source } from "@/lib/types";
import {
  CARNIVAL_EMBARKATION,
  CARNIVAL_KIDS_RULES,
  CARNIVAL_MINOR_PLACEMENT,
  CARNIVAL_MONEY,
  CARNIVAL_SOURCES,
} from "./carnival-common";

/**
 * Carnival Luminosa — its own file, because it's its own thing.
 *
 * MY RESEARCH, NOT OPERATOR-CONFIRMED. Cabin and traps are `verified: false`.
 *
 * Built as Costa Luminosa in 2009 to a Vista/Spirit hybrid design and
 * transferred in 2022. It is routinely listed as Spirit class and is not
 * one — it's larger in tonnage and beam than the four real Spirit hulls —
 * and it is NOT the ex-Costa Deliziosa, which is a near-sister still with
 * Costa. Both errors are common enough that the catalog carried the
 * second one until this workup.
 *
 * The single most important fact about this ship for an advisor:
 * **it has no waterslides at all.** Not a small waterpark — none. It
 * appears to be the only hull in the Carnival fleet like that, and a
 * family booking it off a Carnival brochure will find that out at sea.
 *
 * The layout news is better than the Italian hulls: cabins sit on decks 4
 * to 8 and the Lido is on 9, cleanly above the top cabin deck. That's the
 * Spirit-class pattern, not the Conquest one.
 *
 * Deliberately NOT encoded:
 *   - the elevator count. Two figures surfaced, 15 and 12, and nothing
 *     reconciles them. The 4-forward / 7-midship / 4-aft split came from
 *     the 15 source alone, so it goes too.
 *   - the exact number of cabin decks. The category data shows five
 *     (4 through 8); one snippet said six. The record describes the range
 *     the category data supports and doesn't claim a count.
 */

const LUMINOSA_SOURCES: Source[] = [
  {
    label: "Luminosa cabin categories by deck — staterooms on decks 4 to 8",
    url: "https://www.cruisedeckplans.com/ships/Carnival-Luminosa",
    checked: "2026-08-18",
  },
  {
    label: "Deck-by-deck venues — Lido on 9, nightclub and theater on 2 and 3",
    url: "https://cruiseline.com/ship/carnival-luminosa/decks",
    checked: "2026-08-18",
  },
  {
    label: "Category 4K obstructed interior-with-window, deck 4 lifeboats",
    url: "https://www.icruise.com/cabins/carnival-cruises-carnival-luminosa-cabin-4288.html",
    checked: "2026-08-18",
  },
  {
    label: "Solid metal balcony railings on some cabins; Costa-build cabin size",
    url: "https://www.cruisecritic.com/cruise/carnival/carnival-luminosa/cabins",
    checked: "2026-08-18",
  },
  {
    label: "Built as Costa Luminosa, a Vista/Spirit hybrid — not ex-Deliziosa",
    url: "https://en.wikipedia.org/wiki/Carnival_Luminosa",
    checked: "2026-08-18",
  },
];

export const carnivalLuminosa: ShipContent = {
  reviewDue: "2027-02-01",
  sources: [...CARNIVAL_SOURCES, ...LUMINOSA_SOURCES],

  cabin: {
    // MY RESEARCH. Not signed off.
    verified: false,
    placementNote:
      "Midship on 6 or 7. Cabins sit on decks 4 to 8 and the Lido is on 9, cleanly above the top cabin deck rather than mixed in with it — so unlike most of the fleet, the pool really is overhead here, and deck 8 is where it lands. Deck 4 is the other end of the same problem: it sits directly over the theatre and the nightclub on 3. The middle of that five-deck band is genuinely the quiet part, which is a cleaner answer than most Carnival hulls give you.",
    motionAvoid:
      "Push hard for midship. Extreme forward is the one to rule out; extreme aft is a negative when there's comparable midship inventory, and more so if vibration also matters to them.",
    vibrationNote:
      "Lower decks are generally better for motion, not worse — closer to the waterline. The catch is vibration: a low cabin at the back can still pick up the propulsion, so \"go low\" isn't automatically the right call for a sensitive traveller.",
    categoryWarnings: [
      "This is a European-built hull and the cabins show it — they run larger than the fleet average, with more storage and noticeably better soundproofing. That's a genuine selling point on a ship that's otherwise showing its age, and it's the thing to lead with.",
      "Check the balcony railing before you promise a view. Some cabins here have solid metal railings rather than the clear panels, which means a seated client sees metal. It's per-cabin, so it needs the deck plan rather than a rule.",
      "The Cloud 9 Spa cabins are the old Costa Samsara spa cabins renamed. Same location forward on deck 8, same rooms — but it was a rebrand rather than a rebuild, so don't sell spa perks off what those cabins earn on a newer ship. Check what's actually included on this sailing.",
      "Deck 4 is the lowest cabin deck and it sits over the theatre and the nightclub. If they want cheap, fine — but not forward on 4, and not if they're light sleepers.",
    ],
    hazardsAboveBelow: [
      {
        source: "lido",
        where:
          "deck 9, directly over the deck 8 cabins — the pool, the buffet and the spa all sit on that one deck",
      },
      {
        source: "buffet",
        where: "the Lido Marketplace on deck 9, over the same deck 8 cabins",
      },
      {
        source: "nightclub",
        where:
          "the Altair nightclub spans decks 2 and 3, under the forward deck 4 cabins",
      },
      {
        source: "theater",
        where: "the theatre also spans 2 and 3, below the deck 4 cabins",
      },
      {
        source: "gym",
        where:
          "the fitness centre on deck 10, above the spa cabins forward on 8",
      },
    ],
    obstructedViewNotes:
      "There's a real published category for it here: 4K, an interior with a window, on deck 4 — floor-to-ceiling glass with a lifeboat in front of it. Confirmed examples are 4282, 4288, 4296 and 4302, and that isn't the full list. The category name is the giveaway, so read the code rather than the deck.",
    connectingNote:
      "Never read connecting status off the category or off two cabin numbers being next to each other — only an explicit connecting pair counts.",
    minorPlacementRule: CARNIVAL_MINOR_PLACEMENT,
    accessibilityNote:
      "A compressed stack — entertainment on 2 and 3, cabins on 4 to 8, everything outdoors on 9 to 11 — so there's less of the Excel-class problem where dining and the pool sit eight decks apart. I found two irreconcilable elevator counts for this ship and no reliable bank layout, so check the deck plan for the specific cabin rather than trusting a rule, and confirm scooter clearance against Carnival's accessible deck plan.",
  },

  money: CARNIVAL_MONEY,

  traps: {
    // MY RESEARCH. Not signed off.
    verified: false,
    kidAgeHeightRules: `There are no waterslides on this ship, so the usual height conversation doesn't apply — the conversation to have instead is that there's no waterpark at all. ${CARNIVAL_KIDS_RULES}`,
    obstructedBalconyDecks:
      "the 4K interior-with-window cabins on deck 4, where a lifeboat sits in front of the glass",
    embarkationNote: CARNIVAL_EMBARKATION,
    other: [
      "No waterslides. Not a small waterpark — none at all, and as far as I can tell this is the only Carnival ship you can say that about. There's a putting green, a sports court and a jogging track instead. If a family is booking Carnival for the waterpark, this is the wrong ship and they need to hear it before deposit.",
      "Neither BOLT nor SkyRide nor a ropes course is here either. The thrill inventory on this hull is genuinely thin by Carnival standards.",
      "The covered midships pool under a sliding glass dome is the thing this ship has that almost nothing else in the fleet does — it makes a cold-weather or shoulder-season itinerary work far better than it would elsewhere. Worth leading with when the itinerary is Alaska or a repositioning.",
      "It came over from Costa in 2022 as a rebrand rather than a rebuild, and reviews note the ex-Costa systems and finishes showing their age. Set the expectation that this is an older ship with good bones, not a refreshed one.",
    ],
  },
};
