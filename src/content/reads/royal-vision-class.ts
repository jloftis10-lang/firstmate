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

/**
 * Vision class: Grandeur (1996), Enchantment (1997), Rhapsody (1997),
 * Vision (1998) — the oldest hulls Royal Caribbean still runs.
 *
 * MY RESEARCH, NOT OPERATOR-CONFIRMED. Cabin and traps are `verified: false`.
 *
 * These ships are small and old and the cabins are genuinely tight —
 * standard oceanviews around 126 square feet, interiors from about 135.
 * Roughly a fifth to a quarter of cabins have a balcony and about forty
 * per cent are interior. On a modern Royal Caribbean ship the balcony is
 * the default assumption; here it's the exception, and that gap is the
 * conversation to have before deposit.
 *
 * The layout is simple and in the client's favour: five cabin decks — 2,
 * 3, 4, 7 and 8 — with the pool, Solarium and Windjammer up on 9. Deck 8
 * takes the pool noise from directly above and the interiors there are
 * the worst affected. Deck 3 is the lifeboat band.
 *
 * ENCHANTMENT IS DIFFERENT and it matters for cabin numbers, not just
 * facilities. It was cut in half and had 73 feet inserted amidships in
 * 2005, adding 151 staterooms. The numbering was inserted mid-ship rather
 * than appended, so a cabin number on Enchantment is NOT in the same place
 * as the same number on Rhapsody. Reading one sister's deck plan for
 * another fails on this ship specifically.
 *
 * Deliberately NOT encoded: obstructed cabin numbers, because none were
 * published for any ship in this class; the balcony-count percentages as
 * a single figure, since the sources conflict badly; and the claim that
 * this class "feels rough seas more" — it comes from a low-quality source
 * and amounts to inferring motion from tonnage, which this product
 * doesn't do. The documented vibration here is localised and specific:
 * deck 2 aft, from the engines, worst when manoeuvring.
 */

const VISION_SOURCES: Source[] = [
  {
    label: "Five cabin decks; deck 8 interiors sit directly under the pool decking",
    url: "https://www.cruisemapper.com/deckplans/Grandeur-Of-The-Seas-598",
    checked: "2026-08-18",
  },
  {
    label: "Deck 3 oceanviews obstructed by tenders, lifeboats and davits",
    url: "https://www.cruisebooking.com/articles/royal-caribbean-cruise-tips/vision-of-the-seas-cabins-to-avoid",
    checked: "2026-08-18",
  },
  {
    label: "Enchantment's 73-foot lengthening — 151 added staterooms, inserted midship",
    url: "https://www.ship-technology.com/projects/enchantment/",
    checked: "2026-08-18",
  },
  {
    label: "Cabins added at the stretch — oceanviews 7098-7104 and 7598-7604",
    url: "https://www.cruisedeckplans.com/ships/Enchantment-of-the-Seas",
    checked: "2026-08-18",
  },
  {
    label: "What the class does and doesn't have onboard",
    url: "https://www.royalcaribbeanblog.com/2022/03/23/all-about-vision-class-cruise-ships",
    checked: "2026-08-18",
  },
];

function visionClassContent(
  ship: "grandeur" | "enchantment" | "rhapsody" | "vision",
): ShipContent {
  const isEnchantment = ship === "enchantment";

  return {
    reviewDue: "2027-02-01",
    sources: [...ROYAL_SOURCES, ...VISION_SOURCES],

    cabin: {
      // MY RESEARCH. Not signed off.
      verified: false,
      placementNote: `Midship on deck 7. There are only five cabin decks on this ship — 2, 3, 4, 7 and 8 — with the pool, Solarium and Windjammer up on 9. Deck 8 is the one to avoid because it sits directly under the pool decking, and the interiors there are worst affected. Deck 2 aft picks up the engines, particularly when the ship is manoeuvring. ${
        ship === "vision"
          ? "On this ship specifically, the most forward cabins on deck 7 sit above the theatre — both the oceanviews and the forward interiors."
          : ship === "rhapsody"
            ? "On this ship specifically, cabins around 4022 and 4522 and forward of them sit below the main show lounge."
            : ship === "grandeur"
              ? "On this ship specifically, deck 4 midship takes the casino noise and the late restaurant clear-down, and the theatre runs to about 11pm. Deck 3 forward is reported as the quietest part of the ship."
              : ""
      }`,
      motionAvoid:
        "Push hard for midship. Extreme forward is the one to rule out; extreme aft is a negative when there's comparable midship inventory, and more so if vibration also matters to them.",
      vibrationNote:
        "Lower decks are generally better for motion, not worse — closer to the waterline. The catch is vibration: a low cabin at the back can still pick up the propulsion, so \"go low\" isn't automatically the right call for a sensitive traveller. On this class the documented vibration is specific rather than general: deck 2 aft, from the engines, worst when the ship is manoeuvring or accelerating.",
      categoryWarnings: [
        "The cabins here are genuinely small and that's the expectation to set. Standard oceanviews run about 126 square feet and interiors start around 135 — well below what a client will have seen on a newer ship. The spacious oceanview at about 193 square feet is the one worth paying up for if they need room.",
        "Balconies are scarce on this class — somewhere between a fifth and a quarter of cabins, with about forty per cent interior. Sources disagree on the exact split, but the direction is not in doubt. If a balcony is part of the client's picture of a cruise, price it early, because it runs out.",
        ...(isEnchantment
          ? [
              "This ship was cut in half and lengthened by 73 feet in 2005, and the 151 new cabins were inserted amidships rather than added at one end. That means cabin numbers here are NOT in the same physical position as the same numbers on Rhapsody, Grandeur or Vision. Do not read a sister's deck plan for this ship — the oceanviews around 7098 to 7104 and 7598 to 7604 are among the ones that came with the stretch.",
            ]
          : []),
      ],
      hazardsAboveBelow: [
        {
          source: "lido",
          where:
            "the pool deck on 9, directly over the deck 8 cabins — the interiors on 8 are the ones reported worst",
        },
        {
          source: "buffet",
          where: "the Windjammer, also on deck 9 above the same cabins",
        },
        ...(ship === "vision"
          ? [
              {
                source: "theater",
                where:
                  "the theatre, below the most forward cabins on deck 7 on this ship",
              },
            ]
          : []),
        ...(ship === "grandeur"
          ? [
              {
                source: "bar",
                where:
                  "the casino on deck 4 midship, the noisiest spot on this ship, with the theatre running to about 11pm",
              },
            ]
          : []),
      ],
      obstructedViewNotes:
        "Deck 3 is the lifeboat band on this class — the oceanviews there are obstructed by tenders, lifeboats, davits and steel framing, and at least one passenger account describes opening the curtain onto the stern of a lifeboat. No cabin-by-cabin list is published for any ship in this class that I could reach, so the deck is the warning and the booking screen is the check.",
      connectingNote:
        "Never read connecting status off the category or off two cabin numbers being next to each other — only an explicit connecting pair counts.",
      minorPlacementRule: ROYAL_MINOR_PLACEMENT,
      elevatorNote:
        "Nine elevators, which is few — but this is a small ship and the walk is short. I couldn't establish the bank layout or find any congestion reports.",
      accessibilityNote:
        "The saving grace of a small old ship is that nothing is far away, and the pool deck sits cleanly above the cabins rather than among them. Against that, this class predates most modern accessible-design conventions and there are only nine lifts with no layout I could confirm. Treat a mobility booking here as needing the accessible deck plan checked cabin by cabin rather than reasoned from a rule.",
    },

    money: ROYAL_MONEY,

    traps: {
      // MY RESEARCH. Not signed off.
      verified: false,
      kidAgeHeightRules: `${ROYAL_ATTRACTION_RULES} Most of the fleet's height rules don't apply here — there's no FlowRider and no waterslides on this class${
        isEnchantment ? ", though this ship does have the splash deck and the bungee trampolines from its refit" : ""
      }. The rock wall's age-6 minimum is the one that comes up. ${ROYAL_KIDS_RULES} ${ROYAL_KIDS_COST}`,
      obstructedBalconyDecks:
        "the deck 3 oceanviews, behind the lifeboats, tenders and davits",
      embarkationNote: ROYAL_EMBARKATION,
      other: [
        "This is a 1990s ship and the smallest class in the fleet, and the absence list is long: no FlowRider, no ice rink, no waterslides, no bumper cars, no Central Park or Boardwalk, no North Star. There's a rock wall, a retractable-roof Solarium, mini-golf, an outdoor screen and Chops Grille. If the client's mental image came from an Icon advert, close that gap before deposit — the ship is fine, it just isn't that one.",
        ...(isEnchantment
          ? [
              "This is the stretched one, and it has things its sisters don't: a splash deck with dozens of water jets, two suspension bridges over the pool deck and a bungee-trampoline jump zone. If a family is choosing within the class, that's a real reason to pick this hull.",
              "Because of the 2005 stretch, cabin numbers here don't map to the sister ships. Anything you've learned about a cabin number on Rhapsody or Grandeur does not transfer.",
            ]
          : []),
        ...ROYAL_FLEET_TRAPS,
      ],
    },
  };
}

export const grandeurOfTheSeas = visionClassContent("grandeur");
export const enchantmentOfTheSeas = visionClassContent("enchantment");
export const rhapsodyOfTheSeas = visionClassContent("rhapsody");
export const visionOfTheSeas = visionClassContent("vision");
