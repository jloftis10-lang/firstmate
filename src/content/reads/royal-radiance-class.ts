import type { ShipContent, Source } from "@/lib/types";
import {
  ROYAL_ATTRACTION_RULES,
  ROYAL_EMBARKATION,
  ROYAL_FLEET_TRAPS,
  ROYAL_KIDS_COST,
  ROYAL_KIDS_RULES,
  ROYAL_MINOR_PLACEMENT,
  ROYAL_MONEY,
  ROYAL_SOURCES,
} from "./royal-common";
import {
  CONNECTING_RULE,
  MOTION_RULE,
  VIBRATION_RULE,
  withShipNote,
} from "./operator-rules";

/**
 * Radiance class: Radiance (2001), Brilliance (2002), Serenade (2003),
 * Jewel (2004).
 *
 * MY RESEARCH, NOT OPERATOR-CONFIRMED. Cabin and traps are `verified: false`.
 *
 * These are the scenic-cruising ships — three acres of glass, exterior
 * glass viewing elevators, a glass-walled two-level dining room and a
 * retractable roof over the Solarium. On an Alaska or Panama Canal run
 * that's the entire pitch, and it's a genuinely different product from
 * the big activity ships rather than a smaller version of one.
 *
 * The layout news is good: cabins run decks 2, 3, 4 and 7 to 10, and the
 * pool and Solarium sit on 11 — above the top cabin deck rather than
 * among the cabins. Every deck 10 stateroom is under public space, which
 * makes deck 10 the clean avoid and everything below it sheltered.
 *
 * Deck 7's obstruction is unusual enough to be worth its own note: it
 * isn't a blocked window, it's a metal roof extending eight to ten feet
 * out from the base of the balcony to cover the lifeboats below. The
 * view out is fine; the view down is roof.
 *
 * Deliberately NOT encoded: the proportion of cabins with balconies —
 * three sources give three incompatible figures; the broader "deck 7
 * cabins 7000 to 7100 are lifeboat-obstructed" claim, which comes from a
 * content-farm site and contradicts the better-sourced two-cabin list;
 * the deck-10 cabin number ranges, from the same unreliable source; and
 * any claim that this slim hull rides worse — nothing documents it, and
 * inferring a motion effect from a beam measurement is exactly the kind
 * of plausible reasoning this product refuses.
 */

const RADIANCE_SOURCES: Source[] = [
  {
    label: "Deck 7 balcony roof over the lifeboats; 7170/7670 and 9252/9652 obstructions",
    url: "https://www.cruisedeckplans.com/ships/Radiance-of-the-Seas",
    checked: "2026-08-18",
  },
  {
    label: "All deck 10 staterooms sit under public areas on the Lido deck",
    url: "https://www.cruisemummy.co.uk/radiance-of-the-seas-cabins-to-avoid/",
    checked: "2026-08-18",
  },
  {
    label: "Class overview — three acres of glass, glass lifts, Solarium roof",
    url: "https://en.wikipedia.org/wiki/Radiance-class_cruise_ship",
    checked: "2026-08-18",
  },
  {
    label: "What the class does and doesn't have onboard",
    url: "https://www.royalcaribbeanblog.com/2022/03/03/all-about-radiance-class-cruise-ships",
    checked: "2026-08-18",
  },
];

function radianceClassContent(
  ship: "radiance" | "brilliance" | "serenade" | "jewel",
): ShipContent {
  const isSerenade = ship === "serenade";

  return {
    reviewDue: "2027-02-01",
    sources: [...ROYAL_SOURCES, ...RADIANCE_SOURCES],

    cabin: {
      // MY RESEARCH. Not signed off.
      verified: false,
      placementNote:
        "Midship on 8 or 9. Cabins sit on decks 2, 3, 4 and 7 to 10, and the pool and Solarium are up on 11 — above the cabins rather than mixed in with them, which is the older and cleaner arrangement. That makes deck 10 the deck to avoid: every stateroom on it sits under public space, and the aft end under the buffet is the one travelers complain about most. Below deck 10 you're sandwiched between cabin decks.",
      motionAvoid: MOTION_RULE,
      vibrationNote: withShipNote(VIBRATION_RULE, "Worth knowing on this class: these are gas-turbine ships driving azipods, and the builders made a point of how little vibration that produces compared with a conventional diesel. That's manufacturer material rather than an independent measurement, so I'd treat it as encouraging rather than settled."),
      categoryWarnings: [
        "The deck 7 balconies have an unusual quirk worth explaining rather than avoiding. A metal roof extends eight to ten feet out from the base of the balcony to cover the lifeboats below — so the view out to sea is fine, but looking straight down you see roof. Some clients won't care; a photographer will.",
        isSerenade
          ? "The hump cabins around 7596 to 7606 are actively good on this ship rather than something to avoid — the deck is wider there and the angled position gives better views along the side. Worth asking for by name."
          : "The hump cabins on deck 7 are worth asking for rather than avoiding — the deck is wider there and the angle gives better views along the side of the ship.",
        "This class is built for looking at scenery — three acres of glass, glass lifts on the outside of the hull, a two-level glass-walled dining room. On an Alaska or Panama Canal itinerary the aft-facing balconies are the cabin to push, because the view astern is the product.",
        "Sources disagree badly on what share of cabins here have balconies — I found three incompatible figures, so I won't give you one. Check the actual inventory for the sailing rather than assuming it's like a modern ship.",
      ],
      hazardsAboveBelow: [
        {
          source: "lido",
          where:
            "the pool and Solarium on deck 11, over the whole of deck 10 — chair-scraping early is the standing complaint",
        },
        {
          source: "buffet",
          where:
            "the buffet aft on 11, over the aft deck 10 cabins — reported as the worst spot on the ship",
        },
        {
          source: "sports",
          where:
            "the sports court on 12 and the rock wall and mini-golf on 13, all well above the cabin decks",
        },
      ],
      obstructedViewNotes:
        "Two specific pairs are documented: 7170 and 7670, partially blocked by the ship's structure, and 9252 and 9652, blocked by the window-washing platform. Separately, all the indented deck 7 balconies carry the lifeboat roof described above, which is a different thing from a blocked view. A much broader claim circulates that a long run of deck 7 cabins is lifeboat-obstructed, but it comes from a low-quality source and contradicts the better-sourced list, so I'd check the booking screen rather than believe either of us.",
      obstructionKinds: ["solid-structure"],
      connectingNote: CONNECTING_RULE,
      minorPlacementRule: ROYAL_MINOR_PLACEMENT,
      elevatorNote:
        "Nine elevators, which is few by modern standards but this is a much smaller ship. The Centrum bank is glass and faces out over the ocean on the port side — genuinely worth riding rather than something to endure. I couldn't establish the car counts per bank or find any congestion reports.",
      accessibilityNote:
        "A smaller hull with the pool deck cleanly above the cabins, so distances are short and there's no walking through a pool crowd to get home. Only nine elevators though, and I found nothing on how they're distributed, so check the deck plan for the specific cabin and confirm it against the accessible plan.",
    },

    money: ROYAL_MONEY,

    traps: {
      // MY RESEARCH. Not signed off.
      verified: false,
      kidAgeHeightRules: `${ROYAL_ATTRACTION_RULES} Note there's no FlowRider and there are no waterslides on this class, so most of the fleet's height rules simply don't come up — the rock wall's age-6 minimum is the one that does. ${ROYAL_KIDS_RULES} ${ROYAL_KIDS_COST}`,
      obstructedBalconyDecks:
        "cabins 7170 and 7670, and 9252 and 9652 by the window-washing platform — plus the lifeboat roof under all the indented deck 7 balconies",
      embarkationNote: ROYAL_EMBARKATION,
      other: [
        "Set the expectation about what isn't here, because it's a long list: no FlowRider, no ice rink, no waterslides, no bumper cars, no Central Park or Boardwalk, no North Star. What there is: a rock wall, a sports court, mini-golf, an arcade and Adventure Ocean. A family that booked Royal Caribbean expecting the ads will be disappointed by a ship that isn't trying to be that.",
        "What this class is actually for is scenery — Alaska, the Panama Canal, Europe. Sell the glass, the Solarium roof and the aft balconies. On the right itinerary it beats the big ships outright; on a Caribbean sea-day run it doesn't.",
      ],
      linePolicy: [...ROYAL_FLEET_TRAPS],
    },
  };
}

export const radianceOfTheSeas = radianceClassContent("radiance");
export const brillianceOfTheSeas = radianceClassContent("brilliance");
export const serenadeOfTheSeas = radianceClassContent("serenade");
export const jewelOfTheSeas = radianceClassContent("jewel");
