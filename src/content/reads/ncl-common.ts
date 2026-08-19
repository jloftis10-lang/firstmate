import type { ShipContent, Source } from "@/lib/types";

/**
 * Norwegian line-wide facts, shared by every hull.
 *
 * Researched August 2026. ncl.com is blocked by this environment's egress
 * proxy along with the deck-plan sites, so even the claims attributed to
 * NCL's own FAQ come from search snippets rather than a page anyone
 * opened. Jimmy signed the money block on 2026-08-19 knowing that — the
 * rates, the stacking charge and the placement rule are things he checks
 * against his own bookings, so the sourcing weakness was not what the
 * sign-off rested on.
 *
 * That was the last outstanding decision in the project: it covers all
 * 20 Norwegian hulls at once, which is why it was raised separately from
 * the per-class cabin and traps work rather than being folded into it.
 *
 * TWO THINGS ON THIS LINE DIVERGE HARD FROM ADVISOR INTUITION built on
 * Royal and Carnival, and both are encoded as explicit warnings:
 *
 *   1. **The "free" drinks are not free.** Free at Sea carries a
 *      mandatory fixed charge per person per day for guests 21 and over,
 *      and it STACKS on top of the ordinary daily service charge. A Haven
 *      couple on a seven-night sailing is looking at roughly $53.50 per
 *      person per day before anyone buys anything.
 *   2. **Across-the-hallway does not satisfy the minor rule.** Royal
 *      explicitly allows it. NCL explicitly excludes it. An advisor
 *      carrying the Royal habit across will book a family into a
 *      placement that fails.
 *
 * The programme name has also changed twice in two years — Free at Sea
 * became More at Sea in October 2024, then reverted to Free at Sea on
 * 5 November 2025, with Free at Sea Plus returning 1 February 2026. Any
 * advisor note older than that is describing something that no longer
 * exists, including the "pick two perks" framing, which is obsolete: it
 * is a bundle now.
 */

export const NCL_SOURCES: Source[] = [
  {
    label: "Daily service charge — $20 standard, $25 suites and Haven, age 3+",
    url: "https://www.ncl.com/ca/en/cruise-faq/what-is-onboard-service-charge",
    checked: "2026-08-18",
  },
  {
    label: "More at Sea ends, Free at Sea reinstated 5 November 2025",
    url: "https://www.travelmarketreport.com/cruises/articles/norwegian-cruise-line-reverts-back-to-free-at-sea",
    checked: "2026-08-18",
  },
  {
    label: "Free at Sea fixed charge rises to $32 on short sailings, 1 May 2026",
    url: "https://cruise.blog/2026/05/norwegian-raises-drink-package-price-short-cruises",
    checked: "2026-08-18",
  },
  {
    label: "Free at Sea Plus — $49.99 per day, all guests must take the same offer",
    url: "https://adept.travel/news/2025-12-18-ncl-free-at-sea-plus-returns-pricing-opt-in-rules",
    checked: "2026-08-18",
  },
  {
    label: "Age policy — same, connecting or side-by-side only, never across the hall",
    url: "https://www.ncl.com/faq/age-requirements",
    checked: "2026-08-18",
  },
  {
    label: "Specialty dining opens at 120 days, 125 for suites and top Latitudes tiers",
    url: "https://www.ncl.com/faq/when-can-i-book-specialty-dining",
    checked: "2026-08-18",
  },
  {
    label: "Splash Academy and Entourage age bands",
    url: "https://www.ncl.com/ncl-experience/youth-programs/faq",
    checked: "2026-08-18",
  },
];

/**
 * $20 per person per day for everything from a studio up to and
 * including the Club Balcony Suite; $25 for suites and The Haven. Only
 * two tiers, and the Club Balcony Suite sits in the LOWER one despite
 * the word Suite in its name — a common mis-quote.
 *
 * The standalone Unlimited Open Bar is about $109 per person per day if
 * bought outright, with a per-drink ceiling around $15; Premium Plus
 * lifts the ceiling for roughly $29 more. Everyone in the stateroom has
 * to buy it — the same all-or-nothing rule Royal has.
 *
 * SIGNED OFF by Jimmy, 2026-08-19. One decision covering all 20
 * Norwegian hulls.
 *
 * There is deliberately NO break-even figure, the same as the other
 * lines. Break-even is a property of the drinker.
 */
export const NCL_MONEY: ShipContent["money"] = {
  // Signed off by Jimmy, 2026-08-19.
  verified: true,
  drinkPackagePrice: 109,
  drinkPackageNote:
    "Do not tell an NCL client their drinks are free. Free at Sea bundles the open bar in, but it carries a mandatory fixed charge for every guest 21 and over — about $28.50 per person per day on sailings of six nights or more, and $32 on two-to-five-night sailings since May 2026 — and that STACKS on top of the ordinary daily service charge rather than replacing it. A Haven couple on a week is around $53.50 each per day before they buy a thing. Two more catches: the specialty dining in the bundle goes to guests one and two only, and a second guest under 21 gets a soda package at $12.50 a day charged separately, while guests three and up under 21 get no substitute at all.",
  specialtyDiningNote:
    "Book at 120 days out, the moment it opens — and know you're already behind. Suites, Club Balcony and the top Latitudes tiers get in at 125 days and clear the 6:30 to 8:00 slots at Cagney's, Le Bistro and Ocean Blue before general booking even starts. Take 5:30 or 9:00 rather than nothing, and warn them the \"free\" dinner still surcharges lobster and the premium steak cuts, with a second main at $25.",
  gratuityPerDayUSD: 20,
};

/** Guppies is parent-participation, not drop-off childcare. That surprises people. */
export const NCL_KIDS_RULES =
  "Splash Academy runs Turtles 3–5, Seals 6–9 and Dolphins 10–12, with Entourage for teens 13–17. Guppies covers 6 months to 2 years but it's a parent-participation play session, not drop-off childcare — don't let a couple plan an evening around it. Core programming is free; the Late Night Fun Zone is $10 an hour per child. Registration is a one-time form per child, done on embarkation day.";

/**
 * The placement rule, and the one an advisor coming from Royal gets
 * wrong. Royal allows a cabin directly across the hall. NCL does not.
 */
export const NCL_MINOR_PLACEMENT =
  "On any itinerary touching a US, Canadian or Chinese port, a guest under 21 has to be with someone 21 or over in the same stateroom, a connecting one, or one directly side-by-side. Across the hallway does NOT count here — Royal Caribbean allows that and Norwegian explicitly doesn't, so don't carry the habit across. Guardian minimum is 21, which is looser than Carnival's 25, but the geometry is tighter than both. A guardian who isn't the parent needs a notarised consent letter at the pier.";

/** Check-in opens later than the other lines — 21 days, not 45. */
export const NCL_EMBARKATION =
  "Check-in opens 21 days before sailing, not the 45 Royal gives you, and has to be done at least 3 days out. The arrival window is picked during check-in, and there's a security selfie to upload as part of it — worth warning a less tech-comfortable client about in advance, because eDocs are needed to get onto the pier at all.";

/**
 * Freestyle Cruising is the line's whole proposition and also the source
 * of its most common complaint. The useful advice is not "there are no
 * reservations" but "there is no reservation and everyone wants 7pm".
 */
export const NCL_FREESTYLE =
  "Freestyle means no assigned table and no fixed dinner time, which is the selling point — but it also means everyone turns up at once. The 6:30 to 7:30 window fills hard on the bigger ships and queueing is routine. Tell them to eat at 5:30 or after 8, or to book ahead even where it isn't required. The ships show colour-coded capacity boards for each venue; a red bar means don't walk over.";

/**
 * The Haven is a real product and a real over-promise risk. The trap is
 * not that it's bad — it's that "suite" and "Haven" are not synonyms,
 * and the Haven itself varies enormously between ships.
 */
export const NCL_HAVEN_WARNING =
  "Be precise about The Haven, because two different mistakes cost bookings. First: a Club Balcony Suite is not a Haven category and carries the lower service charge — selling \"a suite\" is not selling Haven access. Second: the Haven is not the same product ship to ship. The newest hulls have the full complex with its own restaurant, pool and sundeck; the oldest have a small enclave and no Haven restaurant at all. Check what this specific ship's Haven actually includes before you describe it.";

/** Line-wide money traps that aren't the drink package. */
export const NCL_FLEET_TRAPS = [
  "Prepaid service charges do not cover bar, beverage or specialty-dining gratuities. That one sentence causes more onboard disputes than anything else on this line — say it at final payment.",
  "Free at Sea Plus is $49.99 per person per day, applies to guests one and two, and every guest in the stateroom has to take the same offer. It has to be added at least 72 hours before sailing and can't be changed onboard, so it's a pre-cruise decision or it's nothing.",
  "Drinks at Great Stirrup Cay, the private island, are carved out of standard Free at Sea and sold as a separate island package. Free at Sea Plus covers them; the standard bundle doesn't. Clients assume the private island is included and it isn't.",
  "Wi-Fi is per device per day — around $30 for browsing and $40 for streaming. A couple with two phones each is paying four times what they think they are.",
  "Room service carries a convenience fee per order, about $5 at breakfast and up to $10 the rest of the day. It's waived in suites and The Haven, so a client moving down from a suite next time will notice.",
];
