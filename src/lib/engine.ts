import type { ClientProfile, CoveredShip, Read, ReadCategory } from "./types";
import { noiseRank, noiseSource } from "./noise";

/**
 * The deterministic Confidence Read engine.
 *
 * Structured ship data + typed rules in, flagged and reasoned output out.
 * No LLM anywhere in this file, and no numeric scores — the output is a
 * plainly-stated call plus the reasoning behind it.
 *
 * Every ship-specific detail comes off the Ship record. The reasoning in
 * the `why` blocks is general operator knowledge and lives here, because
 * it holds true across hulls.
 */

/* ------------------------------------------------------------------ *
 * 01 — Cabin & deck
 * ------------------------------------------------------------------ */

function cabinRead(
  ship: CoveredShip,
  client: ClientProfile,
): ReadCategory | null {
  const cabin = ship.content.cabin;
  if (!cabin) return null;
  const flags: string[] = [];
  let call: string;
  let why: string;

  // With a confirmed deck range, name it. Without one, state the rule —
  // which is what an operator actually says — rather than invent numbers.
  const placement = cabin.midshipRange
    ? `midship, ${cabin.midshipRange}`
    : "on a lower or middle deck, toward the middle of the ship";

  if (client.seasick === "yes") {
    call = `This one matters here — book them ${placement}. Nothing high, nothing at either end. That's where the ship moves least.`;
    // The two ends are bad for DIFFERENT reasons, which is the part a
    // deck plan and the seesaw rule both miss. Aft mechanism is
    // operator-confirmed (Jimmy, 2026-08-17).
    why =
      "A ship pivots around its center, like a seesaw: the ends rise and fall the most, the middle barely moves. But the two ends are bad for different reasons. Forward is the pitch — that's the motion people picture. Aft is the engines: you feel the vibration back there and the room itself can shake, which is a different complaint from motion and catches the people who assumed a low cabin at the back would be fine. Lower is generally better for motion too — closer to the waterline, less of the ship swinging around you. Midship is where you avoid both at once.";
    flags.push(`They're prone to seasickness. ${cabin.motionAvoid}`);
    // Separate flag on purpose: vibration is not motion, and a traveler
    // sensitive to one is not automatically sensitive to the other.
    if (cabin.vibrationNote) {
      flags.push(cabin.vibrationNote);
    }
  } else {
    call = `Put them ${placement} — calmest ride, shortest walk to the dining room and the elevators.`;
    why =
      "Midship is the sweet spot on any ship: least motion, most central. Even for good sailors it saves them a quarter-mile hike to dinner every night.";
  }

  if (cabin.placementNote) {
    flags.push(cabin.placementNote);
  }

  // Category warnings are not motion advice — they apply to everyone.
  for (const warning of cabin.categoryWarnings ?? []) {
    flags.push(warning);
  }

  // Worst first, using the shared risk ranking. The venue wording and the
  // "what they'll actually hear" text come from the taxonomy, so this
  // reads the same on every hull and only the locations differ.
  const hazards = cabin.hazardsAboveBelow
    .map((h) => ({ h, src: noiseSource(h.source) }))
    .filter((x): x is { h: (typeof cabin.hazardsAboveBelow)[number]; src: NonNullable<ReturnType<typeof noiseSource>> } => Boolean(x.src))
    .sort((a, b) => noiseRank(a.h.source) - noiseRank(b.h.source));

  if (hazards.length > 0) {
    const detail = hazards
      .map(({ h, src }) => {
        const venue = src.venue.charAt(0).toUpperCase() + src.venue.slice(1);
        const where = h.where ? ` (${h.where})` : "";
        const when = src.window ? `, ${src.window}` : "";
        return `**${venue}**${where} — ${src.experience}${when}.`;
      })
      .join(" ");
    flags.push(
      `Check what's directly above and below the cabin, worst first: ${detail}`,
    );
  }

  // A connecting door cuts both ways, so this fires for EVERY booking, not
  // just families. Operator-confirmed (Jimmy, 2026-08-17): great when your
  // own people are on the other side of it, wrong when it's strangers.
  if (cabin.connectingNote) {
    if (client.party === "family") {
      flags.push(
        `Connecting cabins are the right call here — but never infer it from the category or from two cabin numbers sitting next to each other. Only an explicit connecting pair counts. ${cabin.connectingNote}`,
      );
    } else {
      flags.push(
        "Keep them out of a connecting cabin. That door is a bonus when your own people are on the other side of it and a problem when it's strangers — check the deck plan before you confirm.",
      );
    }
  }

  // Policy, not layout: an adjacent cabin can fail this where a connecting
  // one passes, which is exactly the distinction an advisor loses track of.
  if (client.party === "family" && cabin.minorPlacementRule) {
    flags.push(cabin.minorPlacementRule);
  }

  if (client.party === "multigen" && cabin.elevatorNote) {
    flags.push(
      `Book them near an elevator bank — that's the call for anyone slower on their feet. ${cabin.elevatorNote}`,
    );
  }

  return { call, flags, why, verified: cabin.verified };
}

/* ------------------------------------------------------------------ *
 * 02 — Money surprises
 * ------------------------------------------------------------------ */

/**
 * Money, written the way a folio shows it. A whole-dollar rate reads as
 * "$17"; anything with cents needs both digits, because "$18.5 per person
 * per day" looks like a typo in front of a client.
 */
function usd(amount: number): string {
  return Number.isInteger(amount) ? `$${amount}` : `$${amount.toFixed(2)}`;
}

function moneyRead(
  ship: CoveredShip,
  client: ClientProfile,
): ReadCategory | null {
  const money = ship.content.money;
  if (!money) return null;
  const flags: string[] = [];
  let call: string;
  let why: string;

  if (client.itinerary === "sea-days") {
    const math =
      money.drinkPackagePrice && money.breakEvenDrinksPerDay
        ? `at about $${money.drinkPackagePrice} a day it breaks even around ${money.breakEvenDrinksPerDay} drinks, and they'll clear that`
        : "what it takes to break even depends entirely on what they actually drink, so run it against their habits rather than a rule of thumb";
    call = `The drink package is worth it on this sailing. Lots of sea days means lots of bar time — ${math}.`;
    why =
      "Drink packages only win when people are actually on the ship drinking. Sea-day itineraries keep them aboard, so the break-even is easy to clear. On a port-heavy run it's the opposite.";
  } else {
    call =
      "Skip the blanket drink package here. It's a port-heavy run — they'll be off the ship most days, and it rarely earns back its cost.";
    why =
      "A drink package has to be consumed on the ship. When the itinerary pulls them ashore five days out of seven, the daily rate almost never breaks even. Sell it and they feel it was a waste — and they remember who suggested it.";
  }

  // Raised before the dining flag: if the package is already in the fare,
  // the worth-it call above is the wrong question entirely.
  if (money.drinkPackageNote) {
    flags.push(money.drinkPackageNote);
  }

  flags.push(
    `Book specialty dining now, before they board. ${money.specialtyDiningNote} When the client can't get a table they blame you, not the ship.`,
  );

  if (client.experience === "first") {
    const rate = money.gratuityPerDayUSD
      ? ` — around ${usd(money.gratuityPerDayUSD)} per person, per day —`
      : "";
    flags.push(
      `Set the gratuity expectation up front. It's auto-added to the folio daily${rate} and first-timers are always surprised by the bill at the end.`,
    );
  }

  return { call, flags, why, verified: money.verified };
}

/* ------------------------------------------------------------------ *
 * 03 — Expectation traps
 * ------------------------------------------------------------------ */

function trapsRead(
  ship: CoveredShip,
  client: ClientProfile,
): ReadCategory | null {
  const { traps, cabin } = ship.content;
  if (!traps) return null;
  const flags: string[] = [];
  let call: string;
  let why: string;

  if (client.party === "family") {
    call =
      "Kid access is the trap on this ship. What the parents picture and what their kids can actually use are two different things — and nobody finds out until day one.";
    why =
      "Every line splits kids' programming and thrill rides by age and height, and the cutoffs aren't on the booking page. A parent who was promised the waterpark and gets a crying kid at the rope is a parent who books with someone else next year.";
    if (traps.kidAgeHeightRules) {
      flags.push(
        `Confirm the kids clear the height and age lines **before** you promise anything. ${traps.kidAgeHeightRules} A tall six-year-old still gets turned away at the slide.`,
      );
    }
  } else if (client.party === "multigen") {
    call =
      "Watch the walking. This is a big ship, and the distance from a far cabin to the theater or dining room is longer than anyone expects — it wears on older travelers by day three.";
    why =
      "Deck plans hide scale. On a vessel this size, 'aft' to 'midship dining' can be a quarter-mile each way. For a multigen group with anyone slower on their feet, cabin placement is really a mobility decision in disguise.";
    if (cabin?.accessibilityNote) {
      flags.push(
        `Map their daily route before you book the cabin. ${cabin.accessibilityNote} A great-looking aft suite can mean a punishing walk to everything, every night.`,
      );
    }
  } else {
    // Deliberately uncounted: the flag list below varies by ship, so the
    // call must not promise "two things" and then show three.
    call =
      "Not many traps on this booking — but don't confirm it before you've glanced at these.";
    why =
      "Experienced or not, these catch people on every sailing, because none of them show up clearly at the point of booking.";
  }

  // The CAUSE comes off the ship record rather than being hardcoded here.
  // It was "obstructed by a lifeboat" in engine prose while cabin
  // .obstructedViewNotes sat unread in four ship files — so the operator's
  // actual answer never reached the advisor. Decks are appended only when
  // we have them.
  const obstruction = cabin?.obstructedViewNotes;
  const obstructedDecks = traps.obstructedBalconyDecks;
  if (obstruction || obstructedDecks) {
    const cause = obstruction ? ` ${obstruction}` : "";
    const decks = obstructedDecks ? ` Watch ${obstructedDecks}.` : "";
    flags.push(
      `If you've booked a balcony, confirm the view isn't blocked.${cause}${decks} The deck plan doesn't always flag it, and an obstructed view is the first thing the client notices.`,
    );
  }

  if (client.experience === "first" && traps.embarkationNote) {
    flags.push(
      `Walk them through embarkation-day timing. ${traps.embarkationNote} First-timers show up whenever, then wait in a two-hour line — a staggered check-in window is the easiest good impression you'll ever make.`,
    );
  }

  for (const other of traps.other ?? []) {
    flags.push(other);
  }

  // Line policy stays out of the flag list on purpose — see the field
  // comment on ShipContent.traps.linePolicy. It is reference the advisor
  // has read on every other ship of the line, and mixing it in buried the
  // ship-specific flags that are the reason they ran the check.
  return {
    call,
    flags,
    why,
    verified: traps.verified,
    ...(traps.linePolicy?.length ? { linePolicy: traps.linePolicy } : {}),
  };
}

/* ------------------------------------------------------------------ */

/** Exactly three categories. Do not add a fourth. */
export function getRead(ship: CoveredShip, client: ClientProfile): Read {
  return {
    cabin: cabinRead(ship, client),
    money: moneyRead(ship, client),
    traps: trapsRead(ship, client),
  };
}

/**
 * The client-ready summary — warmer register than the operator's read.
 * This is what the advisor sends, so it carries no jargon and no flags.
 */
export function clientSummary(ship: CoveredShip, client: ClientProfile): string {
  const who =
    client.party === "family"
      ? "your crew"
      : client.party === "multigen"
        ? "the group"
        : client.party === "solo"
          ? "you"
          : "you two";

  const parts: string[] = [];
  parts.push(`I've got ${who} set for the ${ship.name}.`);

  // Each sentence is gated on the block that backs it. This is what the
  // advisor sends a paying client — it must never assert a placement or a
  // package call that no operator content supports.
  const cabin = ship.content.cabin;
  if (cabin) {
    const range = cabin.midshipRange;
    parts.push(
      client.seasick === "yes"
        ? range
          ? `I'm putting you midship on a lower deck on purpose — ${range} is the steadiest part of the ship, so seasickness shouldn't be an issue.`
          : "I'm putting you on a lower deck toward the middle of the ship on purpose — that's the steadiest part of the ship, so seasickness shouldn't be an issue."
        : range
          ? `I'm booking you midship, ${range}, so you're close to everything and get the smoothest ride.`
          : "I'm booking you toward the middle of the ship so you're close to everything and get the smoothest ride.",
    );
  }

  const money = ship.content.money;
  if (money) {
    parts.push(
      client.itinerary === "sea-days"
        ? "With this many sea days, the drink package is genuinely worth it, so I'll add it."
        : "I'd skip the drink package on this one — you'll be off exploring most days, so it wouldn't pay off.",
    );
  }

  if (client.party === "family" && ship.content.traps?.kidAgeHeightRules) {
    parts.push(
      "I'm double-checking the kids clear the height and age rules for the slides and clubs so there are no surprises on day one.",
    );
  }

  if (client.party === "multigen" && cabin) {
    parts.push(
      "I've picked the cabin with the walking in mind, so nobody's hiking the length of the ship to get to dinner.",
    );
  }

  if (money) {
    parts.push(
      "I'll also lock in your specialty dining before you sail so you get the nights you want.",
    );
  }

  return parts.join(" ");
}

