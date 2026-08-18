import type { ShipContent, Source } from "@/lib/types";
import {
  CARNIVAL_EMBARKATION,
  CARNIVAL_KIDS_RULES,
  CARNIVAL_MINOR_PLACEMENT,
  CARNIVAL_MONEY,
  CARNIVAL_SLIDE_RULES,
  CARNIVAL_SOURCES,
} from "./carnival-common";

/**
 * Spirit class: Spirit, Pride, Legend, Miracle (2001–2004).
 *
 * MY RESEARCH, NOT OPERATOR-CONFIRMED. Cabin and traps are both
 * `verified: false`.
 *
 * LUMINOSA IS DELIBERATELY NOT IN THIS FACTORY. It's routinely listed as
 * Spirit class and it isn't one: it was built as Costa Luminosa in 2009 to
 * a Vista/Spirit hybrid design, bigger in tonnage and beam than these four,
 * and it came to Carnival in 2022. (It's also not the ex-Costa Deliziosa —
 * that's a near-sister still with Costa. The catalog said otherwise until
 * this workup.) Its deck plan is unresearched, so it keeps the fleet
 * baseline rather than inheriting deck claims that don't describe it.
 *
 * The one clean structural fact on these four: the Lido on deck 9 sits
 * directly above deck 8, the top cabin deck. That's the straightforward
 * overhead-hazard case — unlike the Conquest and Sunshine hulls, where the
 * pool deck carries cabins itself.
 *
 * Deliberately NOT encoded:
 *   - elevator counts and banks. Nothing class-specific surfaced at all.
 *   - any claim that the narrow Panamax hull rides differently. The hull
 *     being narrow is documented; an effect on motion or cabin size is not,
 *     and inventing the link would be exactly the kind of plausible
 *     reasoning this product exists to refuse.
 */

const SPIRIT_CLASS_SOURCES: Source[] = [
  {
    label: "Spirit deck plans — Lido on 9 above the top cabin deck",
    url: "https://www.cruisemapper.com/deckplans/Carnival-Spirit-560/deck09-1929",
    checked: "2026-08-18",
  },
  {
    label: "Galley and main dining on deck 2, cabin noise reports",
    url: "https://boards.cruisecritic.com/topic/951993-room-near-galley-carnival-spirit/",
    checked: "2026-08-18",
  },
  {
    label: "Waterslide minimums — Twister 42in, Thrill Slide 48in",
    url: "https://help.carnival.com/app/answers/detail/a_id/1122/~/policies-for-shipboard-water-sports",
    checked: "2026-08-18",
  },
  {
    label: "Luminosa is ex-Costa Luminosa, a Vista/Spirit hybrid hull",
    url: "https://en.wikipedia.org/wiki/Carnival_Luminosa",
    checked: "2026-08-18",
  },
];

function spiritClassContent(): ShipContent {
  return {
    reviewDue: "2027-02-01",
    sources: [...CARNIVAL_SOURCES, ...SPIRIT_CLASS_SOURCES],

    cabin: {
      // MY RESEARCH. Not signed off.
      verified: false,
      placementNote:
        "Midship, decks 5 to 7. Cabins run deck 1 to deck 8 and the Lido sits on 9 — directly over the top cabin deck, not mixed in with it the way it is on the Conquest and Sunshine hulls. So deck 8 is the one that takes the pool noise from above, and it's the deck a client is most likely to ask for. Deck 2 is the other one to check: the main dining room and the galley are on it.",
      motionAvoid:
        "Push hard for midship. Extreme forward is the one to rule out; extreme aft is a negative when there's comparable midship inventory, and more so if vibration also matters to them.",
      vibrationNote:
        "Lower decks are generally better for motion, not worse — closer to the waterline. The catch is vibration: a low cabin at the back can still pick up the propulsion, so \"go low\" isn't automatically the right call for a sensitive traveller.",
      categoryWarnings: [
        "I'd steer them off a porthole room — it's the cheapest category and they've felt small to me. Check the actual square footage for the specific cabin before you rule it in or out.",
        "The bottom deck is fine if they're on a budget — that's where the cheap interiors are, and low is generally kinder for motion, not harsher.",
        "Deck 8 is the top cabin deck and the pool deck is straight above it. A client asking for a high deck is asking for the noisiest one on this ship — offer them midship on 6 or 7 instead and tell them why.",
        "These are narrow hulls, built to fit the old Panama Canal locks. That's a real difference from the rest of the fleet, but I have no evidence it changes how the ship rides or how big the cabins are — so don't sell it as an advantage or warn about it as a drawback.",
      ],
      hazardsAboveBelow: [
        {
          source: "lido",
          where:
            "deck 9, directly over the deck 8 cabins — this is the clean overhead case, and deck 8 is where it lands",
        },
        {
          source: "galley",
          where:
            "deck 2, alongside the main dining room — cabins on that deck can pick up the prep and clear-down",
        },
        {
          source: "nightclub",
          where:
            "reported over the forward end of deck 1 — travelers flag a couple of cabins there for late-night noise, which is a forum report rather than a published layout",
        },
      ],
      obstructedViewNotes:
        "No cabin-level obstruction list surfaced for this class. What Carnival does say generally is that the obstructed balconies are on the indented sections of the hull, where lifeboats and structure sit at railing height. Read the category code on the specific cabin — the deck alone won't tell you.",
      connectingNote:
        "Never read connecting status off the category or off two cabin numbers being next to each other — only an explicit connecting pair counts.",
      minorPlacementRule: CARNIVAL_MINOR_PLACEMENT,
      accessibilityNote:
        "A smaller hull with a single Lido deck, so there's much less of the Excel-class problem where dining is low and the pool is eight decks up — though that's my read of the layout rather than a sourced claim. I found nothing reliable on the elevator banks here, so check the deck plan for the specific cabin, and confirm scooter clearance against Carnival's accessible deck plan.",
    },

    money: CARNIVAL_MONEY,

    traps: {
      // MY RESEARCH. Not signed off.
      verified: false,
      kidAgeHeightRules: `${CARNIVAL_SLIDE_RULES} On this class the Twister slide runs a 42-inch minimum and the Thrill Slide a 48-inch minimum, both capping at 300 pounds — so a child can clear one and not the other, and that's the argument you want to head off at the pool. ${CARNIVAL_KIDS_RULES}`,
      embarkationNote: CARNIVAL_EMBARKATION,
      other: [
        "Neither BOLT nor SkyRide is on this class — those are the Excel and Vista ships. Don't let a client arrive expecting the rollercoaster or the sky ride.",
      ],
    },
  };
}

export const carnivalSpirit = spiritClassContent();
export const carnivalPride = spiritClassContent();
export const carnivalLegend = spiritClassContent();
export const carnivalMiracle = spiritClassContent();
