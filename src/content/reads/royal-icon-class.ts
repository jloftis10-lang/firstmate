import type { ShipContent, Source } from "@/lib/types";
import {
  ROYAL_ATTRACTION_RULES,
  ROYAL_DECK_12_NUMBERING,
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
  QUIET_DEFAULT_RULE,
  VIBRATION_RULE,
  withShipNote,
} from "./operator-rules";

/**
 * Icon class: Icon (2024), Star (2025), Legend (2026).
 *
 * SIGNED OFF by Jimmy, 2026-08-19, against Royal's current deck plans and
 * room pages. Second Royal Caribbean class reviewed.
 *
 * The class-level core he promoted:
 *   - Decks 9 to 11 midship is the quiet default.
 *   - Deck 12 needs a check of deck 14 above it, same numbering trick as
 *     Oasis.
 *   - Deck 14 carries pool and high-activity public space overhead from
 *     15 — a check with a real tradeoff, not a veto.
 *   - The Infinite Balcony is a convertible interior living area and is
 *     NOT a traditional verandah. Permanent expectation flag.
 *   - Known interior range 156 to 187 square feet.
 *   - 22 lifts in two banks, FORWARD and MIDSHIP, destination dispatch.
 *   - Connecting family rooms are genuinely available on this class.
 *
 * THE ELEVATOR FINDING IS THE ONE TO CARRY FORWARD. Icon runs 22 lifts in
 * a forward + midship arrangement. The Oasis ships run 24 in a forward +
 * aft arrangement with NOTHING midship. So the Oasis-class warning —
 * "your calmest cabin is also your longest walk to a lift" — is an Oasis
 * fact and is false here. Midship on this class is next to a bank. That
 * is a hard inheritance boundary: no Royal mobility reasoning transfers
 * between these two classes.
 *
 * What his pass corrected in my version:
 *   - My placement note had no quiet band at all, only "rule out deck
 *     14". I flagged that gap myself and guessed decks 8 to 12; the band
 *     is 9 to 11. Deck 8 is heavily integrated with Central Park and
 *     public space, and deck 12 is a check rather than a default.
 *   - "Deck 14 is the avoid" is too strong, the same correction the Oasis
 *     review made. It is a strong negative for a noise-sensitive traveller
 *     and a rational trade for a family that wants the pools close.
 *   - Legend ADDS a traditional-verandah family category. It does not
 *     replace the Infinite one — Royal's own current Legend room page
 *     still lists Family Infinite Ocean View Balcony rooms and marks them
 *     connecting-capable. I had it as a swap, which would have had an
 *     advisor telling a client a category still on sale was gone.
 *   - Interiors are 156 to 187, not 156 to 178. Surfside Family Interiors
 *     are 187 square feet.
 *   - "No cabin-by-cabin obstruction list is published" is DELETED, and
 *     this is the sixth time that claim has been wrong. Royal's official
 *     graphical deck plans mark obstructed-view staterooms along with
 *     connecting and accessible ones. What doesn't exist is a convenient
 *     text table. The data is there; it has to be read off the plan.
 *   - The deck 8 lifeboat and deck 10 obstruction claims are NOT promoted
 *     to class-wide constants. Secondary sources cluster complaints
 *     there; clustering is not a verified mechanism, so no
 *     `obstructionKinds` is set on this class until the plan is imported.
 *   - "No solo or studio cabins" is retracted to unknown. Absence from a
 *     marketing page is not evidence of absence — that is exactly the
 *     Sunshine SportSquare error, and it isn't being repeated.
 *   - The claim that neighbourhood-facing balconies price lower BECAUSE
 *     of noise is deleted. Cabin pricing has too many inputs to pin on
 *     one cause.
 *   - The Surfside connecting-pair claim is generalised: connecting family
 *     rooms exist on this class, but the exact Surfside pair inventory has
 *     to come off the deck plan.
 *
 * Category 6's height hole is partly closed: the requirements run 48 to 52
 * inches DEPENDING ON THE ATTRACTION. Per-slide numbers stay out — the
 * secondary figures conflict.
 *
 * Deliberately NOT encoded: exact deck 14 cabin ranges (Icon, Star and
 * Legend are evolving independently and their published lists don't
 * match), exact obstructed cabin numbers or obstruction mechanisms,
 * whether studio cabins exist, exact Surfside connecting pairs, per-slide
 * height minimums, and anything about how these hulls ride — nothing
 * Icon-specific exists and extrapolating from Oasis would be a guess.
 */

const ICON_SOURCES: Source[] = [
  {
    label:
      "Icon official deck plan — deck 15 pool complex and The Hideaway over deck 14 accommodation (checked by Jimmy)",
    url: "https://www.royalcaribbean.com/content/dam/royal/ships/deckplans-hub/Icon_2250_v2023.pdf",
    checked: "2026-08-19",
  },
  {
    label:
      "Icon room types — Infinite Balcony converts interior living space; Surfside is a young-family neighbourhood",
    url: "https://www.royalcaribbean.com/guides/icon-of-the-seas-room-types",
    checked: "2026-08-19",
  },
  {
    label:
      "Star rooms guide — interiors from 156 sq ft, Surfside Family Interior 187 sq ft, connecting balcony rooms",
    url: "https://www.royalcaribbean.com/guides/star-of-the-seas-rooms",
    checked: "2026-08-19",
  },
  {
    label:
      "22 elevators in forward and midship banks, destination dispatch with lettered car assignment",
    url: "https://www.royalcaribbean.com/guides/new-technology-on-cruise-ships-how-icon-of-the-seas-is-making-waves",
    checked: "2026-08-19",
  },
  {
    label:
      "Official deck plans identify obstructed-view, connecting and accessible staterooms",
    url: "https://www.royalcaribbean.com/guides/cruise-deck-plans",
    checked: "2026-08-19",
  },
  {
    label:
      "Legend Family Ocean View Balcony (category FB) — traditional verandah, 285 sq ft plus 50 sq ft balcony",
    url: "https://www.royalcaribbeanblog.com/2026/06/30/royal-caribbean-legend-of-the-seas-cruise-fanily-balcony-cabin-review-photos",
    checked: "2026-08-19",
  },
  {
    label:
      "Legend rooms page still lists Family Infinite Ocean View Balcony with connecting availability",
    url: "https://www.royalcaribbean.com/cruise-ships/legend-of-the-seas/rooms",
    checked: "2026-08-19",
  },
  {
    label: "Category 6 height requirements run 48 to 52 inches by attraction",
    url: "https://www.royalcaribbean.com/guides/an-insiders-guide-to-family-cruises-onboard-icon-of-the-seas",
    checked: "2026-08-19",
  },
];

/**
 * Decks 9 to 11 midship.
 *
 * Deck 8 fails below on this class the same way it does on Oasis — it is
 * heavily integrated with Central Park and public space. Deck 12 is a
 * check rather than a default because of the numbering trick.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-19).
 */
const ICON_CLASS_QUIET_DEFAULT = `Midship on decks 9, 10 or 11. ${QUIET_DEFAULT_RULE} Deck 8 doesn't make the band — it's heavily integrated with Central Park and public space rather than being a clean cabin deck. ${ROYAL_DECK_12_NUMBERING}, and deck 14 on this class is not uniformly quiet cabin space either. Check what sits over the specific deck 12 cabin before you bless it.`;

/**
 * Deck 14 as a tradeoff, not an avoid. Same correction the Oasis review
 * made, for the same reason: a family that wants the pools two minutes
 * away is making a rational trade, and a veto loses that booking.
 *
 * The exact affected cabins are deliberately absent. Icon, Star and
 * Legend are evolving independently and their published lists do not
 * match hull to hull.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-19).
 */
const ICON_DECK_14_OVERHEAD =
  "Deck 14 is a check rather than a blanket avoid. Royal's own deck plan puts the Chill Island pool complex, The Hideaway and other high-activity outdoor space on deck 15, directly over deck 14 accommodation. For a light sleeper that is a strong negative — early chair-dragging above your head. For a family that wants the pools two minutes away it can be a perfectly rational trade, so ask which client you have before you rule it out. The affected cabin ranges are ship-specific: Icon, Star and Legend are evolving independently and their published lists don't match, so pull the ranges off the current plan for the hull you're booking rather than transferring them between sisters.";

/**
 * The permanent expectation flag. The Infinite Balcony is not a
 * traditional verandah and the difference is not cosmetic — there is no
 * separate exterior door to step through and close behind you.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-19).
 */
const INFINITE_BALCONY =
  "The Infinite Balcony is the signature category and it needs explaining before it's booked, not after. It's an interior living space whose window drops at the touch of a button to open that part of the room to the air — when it's closed, the same area is extra indoor living space. It is fundamentally not a traditional verandah reached through its own exterior door. People who understand that love them; people expecting a conventional balcony feel short-changed. The line to listen for is a client saying they want to step outside and shut the balcony door behind them — that client should not be in one of these. There are ocean-view and Central Park-view versions.";

/**
 * Legend ADDS a traditional-verandah family category. It does not replace
 * the Infinite one — Royal's current Legend room page still sells Family
 * Infinite Ocean View Balcony rooms and marks them connecting-capable.
 *
 * The square footages are RESEARCHED, not confirmed.
 */
const LEGEND_FAMILY_BALCONY =
  "Legend adds a family category the other two don't have: Family Ocean View Balcony, category FB, with a traditional outdoor verandah — reported at around 285 square feet inside plus a 50 square foot balcony, many of them arranged through paired or shared vestibules. Those figures are researched rather than confirmed, so quote them as approximate. What is NOT true, and I had this wrong: Legend has not dropped the Infinite family category. Royal's own current Legend room page still lists Family Infinite Ocean View Balcony rooms and marks them as connecting-capable. So on Legend a family is choosing between two products, not being handed a substitute for the one they saw in a video.";

function iconClassContent(ship: "icon" | "star" | "legend"): ShipContent {
  const isLegend = ship === "legend";

  return {
    reviewDue: "2027-02-01",
    sources: [...ROYAL_SOURCES, ...ICON_SOURCES],

    cabin: {
      // Signed off by Jimmy, 2026-08-19. Corrections at the top of the file.
      verified: true,
      placementNote: `${ICON_CLASS_QUIET_DEFAULT} ${ICON_DECK_14_OVERHEAD} Cabins are spread across eleven decks from 3 up to 17, and the thing that surprises people coming off an Oasis ship is what happens at the top: up there the pools and the suite cabins are on the SAME decks — Chill Island across 15, 16 and 17, the suite neighbourhood forward on 16, 17 and 18 — separated forward-to-aft rather than stacked. Being high here doesn't mean being above it all.`,
      motionAvoid: withShipNote(
        MOTION_RULE,
        "I found nothing documented about how these specific hulls ride — they're very large and new, but I'm not going to infer a calmer ride from tonnage alone.",
      ),
      vibrationNote: VIBRATION_RULE,
      categoryWarnings: [
        INFINITE_BALCONY,
        ...(isLegend ? [LEGEND_FAMILY_BALCONY] : []),
        "Interiors on this class run from about 156 square feet, with the Surfside Family Interiors at 187 — so 156 to 187 is the range I can stand behind, and the category on the booking screen beats any range I could give you. Either way they're meaningfully bigger than the Oasis interiors, which bottom out a good deal lower. If a client is choosing between the two classes on a budget cabin, that's a real point in this one's favour.",
        "Surfside is built as a young-family neighbourhood — Splashaway Bay, Baby Bay and the Water's Edge pool are all inside it. An inward-facing Surfside room deserves an activity check rather than a warning: for a family with small children that proximity is the entire point, and for anybody else it's the thing that will define their week. Ask which one you've got. Don't repeat the story that these rooms price lower because of the noise — cabin pricing has far too many inputs to pin on one cause, and I have no evidence for it.",
        "I could not establish whether this class has studio or solo cabins. Royal's current Icon, Star and Legend room pages show no dedicated Studio category, but a marketing page not listing something is not evidence it isn't there — so treat this as unknown and check the category inventory for the sailing. If you have a solo client who needs a confirmed no-supplement studio, the Quantum ships are where those are documented.",
      ],
      hazardsAboveBelow: [
        {
          source: "lido",
          where:
            "the Chill Island pool complex on deck 15, over the deck 14 cabins — the clearest overhead case on the class, and a tradeoff rather than a veto",
        },
        {
          source: "nightclub",
          where:
            "The Hideaway, the adults-only DJ space, also on 15 above deck 14 accommodation",
        },
        {
          source: "buffet",
          where: "the Windjammer, aft on the same high-activity deck",
        },
      ],
      obstructedViewNotes:
        "Cabin-level obstruction data for this class does exist — Royal's official graphical deck plans mark obstructed-view staterooms along with the connecting and accessible ones. What doesn't exist is a convenient text table you can quote from, so the markings have to be read off the current plan for the specific hull. Secondary sources cluster complaints around deck 8 above the lifeboats and parts of deck 10, but complaint clustering is not a verified mechanism and neither is a rule here. Until the plan is imported, don't tell a client what KIND of obstruction they'd have — only that the plan marks the cabin, or doesn't.",
      connectingNote: withShipNote(
        CONNECTING_RULE,
        "Connecting family rooms genuinely are an option on this class — Royal marks Family Infinite Ocean View Balcony as connecting-capable on Icon and Legend, and its Star material says connecting Ocean View Balcony rooms can be booked together for families or friends. What I can't give you is the exact Surfside pair inventory; that has to come off the current deck plan, and the general rule still applies to every one of them.",
      ),
      minorPlacementRule: ROYAL_MINOR_PLACEMENT,
      elevatorNote:
        "Twenty-two elevators in two banks — forward and midship — running destination dispatch: you pick your deck at a console outside and the system assigns you a lettered car, with no buttons inside. Worth briefing anyone who'd find that stressful. The bank layout is the important part, because it's the opposite of the Oasis ships: those six put all 24 lifts forward and aft with nothing midship, so the warning that your calmest cabin is also your longest walk to a lift is an Oasis fact and it is NOT true here. Midship on this class is next to a bank.",
      accessibilityNote:
        "Better than Oasis on the one thing that matters most for a slower traveller: there's a midship elevator bank here, so the calm cabin and the short walk are the same cabin rather than a trade. The destination-dispatch system is the thing to prepare them for — a panel that assigns you a car is harder to improvise with than a button you press. Beyond that this is a very large ship organised into neighbourhoods, which means horizontal distance as much as vertical, so map their actual daily route before picking a cabin rather than optimising for deck number, and confirm the accessible deck plan for the specific room.",
    },

    money: ROYAL_MONEY,

    traps: {
      // Signed off by Jimmy, 2026-08-19, with the Category 6 height hole
      // partly closed — a range by attraction rather than one minimum.
      verified: true,
      kidAgeHeightRules: `${ROYAL_ATTRACTION_RULES} On this class the waterpark is Category 6, and its height requirements run 48 to 52 inches DEPENDING ON THE ATTRACTION — there is no single minimum for the complex. That's the trap: clearing one slide does not mean a child can ride all six, and finding that out at the top of the stairs ruins an afternoon. I found conflicting secondary figures for the individual slides, so I won't give you per-slide numbers — check the ship's page for the specific ride the child has their heart set on. ${ROYAL_KIDS_RULES} ${ROYAL_KIDS_COST}`,
      obstructedBalconyDecks:
        "marked on Royal's official deck plan for each hull rather than published as a text list — read the plan, not a review",
      embarkationNote: ROYAL_EMBARKATION,
      other: [
        "The Infinite Balcony is not a traditional verandah. It's an interior room whose window drops to open that part of the space to the air — there's no separate door to step through and close behind you. This is the single most common expectation failure on the class, and it's entirely preventable at the point of sale.",
        "Deck 14 can put a client directly beneath one of the busiest outdoor decks on the ship — Chill Island's pools, The Hideaway and the Windjammer are all on 15. Great for a family who wants the pool close, rough for a light sleeper. Ask before you book, and pull the affected ranges off the current plan for that specific hull.",
        "Surfside is deliberately active young-family territory, not a generic quiet inward-facing neighbourhood. Sell it as proximity to Splashaway Bay and Baby Bay for the right family, and steer everyone else somewhere else.",
        "The AquaTheater is enclosed in the glass dome on this class rather than open-air at the back. If a client has been warned off Boardwalk balconies on the Oasis ships, that whole problem doesn't exist here — there's no cabin category overlooking the show.",
        ...(isLegend
          ? [
              "Legend differs from Icon and Star at the point of sale: it adds a traditional-verandah family category (FB) alongside the Infinite family rooms rather than replacing them, and it has a two-deck casino with a non-smoking section on deck 3. Don't quote this ship's cabins off an Icon or Star review.",
            ]
          : [
              "Icon and Star are close sisters but their published cabin lists don't match cabin-for-cabin, so don't transfer a specific room number between them. Legend differs more again — it adds a traditional-verandah family category these two don't have.",
            ]),
        "Royal Genie service is Star Class only within Royal Suite Class — Sky and Sea Class get less, and the tier names are close enough that clients conflate them.",
      ],
      linePolicy: [...ROYAL_FLEET_TRAPS],
    },
  };
}

export const iconOfTheSeas = iconClassContent("icon");
export const starOfTheSeas = iconClassContent("star");
export const legendOfTheSeas = iconClassContent("legend");
