import type { ShipContent, Source } from "@/lib/types";
import type { Deck } from "@/lib/decks";
import type { ObstructionKind } from "@/lib/obstruction";
import {
  ROYAL_EMBARKATION,
  ROYAL_FLEET_TRAPS,
  ROYAL_KIDS_COST,
  ROYAL_KIDS_RULES,
  ROYAL_MINOR_PLACEMENT,
  ROYAL_MONEY,
  ROYAL_SOURCES,
} from "./royal-common";
import { attractionRules, type AttractionId } from "./royal-attractions";
import {
  MOTION_RULE,
  PORTHOLE_STEER,
  QUIET_DEFAULT_RULE,
  VIBRATION_RULE,
  withShipNote,
} from "./operator-rules";

/**
 * Vision class: Grandeur (1996), Enchantment (1997), Rhapsody (1997),
 * Vision (1998) — the oldest hulls Royal Caribbean still runs.
 *
 * SIGNED OFF by Jimmy, 2026-08-19. Sixth and last Royal unit.
 *
 * THE HEADLINE IS THE QUIET DEFAULT, AND IT OVERTURNED ITSELF. I had
 * midship deck 7. The rule says a deck needs cabins above AND below, and
 * deck 7 fails it: deck 6 underneath is public space. Run the test
 * properly and the answer is DECK 3 MIDSHIP — the lowest middle deck,
 * with cabins on 2 below and 4 above.
 *
 * That is the most counter-intuitive answer this product has produced.
 * Every instinct says a high deck on a small ship is the good one, and
 * on these four hulls the high cabin deck has public space underneath it
 * while the low one is properly sandwiched. Jimmy's read: "exactly the
 * kind of non-obvious answer First Mate needs to be good at." It is also
 * the clearest demonstration yet that the rule earns its place — I would
 * never have got here by reasoning about deck numbers.
 *
 * THE FILE IS HIERARCHICAL, like Voyager/Freedom:
 *
 *     Vision shared base
 *       -> Grandeur/Enchantment pair
 *          -> Enchantment 2005 stretch overlay
 *       -> per-ship noise and obstruction overlays
 *
 * The middle layer exists for one reason and it is a data-safety reason,
 * not a content one: Enchantment was cut in half in 2005 with 73 feet
 * and 151 staterooms inserted AMIDSHIPS, so cabin numbers on that hull
 * are not in the same physical place as the same numbers on its sisters.
 * That is a structural inheritance break, and it was previously carried
 * as two prose warnings — which is advice, not a guarantee. Now the
 * stretch overlay attaches at a layer the other three cannot reach.
 *
 * Corrections his pass made:
 *   - THE DECK 3 LIFEBOAT BAND DOES NOT EXIST. Deleted. Royal's own
 *     printable Grandeur deck 3 plan calls out forward PORTHOLE cabins
 *     without marking the deck obstructed, and deck 3 reads as ordinary
 *     cabin-sandwiched space — which would make no sense behind a row of
 *     boats. Same content-farm inheritance error as Voyager/Freedom deck
 *     6, caught twice in three reviews. `lifeboat-davit` is gone.
 *   - "No cabin-by-cabin list is published for any ship in this class"
 *     is DELETED, and this was the seventh time. Royal's own printable
 *     Rhapsody deck 8 plan states in as many words that 8086 and 8586
 *     have obstructed views. One official cabin number kills the claim.
 *   - Deck 8 is a tradeoff, not an avoid. Fifth class running.
 *   - The deck 2 aft engine-vibration claim drops from a class fact to a
 *     check. The reports are real and experiential; low-deck mechanical
 *     noise also turns up elsewhere, so it isn't a Vision-class constant.
 *   - Cabin square footages are ship-and-category data, not class
 *     constants. Rhapsody alone historically listed interiors from about
 *     135 to 174 depending on category.
 *   - Balcony scarcity keeps the ADVICE and loses the numbers. It is
 *     labelled as inventory planning guidance rather than a physical
 *     fact about the ship — which is what makes it different from the
 *     Radiance percentage note that got deleted.
 *   - The nine-elevator count is gone. Repetition across sources is not
 *     confirmation, same answer as Radiance.
 *   - The Grandeur casino / restaurant clear-down / theatre-to-11pm
 *     prose is NOT promoted. The physical relationships are sound; the
 *     operating-hours language is somebody's week aboard.
 *   - The Enchantment bungee trampolines are DELETED as a current
 *     attraction. They existed after the 2005 stretch; Royal's current
 *     activity page for the ship doesn't list them. Straight Sky Pad
 *     repeat, and handled the same way — removed from inventory, kept as
 *     an explicit retraction so an advisor reading an old review can
 *     correct it.
 *   - Mini-golf is NOT a shared class attraction. Royal's current
 *     per-ship pages don't consistently list it, and after two rounds of
 *     copied facility lists that isn't good enough.
 *   - The positioning is "classic, smaller-scale Royal", not my
 *     "small-and-old". Royal's own framing is a classic, intimate
 *     experience — that is something an advisor can sell, where mine was
 *     an apology with a fact attached.
 *
 * Deliberately NOT encoded: obstructed cabin numbers beyond noting the
 * official plans carry them (they need importing per hull); any cabin
 * dimensions; the balcony percentages; the elevator count or bank
 * layout; and any claim that this class "feels rough seas more", which
 * is inferring motion from tonnage.
 */

type VisionShip = "grandeur" | "enchantment" | "rhapsody" | "vision";

/** The earlier pair. Enchantment's stretch overlay attaches here. */
const GRANDEUR_ENCHANTMENT = new Set<VisionShip>(["grandeur", "enchantment"]);

const VISION_SOURCES: Source[] = [
  {
    label:
      "Official Grandeur deck plans — cabins on 2, 3, 4, 7, 8 with pool/Solarium/Windjammer on 9 (checked by Jimmy)",
    url: "https://www.royalcaribbean.com/cruise-ships/grandeur-of-the-seas/deck-plans",
    checked: "2026-08-19",
  },
  {
    label:
      "Official Grandeur deck 3 printable plan — forward porthole cabins called out, deck NOT marked as an obstructed band",
    url: "https://media.royalcaribbean.com/content/pdf/decks/GR/shp_gr_deck03_rc2_dpl.pdf",
    checked: "2026-08-19",
  },
  {
    label:
      "Official Rhapsody deck 8 printable plan — states 8086 and 8586 have obstructed views",
    url: "https://media.royalcaribbean.com/content/pdf/decks/RH/shp_rh_deck08_rc2_dpl.pdf",
    checked: "2026-08-19",
  },
  {
    label: "Grandeur deck 3 midship cabins have cabin above and cabin below",
    url: "https://cruisesheet.com/cruise-lines/royal-caribbean/grandeur-of-the-seas/cabin/3100",
    checked: "2026-08-19",
  },
  {
    label: "Grandeur aft deck 3 sits beneath galley space; forward deck 4 beneath theatre",
    url: "https://www.cruisedeckplans.com/ships/deckbydeck.php?deck=4&ship=Grandeur-of-the-Seas",
    checked: "2026-08-19",
  },
  {
    label: "Vision forward deck 7 sits over the theatre — show and rehearsal noise",
    url: "https://www.cruisedeckplans.com/ships/deckbydeck.php?deck=7&ship=Vision-of-the-Seas",
    checked: "2026-08-19",
  },
  {
    label: "Enchantment's 2005 lengthening — 73 feet and 151 staterooms inserted amidships",
    url: "https://www.frommers.com/tips/cruise/reintroducing-royal-caribbeans-enchantment-bigger-stronger-faster/",
    checked: "2026-08-19",
  },
  {
    label:
      "Enchantment current activity inventory — rock wall, arcade, pools, Adventure Ocean; NO bungee trampoline",
    url: "https://www.royalcaribbean.com/cruise-ships/enchantment-of-the-seas/things-to-do",
    checked: "2026-08-19",
  },
  {
    label: "Royal's own framing — a classic, intimate experience",
    url: "https://www.royalcaribbean.com/guides/ships-by-age",
    checked: "2026-08-19",
  },
];

/* ------------------------------------------------------------------ *
 * LAYER 1 — Vision shared base.
 * ------------------------------------------------------------------ */

/**
 * DECK 3 MIDSHIP. The answer the rule produced against every instinct.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-19), overturning my deck 7.
 */
const VISION_QUIET_DEFAULT = `Midship on deck 3, and this one is going to feel wrong until you check it. ${QUIET_DEFAULT_RULE} There are five cabin decks here — 2, 3, 4, 7 and 8 — and running the test properly puts the answer at the BOTTOM of the ship, not the top. Deck 3 has cabins on 2 below it and 4 above it, so it passes cleanly. Deck 7 fails, because deck 6 underneath it is public space rather than cabins. Deck 8 fails the other way, with the pool, Solarium and Windjammer directly over it on 9. The instinct to put a client high on a small ship is the wrong instinct on these four hulls.`;

/** Midship matters on 3 — the ends of that deck have their own problems. */
/**
 * THE DECK STACK, transcribed from this file's own signed placement note.
 * Second class through the transcription route after Radiance, and the
 * point of doing a second one is that the checksum has to hold on a
 * stack with a different shape — this one produces a ONE-deck answer.
 *
 * From `VISION_QUIET_DEFAULT`, verbatim:
 *   "There are five cabin decks here — 2, 3, 4, 7 and 8 — ... Deck 3 has
 *    cabins on 2 below it and 4 above it, so it passes cleanly. Deck 7
 *    fails, because deck 6 underneath it is public space rather than
 *    cabins. Deck 8 fails the other way, with the pool, Solarium and
 *    Windjammer directly over it on 9."
 *
 * Deck 5 is not among the five, so it carries no cabins; what IS on it
 * is unrecorded and left empty rather than guessed. Deck 1 is absent for
 * the same reason it is absent from Radiance — the signed prose never
 * says — which makes deck 2 undetermined rather than passing or failing.
 */
const VISION_DECKS: Deck[] = [
  { deck: 2, carriesCabins: true, publicSpace: [] },
  { deck: 3, carriesCabins: true, publicSpace: [] },
  { deck: 4, carriesCabins: true, publicSpace: [] },
  {
    deck: 5,
    carriesCabins: false,
    publicSpace: [],
    note: "Not one of the five cabin decks. What's on it isn't recorded.",
  },
  {
    deck: 6,
    carriesCabins: false,
    publicSpace: ["public space"],
    note: "Named in the signed note as the public space that makes deck 7 fail below.",
  },
  { deck: 7, carriesCabins: true, publicSpace: [] },
  { deck: 8, carriesCabins: true, publicSpace: [] },
  {
    deck: 9,
    carriesCabins: false,
    publicSpace: ["the pool", "the Solarium", "the Windjammer buffet"],
  },
];

/** The band the signed placement note names — one deck, not a range. */
export const VISION_SIGNED_BAND = [3];

const VISION_DECK_3_CAVEATS = `Midship is doing real work in that sentence, so don't bless the whole of deck 3. Aft on 3 can sit under galley space on some of these hulls, which is a check rather than a rule. And at the extreme forward end the cabins are a different product: several are porthole rooms with two round windows rather than a rectangular one. ${PORTHOLE_STEER} Forward is also where the motion is, so that end of deck 3 wants both checks, not one.`;

const VISION_DECK_8 =
  "Deck 8 sits directly under the pool decking, the Solarium and the Windjammer, and the interiors up there are the ones reported worst. That's a strong negative for anyone noise-sensitive and a reasonable trade for someone who wants the pool and the buffet one flight up — ask which client you have rather than ruling the deck out.";

/**
 * Balcony scarcity as PLANNING guidance, explicitly not a physical fact
 * about the ship. This is what makes it different from the Radiance
 * balcony-percentage note, which was deleted as a research diary entry:
 * this one changes what an advisor does, and it does it without a number.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-19).
 */
const VISION_BALCONY_SCARCITY =
  "Balcony inventory here is materially more limited than on the newer Royal classes — that's an inventory and planning point rather than a fact about any particular cabin, and it's the reason to raise it early. On a modern ship a balcony is the default assumption; on these four it's the exception, and it runs out. If a balcony is genuinely a must-have for the client, price it and secure it at the start of the conversation rather than at the end. I'm deliberately not giving you a percentage: the figures that circulate conflict, and no decision turns on which is right.";

/**
 * The positioning, and it is NOT Radiance's. Radiance is scenery-first
 * with a glass ship behind the claim. These are classic and intimate,
 * which is a different sell — and an advisor needs something to sell
 * rather than a list of what's absent.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-19).
 */
const VISION_POSITIONING =
  "Sell these as CLASSIC, SMALLER-SCALE Royal Caribbean, which is Royal's own framing — a more traditional cruise experience on a ship that's easy to navigate, where the itinerary carries more of the value than the hardware does. What that means concretely: there's a rock wall, a retractable-roof Solarium, an arcade and Adventure Ocean, and there is no FlowRider, no ice rink, no waterslides, no bumper cars, no North Star and none of the neighbourhood or Category 6 attractions. If the client's mental image came from an Icon advert, close that gap before deposit — but close it by describing what this is, not by apologising for what it isn't.";

/* ------------------------------------------------------------------ *
 * LAYER 3 — per-ship overlays.
 * ------------------------------------------------------------------ */

/**
 * Ship-specific noise geometry. All RESEARCHED. These are potentially
 * the most useful lines in the record and the most embarrassing if
 * wrong, which is why none of them are in the shared base.
 */
const SHIP_NOISE: Partial<Record<VisionShip, string>> = {
  vision:
    "On this ship specifically, the most forward cabins on deck 7 sit over the theatre, and show and rehearsal noise is what gets reported there. Researched rather than confirmed.",
  grandeur:
    "On this ship specifically, two relationships are worth checking on the plan: the forward deck 4 cabins around 4022 and 4522 and forward of them sit beneath theatre space, and the aft end of deck 3 sits beneath galley space. Both are researched. What I'm NOT giving you is the folklore attached to them — casino noise, restaurant clear-down, the theatre running to eleven — because the physical relationships are sound and the operating hours are somebody's week aboard.",
  rhapsody:
    "On this ship specifically, cabin 4022 is mapped as having public space above it. I'm stopping there: the fuller claim that 4022, 4522 and everything forward sit under the show lounge isn't established, and I'd rather give you one checked cabin than a range I've inferred.",
};

/** Obstruction is per hull and comes off Royal's own plan. */
const SHIP_OBSTRUCTION: Partial<Record<VisionShip, string>> = {
  rhapsody:
    "On this ship there's a documented example straight from Royal's own printable deck 8 plan: 8086 and 8586 are marked obstructed. That's the pattern to follow on the others rather than a list to reuse.",
};

/** Enchantment only. A structural rule, not advice copy. */
const ENCHANTMENT_STRETCH =
  "STRUCTURAL WARNING, and it's the reason this ship can't be reasoned about from its sisters: Enchantment was cut in half in 2005 and had 73 feet and 151 staterooms inserted AMIDSHIPS. Because the new section went into the middle rather than onto an end, a cabin number on this hull is not in the same physical position as the same number on Grandeur, Rhapsody or Vision. Do not read a sister's deck plan for this ship, and don't carry over anything you know about a specific cabin number — the geometry underneath it changed.";

/** Rock wall only. Mini-golf is NOT established across all four. */
const VISION_ATTRACTIONS: AttractionId[] = ["rock-wall"];

function visionClassContent(ship: VisionShip): ShipContent {
  const isEnchantment = ship === "enchantment";
  const isEarlyPair = GRANDEUR_ENCHANTMENT.has(ship);

  // No obstructionKinds on this class, deliberately. The deck 3 lifeboat
  // band turned out not to exist, and Royal's plans mark cabins as
  // obstructed without saying by what. The field carries knowledge, not
  // guesses — so it stays empty until a hull's mechanism is established.
  const kinds: ObstructionKind[] = [];

  return {
    reviewDue: "2027-02-01",
    sources: [...ROYAL_SOURCES, ...VISION_SOURCES],

    // Class geometry, shared by all four hulls.
    decks: VISION_DECKS,

    cabin: {
      // Signed off by Jimmy, 2026-08-19. Corrections at the top of the file.
      verified: true,
      placementNote: `${VISION_QUIET_DEFAULT} ${VISION_DECK_3_CAVEATS} ${VISION_DECK_8} ${SHIP_NOISE[ship] ?? ""}`,
      motionAvoid: MOTION_RULE,
      vibrationNote: withShipNote(
        VIBRATION_RULE,
        "On these hulls there are credible reports of mechanical vibration and thruster noise low down and aft, worst around docking and manoeuvring — but treat that as a check on the specific cabin rather than a rule about deck 2. Low-deck mechanical noise turns up in other spots too, and the reports are experiential rather than measured.",
      ),
      categoryWarnings: [
        VISION_BALCONY_SCARCITY,
        "The cabins here are genuinely smaller than a client will have seen on a newer ship, and that's the expectation to set — but set it with the actual number for their category rather than a class range. Even within one of these hulls the interior categories span a wide spread, so a class-wide figure would be false precision. Read the dimensions for the specific ship and category on the booking screen.",
        ...(isEnchantment ? [ENCHANTMENT_STRETCH] : []),
        ...(isEarlyPair && !isEnchantment
          ? [
              "This ship is the sister to Enchantment, which was lengthened amidships in 2005. Nothing about that stretch applies here — this hull was never cut — so don't carry Enchantment's cabin numbers or its extra deck space onto it in either direction.",
            ]
          : []),
      ],
      hazardsAboveBelow: [
        {
          source: "lido",
          where:
            "the pool deck and Solarium on 9, directly over the deck 8 cabins — the interiors on 8 are the ones reported worst",
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
                  "the theatre, below the most forward cabins on deck 7 on this ship — show and rehearsal noise",
              },
            ]
          : []),
        ...(ship === "grandeur"
          ? [
              {
                source: "theater",
                where:
                  "theatre space below the forward deck 4 cabins on this ship, around 4022 and 4522 and forward",
              },
              {
                source: "galley",
                where: "galley space below the aft end of deck 3 on this ship",
              },
            ]
          : []),
      ],
      obstructedViewNotes: `There is NO class-wide lifeboat band on these ships, and that's worth saying plainly because an earlier version of this record claimed deck 3 was one. Royal's own printable deck 3 plan calls out the forward PORTHOLE cabins — two round windows instead of a rectangular one — without marking the deck as obstructed, and deck 3 otherwise reads as ordinary cabin-sandwiched space. Don't warn a client off deck 3 on lifeboat grounds. What IS true is that Royal marks obstructed staterooms on its own deck plans for all four of these hulls, cabin by cabin, so that plan is the check. ${SHIP_OBSTRUCTION[ship] ?? "The obstructed cabins for this hull need reading off its current plan — don't inherit a sister's numbers."} No mechanism is recorded here, because Royal marks a cabin obstructed without saying by what, and guessing at the cause would defeat the point of having the field.`,
      obstructionKinds: kinds,
      minorPlacementRule: ROYAL_MINOR_PLACEMENT,
      accessibilityNote:
        "The saving grace of a small ship is that nothing is far away, and the pool deck sits cleanly above the cabins rather than among them. Against that, this class predates most modern accessible-design conventions. I'm not giving you a lift count or a bank layout: a figure repeated across secondary sources isn't a confirmed one, and a count without a layout gives you no usable advice anyway. Treat a mobility booking here as needing the accessible deck plan checked cabin by cabin rather than reasoned from a rule.",
    },

    money: ROYAL_MONEY,

    traps: {
      // Signed off by Jimmy, 2026-08-19, after the attraction cleanup.
      verified: true,
      kidAgeHeightRules: `${attractionRules(VISION_ATTRACTIONS)} Most of the fleet's height rules simply don't come up on this class — there's no FlowRider and there are no waterslides — so the rock wall's age minimum is the one that matters. Worth telling a parent up front rather than letting them find out. ${ROYAL_KIDS_RULES} ${ROYAL_KIDS_COST}`,
      obstructedBalconyDecks:
        "whatever Royal's own current deck plan marks for the specific hull — not deck 3, which is not an obstructed band on this class",
      embarkationNote: ROYAL_EMBARKATION,
      other: [
        VISION_POSITIONING,
        "Don't promise mini-golf on this class as a given. It gets listed generically for these ships and Royal's current per-ship pages don't consistently show it — check the specific hull before you mention it. Facility lists copied across sister ships are how this record has been wrong before.",
        ...(isEnchantment
          ? [
              "This is the stretched one, and the 2005 work gave it things its sisters don't have — a splash deck with dozens of water jets and the two suspension bridges over the pool deck, which are permanent design features rather than attractions with operating rules. If a family is choosing within the class, that's a real reason to pick this hull.",
              "Do NOT promise the bungee trampolines. They were part of the 2005 refit and they turn up in older reviews, but Royal's current activity page for this ship doesn't list them. Same shape as the Sky Pad on the Voyager hulls: a real feature from a real announcement that quietly went away. If a client has read about them, correct it before they book.",
              "Because of the 2005 stretch, cabin numbers on this ship don't map to its sisters. Anything learned about a cabin number on Rhapsody, Grandeur or Vision does not transfer here.",
            ]
          : []),
      ],
      linePolicy: [...ROYAL_FLEET_TRAPS],
    },
  };
}

export const grandeurOfTheSeas = visionClassContent("grandeur");
export const enchantmentOfTheSeas = visionClassContent("enchantment");
export const rhapsodyOfTheSeas = visionClassContent("rhapsody");
export const visionOfTheSeas = visionClassContent("vision");
