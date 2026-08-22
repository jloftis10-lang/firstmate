import type { ShipContent, Source } from "@/lib/types";
import type { ObstructionKind } from "@/lib/obstruction";
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
import { nclAttractionRules, type NclAttractionId } from "./ncl-attractions";
import {
  MOTION_RULE,
  QUIET_DEFAULT_RULE,
  VIBRATION_RULE,
  withShipNote,
} from "./operator-rules";

/**
 * Prima class: Prima (2022), Viva (2023).
 * Prima Plus: Aqua (2025), Luna (2026) — stretched, about 75 feet longer.
 *
 * CABIN AND TRAPS SIGNED OFF by Jimmy, 2026-08-19. First Norwegian unit.
 *
 * MONEY IS STILL UNSIGNED. `NCL_MONEY` is shared line-wide and remains
 * `verified: false` — the Norwegian money and line-policy block was
 * raised at this review and not ruled on, so all 20 NCL hulls stay
 * part-verified until it is. That is deliberately not being inferred
 * from silence.
 *
 * HIERARCHICAL, and the split is real rather than tidy: Prima/Viva is
 * the base and Aqua/Luna is a Prima Plus overlay, because the upper-deck
 * attraction layout is materially different. Prima and Viva have the
 * Speedway go-kart track; Aqua and Luna don't, and have the Slidecoaster
 * instead. A flat four-ship record would quote one hull's ride — and its
 * height minimum — for a ship that doesn't have it.
 *
 * IT ADDED AN OBSTRUCTION KIND, and this is the one that most justifies
 * the whole taxonomy. The Drop and The Rush run from deck 18 down to a
 * deck 8 terminus, passing the balconies on the way — and on some cabins
 * the slide structure comes INTO the balcony rather than passing outside
 * it. That is not a view problem, and "obstructed" is not merely
 * imprecise about it, it's the wrong word: the client keeps their view
 * and loses floor. `slide-intrusion` with the effect `space-intrusion`
 * is now its own kind. The rooms with the biggest balconies are reported
 * worst affected, which is the opposite of what anyone expects.
 *
 * Two findings that cut in the client's favour, and killing a false
 * alarm is worth as much as finding a real one:
 *
 *   - NOTHING SITS UNDER THE GO-KART TRACK. The Speedway is a top-deck
 *     attraction on 18 to 20; directly beneath it is the deck 17 pool
 *     deck, not staterooms. A client warned off this ship over kart
 *     noise in the cabin has been misinformed.
 *   - OCEAN BOULEVARD CARRIES NO CABINS. The deck 8 wraparound promenade
 *     has no staterooms opening onto it, so the Promenade-privacy
 *     problem resolved on Voyager/Freedom does NOT inherit here. This is
 *     not Royal Promenade geometry.
 *
 * Corrections his pass made:
 *   - Quiet default moves from 11-14 to DECKS 10 TO 13 midship. I'd
 *     flagged the start at 11 as arbitrary and it was; NCL's own Studio
 *     inventory puts the solo rooms midship on 12 and 13, and 10 to 13
 *     is the strongest contiguous cabin-heavy band. Deck 9 needs the
 *     check below; 14 and up need individual overhead checks.
 *   - SPEEDWAY IS 55 INCHES. My record said NCL's FAQ and the ship
 *     material disagreed, 48 against 55, and told the advisor to check.
 *     Resolved against NCL's current activity FAQ: 55 minimum, 82
 *     maximum. Recording a live conflict is honest; leaving a resolved
 *     one on the page is an unfinished job. The weight cap stays
 *     source-dated because that one genuinely does vary by locale.
 *   - The balcony size range is deleted as a class constant, the fourth
 *     time. NCL's own category pages show it varying substantially —
 *     an aft-facing balcony is much larger than a standard one.
 *   - The studios get STRONGER, not softer. NCL's own words are "no
 *     single supplement required", so the Quantum reframing does not
 *     apply here — that correction was about Royal's studios not being
 *     supplement-waived doubles, and NCL states the thing directly.
 *     About 94 to 95 square feet, midship on 12 and 13, private Studio
 *     Lounge. Count still omitted.
 *   - Viva also lists newer Solo products on decks 12, 14 and 16. Those
 *     are NOT the Studio category and the record keeps them apart.
 *   - "Largest Haven in the fleet" is demoted to the factual attributes.
 *     Marketing superlatives age badly as newer ships arrive.
 *   - THE ACCESSIBILITY WARNING IS PULLED. It was the strongest one in
 *     the database and it rested on ambiguous deck-plan reading: no
 *     midship bank, banks at dead ends, no continuous fore-and-aft
 *     interior corridor. None of that is confirmed, and a wrong mobility
 *     recommendation is the most expensive kind. Bank layout is
 *     uncharted and the record now says so.
 *
 * Deliberately NOT encoded: the obstructed-cabin list and the "avoid
 * these numbers" blocks for the theatre and pool deck — single SEO site
 * which concedes in the same article that NCL doesn't publish most of
 * them; the specific cabins affected by the slide intrusion, which need
 * mapping from deck-plan geometry and photographs rather than inferring;
 * any motion claim; the studio count; and the elevator bank layout.
 */

type PrimaShip = "prima" | "viva" | "aqua" | "luna";

/** Prima Plus — the stretched pair, with a different upper-deck layout. */
const PRIMA_PLUS = new Set<PrimaShip>(["aqua", "luna"]);

const PRIMA_SOURCES: Source[] = [
  {
    label:
      "NCL Prima stateroom inventory — cabins on decks 9 to 16, Studios midship on 12 and 13 (checked by Jimmy)",
    url: "https://www.ncl.com/cruise-ship/prima/staterooms",
    checked: "2026-08-19",
  },
  {
    label:
      "NCL activity FAQ — Speedway 55in minimum, 82in maximum; Slidecoaster 48in",
    url: "https://www.ncl.com/faq/size-age-weight-requirements-for-activities",
    checked: "2026-08-19",
  },
  {
    label: "First-hand cabin review — the slide structure enters some balconies",
    url: "https://emmacruises.com/norwegian-prima-cabin-reviews-and-cabins-to-avoid-real-photos-i-stayed-onboard/",
    checked: "2026-08-19",
  },
  {
    label: "Speedway occupies decks 18 to 20, above the deck 17 pool deck",
    url: "https://www.cruisemapper.com/deckplans/Norwegian-Prima-2216/deck19-7482",
    checked: "2026-08-19",
  },
  {
    label: "Aqua is built around the Slidecoaster; no Speedway on this hull",
    url: "https://www.ncl.com/cruise-ship/aqua",
    checked: "2026-08-19",
  },
  {
    label: "Viva lists newer Solo products on decks 12, 14 and 16, distinct from Studios",
    url: "https://www.ncl.com/cruise-ship/viva/staterooms",
    checked: "2026-08-19",
  },
];

/* ------------------------------------------------------------------ *
 * LAYER 1 — shared Prima-class geometry.
 * ------------------------------------------------------------------ */

/**
 * Decks 10 to 13 midship. I had 11 to 14 and could not say why it
 * started at 11 — which is the same arbitrary-band error as the Icon
 * "8 to 12" guess.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-19).
 */
const PRIMA_QUIET_DEFAULT = `Midship on decks 10 to 13. ${QUIET_DEFAULT_RULE} Cabins run from 9 up to 16 here, and 10 to 13 is the strongest contiguous cabin-heavy band — NCL's own inventory puts the solo Studios midship on 12 and 13, which tells you something about where the quiet middle of this ship is. Deck 9 needs the check below it, because the forward end sits over the theatre. From 14 up, check what's overhead on the specific cabin rather than trusting the band. And let the actual vertical scan override the default: this is a starting point, not a verdict.`;

const PRIMA_DECK_16 =
  "Deck 16 is the top of the cabin range and the pool deck and the Surfside Café sit directly on 17 above it — a strong negative for a light sleeper and a reasonable trade for someone who wants the pool one flight up. Ask which client you have.";

/**
 * THE SLIDE INTRUSION. The reason the obstruction taxonomy grew a
 * `space-intrusion` effect.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-19).
 */
const SLIDE_INTRUSION =
  "The most important check on this class, and it isn't what anyone expects. The Drop and The Rush run from deck 18 down to a terminus on deck 8, passing the balconies on the way — and on some cabins the slide structure comes INTO the balcony rather than passing outside it. Don't file that under \"obstructed view\", because the view is fine; what's gone is balcony space. The rooms with the LARGEST balconies are the ones reported worst affected, which is backwards from every instinct, so check the specific cabin against the deck plan before you confirm a family in a big-balcony category. This came from someone who sailed the ship and photographed it, which is why it's here at all — and the exact affected cabin numbers are not, because those need mapping from the geometry rather than guessing.";

/**
 * NCL admits the obstruction risk in its own guarantee terms, which is
 * more useful than any list — it's the line telling you the guarantee
 * doesn't protect the view.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-19).
 */
const GUARANTEE_WARNING =
  "NCL's own guarantee language warns that an assigned guarantee balcony may be fully or partially obstructed. That's the line saying in its own terms that a guarantee category does not protect the view — so if the client cares about what they'll see, pick the cabin rather than taking the guarantee rate.";

/**
 * The studios, and this is the one place a Royal correction does NOT
 * transfer. On Quantum the framing had to change because those rooms
 * are about avoiding the 200% solo rate rather than a waived
 * supplement. NCL states "no single supplement required" itself.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-19).
 */
const PRIMA_STUDIOS =
  "The solo Studios are a genuine reason to put a single client on this class. They're midship on decks 12 and 13 at about 94 to 95 square feet, with keycard access to a private Studio Lounge, and NCL's own words are that no single supplement is required — so you can say that plainly here rather than hedging it. They're small, and for the right solo traveller that's a trade worth making. I'm not giving you a count: sources differ wildly, so check live availability.";

/* ------------------------------------------------------------------ *
 * LAYER 2 — Prima Plus overlay (Aqua, Luna).
 * ------------------------------------------------------------------ */

const PRIMA_PLUS_NOTE =
  "This is the stretched Prima Plus version — about 75 feet longer with more cabins, but the same deck structure, so the placement logic above is unchanged.";

const PRIMA_PLUS_UPPER_DECKS =
  "The upper decks are where this pair genuinely differs and it's a point of sale, not a footnote: there is NO Speedway go-kart track on this ship. It has the Aqua Slidecoaster and an LED sports court instead, and losing the Speedway footprint makes the deck 17 pool area bigger and quieter — which is a real argument for a deck 16 cabin here over the same cabin on Prima or Viva. One deck-plan aggregator does publish a Speedway page for this hull; NCL's own current product doesn't, and NCL wins that disagreement.";

const PRIMA_PLUS_HAVEN =
  "The Haven on this pair is expanded relative to the rest of the fleet and includes two-storey duplex suites that don't exist elsewhere. Those are the facts to sell. I'm deliberately not calling it the largest Haven in the fleet — that's marketing language and it ages the moment a newer ship arrives.";

const ATTRACTIONS: Record<PrimaShip, NclAttractionId[]> = {
  prima: ["speedway", "the-drop", "the-rush"],
  viva: ["speedway", "the-drop", "the-rush"],
  aqua: ["slidecoaster"],
  luna: ["slidecoaster"],
};

function primaClassContent(ship: PrimaShip): ShipContent {
  const isPlus = PRIMA_PLUS.has(ship);

  // Slide intrusion is the class's signature mechanism and it is not a
  // view obstruction — see src/lib/obstruction.ts. No other kind is set:
  // NCL doesn't publish what blocks what, and the field carries
  // knowledge rather than guesses.
  const kinds: ObstructionKind[] = ["slide-intrusion"];

  return {
    reviewDue: "2027-02-01",
    sources: [...NCL_SOURCES, ...PRIMA_SOURCES],

    cabin: {
      // Signed off by Jimmy, 2026-08-19. Corrections at the top of the file.
      verified: true,
      placementNote: `${PRIMA_QUIET_DEFAULT} ${PRIMA_DECK_16} Deck 8 is Ocean Boulevard — the wraparound outdoor promenade — and it carries no cabins at all, so nobody is living on it.${isPlus ? ` ${PRIMA_PLUS_NOTE}` : ""}`,
      motionAvoid: withShipNote(
        MOTION_RULE,
        "I found nothing documented about how these specific hulls ride, so that's the general rule rather than a claim about these ships.",
      ),
      vibrationNote: VIBRATION_RULE,
      categoryWarnings: [
        SLIDE_INTRUSION,
        PRIMA_STUDIOS,
        ...(ship === "viva"
          ? [
              "One thing to keep straight on this ship: NCL also lists newer Solo products on decks 12, 14 and 16, and those are NOT the Studio category. Different rooms, different terms — don't quote Studio pricing or the Studio Lounge access for a room that's simply sold to a single traveller.",
            ]
          : []),
        "Club Balcony Suite is not a suite. It's a balcony stateroom with perks — earlier dining booking, an amenity, a laundry bag — with no suite-level access to anything, and it sits in the LOWER service-charge band. Clients hear \"suite\" and picture The Haven; be explicit that it isn't, especially with anyone coming from another line.",
        "Don't quote a balcony size for this class from memory or from the launch campaign. NCL's own category pages show the dimensions varying substantially — an aft-facing balcony is far larger than a standard one — so read the figure for the specific ship and category. What is fair to say is that the cabin is genuinely big and the balcony is more ordinary than the advertising implied.",
        GUARANTEE_WARNING,
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
        "The documented issue on this class is not a blocked view at all — it's the slide structure running down the hull past the balconies between decks 8 and 16, entering the balcony on some cabins. Treat that as a geometry check on the specific room. Beyond it, NCL doesn't publish a full obstructed list and says so obliquely in its own guarantee terms, which warn that a guarantee balcony may be fully or partially obstructed. Lists of specific cabin numbers circulate, but they come from a single site that concedes in the same article that NCL doesn't flag most of them, so none of those numbers are repeated here.",
      obstructionKinds: kinds,
      connectingNote:
        "Connecting cabins exist on this class but I couldn't find any published inventory, so treat it as something to confirm rather than assume.",
      minorPlacementRule: NCL_MINOR_PLACEMENT,
      accessibilityNote:
        "I'm deliberately giving you less here than an earlier version of this record did, and the reason matters. That version warned there was no midship lift bank, that the banks sat at dead ends, and that there's no continuous fore-and-aft interior corridor — the strongest accessibility warning in this whole database, resting on ambiguous deck-plan reading. None of it is confirmed, and a wrong mobility recommendation is the most expensive kind to get wrong. So: the lift bank layout is UNCHARTED here. Map the actual route from the specific cabin to the dining room and the theatre before you commit, and confirm it against NCL's accessible deck plan rather than against any rule I could give you.",
    },

    // STILL UNSIGNED, line-wide. See the file header.
    money: NCL_MONEY,

    traps: {
      // Signed off by Jimmy, 2026-08-19, with the Speedway height
      // conflict resolved and the attraction inventory split per hull.
      verified: true,
      kidAgeHeightRules: `${nclAttractionRules(ATTRACTIONS[ship])} ${NCL_KIDS_RULES}`,
      embarkationNote: NCL_EMBARKATION,
      other: [
        ...(isPlus
          ? [PRIMA_PLUS_UPPER_DECKS, PRIMA_PLUS_HAVEN]
          : [
              "Nothing sits underneath the go-kart track. The Speedway runs across decks 18 to 20 and what's directly below it is the deck 17 pool deck, not staterooms — the nearest cabins are two decks further down. If a client has been warned off this ship over kart noise in the cabin, the deck plan doesn't support it, and correcting that is worth as much as finding a bad cabin.",
            ]),
        "Ocean Boulevard, the wraparound promenade on deck 8, has no cabins on it. This is NOT Royal Promenade geometry — there's no corridor of stateroom windows looking onto a public walkway, so none of the privacy problems you'd warn about on those ships apply here. From a balcony above you can see down onto the promenade but not into the balconies either side.",
      ],
      linePolicy: [NCL_HAVEN_WARNING, NCL_FREESTYLE, ...NCL_FLEET_TRAPS],
    },
  };
}

export const norwegianPrima = primaClassContent("prima");
export const norwegianViva = primaClassContent("viva");
export const norwegianAqua = primaClassContent("aqua");
export const norwegianLuna = primaClassContent("luna");
