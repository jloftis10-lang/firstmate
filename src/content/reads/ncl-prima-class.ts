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
 * Prima class: Prima (2022), Viva (2023).
 * Prima Plus: Aqua (2025), Luna (2026) — the stretched version.
 *
 * MY RESEARCH, NOT OPERATOR-CONFIRMED. Cabin and traps are `verified: false`.
 *
 * The one genuinely important cabin fact on this class is the slides.
 * The Drop and The Rush run from deck 18 all the way down to a deck 8
 * terminus, and in doing so they pass the balconies between 8 and 16 —
 * on some cabins the structure passes straight through the balcony. That
 * comes from a reviewer who actually sailed the ship, which makes it the
 * most credible of the "avoid" claims, and it's the thing to check before
 * placing anyone in a family suite.
 *
 * Two pieces of good news worth telling a client, because both cut
 * against what they'll have read:
 *
 *   - **Nothing sits under the go-kart track.** The Speedway occupies
 *     decks 18 to 20 and what's directly beneath it is deck 17 — the pool
 *     deck — not cabins. The nearest staterooms are two decks below that.
 *   - **Ocean Boulevard carries no cabins.** The wraparound promenade on
 *     deck 8 has no staterooms opening onto it, so the promenade-privacy
 *     problem that bites on other lines simply doesn't exist here.
 *
 * Deliberately NOT encoded: the obstructed-cabin list and the "avoid
 * these cabin numbers" blocks for the theatre and pool deck. They come
 * from a single SEO site which concedes in the same breath that NCL
 * doesn't publish most of them. The decks are recorded; the numbers are
 * not. Also not encoded: any motion claim — nothing class-specific
 * exists — and the studio count, where two sources differ by a factor
 * of three.
 */

const PRIMA_SOURCES: Source[] = [
  {
    label: "Prima deck plans — 9 cabin decks, balconies 9 to 16, pool on 17",
    url: "https://www.cruisemapper.com/deckplans/Norwegian-Prima-2216",
    checked: "2026-08-18",
  },
  {
    label: "First-hand cabin review — the slides pass through some balconies",
    url: "https://emmacruises.com/norwegian-prima-cabin-reviews-and-cabins-to-avoid-real-photos-i-stayed-onboard/",
    checked: "2026-08-18",
  },
  {
    label: "Speedway occupies decks 18 to 20, above the deck 17 pool deck",
    url: "https://www.cruisemapper.com/deckplans/Norwegian-Prima-2216/deck19-7482",
    checked: "2026-08-18",
  },
  {
    label: "Balcony sizes 45 to 69 sq ft against the largest-ever marketing",
    url: "https://www.lifeinnorway.net/norwegian-prima-balcony-room/",
    checked: "2026-08-18",
  },
  {
    label: "Ride height, weight and clothing requirements",
    url: "https://www.ncl.com/faq/size-age-weight-requirements-for-activities",
    checked: "2026-08-18",
  },
];

function primaClassContent(
  ship: "prima" | "viva" | "aqua" | "luna",
): ShipContent {
  const isPlus = ship === "aqua" || ship === "luna";

  return {
    reviewDue: "2027-02-01",
    sources: [...NCL_SOURCES, ...PRIMA_SOURCES],

    cabin: {
      // MY RESEARCH. Not signed off.
      verified: false,
      placementNote: `Midship, decks 11 to 14. Cabins run across nine decks with the balconies from 9 up to 16, and the two ends of that range are the ones to think about: deck 16 sits directly under the pool deck and the buffet on 17, and deck 9 forward sits over the theatre, which converts to a nightclub at night. Deck 8 is Ocean Boulevard — the wraparound outdoor promenade — and carries no cabins at all, so nobody is living on it.${
        isPlus
          ? " This is the stretched version of the class: about 75 feet longer with more cabins, but the same deck structure, so the deck logic is unchanged."
          : ""
      }`,
      motionAvoid: withShipNote(MOTION_RULE, "I found nothing documented about how this specific hull rides, so that's the general rule rather than a claim about these ships."),
      vibrationNote: VIBRATION_RULE,
      categoryWarnings: [
        isPlus
          ? "The slides on this ship run down the sides of the hull past the balconies. Check the specific cabin against the deck plan before you confirm a family in a large-balcony category — on the original two ships of this class the slide structure passes straight through some balconies, and the family suites with the bigger balconies are the ones reported worst affected."
          : "The Drop and The Rush run from deck 18 down to a terminus on deck 8, passing the balconies on the way — and on some cabins the structure passes straight through the balcony rather than beside it. The family suites with master bedrooms and the larger balconies are the ones reported worst affected. This is the single most important check on this class, and it came from someone who sailed the ship rather than an aggregator.",
        "The balconies on this class are smaller than the marketing implies — roughly 45 to 69 square feet against a launch campaign about the largest staterooms NCL had built. The cabin is genuinely big; the balcony is ordinary. Reviewers split on whether that matters, but a client who bought the advert will notice.",
        "Club Balcony Suite is not a suite. It's a balcony stateroom with perks — earlier dining booking, an amenity, a laundry bag — and no suite-level access to anything. It also sits in the lower service-charge band. Clients hear \"suite\" and expect The Haven; be explicit that it isn't.",
        "The solo studios are midship on decks 12 and 13 at about 95 square feet, with keycard access to a private Studio Lounge and no single supplement. They're small, and for the right solo client that trade is worth making. Sources disagree wildly on how many there are, so check availability rather than assuming.",
        "NCL's own guarantee language for the Club Balcony Suite warns the balcony view may be fully or partially obstructed. If a client cares about the view, don't book a guarantee in that category — pick the cabin.",
      ],
      hazardsAboveBelow: [
        {
          source: "lido",
          where:
            "the pool deck on 17, directly over the deck 16 cabins — chair setup early is the standing complaint",
        },
        {
          source: "buffet",
          where: "the Surfside Café, also on deck 17 above the same cabins",
        },
        {
          source: "theater",
          where:
            "the theatre spans decks 6 to 8 forward and turns into a nightclub at night — the forward cabins on deck 9 are the ones above it",
        },
        {
          source: "kids",
          where:
            "Splash Academy on deck 15, which is itself a cabin deck — so it's a corridor check there rather than an overhead one",
        },
      ],
      obstructedViewNotes:
        "NCL doesn't publish a full obstructed list for this class, and says so obliquely in its own guarantee language — the Club Balcony Suite guarantee warns the balcony may be fully or partially obstructed. What is documented is the slide structure running down the hull past the balconies between decks 8 and 16. Lists of specific cabin numbers do circulate but they come from a single SEO site that admits in the same article that NCL doesn't flag most of them, so I'm not repeating those numbers. Check the specific cabin on the deck plan.",
      connectingNote: withShipNote(CONNECTING_RULE, "Connecting cabins exist on this class but I couldn't find any published inventory, so treat it as something to confirm rather than assume."),
      minorPlacementRule: NCL_MINOR_PLACEMENT,
      elevatorNote:
        "Sixteen elevators, two of them reserved for The Haven — and the layout is the issue rather than the count. The banks are forward and aft with no true midship bank, they're placed at what several passengers describe as dead ends, and there's no continuous fore-and-aft interior corridor, so getting from one end to the other means crossing through an atrium. One reviewer thought there were plenty of lifts; several thought the walk to reach them was the problem. Both can be true.",
      accessibilityNote:
        "This is the class where I'd be most careful with a mobility booking, and it's the corridor layout rather than the lifts. No midship elevator bank, banks reported to sit at dead ends, and no straight fore-to-aft route inside — so a cabin that looks central on the plan can still mean a long indirect walk. Map the actual route from the cabin to the dining room before you commit, and confirm against the accessible deck plan.",
    },

    money: NCL_MONEY,

    traps: {
      // MY RESEARCH. Not signed off.
      verified: false,
      kidAgeHeightRules: isPlus
        ? `The Slidecoaster needs 48 inches. ${NCL_KIDS_RULES}`
        : `Check the go-kart minimum before you promise a child a ride — NCL's own FAQ and the ship's material disagree, one saying 48 inches and the other 55, with an 82-inch maximum and a 265-pound cap either way. That gap is exactly the height of a ten-year-old, so confirm it rather than quoting me. Karts are about $15 for ten laps. The Drop needs 55 inches and The Rush 48, both capping at 330 pounds. Closed flat shoes for the karts — no Crocs, no flip-flops. ${NCL_KIDS_RULES}`,
      embarkationNote: NCL_EMBARKATION,
      other: [
        "Nothing sits underneath the go-kart track. The Speedway runs across decks 18 to 20 and what's directly below it is the deck 17 pool deck, not staterooms — the nearest cabins are two decks further down. If a client has been warned off this ship over kart noise in the cabins, the deck plan doesn't support it.",
        "Ocean Boulevard, the wraparound promenade on deck 8, has no cabins on it. That means none of the privacy problems you'd warn about on a ship with cabins opening onto a public walkway. From a balcony above you can see down onto the promenade but not into the balconies either side.",
        ...(isPlus
          ? [
              "This ship has no go-kart track — that's the original two. It got the Slidecoaster instead, plus an LED sports court, and the deck 17 pool area is bigger and quieter for losing the Speedway footprint. That's a real point in favour of a deck 16 cabin here versus on Prima or Viva. One deck-plan site does publish a Speedway page for this hull; every other source says there isn't one, and I'd trust the majority.",
              "The Haven here is the largest in the fleet, including two-storey duplex suites that exist nowhere else. If a client is Haven-shopping across NCL, this class is the top of the range.",
            ]
          : []),
      ],
      linePolicy: [NCL_HAVEN_WARNING, NCL_FREESTYLE, ...NCL_FLEET_TRAPS],
    },
  };
}

export const norwegianPrima = primaClassContent("prima");
export const norwegianViva = primaClassContent("viva");
export const norwegianAqua = primaClassContent("aqua");
export const norwegianLuna = primaClassContent("luna");
