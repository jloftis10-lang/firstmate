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
  CONNECTING_RULE,
  MOTION_RULE,
  PORTHOLE_STEER_CORE,
  VIBRATION_RULE,
  withShipNote,
} from "./operator-rules";

/**
 * Carnival Splendor — a singleton, and not the ship people assume.
 *
 * MY RESEARCH, NOT OPERATOR-CONFIRMED. Cabin and traps are `verified: false`.
 *
 * It gets called a stretched Conquest and it isn't one. It was ordered as
 * a Costa Concordia-class hull and completed for Carnival in 2008; its
 * sisters are all Costa ships. Anyone reasoning "it's basically a
 * Conquest" gets the cabin geometry and the venue layout wrong.
 *
 * This is the only record in the fleet built partly from a primary
 * source: Carnival's own deck-plan PDF was reachable, so the deck names,
 * the tonnage and the published obstructed-cabin list below come from
 * that document rather than an aggregator. It's the closest thing to
 * operator-grade research in this repo, and it's still not a sign-off.
 *
 * Deliberately NOT encoded: the "4J picture window with obstructed view"
 * list (6201–6206, 7201–7206, 9201–9203) that circulates for this ship.
 * Category 4J does not appear in the official PDF's category list at all —
 * interiors run 4A to 4G — so that list is stale or misattributed. The
 * record publishes the 6E group the PDF actually documents.
 */

const SPLENDOR_SOURCES: Source[] = [
  {
    label: "Carnival Splendor official deck plan (PDF) — decks, categories, 6E obstructed list",
    url: "https://bum-images.s3.amazonaws.com/media/deckplaene/Carnival_Splendor.pdf",
    checked: "2026-08-18",
  },
  {
    label: "Costa Concordia-class hull completed for Carnival in 2008",
    url: "https://www.ship-technology.com/projects/carnival-splendor/",
    checked: "2026-08-18",
  },
  {
    label: "Deck 11 spa complex and Thunderball Pool over the Panorama cabins",
    url: "https://cruiseline.com/ship/carnival-splendor/decks",
    checked: "2026-08-18",
  },
];

export const carnivalSplendor: ShipContent = {
  reviewDue: "2027-02-01",
  sources: [...CARNIVAL_SOURCES, ...SPLENDOR_SOURCES],

  cabin: {
    // MY RESEARCH. Not signed off — though the deck names and the
    // obstructed list came from Carnival's own PDF rather than an
    // aggregator, which is better sourcing than the rest of the fleet.
    verified: false,
    placementNote:
      "Midship on 7 or 8 — Empress and Verandah — is the band to aim for. Above that it gets busy fast: deck 9 is the Lido and carries cabins on it, deck 10 is Panorama cabins sitting directly under the deck 11 spa complex, and deck 11 has the gym, the aerobics studio, a pool and a children's spray park all on one deck. Below, deck 2 sits under the public sandwich on 3 to 5 — the theatre spans three decks there and the dance club is on 5 — so forward and midship deck 2 is the classic under-the-nightclub cabin.",
    motionAvoid: MOTION_RULE,
    vibrationNote: VIBRATION_RULE,
    categoryWarnings: [
      "This is a Costa-built hull, not a stretched Conquest, whatever a comparison chart tells you. Don't reason about cabin geometry or venue placement from a Conquest deck plan — it's the wrong ship.",
      withShipNote(
          PORTHOLE_STEER_CORE,
          "Carnival's own plan marks the two-porthole cabins with a symbol rather than a separate category name, so read the plan, not just the category code.",
        ),
      BOTTOM_DECK_NOTE,
      "The Twister slide runs down from deck 14 and lands in the Thunderball Pool on 11. If a client is in a Panorama cabin on 10, that whole apparatus is directly overhead — it's the single noisiest position on this ship.",
    ],
    hazardsAboveBelow: [
      {
        source: "lido",
        where:
          "deck 9, which carries cabins itself — a next-door problem there as well as an overhead one for deck 8",
      },
      {
        source: "gym",
        where:
          "the deck 11 spa complex, gym and aerobics studio, directly over the Panorama cabins on 10",
      },
      {
        source: "kids",
        where:
          "the children's spray park and Thunderball Pool, also on 11 over the deck 10 cabins",
      },
      {
        source: "nightclub",
        where: "the dance club on deck 5, above the deck 2 cabins",
      },
      {
        source: "theater",
        where: "the theatre spans decks 3 to 5, over the forward deck 2 cabins",
      },
    ],
    obstructedViewNotes:
      "Carnival's own deck plan publishes one obstructed group on this ship: category 6E, the Cloud 9 Spa oceanviews on the Panorama deck — cabins 1001, 1002, 1003 and 1004. A different list naming 6201 to 6206, 7201 to 7206 and 9201 to 9203 as \"4J obstructed\" circulates online, but category 4J doesn't exist on Carnival's current plan for this ship, so treat that list as stale rather than a second set of cabins to avoid.",
    connectingNote: CONNECTING_RULE,
    minorPlacementRule: CARNIVAL_MINOR_PLACEMENT,
    elevatorNote:
      "Fourteen elevators. I couldn't establish how they split forward, midship and aft, so don't steer anyone to a bank on my say-so — pick the end of the ship where they'll actually spend the week.",
    accessibilityNote:
      "This one has a wide vertical split and it's worth taking seriously: dining and entertainment sit on decks 3 to 5, and the pools, sport deck, mini-golf and ropes course run from 9 all the way to 14. That's six to eleven decks of travel, repeated daily. For a slower traveller, book them close to an elevator and set expectations about the trip up. Wheelchair-modified staterooms are arranged through Carnival's Guest Access Services rather than the normal booking path — start that conversation early, not at final payment.",
  },

  money: CARNIVAL_MONEY,

  traps: {
    // MY RESEARCH. Not signed off.
    verified: false,
    kidAgeHeightRules: `${CARNIVAL_SLIDE_RULES} The Twister slide runs a 42-inch minimum. ${CARNIVAL_KIDS_RULES}`,
    obstructedBalconyDecks:
      "the category 6E Cloud 9 Spa oceanviews on the Panorama deck — cabins 1001 through 1004",
    embarkationNote: CARNIVAL_EMBARKATION,
    other: [
      "WaterWorks was revamped in 2024 and gained a Splashy Cove playground, so reviews and photos older than that undersell the kids' offering here. Check the date on anything you're showing a client.",
      "Neither BOLT nor SkyRide is on this ship. There is a ropes course and a nine-hole mini-golf up on the top deck, which is a different pitch — make it the right one.",
    ],
  },
};
