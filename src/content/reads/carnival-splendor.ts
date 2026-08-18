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
  PORTHOLE_STEER,
  QUIET_DEFAULT_RULE,
  VIBRATION_RULE,
} from "./operator-rules";

/**
 * Carnival Splendor — a singleton, and not the ship people assume.
 *
 * SIGNED OFF by Jimmy, 2026-08-18.
 *
 * It gets called a stretched Conquest and it isn't one: it was ordered as
 * a Costa Concordia-class hull and completed for Carnival in 2008, and
 * its sisters are all Costa ships. Reasoning from a Conquest deck plan
 * gets the geometry wrong.
 *
 * Corrections from his pass:
 *   - Quiet default is deck 7 midship, not 7 or 8. Deck 8 needs the
 *     overhead check because deck 9 becomes Lido and public space.
 *   - The obstructed spa cabins 1001 to 1004 are category **6S**, not 6E
 *     as I had recorded, and the obstruction is an outdoor walkway the
 *     window faces rather than something unspecified.
 *   - Those four are NOT the whole obstruction model. Splendor also
 *     carries the 4J interior-with-picture-window walkway-view category.
 */

const SPLENDOR_SOURCES: Source[] = [
  {
    label:
      "Carnival Splendor deck plan (PDF) — deck geometry and the 4J walkway-view category",
    url: "https://www.carnival.com/-/media/fe744bd55791448e9ccf182c6bc7ee7b.ashx",
    checked: "2026-08-18",
  },
  {
    label:
      "Cloud 9 Spa staterooms — 1001 to 1004 are category 6S, obstructed by an outdoor walkway",
    url: "https://help.goccl.com/app/answers/detail/a_id/1551/~/carnival-splendor-%28sl%29-cloud-9-spa-staterooms-and-amenities",
    checked: "2026-08-18",
  },
  {
    label: "Green Lightning waterslide — listed on Splendor",
    url: "https://www.carnival.com/onboard/green-lightning-waterslide",
    checked: "2026-08-18",
  },
];

/**
 * Deck 7 midship. Deck 8 fails the test because deck 9 above it turns
 * into Lido and public space.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-18). Read off Carnival's deck
 * geometry, not a Carnival recommendation.
 */
const SPLENDOR_QUIET_DEFAULT = `Midship on deck 7. ${QUIET_DEFAULT_RULE} Deck 8 is a perfectly good cabin deck but needs the overhead check — deck 9 above it becomes Lido and public territory. From 9 upward it only gets more mixed: 9, 10 and 11 increasingly put cabins alongside the Lido, the Panorama deck, the spa and the recreation areas.`;

export const carnivalSplendor: ShipContent = {
  reviewDue: "2027-02-01",
  sources: [...CARNIVAL_SOURCES, ...SPLENDOR_SOURCES],

  cabin: {
    // Signed off by Jimmy, 2026-08-18.
    verified: true,
    placementNote: SPLENDOR_QUIET_DEFAULT,
    motionAvoid: MOTION_RULE,
    vibrationNote: VIBRATION_RULE,
    categoryWarnings: [
      "This is a Costa-built hull, not a stretched Conquest, whatever a comparison chart tells you. Don't reason about cabin geometry or venue placement from a Conquest deck plan — it's the wrong ship.",
      PORTHOLE_STEER,
      BOTTOM_DECK_NOTE,
      "The Twister slide runs down from the top deck and lands in the pool on 11. If a client is in a Panorama cabin on 10, that whole apparatus is overhead — it's the noisiest position on this ship.",
    ],
    hazardsAboveBelow: [
      {
        source: "lido",
        where:
          "deck 9 and upward, with cabins increasingly mixed in alongside rather than sitting cleanly below",
      },
      {
        source: "gym",
        where:
          "the deck 11 spa and fitness complex, over the Panorama cabins on 10",
      },
      {
        source: "kids",
        where: "the children's spray park and pool, also on 11 above deck 10",
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
      "Two different things, and the record used to have only one of them. The Cloud 9 Spa ocean views 1001, 1002, 1003 and 1004 up on the Panorama deck are category 6S sold as obstructed — the window looks onto an outdoor walkway, which means people as well as a blocked view. Separately, Splendor carries the 4J interior-with-picture-window walkway-view category, which is the same kind of problem in a different category code. So read the code on the specific cabin; those four spa rooms are not the whole picture.",
    obstructionKinds: ["outdoor-walkway"],
    connectingNote: CONNECTING_RULE,
    minorPlacementRule: CARNIVAL_MINOR_PLACEMENT,
    elevatorNote:
      "Fourteen elevators. I couldn't establish how they split forward, midship and aft, so don't steer anyone to a bank on my say-so — pick the end of the ship where they'll actually spend the week.",
    accessibilityNote:
      "Wide vertical split on this one and it's worth taking seriously: dining and entertainment sit on decks 3 to 5, and the pools, sport deck, mini-golf and ropes course run from 9 up to 14. That's six to eleven decks of travel, repeated daily. Book them close to an elevator and set the expectation about the trip up. Wheelchair-modified staterooms go through Carnival's Guest Access Services rather than the normal booking path — start that early, not at final payment.",
  },

  money: CARNIVAL_MONEY,

  traps: {
    // Signed off by Jimmy, 2026-08-18.
    verified: true,
    kidAgeHeightRules: `${CARNIVAL_SLIDE_RULES} The Twister slide runs a 42-inch minimum. ${CARNIVAL_KIDS_RULES}`,
    obstructedBalconyDecks:
      "the category 6S Cloud 9 Spa ocean views 1001 to 1004 on the Panorama deck, plus the 4J walkway-view interiors wherever they sit",
    embarkationNote: CARNIVAL_EMBARKATION,
    other: [
      "Green Lightning is this ship's own waterslide and Carnival lists it here specifically — worth naming rather than describing the water offering generically, because it's a reason to pick this hull over a sister that doesn't have it.",
      "WaterWorks was revamped in 2024 and gained a Splashy Cove playground, so reviews and photos older than that undersell the kids' offering. Check the date on anything you're showing a client.",
      "Neither BOLT nor SkyRide is on this ship. There is a ropes course and a nine-hole mini-golf up top, which is a different pitch — make it the right one.",
    ],
  },
};
