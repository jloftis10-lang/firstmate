import type { ShipContent, Source } from "@/lib/types";
import {
  NCL_EMBARKATION,
  NCL_FLEET_TRAPS,
  NCL_FREESTYLE,
  NCL_HAVEN_WARNING,
  NCL_KIDS_RULES,
  NCL_MINOR_PLACEMENT,
  NCL_MONEY,
  NCL_SOURCES,
} from "./ncl-common";
import {
  CONNECTING_RULE,
  MOTION_RULE,
  VIBRATION_RULE,
  withShipNote,
} from "./operator-rules";

/**
 * Norwegian Epic (2010) — a one-off, and the ship in this fleet most
 * likely to generate a complaint that isn't the advisor's fault but will
 * land on them anyway.
 *
 * MY RESEARCH, NOT OPERATOR-CONFIRMED. Cabin and traps are `verified: false`.
 *
 * THE BATHROOM IS THE STORY. Epic's standard cabins have a three-part
 * bathroom: the toilet behind one sliding translucent door, the shower
 * behind another, and the sink out in the living area between them. The
 * glass is frosted, not opaque — reviewers are explicit that you can see
 * a silhouette and hear everything, and the only extra screening is a
 * pull curtain. NCL never repeated the design on another ship, which
 * tells you what they concluded.
 *
 * Two follow-ons matter for an advisor:
 *   - It has NOT been fixed. The 2025 dry dock left the bathrooms alone,
 *     reportedly because the separate toilet and shower drainage runs
 *     would mean gutting every cabin. Don't tell a client it was updated.
 *   - It's a real problem for anyone not sharing a bathroom intimately —
 *     adult friends, siblings, a parent and teenager. That's the booking
 *     to redirect, not the honeymoon couple.
 *
 * The other genuine structural fact: there are no midship elevators or
 * midship stairs at all. Two banks, forward and aft, and the aft bank
 * doesn't even serve deck 5.
 *
 * Deliberately NOT encoded: the claim that Epic has virtually no
 * connecting cabins — it's widely repeated and the sources don't support
 * it, since connecting owner's suites, family balconies and
 * studio-to-studio pairs all appear. Also not encoded: any claim that
 * this tall, boxy hull rides badly. Member reviews flatly contradict
 * each other and no engineering source exists.
 */

const EPIC_SOURCES: Source[] = [
  {
    label: "The three-part bathroom and the wave-wall cabin design",
    url: "https://www.cruisecritic.com/cruise/norwegian-ncl/norwegian-epic/cabins",
    checked: "2026-08-18",
  },
  {
    label: "2025 dry dock — bathrooms unchanged, 8 cabins added on deck 14",
    url: "https://www.cruisecritic.com/articles/norwegian-epic-latest-dry-dock",
    checked: "2026-08-18",
  },
  {
    label: "Deck 8 and 9 lifeboat obstruction and overlooked-balcony lists",
    url: "https://www.cruisedeckplans.com/ships/deckbydeck.php?ship=Norwegian-Epic&deck=8",
    checked: "2026-08-18",
  },
  {
    label: "No midship elevators or stairs; aft bank does not serve deck 5",
    url: "https://boards.cruisecritic.com/topic/1106428-no-midship-elevatorsstairs-on-epic/",
    checked: "2026-08-18",
  },
];

export const norwegianEpic: ShipContent = {
  reviewDue: "2027-02-01",
  sources: [...NCL_SOURCES, ...EPIC_SOURCES],

  cabin: {
    // MY RESEARCH. Not signed off.
    verified: false,
    placementNote:
      "Midship on 11 or 12. Cabins run decks 8 to 14 with the solo studios on 11 and 12, and the Haven sits right up on 16 and 17 — above the pool deck on 15 rather than below it, which is unusual. Deck 14 is the one to avoid for noise, sitting under the pool and the aqua park. Decks 8 and 9 are the lifeboat decks and need checking for view. One piece of good news: the kids' club moved from deck 12 down to deck 6 in the 2025 dry dock, so the old advice about avoiding deck 12 for Splash Academy noise is now out of date.",
    motionAvoid: withShipNote(MOTION_RULE, "You'll hear that this ship rides badly because it's tall and boxy — member reviews flatly contradict each other on it and there's no real source either way, so I wouldn't repeat it."),
    vibrationNote: withShipNote(VIBRATION_RULE, "One Epic-specific quirk worth passing on: in any real swell the sliding bathroom doors tend to roll open on their own, which sets off the motion-activated lights in the night."),
    categoryWarnings: [
      "The bathroom is the thing to explain before anyone books this ship. It's in three parts — toilet behind one sliding frosted door, shower behind another, and the sink out in the living area between them. The glass is frosted rather than opaque, so there's a visible silhouette and no sound insulation, and a pull curtain is all the extra privacy there is. Couples mostly shrug. Adult friends sharing, siblings, a parent and a teenager — that's the booking that goes wrong, and it's worth asking who's actually sharing before you sell it.",
      "It has not been fixed and won't be. The 2025 dry dock left the bathrooms exactly as they were, because the separate drainage runs would mean gutting every stateroom. If a client has heard the ship was refurbished, be clear about what that did and didn't cover.",
      "Balcony sizes on this ship swing from about 37 to 100 square feet within what looks like one category, and the bed sits by the balcony in some cabins and by the door in others. Same category code, materially different room — check the specific cabin rather than the category.",
      "Interiors are a uniform 128 square feet, which is small, and the family inside at the same size is described as genuinely cramped. If a family needs an interior here, look hard at whether two cabins beat one.",
      "This ship invented the solo studio — 128 of them on decks 11 and 12, around 100 square feet, with the first Studio Lounge NCL ever built. For a solo client that's still one of the best offers at sea.",
      "You'll read that Epic has almost no connecting cabins. The sources don't support it — connecting owner's suites, connecting family balconies and studio-to-studio pairs all exist. Check inventory rather than ruling the ship out for a family.",
    ],
    hazardsAboveBelow: [
      {
        source: "lido",
        where:
          "the pool and aqua park on deck 15, over the deck 14 cabins — and note the Haven sits above all of that on 16 and 17",
      },
      {
        source: "theater",
        where: "forward on the lower decks, under the forward deck 8 cabins",
      },
    ],
    obstructedViewNotes:
      "Decks 8 and 9 are the lifeboat decks and this ship has an unusually specific published picture. On deck 8, the cabins from 8026 forward on port and 8027 forward on starboard are clear, as are 8190 and aft on port and 8191 and aft on starboard — most of the rest look down onto the tops of the lifeboats. On deck 9 the clear ones are 9044 forward and 9270 aft on port, 9047 forward and 9269 aft on starboard, with the rest looking at the boats extending from deck 7. Separately, a run of deck 9 balconies is open to view from the cabins above — that's a privacy issue rather than an obstruction, and it's the one people don't think to ask about.",
    obstructionKinds: ["lifeboat-davit", "overlooked"],
    connectingNote: CONNECTING_RULE,
    minorPlacementRule: NCL_MINOR_PLACEMENT,
    elevatorNote:
      "This is a documented structural problem rather than a grumble: there are no midship elevators and no midship stairs anywhere on the ship. Two banks, forward and aft, and the aft bank doesn't serve deck 5 at all — which is a busy deck. Congestion is heavily reported. Book near the end of the ship they'll actually use.",
    accessibilityNote:
      "Take this one seriously for a mobility booking. No midship lifts and no midship stairs means every vertical trip starts with a walk to one end of a 1,080-foot ship, and the aft bank skips deck 5. For anyone slower on their feet, pick the end that matches their week and book as close to it as the inventory allows, then check the route to the dining room specifically. Confirm against the accessible deck plan.",
  },

  money: NCL_MONEY,

  traps: {
    // MY RESEARCH. Not signed off.
    verified: false,
    kidAgeHeightRules: `The waterslides here run a 42-inch minimum and a 300-pound cap, and the free-fall drop slides need 55 to 82 inches. One source claims the Epic Plunge has no height restriction at all, which contradicts the ship's other slide rules — check before promising a small child a ride. ${NCL_KIDS_RULES}`,
    embarkationNote: NCL_EMBARKATION,
    other: [
      "Splash Academy and Entourage moved from deck 12 to deck 6 in the 2025 dry dock. Any advice you've got about avoiding deck 12 for kids' club noise is now describing the wrong deck.",
    ],
    linePolicy: [NCL_HAVEN_WARNING, NCL_FREESTYLE, ...NCL_FLEET_TRAPS],
  },
};
