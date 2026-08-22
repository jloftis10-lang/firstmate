import type { ShipContent, Source } from "@/lib/types";
import type { ActivityAvailability } from "@/lib/availability";
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
  MOTION_RULE,
  QUIET_DEFAULT_RULE,
  VIBRATION_RULE,
  withShipNote,
} from "./operator-rules";

/**
 * Quantum class: Quantum, Anthem, Ovation (2014–2016).
 * Quantum Ultra: Spectrum (2019), Odyssey (2021).
 *
 * SIGNED OFF by Jimmy, 2026-08-19, against Royal's own ship and activity
 * pages and the current official deck plans. Third Royal class reviewed.
 *
 * A NOTE ON SOURCING, because it decided what is in this file. The
 * "cabins to avoid" sites that dominate search for this class are
 * demonstrably wrong, not merely thin — one places cabins on decks 4 and
 * 5, which carry none; another describes Promenade-view interiors facing
 * the Royal Promenade, a venue this class does not have. That is
 * Voyager-class boilerplate with the ship name swapped. Their obstructed
 * lists also contradict each other on which deck 6 ranges are affected.
 *
 * So no cabin numbers from those sites are encoded, and Jimmy signed that
 * decision explicitly: "when the article gets the actual decks and even
 * the existence of Royal Promenade wrong, none of its cabin-number claims
 * get to survive by default." The official category code and the official
 * plan's obstructed-view marker are the source of truth; anecdote is
 * allowed to add context only after the physical fact is established.
 *
 * Note this cuts the OPPOSITE way from the Icon correction and both are
 * right. On Icon I wrongly said no list exists; here a list exists and is
 * wrong. The rule that satisfies both: go to the official plan.
 *
 * What his pass corrected:
 *   - Decks 11 and 12 DO pass the vertical sandwich test in much of their
 *     length — I was right to question stopping at 10 — but they stay out
 *     of the automatic default, because 11 and 12 carry Adventure Ocean
 *     and 12 also carries the bridge and concierge space. They are
 *     "good after a check", which is a different answer from "default".
 *   - Deck 3 is a BUDGET pick, not a quiet one. It has public area both
 *     above and below parts of its run, so it fails the scan. I had
 *     offered it as the budget option without running the rule on it.
 *   - Two70's geometry is signed; the show noise stays researched. Don't
 *     condemn every aft 6 and 7 cabin.
 *   - The studios are real and this validates what the Icon record says —
 *     but there are TWO studio families, not three: Studio Interior and
 *     Studio Ocean View Balcony. And "no single supplement" is the wrong
 *     framing: these are purpose-built single-occupancy rooms that avoid
 *     booking a double at the standard 200% solo rate, which is what
 *     Royal itself distinguishes them by.
 *   - North Star has a MINIMUM AGE OF 3. I had "no age limit", which is
 *     the kind of thing that gets a family turned away at the queue. Max
 *     weight is 300lb, and the port-day-free structure is per sailing
 *     rather than a fleet promise.
 *   - The elevator sentence claiming "travelers report the aft bank being
 *     the least busy" is DELETED. The rest of the record says the bank
 *     layout is unestablished, so that sentence asserted the existence of
 *     a bank the same file says it cannot locate. His words: exactly the
 *     type of internal contradiction First Mate should never ship.
 *   - Spectrum's private lift is demoted to unresearched. The private
 *     dining, private lounge and exclusive suite area are confirmed.
 *
 * AND IT ADDED A FIELD. RipCord is currently out of service on Quantum
 * herself. That is not a property of the ship and must never harden into
 * one, so it lives in `ShipContent.availability` with a checked date and
 * a source rather than in trap prose — see `src/lib/availability.ts`.
 *
 * Deliberately NOT encoded: any cabin number from the boilerplate sites,
 * the elevator count (16 and 14 both surfaced) or bank layout, which
 * decks carry virtual balconies (sources conflict, including on deck 3),
 * exact forward-oceanview square footages as class constants, RipCord or
 * North Star pricing, and the aft-vibration claim — it comes from the
 * same site that got the deck numbers wrong, and azipod rumble being
 * plausible is not evidence.
 */

const QUANTUM_SOURCES: Source[] = [
  {
    label:
      "Official Quantum deck plans — deck 14 pool/Solarium/Windjammer, deck 13 accommodation, obstructed-view marker in the legend (checked by Jimmy)",
    url: "https://www.royalcaribbean.com/cruise-ships/quantum-of-the-seas/deck-plans",
    checked: "2026-08-19",
  },
  {
    label:
      "Decks 11 and 12 carry Adventure Ocean; deck 12 also the bridge and concierge space",
    url: "https://www.cruisedeckplans.com/ships/deckbydeck.php?deck=11&ship=Quantum-of-the-Seas",
    checked: "2026-08-19",
  },
  {
    label: "Deck 3 has public area above and below parts of its cabin run",
    url: "https://cruisesheet.com/cruise-lines/royal-caribbean/quantum-of-the-seas/deck/3",
    checked: "2026-08-19",
  },
  {
    label: "Aft deck 7 interiors can hear Two70 during shows",
    url: "https://www.cruisemapper.com/deckplans/Quantum-Of-The-Seas-802/deck07-1382",
    checked: "2026-08-19",
  },
  {
    label:
      "Single-occupancy Studio Interior category 2W exists on Quantum class, distinguished from the 200% standard solo rate",
    url: "https://www.royalcaribbean.com/aus/en/faq/questions/can-i-purchase-a-stateroom-for-one-person",
    checked: "2026-08-19",
  },
  {
    label: "Obstructed Ocean View Balcony — obstruction described as in most cases a lifeboat",
    url: "https://www.royalcaribbean.com/cruise-ships/quantum-of-the-seas/deck-plans",
    checked: "2026-08-19",
  },
  {
    label: "North Star — 42in minimum, 48in to ride alone, 300lb maximum",
    url: "https://www.royalcaribbean.com/cruise-activities/north-star",
    checked: "2026-08-19",
  },
  {
    label: "North Star minimum age 3, per current Cruise Planner listings",
    url: "https://www.royalcaribbean.com/account/cruise-planner/category/onboardactivities/product/3161",
    checked: "2026-08-19",
  },
  {
    label: "RipCord by iFLY — age 3 and up, under 230lb below six foot, under 250lb at or above",
    url: "https://www.royalcaribbean.com/cruise-activities/ripcord-by-ifly",
    checked: "2026-08-19",
  },
  {
    label: "Virtual Balcony is an ~80-inch HD screen showing real-time exterior views",
    url: "https://www.royalcaribbean.com/faq/questions/what-is-a-virtual-balcony",
    checked: "2026-08-19",
  },
  {
    label: "Spectrum is the first Quantum Ultra ship, with the Suite Neighborhood / Suite Club",
    url: "https://www.royalcaribbean.com/cruise-ships/spectrum-of-the-seas",
    checked: "2026-08-19",
  },
];

/**
 * Decks 8 to 10 midship, and the interesting part is why it STOPS at 10
 * when 11 and 12 pass the sandwich test.
 *
 * They do pass — cabins above and below much of both. But passing the
 * vertical scan isn't the whole question: 11 and 12 carry Adventure Ocean
 * on the deck itself, and 12 also carries the bridge and concierge space.
 * So they are good-after-a-check rather than automatic, which is a
 * distinction the product should be able to express.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-19).
 */
const QUANTUM_QUIET_DEFAULT = `Midship on decks 8, 9 or 10. ${QUIET_DEFAULT_RULE} Decks 11 and 12 are the interesting case on this class: they DO pass that test through much of their length, so they're not bad decks — but they're not automatic either, because 11 and 12 carry Adventure Ocean on the deck itself and 12 also has the bridge and concierge space. Treat them as good once you've checked what the specific cabin sits beside, rather than as part of the default.`;

/**
 * The class's structural gift, and it's a real one: the pool deck carries
 * no cabins, so exactly one deck takes the overhead noise.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-19).
 */
const QUANTUM_DECK_13 =
  "Deck 14 is the Solarium, the main pool and the Windjammer, and it carries no cabins at all — which is cleaner than most hulls manage. That puts all the overhead exposure on deck 13: it's the deck sitting under the pool and the buffet, so it gets the early chair-scraping and the late music. Everything from 8 down is sandwiched between other cabin decks.";

/**
 * Deck 3 as a budget pick with the scan run on it — which is what I
 * failed to do first time. It has public area above and below parts of
 * its run, so it does not get offered as a quiet answer.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-19).
 */
const QUANTUM_DECK_3 =
  "Deck 3 has oceanviews down low and they're the budget answer on this class — but sell them as budget, not as quiet. Parts of deck 3's cabin run have public area both above and below, so it fails the sandwich test rather than passing it, and low-and-cheap is a different recommendation from low-and-calm. Check what's over and under the specific cabin.";

/**
 * TWO studio families, not three. The correction matters because an
 * advisor searching for a "studio balcony" that doesn't exist wastes a
 * call, and because the pricing framing was wrong.
 */
const QUANTUM_STUDIOS =
  "This class has genuine purpose-built single-occupancy cabins, and it's the reason to point a solo client at these ships rather than anywhere else in the fleet. There are two families, not three: Studio Interior — category 2W, from about 101 square feet with a double bed — and Studio Ocean View Balcony. Around 28 of them on the original design, roughly split 16 interior and 12 balcony. Frame the value carefully: the point isn't a waived supplement, it's that these are rooms built and priced for one person, so the client avoids booking an ordinary double at Royal's standard 200% solo rate. Royal itself draws that distinction, and it's the sentence that sells it.";

/** Quantum only. A status with a date, not a fact about the hull. */
const QUANTUM_RIPCORD_STATUS: ActivityAvailability[] = [
  {
    activity: "RipCord by iFLY, the skydiving simulator",
    status: "out-of-service",
    checked: "2026-08-19",
    source: "https://www.royalcaribbean.com/cruise-ships/quantum-of-the-seas",
    note: "Royal's own live ship page lists it as unavailable on this hull. Her sisters are unaffected, and this is exactly the kind of thing that comes back into service without anyone updating a record — so if a family is booking for the tunnel, confirm it for their sailing.",
  },
];

function quantumClassContent(
  ship: "quantum" | "anthem" | "ovation" | "spectrum" | "odyssey",
): ShipContent {
  const isSpectrum = ship === "spectrum";
  const isAnthem = ship === "anthem";
  const isQuantum = ship === "quantum";

  return {
    reviewDue: "2027-02-01",
    sources: [...ROYAL_SOURCES, ...QUANTUM_SOURCES],

    // Per ship, never per class — one hull's broken attraction must not
    // spread to its sisters through the factory.
    ...(isQuantum ? { availability: QUANTUM_RIPCORD_STATUS } : {}),

    cabin: {
      // Signed off by Jimmy, 2026-08-19. Corrections at the top of the file.
      verified: true,
      placementNote: isSpectrum
        ? `${QUANTUM_QUIET_DEFAULT} SPECTRUM BREAKS THE CLASS PATTERN AND IT'S THE ONE THING NOT TO INHERIT. Where the other four stop their cabins below the pool deck, this hull carries staterooms up on 15 and 16 as part of the gated Suite Club neighbourhood forward — Royal built her as the first Quantum Ultra around exactly that concept. So the class reassurance that nothing sits above deck 13 does NOT hold here. Check where the specific cabin sits rather than applying the class rule. ${QUANTUM_DECK_3}`
        : `${QUANTUM_QUIET_DEFAULT} ${QUANTUM_DECK_13} ${QUANTUM_DECK_3}`,
      motionAvoid: MOTION_RULE,
      vibrationNote: withShipNote(
        VIBRATION_RULE,
        "I found aft-vibration reports for this class but only from sources that got other facts about these ships plainly wrong, so I'd apply the general rule rather than treat it as a claim about these hulls.",
      ),
      categoryWarnings: [
        QUANTUM_STUDIOS,
        "The Virtual Balcony interiors need one sentence before booking. Royal's own description is accurate and worth using: it's a roughly 80-inch floor-to-ceiling HD screen showing a real-time view of what's outside. What the reviews add — and this is passenger experience rather than ship fact — is that it glows at night, the supplied curtains don't fully kill it, and there IS a remote to switch it off that guests routinely don't find; one reviewer didn't until day six. If they're a light-sensitive sleeper, the line to say is that the Virtual Balcony is an actual large display inside the room, not a window.",
        "Two70 is the aft venue and it spans decks 5, 6 and 7 as a vertical volume, centred on 5 and 6 with its upper structure reaching into 7. Aft interiors on deck 7 are reported to hear it during shows. That's a check on the specific cabin, not a reason to write off every aft cabin on 6 and 7 — the reports are researched rather than confirmed.",
        "The forward-facing oceanviews are the value pick here, with a forward corner category that's substantially larger again. But sources use \"Spacious\" and \"Ultra Spacious\" inconsistently across room families, so those adjectives carry no information — match the exact square footage for the ship and category on the booking screen rather than comparing labels. I'm not encoding class-wide dimensions for the same reason.",
      ],
      hazardsAboveBelow: [
        {
          source: "lido",
          where:
            "deck 14, over the deck 13 cabins — the pool deck itself carries no cabins on this class, so all of it lands on 13",
        },
        {
          source: "buffet",
          where: "the Windjammer, also on deck 14 aft, above the same cabins",
        },
        {
          source: "theater",
          where:
            "Two70 as a vertical volume across decks 5 to 7 aft, so the aft cabins on 6 and 7 sit alongside and above its upper level",
        },
      ],
      obstructedViewNotes:
        "Two authoritative things exist here and neither is a blog list. Royal sells obstruction as its own booking category — Obstructed Ocean View Balcony — and describes the cause as, in most cases, a lifeboat. And Royal's official deck plan carries an explicit obstructed-view marker in its legend, so the plan itself is cabin-level obstruction data. Those two beat any deck number. Cabin-number lists for this class do circulate, but the sites publishing them place cabins on decks that carry none and describe a Royal Promenade this class doesn't have, so none of their numbers are repeated here — read the category code and the official plan marker for the specific cabin.",
      obstructionKinds: ["lifeboat-davit"],
      connectingNote:
        "Connecting options are genuinely good on this class — there are explicit connecting categories for balconies and for interiors including the virtual-balcony rooms, and configurations pairing a Studio Interior with an adjacent balcony. That last one is worth knowing for a solo travelling alongside family. All of it still needs Royal's own connecting marker on the specific pair.",
      minorPlacementRule: ROYAL_MINOR_PLACEMENT,
      accessibilityNote:
        "One real advantage here: the pool deck sits above all the cabins rather than among them, so nobody walks through a pool crowd to get home, and the atrium lifts are glass and easy to orient by. What I can't give you is the elevator count or the bank layout — two different counts surfaced and neither is confirmed, and I found nothing establishing where the banks are. So check the deck plan for the specific cabin and confirm it against the accessible plan. Spectrum is the exception to the first sentence: her suite neighbourhood puts cabins up on 15 and 16.",
    },

    money: ROYAL_MONEY,

    traps: {
      // Signed off by Jimmy, 2026-08-19, with North Star's minimum age
      // corrected and RipCord's ship status moved out of prose.
      verified: true,
      kidAgeHeightRules: `North Star has a MINIMUM AGE OF 3 — that one catches families with a toddler who assume a gondola ride has no floor. Beyond that it's 42 inches with an adult, 48 inches to ride alone and a 300-pound maximum. On pricing, don't promise anything fleetwide: the pattern is a complimentary standard ride on port days with an extended sea-day experience charged, but it varies by ship and sailing, so check the Cruise Planner for their date. RipCord, the skydiving simulator, is also age 3 and up, with weight limits of under 230 pounds below six foot and under 250 pounds at six foot or taller; its price varies by ship and destination, so quote it from the Cruise Planner rather than from memory. ${ROYAL_ATTRACTION_RULES} ${ROYAL_KIDS_RULES} ${ROYAL_KIDS_COST}`,
      embarkationNote: ROYAL_EMBARKATION,
      other: [
        "SeaPlex — the bumper cars and sports complex — sits high and aft on decks 15 and 16, with the pool deck and the Windjammer between it and any cabins. There are no staterooms directly beneath it. If a client has read that SeaPlex ruins the rooms below, the deck plan says otherwise, and being able to kill a false alarm is worth as much as finding a real one.",
        ...(isSpectrum
          ? [
              "Spectrum has a gated Suite Club neighbourhood — Royal built her as the first Quantum Ultra around it. Confirmed: exclusive private dining, an exclusive lounge and dedicated suite-guest areas. If your client is in it, that's the pitch; if they're not, be clear that parts of this ship are closed to them in a way they aren't on the other four. One thing often repeated that I could NOT confirm from Royal: a dedicated private lift. Don't promise it.",
              "This one was built for the Asia market and sails there. It takes US bookings, the onboard currency is US dollars and the dining rooms keep Western options — the real friction is the long-haul flight to the homeport, not the product.",
              "Spectrum and Odyssey are both Quantum Ultra and that is NOT a reason to cross-quote them. Odyssey has her own activity mix and Spectrum has venues that don't exist on her. Check the specific ship's page.",
            ]
          : []),
        ...(ship === "odyssey"
          ? [
              "Odyssey is Quantum Ultra like Spectrum, but don't inherit Spectrum's features onto her — no gated Suite Club neighbourhood of that kind, and her own activity mix. Quote from this ship's page.",
            ]
          : []),
        ...(isAnthem
          ? [
              "If a client brings up the 2016 storm, here's the ground truth so you're not caught out: Anthem sailed into severe weather off the US east coast in February 2016, took damage to public areas and cabins, lost the use of one azipod and turned back. Reported figures vary a lot — the Coast Guard finding and the plaintiff filings are far apart on how far she listed — so don't quote a number. Nothing came out of it about the hull design or where to book a cabin. It's a weather-routing story, not a ship story, and it stays out of cabin advice.",
            ]
          : []),
      ],
      linePolicy: [...ROYAL_FLEET_TRAPS],
    },
  };
}

export const quantumOfTheSeas = quantumClassContent("quantum");
export const anthemOfTheSeas = quantumClassContent("anthem");
export const ovationOfTheSeas = quantumClassContent("ovation");
export const spectrumOfTheSeas = quantumClassContent("spectrum");
export const odysseyOfTheSeas = quantumClassContent("odyssey");
