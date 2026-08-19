import type { ShipContent, Source } from "@/lib/types";
import type { ObstructionKind } from "@/lib/obstruction";
import {
  CONNECTING_RULE,
  MOTION_RULE,
  PUBLIC_SPACE_SANDWICH,
  QUIET_DEFAULT_RULE,
  VIBRATION_RULE,
  withShipNote,
} from "./operator-rules";

/**
 * Viking Star (2015) — the first record composed through the intake
 * pipeline rather than drafted from search snippets.
 *
 * MY COMPOSITION FROM OPERATOR-VERIFIED FACTS. All three blocks are
 * `verified: false`. That is not hedging: the FACTS below were read off
 * Viking's own 2022 deck-plan PDF by Jimmy and are solid. What nobody
 * has signed is this WORDING — the composed record, which is the part I
 * wrote. Extraction replaces the research half of a review, not the
 * judgment half, and this file is waiting on the judgment half.
 *
 * ONLY VIKING STAR. Its eight same-generation sisters — Sea, Sky, Orion,
 * Jupiter, Venus, Mars, Neptune, Saturn — deliberately get NO record.
 * The extraction returned "not checked" for every one of them: their
 * hull dimensions, guest counts and stateroom category sizes match
 * Star's, but nobody compared the deck stack or venue placement, which
 * is exactly what this record is about. Writing one factory across nine
 * hulls would assert a sameness that was explicitly not established, and
 * "not checked" was reported separately from "no differences found"
 * precisely so it could not be quietly upgraded here.
 *
 * Vela, Vesta and Mira are a different class entirely — 998 guests, 784
 * feet, 101-foot beam, every category larger. They are not covered by
 * this file in any respect.
 *
 * THE DECK STACK, from Viking's own plan:
 *
 *   A   no cabins   Medical Center
 *   1   no cabins   Nordic Spa, Fitness, salon, shops, The Living Room,
 *                   bar, Guest Services, The Chef's Table, The Kitchen
 *                   Table, Manfredi's, private dining
 *   2   no cabins   Torshavn, shops, Promenade, The Theater, The
 *                   Restaurant, two cinemas, bar, atrium
 *   3   CABINS      atrium, launderette
 *   4   CABINS      launderette
 *   5   CABINS      launderette
 *   6   CABINS      launderette (bridge, not a guest venue)
 *   7   CABINS      Explorers' Lounge, Mamsen's, Wintergarden, Pool
 *                   Grill, Pool Bar, Main Pool, Lanai, World Café,
 *                   Aquavit Terrace, Infinity Pool, hot tub
 *   8   CABINS      Explorers' Lounge upper level, open-to-below and
 *                   retractable-roof areas
 *   9   no cabins   Sports Deck, hot tub, outdoor recreation
 *
 * WHAT THE RULE PRODUCES, AND WHERE JUDGMENT OVERRODE IT. Run purely on
 * cabins-above-and-below, decks 4, 5, 6 and 7 all pass. The answer is 4
 * and 5, and the two exclusions are the interesting part:
 *
 *   - Deck 6 passes arithmetically and fails in practice, because the
 *     deck above it is 7 — the single most mixed-use deck on the ship.
 *   - Deck 7 passes arithmetically and fails hardest of all, because it
 *     carries the pools, the buffet and two bars ON ITS OWN DECK.
 *
 * That is `PUBLIC_SPACE_SANDWICH` doing exactly the job it was named for
 * two reviews ago, and it is the reason `quietCandidates()` and
 * `mixedUseDecks()` are separate functions.
 *
 * THE LAUNDERETTE CAVEAT. Decks 3 through 6 are all technically
 * mixed-use, on the strength of a self-service launderette apiece. That
 * is true and it is not advice — nobody is kept awake by a washing
 * machine two doors down. The record says so rather than flagging four
 * decks for nothing.
 *
 * Deliberately NOT encoded: obstructed cabin numbers and any
 * `obstructionKinds`, because Viking's plan was not established to mark
 * obstruction at all and the extraction correctly refused to turn "I
 * could not inspect it" into "they don't mark it"; the elevator COUNT,
 * because the drawing shows two lift cores without establishing car
 * numbers; and any forward/midship/aft LABEL for those cores, because
 * reading position off a drawing is how three accessibility warnings got
 * withdrawn.
 */

const VIKING_SOURCES: Source[] = [
  {
    label:
      "Viking Ocean deck plans PDF — full Viking Star deck stack, cabin decks 3-8, venue placement (read by Jimmy)",
    url: "https://cms-assets.viking.com/ocean/ships/deck_plan/2022-VOC-Deckplans.pdf",
    checked: "2026-08-19",
  },
  {
    label: "Viking Star ship page — 930 guests, 745ft, categories OS/ES/PS/PV/DV/V",
    url: "https://www.vikingcruises.com/oceans/ships/viking-star.html",
    checked: "2026-08-18",
  },
  {
    label:
      "Viking inclusive value — Wi-Fi, one shore excursion per port, beer/wine/soft drinks at lunch and dinner, specialty dining, spa access, room service, launderettes",
    url: "https://www.vikingcruises.com/oceans/why-viking/viking-difference/viking-inclusive-value.html",
    checked: "2026-08-18",
  },
  {
    label:
      "Silver Spirits — $27 per guest per day, 15% service charge included, age 21, both guests must buy",
    url: "https://www.vikingcruises.com/oceans/my-trip/silver-spirits-beverage-package/index.html",
    checked: "2026-08-18",
  },
  {
    label: "Gratuities are not in the fare — around $20 per person per night",
    url: "https://www.vikingcruises.com/oceans/frequently-asked-questions.html",
    checked: "2026-08-18",
  },
  {
    label: "No guests under 18; no casinos; no inside staterooms",
    url: "https://www.vikingcruises.com/oceans/why-viking/viking-difference/what-viking-is-not.html",
    checked: "2026-08-19",
  },
];

/**
 * Decks 4 and 5 midship, off Viking's own plan.
 *
 * FACTS OPERATOR-VERIFIED (Jimmy, 2026-08-19). The wording is mine.
 */
const VIKING_STAR_QUIET_DEFAULT = `Midship on deck 4 or 5. ${QUIET_DEFAULT_RULE} On this ship the cabin decks are 3 through 8, and the band comes out narrow for reasons worth knowing: deck 3 fails below, because deck 2 under it is the theatre, the main restaurant, the cinemas and the promenade. Deck 8 fails above, because deck 9 is the sports deck. And decks 6 and 7 both pass the above-and-below test on paper while failing in practice — see the deck 7 note, which is the important one on this hull.`;

/**
 * DECK 7. The most mixed-use deck in the catalog, and the clearest
 * vindication of the rule Jimmy named at the Norwegian Sun review.
 */
const VIKING_STAR_DECK_7 = `Deck 7 is the one to understand on this ship, and the vertical scan will tell you it's fine. ${PUBLIC_SPACE_SANDWICH} Deck 7 carries staterooms AND the Main Pool, the Infinity Pool, the Pool Grill, the Pool Bar, the World Café buffet, the Aquavit Terrace, Mamsen's, the Wintergarden, the Lanai and the lower level of the Explorers' Lounge. That is more public space sharing a cabin deck than anything else in this catalog — worse than Norwegian Sun's deck 11, which was the previous worst. A client who asks for a high deck with a veranda is asking for that, and they should be told what it means rather than talked out of it: for someone who wants to walk out of their room into the pool and the buffet it's genuinely good, and for a light sleeper it's the wrong end of the ship. Deck 6 gets a lighter version of the same problem, because deck 7 sits directly over it.`;

const LAUNDERETTE_CAVEAT =
  "One thing not to worry about, because a deck plan makes it look worse than it is: decks 3 through 6 each have a self-service launderette on the cabin deck itself. That technically makes them mixed-use decks and it isn't a reason to move anyone — nobody is kept awake by a washing machine two doors down. The mixed-use warning on this ship is about deck 7 and nothing else.";

/** No `obstructionKinds`: Viking was not established to mark obstruction at all. */
const NO_ESTABLISHED_MECHANISM: ObstructionKind[] = [];

export const vikingStar: ShipContent = {
  reviewDue: "2027-02-01",
  sources: VIKING_SOURCES,

  // Operator-verified. Drives the engine's eligibility gate, which runs
  // before any family logic.
  eligibility: {
    minimumGuestAge: 18,
    note: "Viking states plainly that it carries no guests under 18.",
  },

  // Operator-verified. Resolved before any package economics.
  fareInclusions: {
    state: "known",
    includes: [
      "Wi-Fi",
      "one shore excursion in every port",
      "all onboard meals including the specialty restaurants",
      "beer, wine and soft drinks with lunch and dinner",
      "Nordic Spa and fitness centre access",
      "24-hour room service",
      "self-service launderettes",
    ],
    alcohol: "with-meals",
    upgrade: {
      name: "the Silver Spirits package",
      note: "It's $27 per guest per day with the 15% service charge already in that price, it covers anything up to $18 a glass all day rather than only at meals, and it carries the same all-or-nothing rule as Royal's and Norwegian's packages — both guests in the stateroom have to buy it, for the whole cruise. Minimum age 21.",
    },
  },

  cabin: {
    // MY COMPOSITION from operator-verified facts. Not signed.
    verified: false,
    placementNote: `${VIKING_STAR_QUIET_DEFAULT} ${VIKING_STAR_DECK_7} ${LAUNDERETTE_CAVEAT}`,
    motionAvoid: withShipNote(
      MOTION_RULE,
      "Nothing is documented about how this hull rides, so that's the general rule rather than a claim about this ship.",
    ),
    vibrationNote: VIBRATION_RULE,
    categoryWarnings: [
      "Every stateroom on this ship has a private veranda and there are no inside cabins at all. That changes the conversation rather than simplifying it: there's no interior-versus-balcony trade to make and no balcony scarcity to manage, so the only question left is whether a particular veranda is compromised — by what's above it, what's beside it, or what can see into it. On deck 7 that question has a real answer.",
      "The categories are OS, ES, PS, PV, DV and V — Owner's Suite, Explorer Suite, Penthouse Junior Suite, Penthouse Veranda, Deluxe Veranda and Veranda. Viking publishes total area INCLUDING the veranda rather than splitting the two, so a 270 square foot Deluxe Veranda is not 270 square feet of room. Read the figure for the exact category and know what it's measuring before you compare it to another line's number.",
      "There are no purpose-built solo studios here. What the fare structure does instead is worth knowing, because it changes the arithmetic for a single traveller more than a studio would: Wi-Fi, excursions, meals and drinks with lunch and dinner are already in the price, so the per-person cost gap between this and a cheaper line is narrower than the headline fare suggests.",
    ],
    hazardsAboveBelow: [
      {
        source: "lido",
        where:
          "the Main Pool and the Infinity Pool on deck 7 — on the SAME deck as the cabins there, not above them, which is the whole point",
      },
      {
        source: "buffet",
        where: "the World Café and the Aquavit Terrace, also on deck 7 beside the cabins",
      },
      {
        source: "bar",
        where:
          "the Pool Bar, the Pool Grill and Mamsen's, all on deck 7; the Explorers' Lounge spans 7 and 8",
      },
      {
        source: "theater",
        where:
          "The Theater, the two cinemas and The Restaurant on deck 2 — under the deck 3 cabins",
      },
      {
        source: "sports",
        where: "the Sports Deck on 9, over the deck 8 cabins",
      },
    ],
    obstructedViewNotes:
      "Nothing is established here and that is the honest state rather than a gap. Viking's plan was not confirmed to mark obstructed verandas at all, and \"I could not inspect it\" is not the same as \"they don't mark it\" — that assumption has been wrong seven times in this project. So: read the plan for the specific cabin. What IS structurally known is where a veranda is likely to be compromised on this ship, and it isn't a blocked sea view — it's deck 7, where the veranda opens onto the same deck as the pools and the buffet.",
    obstructionKinds: NO_ESTABLISHED_MECHANISM,
    connectingNote: CONNECTING_RULE,
    accessibilityNote:
      "Viking's own plan shows two passenger lift cores running through the accommodation decks. I'm giving you neither a car count nor a forward/midship/aft label for them: the count isn't established, and reading bank positions off a drawing is exactly how three accessibility warnings in this project got withdrawn. What IS worth planning around is the shape of the ship — the dining and entertainment are low, on decks 1 and 2, while the pools and the buffet are up on 7. That's a real vertical journey twice a day. Confirm the route and the accessible plan for the specific cabin.",
  },

  money: {
    // MY COMPOSITION from operator-verified facts. Not signed.
    verified: false,
    specialtyDiningNote:
      "There is nothing to pre-book and nothing to pay: the specialty restaurants are included in the fare on this line. Reservations are still worth making early for the times they want, but the conversation is about availability rather than cost, which is the opposite of every contemporary line.",
    gratuityPerDayUSD: 20,
  },

  traps: {
    // MY COMPOSITION from operator-verified facts. Not signed.
    verified: false,
    embarkationNote:
      "Not established for this line yet — check Viking's own check-in window rather than assuming it matches Royal's 45 days or Norwegian's 21.",
    other: [
      "This ship carries no guests under 18. That is not a fit question, it's an eligibility one — a family with children cannot sail here at all, and it's the first thing to establish before any other conversation about the ship.",
      "There is no casino. On a line sold on quiet that's a feature rather than an absence, but it's the kind of thing a client notices on night two if nobody mentioned it.",
      "Gratuities are NOT in the fare, at around $20 per person per night. On a line whose entire pitch is inclusive value, that is the one an advisor gets caught by — the client has been told everything is included, and this isn't. Say it at final payment.",
      "Silver Spirits carries the same all-or-nothing rule as Royal's and Norwegian's drink packages: both guests in the stateroom have to buy it, for the whole cruise. An advisor who knows that rule from the contemporary lines will apply it correctly here; one who assumes an inclusive line wouldn't have such a rule will quote half the price.",
      "Deck 7 is the trap on this hull. Staterooms share it with both pools, the buffet, two bars and the lower Explorers' Lounge — more public space on a cabin deck than any other ship in this catalog. Ask which kind of client you have before you sell a deck 7 veranda.",
    ],
  },
};
