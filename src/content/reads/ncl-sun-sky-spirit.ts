import type { ShipContent, Source } from "@/lib/types";
import {
  NCL_EMBARKATION,
  NCL_FLEET_TRAPS,
  NCL_FREESTYLE,
  NCL_KIDS_RULES,
  NCL_MINOR_PLACEMENT,
  NCL_MONEY,
  NCL_SOURCES,
} from "./ncl-common";

/**
 * The three NCL singletons: Sun (2001), Sky (1999), Spirit (1998).
 *
 * MY RESEARCH, NOT OPERATOR-CONFIRMED. Cabin and traps are `verified: false`.
 *
 * These are the smallest, oldest hulls in the fleet and each came from a
 * different place, so they get a shared file but not a shared rule:
 *
 *   - **Sun** — the pool deck carries cabins. Deck 11 has staterooms
 *     sharing space with the pools and the gym, and deck 12 above holds
 *     the sports court, the golf net, the Spinnaker Lounge and four
 *     specialty restaurants. Deck 11 is sandwiched from both sides.
 *   - **Sky** — began life as Costa Olympia, abandoned half-built when
 *     the yard collapsed, bought by NCL and redesigned with two extra
 *     cabin decks. She launched with 812 staterooms and ZERO balconies.
 *     The 245 balconies she has now were retrofitted, and the cabin mix
 *     is still unusually weighted to insides and oceanviews.
 *   - **Spirit** — built as SuperStar Leo for Star Cruises. The Asian
 *     heritage still shows in the small standard cabins, most of them
 *     150 to 170 square feet, which is tight even for a 1998 ship.
 *
 * NONE OF THE THREE HAS A HAVEN. NCL's own Haven page doesn't list them.
 * Some booking screens still surface Haven wording for Sun, which is a
 * conflict worth resolving per booking rather than assuming either way.
 * The top accommodation is an Owner's Suite.
 *
 * Deliberately NOT encoded: obstructed cabin numbers, since none are
 * published for any of the three; any motion claim, since nothing is
 * documented and these are exactly the hulls where inferring from
 * tonnage would be tempting and wrong; and whether Spirit skips a deck
 * number, which I could not confirm.
 */

const SINGLETON_SOURCES: Source[] = [
  {
    label: "Sun deck 11 — cabins sharing the deck with the pools and gym",
    url: "https://www.cruisemapper.com/deckplans/Norwegian-Sun-735/deck11-1236",
    checked: "2026-08-18",
  },
  {
    label: "Sky deck 11 is Lido with no cabins; deck 10 is the top cabin deck",
    url: "https://www.cruisemapper.com/deckplans/Norwegian-Sky-543/deck11-108",
    checked: "2026-08-18",
  },
  {
    label: "Sky's Costa Olympia origin — launched with no balconies at all",
    url: "https://www.cruisemapper.com/ships/Norwegian-Sky-543",
    checked: "2026-08-18",
  },
  {
    label: "Spirit deck 12 is Lido with no cabins; deck 11 is the top cabin deck",
    url: "https://www.cruisemapper.com/deckplans/Norwegian-Spirit-702/deck12-1019",
    checked: "2026-08-18",
  },
  {
    label: "Spirit's $100M 2020 refit — 16 cabins added, Spice H2O replaces the kids' park",
    url: "https://www.nclhltd.com/news-media/press-releases/detail/284",
    checked: "2026-08-18",
  },
  {
    label: "The Haven ship list — none of these three appear",
    url: "https://www.ncl.com/staterooms/the-haven",
    checked: "2026-08-18",
  },
];

const NO_HAVEN =
  "There is no Haven on this ship. NCL's own Haven page doesn't list it, and the top accommodation is an Owner's Suite. Some booking screens have been seen surfacing Haven wording anyway — if that happens, resolve it before you promise anything, because there's no private complex here to deliver.";

function sunContent(): ShipContent {
  return {
    reviewDue: "2027-02-01",
    sources: [...NCL_SOURCES, ...SINGLETON_SOURCES],

    cabin: {
      verified: false,
      placementNote:
        "Midship on 9 or 10. Deck 11 is the one to steer off on this ship, and it's squeezed from both directions: it carries cabins alongside the pools and the gym on its own deck, and deck 12 directly above holds the basketball and volleyball court, the golf net, the Spinnaker Lounge and four specialty restaurants. That's a genuinely bad sandwich. Cabins run decks 4 to 11.",
      motionAvoid:
        "Push hard for midship. Extreme forward is the one to rule out; extreme aft is a negative when there's comparable midship inventory, and more so if vibration also matters to them. Nothing is documented about how this hull rides and I'm not going to infer it from the tonnage.",
      vibrationNote:
        "Lower decks are generally better for motion, not worse — closer to the waterline. The catch is vibration: a low cabin at the back can still pick up the propulsion, so \"go low\" isn't automatically the right call for a sensitive traveller.",
      categoryWarnings: [
        "Deck 11 is the trap here. It looks like a good high deck with balconies, and it has a sports court and four restaurants directly overhead plus the pools and the gym on its own level. If a client wants quiet, put them on 9 or 10 midship instead.",
        "There are no purpose-built solo studios on this ship.",
      ],
      hazardsAboveBelow: [
        {
          source: "sports",
          where:
            "the basketball and volleyball court and the golf net on deck 12, directly over the deck 11 cabins",
        },
        {
          source: "lido",
          where: "the pools on deck 11, on the same deck as those cabins",
        },
        { source: "gym", where: "also on deck 11, alongside the cabins" },
        {
          source: "restaurant-quiet",
          where: "four specialty restaurants on deck 12, above deck 11",
        },
      ],
      obstructedViewNotes:
        "No obstructed-cabin list is published for this ship. NCL's generic guarantee language covers it — views may be fully obstructed, partially obstructed, porthole or picture window — which is a warning about guarantee bookings rather than a list of cabins. Pick the cabin rather than taking a guarantee if the view matters.",
      connectingNote:
        "Never read connecting status off the category or off two cabin numbers being next to each other — only an explicit connecting pair counts.",
      minorPlacementRule: NCL_MINOR_PLACEMENT,
      elevatorNote:
        "Around eight lifts. I couldn't establish the bank layout or find congestion reports.",
      accessibilityNote:
        "A small ship, so distances are short — but only about eight lifts, and the busiest cabin deck is the one wedged between the pools and the sports deck. Put a slower traveller lower and midship rather than high, and confirm the accessible deck plan for the specific cabin.",
    },

    money: NCL_MONEY,

    traps: {
      verified: false,
      kidAgeHeightRules: NCL_KIDS_RULES,
      embarkationNote: NCL_EMBARKATION,
      other: [
        NO_HAVEN,
        "The absence list: no go-karts, no Waterfront, no Ocean Boulevard, no ropes course, no laser tag, no big waterslide complex. There is a forward observation lounge — the Spinnaker, up on 12 — so the ship isn't short of a view bar.",
        NCL_FREESTYLE,
        ...NCL_FLEET_TRAPS,
      ],
    },
  };
}

function skyContent(): ShipContent {
  return {
    reviewDue: "2027-02-01",
    sources: [...NCL_SOURCES, ...SINGLETON_SOURCES],

    cabin: {
      verified: false,
      placementNote:
        "Midship on 8 or 9. Cabins run decks 4 to 10, and deck 11 is a pure Lido deck with no staterooms — pools, the Garden Café, the outdoor café and the Spinnaker Lounge, which doubles as a show venue. That puts everything on deck 10, the top cabin deck. Below that you're sandwiched between cabin decks.",
      motionAvoid:
        "Push hard for midship. Extreme forward is the one to rule out; extreme aft is a negative when there's comparable midship inventory, and more so if vibration also matters to them. Nothing is documented about how this hull rides.",
      vibrationNote:
        "Lower decks are generally better for motion, not worse — closer to the waterline. The catch is vibration: a low cabin at the back can still pick up the propulsion, so \"go low\" isn't automatically the right call for a sensitive traveller.",
      categoryWarnings: [
        "This ship's balconies were an afterthought, literally. She was laid down as a Costa hull, abandoned half-built when the yard collapsed, bought by NCL and redesigned with two extra cabin decks — and she launched in 1999 with 812 staterooms and not a single balcony. The couple of hundred balconies she has now were retrofitted, so check the specific cabin's dimensions rather than assuming a standard balcony.",
        "The cabin mix here is weighted much more heavily to insides and oceanviews than a client will expect from a modern ship. If a balcony is part of their picture of a cruise, price it early — there aren't many.",
        "Deck 10 is the one to check: the pool deck, the buffet and the Spinnaker Lounge are all on 11 directly above it, and the Spinnaker is a show venue as well as an observation lounge.",
        "There are no purpose-built solo studios on this ship.",
      ],
      hazardsAboveBelow: [
        {
          source: "lido",
          where: "the pools on deck 11, over the deck 10 cabins",
        },
        {
          source: "buffet",
          where: "the Garden Café and the outdoor café, also on 11",
        },
        {
          source: "nightclub",
          where:
            "the Spinnaker Lounge on 11 — an observation lounge that also runs as a show and club venue",
        },
      ],
      obstructedViewNotes:
        "No obstructed-cabin list is published for this ship. NCL's generic guarantee language is all there is — views may be fully obstructed, partially obstructed, porthole or picture window. Pick the cabin rather than taking a guarantee if the view matters.",
      connectingNote:
        "Never read connecting status off the category or off two cabin numbers being next to each other — only an explicit connecting pair counts.",
      minorPlacementRule: NCL_MINOR_PLACEMENT,
      elevatorNote:
        "Around eight lifts. I couldn't establish the bank layout or find congestion reports.",
      accessibilityNote:
        "Small and compact, so short distances — but only about eight lifts, and this is a 1999 hull that predates most modern accessible-design conventions. Treat a mobility booking as needing the accessible deck plan checked cabin by cabin.",
    },

    money: NCL_MONEY,

    traps: {
      verified: false,
      kidAgeHeightRules: NCL_KIDS_RULES,
      embarkationNote: NCL_EMBARKATION,
      other: [
        NO_HAVEN,
        "The absence list: no go-karts, no Waterfront, no Ocean Boulevard, no ropes course, no laser tag, no big waterslide complex. There is a forward observation lounge, the Spinnaker on 11, which also serves as a show venue.",
        "This is the oldest-feeling ship in the fleet and it started life as somebody else's. That's not a reason to avoid it — it's a reason to set the expectation against the right comparison, which is a small older ship, not a Prima.",
        NCL_FREESTYLE,
        ...NCL_FLEET_TRAPS,
      ],
    },
  };
}

function spiritContent(): ShipContent {
  return {
    reviewDue: "2027-02-01",
    sources: [...NCL_SOURCES, ...SINGLETON_SOURCES],

    cabin: {
      verified: false,
      placementNote:
        "Midship on 9 or 10. Cabins run 5 through 11 and deck 12 is a pure Lido deck with no staterooms — the pool, the Garden Café, the Spinnaker observation lounge which runs as a disco at night, and the spa. So deck 11 takes all of that from above, and the disco is the part that matters after midnight. Lower down, deck 7 holds the 798-seat theatre and the Bliss Ultra Lounge, and the deck 6 cabins sit alongside the dining rooms.",
      motionAvoid:
        "Push hard for midship. Extreme forward is the one to rule out; extreme aft is a negative when there's comparable midship inventory, and more so if vibration also matters to them. Nothing is documented about how this hull rides.",
      vibrationNote:
        "Lower decks are generally better for motion, not worse — closer to the waterline. The catch is vibration: a low cabin at the back can still pick up the propulsion, so \"go low\" isn't automatically the right call for a sensitive traveller.",
      categoryWarnings: [
        "The cabins on this ship are small — most standard rooms run about 150 to 170 square feet, which is tight even by the standards of a 1998 build. That's a Star Cruises inheritance: she was built as SuperStar Leo for the Asian market, where the expectations were different. Set the size expectation explicitly, because square footage is the complaint that follows people home.",
        "Deck 11 is the one to steer off. The Spinnaker lounge on 12 runs as a disco at night, directly above those cabins.",
        "There are no purpose-built solo studios on this ship.",
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
          source: "theater",
          where:
            "the 798-seat theatre and the Bliss Ultra Lounge on deck 7, below the cabins above them",
        },
      ],
      obstructedViewNotes:
        "No obstructed-cabin list is published for this ship. NCL's generic guarantee language is all there is. Pick the cabin rather than taking a guarantee if the view matters.",
      connectingNote:
        "Never read connecting status off the category or off two cabin numbers being next to each other — only an explicit connecting pair counts.",
      minorPlacementRule: NCL_MINOR_PLACEMENT,
      elevatorNote:
        "Around nine lifts, including the glass ones in the atrium — a Star Cruises design touch that survived the rebuild. I couldn't establish the bank layout.",
      accessibilityNote:
        "Compact and short-distanced, with about nine lifts. The cabins themselves are small, which is worth factoring in for anyone using a wheelchair or scooter — 150 to 170 square feet leaves little turning room. Confirm the accessible deck plan and the specific cabin's dimensions rather than the category's.",
    },

    money: NCL_MONEY,

    traps: {
      verified: false,
      kidAgeHeightRules: NCL_KIDS_RULES,
      embarkationNote: NCL_EMBARKATION,
      other: [
        NO_HAVEN,
        "The 2020 refit was substantial — over $100 million and 40 days — but it was about venues, not cabins. Fourteen new spaces including a third main dining room, the Garden Café, Onda by Scarpetta and a doubled spa. Only sixteen cabins were added and nothing was renumbered, so the rooms themselves are still the 1998 rooms with new décor.",
        "One thing that refit took away: the children's water park was removed and replaced with Spice H2O, which is adults-only and carries an extra fee. If a family is booking this ship off an older review expecting a kids' splash area, it isn't there any more.",
        "The absence list: no go-karts, no Waterfront, no Ocean Boulevard, no ropes course, no laser tag, no big waterslide complex. There is a forward observation lounge, the Spinnaker on 12.",
        NCL_FREESTYLE,
        ...NCL_FLEET_TRAPS,
      ],
    },
  };
}

export const norwegianSun = sunContent();
export const norwegianSky = skyContent();
export const norwegianSpirit = spiritContent();
