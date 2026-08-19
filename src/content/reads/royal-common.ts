import type { ShipContent, Source } from "@/lib/types";

/**
 * Royal Caribbean line-wide facts, shared by every hull.
 *
 * Gratuity rates, the beverage-package rules, the Adventure Ocean age
 * bands, the age policy and the arrival-window process are set by the
 * line, not the ship. They live here so a rate change is one edit rather
 * than thirty.
 *
 * Researched August 2026 from the sources below. Royal Caribbean's own
 * FAQ pages are the best of them, but this environment's egress proxy
 * blocks royalcaribbean.com along with Cruise Critic and the deck-plan
 * sites, so even the FAQ claims come from search snippets rather than a
 * page anyone opened. Jimmy signed the money block on 2026-08-19 knowing
 * that — the rates and the all-or-nothing package rule are things he
 * checks against his own bookings, so the sourcing weakness was not what
 * the sign-off rested on.
 */

export const ROYAL_SOURCES: Source[] = [
  {
    label: "Gratuity rise to $18.50 / $21.00, effective 1 November 2024",
    url: "https://www.cruisehive.com/royal-caribbean-increasing-gratuities-on-november-1/147038",
    checked: "2026-08-18",
  },
  {
    label: "Every legal-drinking-age guest in the stateroom must buy the package",
    url: "https://www.royalcaribbean.com/faq/questions/does-everyone-need-to-buy-the-deluxe-beverage-package",
    checked: "2026-08-18",
  },
  {
    label: "The 18% package gratuity is added at checkout, not included",
    url: "https://www.royalcaribbean.com/faq/questions/beverage-package-gratuities-policy",
    checked: "2026-08-18",
  },
  {
    label: "Freestyle cup dropped from Deluxe and Refreshment, 15 March 2026",
    url: "https://www.royalcaribbeanblog.com/2026/02/27/royal-caribbean-quietly-cuts-drink-package-benefit",
    checked: "2026-08-18",
  },
  {
    label: "International age policy and the connecting/adjacent/across-the-hall waiver",
    url: "https://www.royalcaribbean.com/faq/questions/international-age-policy",
    checked: "2026-08-18",
  },
  {
    label: "Adventure Ocean and nursery pricing changes, October 2025",
    url: "https://www.royalcaribbeanblog.com/2025/10/06/royal-caribbean-changes-kids-club-prices-nursery-and-late-night-care",
    checked: "2026-08-18",
  },
  {
    label: "Check-in opens 45 days out; arrival windows are first-come first-served",
    url: "https://www.royalcaribbeanblog.com/2024/05/29/royal-caribbean-check-in-questions",
    checked: "2026-08-18",
  },
];

/**
 * $18.50 per person per day for interior, oceanview, balcony and junior
 * suites; $21.00 for Grand Suite and above. Raised 1 November 2024.
 * Auto-added to the SeaPass account, prepayable pre-cruise (which locks
 * the rate), and adjustable at Guest Services onboard.
 *
 * The Deluxe Beverage Package runs roughly $55 to $120 per person per day
 * depending on ship and sailing; $75 is the tracked fleet median and is
 * what's recorded here. It is a genuinely variable price, not a rate.
 *
 * SIGNED OFF by Jimmy, 2026-08-19, at the Icon-class review. One
 * decision covering all 30 Royal hulls, which is why it was raised
 * separately from the per-class cabin and traps work.
 *
 * There is deliberately NO break-even figure, the same as Carnival.
 * Break-even is a property of the drinker, not the ship.
 *
 * Two things about this package matter more than the price, and both are
 * in the note: the 18% is added at checkout rather than included, and
 * everyone of drinking age in the stateroom has to buy it if one person
 * does. That second rule turns a $75 decision into a $150 one for a
 * couple where only one of them drinks, and it is the single most
 * expensive surprise on this line.
 */
export const ROYAL_MONEY: ShipContent["money"] = {
  // Signed off by Jimmy, 2026-08-19.
  verified: true,
  drinkPackagePrice: 75,
  drinkPackageNote:
    "Two things before you price this. The 18% gratuity is added at checkout rather than included, so the real daily cost is about a fifth above the headline — and if one adult in the stateroom buys the alcohol package, every guest of drinking age in that stateroom has to buy it too. For a couple where only one drinks, that doubles the bill. The non-alcoholic packages can be bought individually, so that's the way round it.",
  specialtyDiningNote:
    "Book it in the Cruise Planner before you sail — reservations close about two days out, and the dining-package holders all book their times onboard, so the 6:30 to 8:00 slots and the sea-day nights go first.",
  gratuityPerDayUSD: 18.5,
};

/**
 * The deck 12 / deck 14 numbering trick, confirmed on two Royal classes
 * now (Oasis 2026-08-19, Icon 2026-08-19).
 *
 * OPERATOR-CONFIRMED. It lives here rather than in a class file because
 * it is a property of how Royal numbers decks, not of any hull: they skip
 * the NUMBER 13, so the physical deck sitting on top of deck 12 is
 * labelled 14. That defeats the quiet-default scan for anyone counting
 * numerically — you look for "deck 13" above your deck 12 cabin, find no
 * such deck, and wrongly conclude there is nothing overhead.
 *
 * What is above 14 differs by class and is NOT part of this constant.
 * On the Oasis ships deck 14 mixes cabins with Adventure Ocean; on the
 * Icon ships it is accommodation under the deck 15 pool complex. Each
 * class file finishes the sentence its own way.
 */
export const ROYAL_DECK_12_NUMBERING =
  "Deck 12 is often good but doesn't get an automatic yes, and the reason is a numbering trick: Royal skips the number 13, so the physical deck directly above 12 is numbered 14";

/** Aquanauts 3–5, Explorers 6–8, Voyagers 9–12, then two teen bands. */
export const ROYAL_KIDS_RULES =
  "Adventure Ocean runs Aquanauts 3–5 (potty-trained only), Explorers 6–8 and Voyagers 9–12, with separate teen spaces for 12–14 and 15–17. The nursery covers 6 to 36 months but is not on every ship — check the specific hull rather than assuming.";

/**
 * The childcare costs are the part that surprises people, and they went
 * up in October 2025. Free daytime care is the headline; the hours a
 * parent actually wants are the ones that bill.
 */
export const ROYAL_KIDS_COST =
  "Adventure Ocean is free for 3 to 12 year-olds until 10pm, then the late-night party runs 10pm to 1am at $15 per hour per child. The nursery is $9 an hour between 9am and 6pm and $12 an hour from 6pm to midnight. All three went up in October 2025, so an older quote will be low.";

/**
 * Royal's age policy, and the waiver that makes it different from
 * Carnival's.
 *
 * The base rule is stricter than Carnival's — the guardian has to be 21,
 * not 25 or 21-to-24-if-a-parent — but the placement waiver is LOOSER:
 * connecting is not required. Adjacent counts, and so does directly
 * across the hall off the same hallway. An advisor who applies Carnival's
 * connecting-cabin rule here will over-restrict and lose inventory they
 * did not need to lose.
 */
export const ROYAL_MINOR_PLACEMENT =
  "No guest under 21 gets a stateroom without an adult 21 or older in that same room — the guardian minimum is 21 here, not 18. On sailings out of North America there's a waiver that's looser than Carnival's: the child can be in a stateroom that connects to the guardian's, or is adjacent to it, or is directly across the hall opening onto the same hallway. Connecting is not required, so don't over-restrict the inventory. Underage married couples and active-duty US or Canadian military are separate exceptions, both needing proof. Sailings originating in Europe, South America, Asia or Australia use different thresholds — check the departure region.";

/**
 * Royal's arrival window. Functionally Carnival's Arrival Appointment,
 * with one difference that matters to an advisor: the slots are
 * first-come first-served from when check-in opens, so checking in early
 * is worth real money in convenience.
 */
export const ROYAL_EMBARKATION =
  "Check-in opens 45 days before sailing and arrival windows are picked then, in half-hour slots from about 10:30am to 2:30pm — first-come first-served, so the client who checks in on day 45 gets the early boarding and the one who waits gets 2pm. Turn up inside the window: early arrivals wait outside the terminal and late ones board with a later group. How hard it's enforced varies by port.";

/**
 * FlowRider, rock wall, Perfect Storm slides. Class-specific ones live in
 * the class files.
 *
 * SUPERSEDED, NOT YET RETIRED. `royal-attractions.ts` now holds these as
 * per-attraction constants that a hull maps onto, which is the better
 * model: it can say Navigator has the Blaster and Riptide while Adventure
 * has Typhoon and Cyclone, where this generic paragraph names rides a
 * ship may not carry. Voyager/Freedom uses the table.
 *
 * This stays because Oasis, Icon and Quantum are SIGNED against this
 * exact wording, and rewriting signed text to adopt a better structure
 * would silently change what an operator approved. Each class migrates
 * at its next review, not before. Radiance and Vision have already
 * migrated; those three are what's left.
 */
export const ROYAL_ATTRACTION_RULES =
  "The FlowRider needs 52 inches to bodyboard and 58 inches to stand up on a flowboard, which catches families out — a child can ride it lying down and not standing. The rock wall is age 6 and up with a signed waiver, and 6 to 12 need supervision. Where there are Perfect Storm slides they run a 48-inch minimum with under-12s supervised.";

/**
 * The line-wide money traps that aren't the drink package. These go in
 * `traps.other` on every ship rather than the money block, because they
 * are expectation problems as much as cost ones.
 */
export const ROYAL_FLEET_TRAPS = [
  "From 15 March 2026 the Deluxe and Refreshment packages no longer include the Coca-Cola Freestyle cup — it's $4.99 onboard now. Only the Classic Soda package still includes it. Anyone who booked before that date was grandfathered, so a repeat client may be comparing against what they got last year.",
  "Voom Wi-Fi is priced per device per day, not per cabin — roughly $18 to $38 a day each, and materially cheaper pre-cruise. A family of four assuming one household plan is in for a real shock.",
  "Room service is $7.95 per order plus 18%, so about $9.40 a delivery. Continental breakfast is still free.",
  "The Key costs roughly $26 to $50 per person per day and every guest aged 6 and over in the stateroom has to buy it — the same all-or-nothing structure as the drink package.",
  "One 750ml bottle of wine per drinking-age guest on embarkation day, and $15 corkage if they drink it anywhere public. Anything bought in port is held until the last night.",
  "Taxes, fees and port expenses sit outside the fare and vary by sailing. A free-cruise certificate never covers them, and that's a conversation to have before deposit rather than at final payment.",
];
