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
 * Quantum class: Quantum, Anthem, Ovation (2014–2016).
 * Quantum Ultra: Spectrum (2019), Odyssey (2021).
 *
 * MY RESEARCH, NOT OPERATOR-CONFIRMED. Cabin and traps are `verified: false`.
 *
 * A NOTE ON SOURCING, because it changed what's in this file. The
 * "cabins to avoid" sites that dominate search for this class are
 * demonstrably unreliable — one places cabins on decks 4 and 5, which
 * carry none; another describes Promenade-view interiors facing the Royal
 * Promenade, a venue this class does not have. That looks like boilerplate
 * generated from Voyager-class content. Their obstructed-cabin lists also
 * contradict each other on which deck 6 ranges are affected.
 *
 * So no cabin numbers from those sites are encoded here. What IS encoded
 * is the thing an advisor can actually act on: Royal sells obstruction as
 * its own booking category, so the category code is the check, not the
 * deck. That's true regardless of which folk list is right.
 *
 * The good news on this class is structural: deck 14 is the pool,
 * Solarium and Windjammer deck and carries no cabins at all. That makes
 * deck 13 the clean overhead case and the rest of the stack genuinely
 * quiet — a cleaner answer than most hulls give.
 *
 * Deliberately NOT encoded: the elevator count (16 and 14 both surfaced),
 * the bank layout (not found), which decks carry virtual balconies (two
 * sources conflict, including on whether deck 3 has them), and the aft
 * vibration claim — it comes from the same site that got the deck
 * numbers wrong, and azipod-aft rumble being plausible is not evidence.
 */

const QUANTUM_SOURCES: Source[] = [
  {
    label: "Deck 14 is Solarium, pool and Windjammer — no staterooms",
    url: "https://www.cruisedeckplans.com/ships/deckbydeck.php?ship=Quantum-of-the-Seas&deck=14",
    checked: "2026-08-18",
  },
  {
    label: "Two70 spans decks 5 to 7 aft; SeaPlex on 15 and 16",
    url: "https://www.cruisemapper.com/deckplans/Quantum-Of-The-Seas-802/deck15-1390",
    checked: "2026-08-18",
  },
  {
    label: "Virtual balcony screens glow at night; the off-switch is a remote",
    url: "https://emmacruises.com/7-days-in-the-most-controversial-inside-cabin-virtual-balcony-review/",
    checked: "2026-08-18",
  },
  {
    label: "Obstruction sold as its own category (ZM, Obstructed Ocean View Balcony)",
    url: "https://cruiseline.com/ship/quantum-of-the-seas/cabins/ZM",
    checked: "2026-08-18",
  },
  {
    label: "Spectrum's suites-only complex on decks 13, 15 and 16",
    url: "https://www.cruisemapper.com/deckplans/Spectrum-Of-The-Seas-1861/deck16-5710",
    checked: "2026-08-18",
  },
  {
    label: "North Star height minimums; RipCord age and weight limits",
    url: "https://cruiselowdown.com/blog/ripcord-by-ifly-royal-caribbean",
    checked: "2026-08-18",
  },
];

const VIRTUAL_BALCONY_NOTE =
  "The virtual balcony interiors are worth understanding before you sell one. It's a floor-to-ceiling screen running a live camera feed of what's outside, and people either love it or find it uncanny. The practical catch is that it glows at night — the supplied curtains don't fully kill it, and reviewers report a faint glow even with the screen off. There IS a remote to switch it off, and guests routinely fail to find it; one reviewer didn't until day six. If they're a light-sensitive sleeper, either steer them elsewhere or tell them about the remote before they board.";

function quantumClassContent(
  ship: "quantum" | "anthem" | "ovation" | "spectrum" | "odyssey",
): ShipContent {
  const isSpectrum = ship === "spectrum";
  const isAnthem = ship === "anthem";

  return {
    reviewDue: "2027-02-01",
    sources: [...ROYAL_SOURCES, ...QUANTUM_SOURCES],

    cabin: {
      // MY RESEARCH. Not signed off.
      verified: false,
      placementNote: isSpectrum
        ? "Midship, decks 8 to 10. Spectrum breaks the class pattern: where the other four stop their cabins below the pool deck, this one carries staterooms up on 15 and 16 as part of a gated suites-only complex forward. So the usual \"nothing above deck 13\" reassurance doesn't hold here — check where the specific cabin sits rather than applying the class rule."
        : "Midship, decks 8 to 10. This class has a genuinely clean stack: deck 14 is the Solarium, the main pool and the Windjammer, and it carries no cabins at all. That makes deck 13 the one deck taking pool and buffet noise from directly above, and leaves everything from 8 to 10 sandwiched between other cabins. Deck 3 has oceanviews down low if budget matters.",
      motionAvoid: MOTION_RULE,
      vibrationNote: withShipNote(VIBRATION_RULE, "I found aft-vibration reports for this class but only from sources that got other facts on these ships plainly wrong, so I'd treat it as the general rule rather than a claim about these hulls."),
      categoryWarnings: [
        VIRTUAL_BALCONY_NOTE,
        "This class has real solo cabins — around 28 of them across studio interior, oceanview and balcony categories, with no single supplement. The interior studios are small at about 101 square feet with a double bed, but for a solo client that's a genuinely better deal than paying double occupancy anywhere else in the fleet. Lead with it.",
        "The forward-facing spacious oceanviews are the value pick here — around 214 square feet, with a forward corner category running past 300 with an alcove and a panoramic window. Sources use \"Spacious\" and \"Ultra Spacious\" inconsistently for these, so match the square footage rather than the adjective.",
        "Deck 13 is the one to check on this class. It sits directly under the pool deck and the Windjammer, which means early chair-scraping and late music. Everything below it is sandwiched between cabin decks.",
      ],
      hazardsAboveBelow: [
        {
          source: "lido",
          where:
            "deck 14, over the deck 13 cabins — the pool deck itself carries no cabins on this class, so 13 is where it lands",
        },
        {
          source: "buffet",
          where: "the Windjammer, also on deck 14 aft, above the same cabins",
        },
        {
          source: "theater",
          where:
            "Two70 spans decks 5 to 7 at the back of the ship, so the aft cabins on 6 and 7 sit alongside and above its upper level — this is the best-documented adjacency on the class",
        },
      ],
      obstructedViewNotes:
        "Royal sells obstruction as its own booking category here rather than burying it — there are published obstructed oceanview and obstructed balcony codes, and the obstruction is lifeboats and structure on the indented sections where the hull narrows. That category code is the reliable check. Cabin-number lists for this class do circulate, but the sites publishing them contradict each other and get other facts about these ships wrong, so I'm not repeating their numbers. Read the code on the specific cabin.",
      connectingNote: withShipNote(CONNECTING_RULE, "This class does publish connecting categories for both oceanview and virtual-balcony interiors, which makes multi-room family bookings easier here than on some hulls."),
      minorPlacementRule: ROYAL_MINOR_PLACEMENT,
      accessibilityNote:
        "Two things help here: the pool deck sits above all the cabins rather than among them, so there's no wandering through a pool crowd to get home, and the atrium elevators are glass and easy to orient by. I couldn't establish the elevator count or the bank layout — two figures surfaced and neither is confirmed — so check the deck plan for the specific cabin. Travelers do report the aft bank being the least busy.",
    },

    money: ROYAL_MONEY,

    traps: {
      // MY RESEARCH. Not signed off.
      verified: false,
      kidAgeHeightRules: `North Star needs 42 inches with an adult and 48 inches to ride alone, with no age limit — and it's normally included in the fare on port-day rotations, with the premium slots charged. RipCord, the skydiving simulator, is age 3 and up with weight limits around 230 pounds under six foot and 250 above it; sources disagree on whether the first flight is free or charged, so check the Cruise Planner for the sailing rather than quoting a price. ${ROYAL_ATTRACTION_RULES} ${ROYAL_KIDS_RULES} ${ROYAL_KIDS_COST}`,
      embarkationNote: ROYAL_EMBARKATION,
      other: [
        "SeaPlex — the bumper cars and sports complex — sits on decks 15 and 16 aft, with the Windjammer on 14 beneath it. That means there are no cabins directly under it. If a client has read that SeaPlex ruins the cabins below, the deck plan says otherwise.",
        ...(isSpectrum
          ? [
              "Spectrum has a gated suites-only complex — private lift, private restaurant, keycard-only access. If your client is in it, that's the pitch. If they're not, be clear that parts of this ship are closed to them in a way they aren't on the other four.",
              "This one was built for the Asia market and sails there. It takes US bookings and the onboard currency is US dollars, and the dining rooms keep Western options — the real friction is the long-haul flight to the homeport, not the product. There are also venues here that don't exist on Odyssey, so don't cross-quote features between the two.",
            ]
          : []),
        ...(isAnthem
          ? [
              "If a client brings up the 2016 storm, here's the ground truth so you're not caught out: Anthem sailed into severe weather off the US east coast in February 2016, took damage to public areas and cabins, lost the use of one azipod and turned back. Reported figures vary a lot — the Coast Guard finding and the plaintiff filings are far apart on how far she listed — and nothing came out of it about the hull design or where to book a cabin. It's a weather-routing story, not a ship story.",
            ]
          : []),
        ...ROYAL_FLEET_TRAPS,
      ],
    },
  };
}

export const quantumOfTheSeas = quantumClassContent("quantum");
export const anthemOfTheSeas = quantumClassContent("anthem");
export const ovationOfTheSeas = quantumClassContent("ovation");
export const spectrumOfTheSeas = quantumClassContent("spectrum");
export const odysseyOfTheSeas = quantumClassContent("odyssey");
