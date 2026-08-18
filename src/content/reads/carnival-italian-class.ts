import type { ShipContent, Source } from "@/lib/types";
import {
  AQUA_TUNNEL_TALL_RULES,
  CARNIVAL_EMBARKATION,
  CARNIVAL_KIDS_RULES,
  CARNIVAL_MINOR_PLACEMENT,
  CARNIVAL_MONEY,
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
 * Venezia and Firenze — the "Fun Italian Style" hulls, built as Costa
 * Venezia (2019) and Costa Firenze (2021) and transferred in 2023 and 2024.
 *
 * MY RESEARCH, NOT OPERATOR-CONFIRMED. Cabin and traps are `verified: false`.
 *
 * These are the two ships in the fleet where an advisor's Carnival
 * instincts are most likely to be wrong, and the reasons are all
 * heritage: the category names don't map (Terrazza, not Havana; there's a
 * "Small Interior"), the pool deck is small and covered, the casino is
 * laid out for smokers, and the bathrooms have glass doors instead of the
 * curtain. None of that is a defect — it's a different product wearing a
 * familiar funnel, and the mismatch is what generates the complaint.
 *
 * Firenze has very little independently published detail. Almost
 * everything in circulation about it is inferred from Venezia. Where a
 * claim below is Venezia-sourced it says so rather than quietly covering
 * both hulls.
 *
 * Deliberately NOT encoded:
 *   - SkyRide. Two Carnival-adjacent sources conflict: one SportSquare
 *     table appears to list it for these ships, another says it's a
 *     Vista-class exclusive. The traps block warns not to promise it
 *     rather than resolving a conflict I can't resolve.
 *   - the elevator bank split. Venezia's total (16) surfaced, the split
 *     didn't, and Firenze's total didn't either.
 *   - Firenze's obstructed-cabin list. Venezia's surfaced; Firenze's
 *     didn't, and sistership inference is not a cabin number.
 */

const ITALIAN_SOURCES: Source[] = [
  {
    label: "Venezia deck plans — cabins on decks 10, 11 and 12 with the pools",
    url: "https://www.cruisemapper.com/deckplans/Carnival-Venezia-1651",
    checked: "2026-08-18",
  },
  {
    label: "Firenze deck 12 — 33 staterooms alongside WaterWorks and mini-golf",
    url: "https://gangwaze.com/cruise-lines/carnival-cruise-lines/carnival-firenze/deck-plans/deck-12",
    checked: "2026-08-18",
  },
  {
    label: "Venezia obstructed oceanviews on deck 3, and balconies 9205/9206",
    url: "https://www.cruisedeckplans.com/ships/category-detail.php?c=3486",
    checked: "2026-08-18",
  },
  {
    label: "Aqua Tunnel is 51 inches on Venezia and Firenze, 42 elsewhere",
    url: "https://help.carnival.com/app/answers/detail/a_id/1122/~/policies-for-shipboard-water-sports",
    checked: "2026-08-18",
  },
  {
    label: "Venezia's destination-dispatch elevators",
    url: "https://www.cruisehive.com/carnival-cruise-line-provides-insight-on-new-elevator-usage/124525",
    checked: "2026-08-18",
  },
  {
    label: "Terrazza replaces Havana; Venezia cabin categories",
    url: "https://cruiseradio.net/carnival-venezia-cabins-suites-complete-guide/",
    checked: "2026-08-18",
  },
];

/** Gondola Glide carries the same tall minimum as the Aqua Tunnel. */
const GONDOLA_GLIDE_RULES =
  "The Gondola Glide also runs 51 inches and caps at 300 pounds, so on these two ships a child who clears the slides everywhere else in the fleet can still be turned away here.";

function italianClassContent(ship: "venezia" | "firenze"): ShipContent {
  const isVenezia = ship === "venezia";

  return {
    reviewDue: "2027-02-01",
    sources: [...CARNIVAL_SOURCES, ...ITALIAN_SOURCES],

    cabin: {
      // MY RESEARCH. Not signed off.
      verified: false,
      placementNote:
        "Midship, and lower than instinct says. Cabins are spread across twelve of the fourteen decks here, and — this is the part that catches people — the pool decks carry cabins too. Decks 10, 11 and 12 all mix staterooms in with the pools, the sports court, WaterWorks and the ropes course, so booking high on this ship books them into the middle of the noise rather than above it. Deck 5 is the other one to check: it carries cabins along the promenade with the theatre and the lounges. Decks 6 to 8 midship are the quiet band.",
      motionAvoid: MOTION_RULE,
      vibrationNote: VIBRATION_RULE,
      categoryWarnings: [
        "The category names don't match the rest of Carnival. Terrazza is what Havana is elsewhere — the same private-area idea under a different name — and there's a Small Interior category that has no equivalent on a Carnival-built ship. Interiors start around 150 square feet. Read the category description here rather than assuming you know it from the code.",
        PORTHOLE_STEER,
        BOTTOM_DECK_NOTE,
        "Third-party deck plans for this hull are unreliable. Costa's original deck numbering still circulates alongside Carnival's, and at least one big deck-plan site publishes decks numbered into the twenties for this ship. Work from Carnival's own plan, not a search result, or you'll place someone on a deck that doesn't exist.",
        "Bathrooms have glass shower doors rather than the curtain the rest of the fleet uses. It's a small thing that reads as an upgrade — worth mentioning to a client who's sailed Carnival before.",
      ],
      hazardsAboveBelow: [
        {
          source: "lido",
          where:
            "deck 10, which carries cabins itself — so it's a next-door problem there as much as an overhead one",
        },
        {
          source: "kids",
          where:
            "WaterWorks and the ropes course on deck 12, over the deck 11 cabins, with Camp Ocean on 11 alongside them",
        },
        {
          source: "sports",
          where: "the sports court and jogging track on decks 11 and 12",
        },
        {
          source: "theater",
          where:
            "the theatre spans decks 4 and 5, and deck 5 carries cabins along the same corridor",
        },
        {
          source: "nightclub",
          where:
            "the late-night comedy and dancing lounge on deck 4, below the deck 5 cabins",
        },
      ],
      obstructedViewNotes: isVenezia
        ? "Two separate groups on Venezia. The deck 3 oceanviews are the bigger one — 3219, 3221, 3222, 3225, 3226, 3229, 3230, 3233, 3234, 3237, 3238 and 3242 are sold as obstructed, with the lifeboat deck sitting on 4 above them. Separately, balconies 9205 and 9206 are standard balconies with an obstructed view. Confirm on the booking screen; this came from a deck-plan aggregator rather than Carnival's own sheet."
        : "No obstruction list surfaced for Firenze specifically. Venezia's is documented — a band of deck 3 oceanviews under the deck 4 lifeboats, plus balconies 9205 and 9206 — and these are near-sisters, so check the same positions. I'm not claiming the same cabins are affected here, because nobody has published that.",
      connectingNote: CONNECTING_RULE,
      minorPlacementRule: CARNIVAL_MINOR_PLACEMENT,
      elevatorNote: isVenezia
        ? "Sixteen elevators, and they're destination-dispatch — you pick your deck on a touchscreen in the lobby and it assigns you a car, with no buttons inside. That's worth warning about in advance for anyone who finds new systems stressful, and it changes how you'd brief a client who expects to just press a button. I couldn't establish how the banks split forward, midship and aft."
        : "I couldn't establish the elevator count or the bank split for this hull. Venezia uses destination-dispatch elevators — you pick a deck on a lobby touchscreen instead of pressing a button in the car — and it's worth checking whether this ship does too before you brief a nervous traveller.",
      accessibilityNote:
        "The dining and theatre core sits on decks 4 and 5 and the outdoor attractions run 11 and 12, so there's a real vertical trip in the day even though cabins are interleaved through the middle. On Venezia, factor the destination-dispatch elevators into the brief — a system that assigns you a car is harder to improvise with if someone is slow to board. Confirm scooter clearance against Carnival's accessible deck plan as usual.",
    },

    money: CARNIVAL_MONEY,

    traps: {
      // MY RESEARCH. Not signed off.
      verified: false,
      kidAgeHeightRules: `${AQUA_TUNNEL_TALL_RULES} ${GONDOLA_GLIDE_RULES} ${CARNIVAL_SLIDE_RULES} ${CARNIVAL_KIDS_RULES}`,
      ...(isVenezia
        ? {
            obstructedBalconyDecks:
              "the deck 3 oceanviews under the lifeboat deck (3219 through 3242 on the published list), plus balconies 9205 and 9206",
          }
        : {}),
      embarkationNote: CARNIVAL_EMBARKATION,
      other: [
        "This is an Italian-concept ship, not a standard Carnival one, and that's the expectation to set before they board. The pool deck is small by Carnival standards with far less lounger space, the main pool is covered, and sail-away is a more subdued affair. A client who booked it expecting the usual Carnival deck party will be disappointed by something that isn't a fault.",
        "The Guy's Burger and BlueIguana counters a repeat Carnival client will look for aren't here — the food concepts were replaced with Italian equivalents. Name the venues that are actually onboard rather than letting them assume.",
        "The casino is laid out around smoking, with only a small non-smoking alternative. If anyone in the party is sensitive to it, that's worth raising before deposit rather than at the pier.",
        "Don't promise SkyRide on this ship. Sources conflict on whether these two have it, and I couldn't resolve it — check the ship's own page before you say either way.",
        "Neither BOLT nor a Carnival-built waterpark layout applies here. The ropes course is real on both, and Firenze's is branded SkyCourse.",
      ],
    },
  };
}

export const carnivalVenezia = italianClassContent("venezia");
export const carnivalFirenze = italianClassContent("firenze");
