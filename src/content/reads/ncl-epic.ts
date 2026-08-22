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
import { nclAttractionRules } from "./ncl-attractions";
import {
  MOTION_RULE,
  QUIET_DEFAULT_RULE,
  VIBRATION_RULE,
  withShipNote,
} from "./operator-rules";

/**
 * Norwegian Epic (2010) — a one-off, and deliberately kept as one. No
 * Prima or Breakaway cabin logic inherits into this record: NCL never
 * repeated the design, which is itself the most useful fact about it.
 *
 * CABIN AND TRAPS SIGNED OFF by Jimmy, 2026-08-19. Second Norwegian unit.
 *
 * MONEY IS STILL UNSIGNED line-wide — `NCL_MONEY` remains
 * `verified: false`, so this hull stays part-verified with the rest of
 * the fleet until that one decision is made.
 *
 * THE WORST ERROR IN THIS FILE WAS MINE AND IT WAS A SOURCE MIX-UP. I
 * had Splash Academy and Entourage moving from deck 12 to deck 6 in the
 * 2025 dry dock, and told the advisor their old deck-12 warning was out
 * of date. That relocation happened on PRIDE OF AMERICA. The same NCL
 * press release covered both ships, and I read one ship's change onto
 * the other. It is deleted — including from the placement note, where it
 * had become a reason to relax about deck 12.
 *
 * That is a different failure from the ones before it. The phantom
 * lifeboat bands came from bad sources; this came from a good source
 * read carelessly, which no amount of source-quality filtering catches.
 * The discipline it argues for is per-ship attribution: a release that
 * names two ships needs reading twice.
 *
 * THE BATHROOM IS THE STORY. Standard cabins have a three-part bathroom:
 * toilet behind one sliding frosted door, shower behind another, and the
 * sink out in the living area between them. Frosted is not opaque —
 * there's a visible silhouette and no sound insulation, and a pull
 * curtain is the only extra screening. The 2025 dry dock did not change
 * it. What the record does NOT say any more is WHY: the drainage-runs
 * explanation was plausible and unsourced, and only the outcome matters
 * to an advisor.
 *
 * The client-fit framing is also corrected. I had written that couples
 * mostly shrug, which is a population claim I have no basis for. It is
 * now a fit rule: privacy-sensitive travellers and anyone sharing
 * non-romantically — adult friends, siblings, a parent and a teenager —
 * are the strong warning. Couples comfortable with an unconventional
 * layout are the lower-risk fit.
 *
 * Other corrections from his pass:
 *   - Quiet default narrows from "11 or 12" to DECK 11 MIDSHIP. Deck 11
 *     is cleanly sandwiched; deck 12 mixes in Studio and public-adjacent
 *     space, so it's good-with-a-same-deck-check rather than equal.
 *   - Deck 14 is a tradeoff, not an avoid. Sixth class running.
 *   - The deck 8 lifeboat picture SURVIVES, unlike the Voyager and
 *     Vision bands. The published clear ranges are specific and hold.
 *     The deck 9 exact boundaries do NOT — they're deleted, and deck 9
 *     keeps a general check instead.
 *   - The aft-bank-doesn't-serve-deck-5 claim is deleted. The two-bank
 *     geometry stays as researched; that one detail was never proven.
 *   - The 37-to-100 balcony range goes; the FINDING stays, because the
 *     finding was never the number — it's that the category code doesn't
 *     tell you the room, and the bed is by the balcony in some cabins
 *     and by the door in others.
 *   - The interior square footage stays as a fact; "look hard at whether
 *     two cabins beat one" stops being a ship rule and becomes advice
 *     conditioned on party size.
 *   - The studios are fully resolved in the record's favour — NCL's own
 *     Epic page states no single supplement is required. "One of the
 *     best offers at sea" is gone; it was my adjective standing in for a
 *     sourced sentence.
 *   - The slide conflict is resolved, not recorded. NCL's current FAQ
 *     sets ONE rule for all Epic waterslides: 42 inches, 300 pounds. The
 *     free-fall 55-to-82 figures and the "Epic Plunge has no height
 *     restriction" claim were both wrong.
 *   - The sliding-doors-roll-open-in-a-swell anecdote is out of the
 *     advisor read. Recorded here as anecdotal and nowhere else.
 *
 * Refusals confirmed: "Epic has virtually no connecting cabins" stays
 * refused — connecting owner's suites, family balconies and
 * studio-to-studio pairs all exist, and the record tells the advisor to
 * check inventory rather than rule the ship out. "This tall boxy hull
 * rides badly" also stays refused; nothing turns a silhouette into a
 * motion rule.
 */

const EPIC_SOURCES: Source[] = [
  {
    label: "The three-part bathroom and the wave-wall cabin design",
    url: "https://www.cruisecritic.com/cruise/norwegian-ncl/norwegian-epic/cabins",
    checked: "2026-08-19",
  },
  {
    label:
      "2025 dry dock — the three-part bathroom layout remains unchanged; kids' club relocation was Pride of America, NOT Epic (checked by Jimmy)",
    url: "https://www.cruisecritic.com/articles/norwegian-epic-latest-dry-dock",
    checked: "2026-08-19",
  },
  {
    label:
      "Deck 8 lifeboat tops — clear from 8026 fwd and 8190 aft on port, 8027 fwd and 8191 aft on starboard",
    url: "https://www.cruisedeckplans.com/ships/deckbydeck.php?ship=Norwegian-Epic&deck=8",
    checked: "2026-08-19",
  },
  {
    label: "Forward and aft passenger lift banks with no true midship bank",
    url: "https://boards.cruisecritic.com/topic/1106428-no-midship-elevatorsstairs-on-epic/",
    checked: "2026-08-19",
  },
  {
    label:
      "NCL Epic page — Studios are priced for solo travellers with Studio Lounge access and no single supplement required",
    url: "https://www.ncl.com/cruise-ship/epic/staterooms",
    checked: "2026-08-19",
  },
  {
    label: "NCL activity FAQ — Norwegian Epic, ALL waterslides: 42in minimum, 300lb maximum",
    url: "https://www.ncl.com/faq/size-age-weight-requirements-for-activities",
    checked: "2026-08-19",
  },
];

/**
 * Deck 11 midship. I had "11 or 12" and treated them as equal; deck 11
 * is cleanly cabin-sandwiched and deck 12 mixes in Studio and
 * public-adjacent space.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-19).
 */
const EPIC_QUIET_DEFAULT = `Midship on deck 11. ${QUIET_DEFAULT_RULE} Deck 11 passes it cleanly and it's the strongest single answer on this ship. Deck 12 is good too but it isn't equal — it mixes in Studio inventory and public-adjacent space, so it wants a check of what the specific cabin sits beside rather than an automatic yes. Cabins run decks 8 to 14, and the Haven is right up on 16 and 17 — ABOVE the pool deck on 15 rather than below it, which is unusual and worth knowing if a client pictures the Haven as a quiet enclave.`;

const EPIC_DECK_14 =
  "Deck 14 sits directly below the pool and the Aqua Park, so it's a real overhead check rather than a blanket avoid: a strong negative for a light sleeper, and a fair trade for someone who wants the pool and the buffet one flight up.";

/**
 * The bathroom, as a client-fit rule rather than a population claim.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-19). The "couples mostly shrug"
 * framing was mine and is gone — I had no basis for it.
 */
const EPIC_BATHROOM =
  "The bathroom is the thing to explain before anyone books this ship, and it's a client-fit question rather than a good-or-bad one. It's in three parts: the toilet behind one sliding frosted door, the shower behind another, and the sink out in the living area between them. Frosted is not opaque — there's a visible silhouette and no sound insulation, and a pull curtain is all the extra screening there is. The strong warning is for anyone privacy-sensitive and for anyone sharing non-romantically: adult friends, siblings, a parent and a teenager. That's the booking to redirect. A couple who's comfortable with an unconventional layout is the lower-risk fit, but ask who's actually sharing before you sell it rather than assuming.";

const EPIC_BATHROOM_NOT_FIXED =
  "It was not fixed in the 2025 refurbishment. Post-dry-dock coverage is explicit that the three-part layout remains, and NCL's own list of what that work covered doesn't include any cabin-bathroom redesign. So if a client has heard the ship was refurbished, be clear about what that did and didn't touch — \"refurbished in 2025\" and \"the bathroom is normal now\" are not the same sentence.";

/**
 * NCL states this itself on Epic's own page, so it's said plainly here —
 * the same call as Prima, and for the same reason.
 */
const EPIC_STUDIOS =
  "This ship invented the solo studio and it's still a genuine reason to put a single client here: 128 of them on decks 11 and 12 at around 100 square feet, with the first Studio Lounge NCL ever built and keycard access to it. NCL's own Epic page says no single supplement is required, so you can state that plainly rather than hedging it.";

export const norwegianEpic: ShipContent = {
  reviewDue: "2027-02-01",
  sources: [...NCL_SOURCES, ...EPIC_SOURCES],

  cabin: {
    // Signed off by Jimmy, 2026-08-19. Corrections at the top of the file.
    verified: true,
    placementNote: `${EPIC_QUIET_DEFAULT} ${EPIC_DECK_14} Decks 8 and 9 are the lifeboat decks and need a view check on the specific cabin.`,
    motionAvoid: withShipNote(
      MOTION_RULE,
      "You'll hear that this ship rides badly because it's tall and boxy — member reviews flatly contradict each other on it and there's no real source either way, so I wouldn't repeat it.",
    ),
    // The sliding bathroom doors are reported to roll open in a real
    // swell, setting off the motion-activated lights at night. That is
    // ANECDOTAL and deliberately not in the advisor read — it's a single
    // thread's worth of evidence dressed as a ship property.
    vibrationNote: VIBRATION_RULE,
    categoryWarnings: [
      EPIC_BATHROOM,
      EPIC_BATHROOM_NOT_FIXED,
      EPIC_STUDIOS,
      "Balcony size and bed orientation vary materially inside what looks like a single cabin family here — the bed sits by the balcony in some rooms and by the door in others, and the outdoor space differs a lot too. The useful rule isn't a size range, it's this: on this ship the category code does not tell you the room. Verify the actual layout for the specific cabin rather than quoting the category.",
      "The interiors are compact at around 128 square feet at the small end. For a couple that's tight but workable; for a family of four in one interior it's the thing they'll remember about the holiday, so it's worth comparing two cabins or a larger family category before you book one. That comparison is a party-size judgment, not a rule about the ship.",
      "You'll read that Epic has almost no connecting cabins. The sources don't support it — connecting owner's suites, connecting family balconies and studio-to-studio pairs all exist, and NCL's own deck plans carry a connecting marker. Check the available pairs rather than ruling the ship out for a family on folklore.",
    ],
    hazardsAboveBelow: [
      {
        source: "lido",
        where:
          "the pool and Aqua Park on deck 15, over the deck 14 cabins — and note the Haven sits above all of that on 16 and 17",
      },
      {
        source: "theater",
        where: "forward on the lower decks, under the forward deck 8 cabins",
      },
    ],
    obstructedViewNotes:
      "Deck 8 is where this ship has an unusually specific published picture, and unlike some other lines' \"lifeboat bands\" this one holds up. Most of the deck 8 side balconies look down onto the tops of the lifeboats; the clear ones are 8026 and forward on port with 8190 and aft, and 8027 and forward on starboard with 8191 and aft. That's a DOWNWARD view problem rather than a lost horizon, so describe it rather than writing those cabins off. Deck 9 also carries lifeboat and structure issues and needs the same check, but the exact cabin boundaries there aren't established well enough to quote — read the plan. Separately and differently: a run of deck 9 balconies is open to view from above. That's a privacy defect, not an obstruction, and it's the one people don't think to ask about.",
    obstructionKinds: ["lifeboat-davit", "overlooked"],
    minorPlacementRule: NCL_MINOR_PLACEMENT,
    elevatorNote:
      "The geometry here is decision-relevant and it's researched rather than confirmed: the passenger lifts run in forward and aft banks with no true midship bank, on a ship over a thousand feet long. Sources agree on that and I couldn't get plan-level proof, so treat it as a strong steer rather than a fact. Book near the end of the ship they'll actually use. One thing an earlier version of this record claimed and I've withdrawn: that the aft bank doesn't serve deck 5. It may well be true and it was never proven, so it's out.",
    accessibilityNote:
      "Take this one seriously for a mobility booking, with the caveat that the layout claim is researched rather than confirmed. If the forward-and-aft-only geometry is right, every vertical trip starts with a walk toward one end of a very long ship, and there's no midship bank to fall back on. So pick the end that matches their week, book as close to it as inventory allows, and check the route to the dining room specifically. Confirm the whole of it against NCL's accessible deck plan rather than against this note.",
  },

  // STILL UNSIGNED, line-wide. See the file header.
  money: NCL_MONEY,

  traps: {
    // Signed off by Jimmy, 2026-08-19, with the slide conflict resolved
    // and the Pride of America mix-up removed.
    verified: true,
    kidAgeHeightRules: `${nclAttractionRules(["epic-waterslides"])} ${NCL_KIDS_RULES}`,
    obstructedBalconyDecks:
      "the deck 8 side balconies looking down onto the lifeboat tops — clear from 8026 forward and 8190 aft on port, 8027 forward and 8191 aft on starboard",
    embarkationNote: NCL_EMBARKATION,
    other: [
      "\"Refurbished in 2025\" does not mean the bathroom was redesigned. That dry dock covered the Kids' Aqua Park, the Vibe expansion, eight new staterooms and other top-deck work — the three-part bathroom layout is exactly as it was. This is the correction most likely to save you a complaint on this ship.",
      "Every waterslide on Epic runs the same height and weight rule, which is unusual — most big slide complexes have different minimums per ride. Here, clearing one genuinely does clear the rest.",
    ],
    linePolicy: [NCL_HAVEN_WARNING, NCL_FREESTYLE, ...NCL_FLEET_TRAPS],
  },
};
