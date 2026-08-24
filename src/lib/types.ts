/**
 * The CruiseRead domain types.
 *
 * The Confidence Read is produced by a deterministic engine over structured
 * ship data — never by an LLM. An LLM hallucinating a deck number is a
 * lawsuit-shaped risk, and the encoded operator judgment is the moat.
 *
 * Two things are deliberately kept apart:
 *
 *   - the CATALOG (a ship's line, name and class) — public, factual,
 *     researchable, and safe to carry for every hull afloat;
 *   - the READ CONTENT (cabin, money and trap judgment) — the operator
 *     knowledge, which only exists for ships someone has actually worked.
 *
 * A ship in the catalog with no read content returns no read at all. That
 * is the point: breadth in the picker must never become breadth in the
 * calls, because a confidence product that is confidently wrong becomes
 * the exact thing the advisor feared.
 */

import type { ActivityAvailability } from "./availability";
import type { Deck } from "./decks";
import type { ObstructionKind } from "./obstruction";

/**
 * Where a line sits in the market — drives grouping in the ship picker.
 *
 * Luxury and expedition were removed with their rosters on 2026-08-19;
 * see the note in `src/content/ships/index.ts`. The type lists what the
 * catalog actually contains rather than what it might one day, so a
 * category nothing can be assigned to doesn't sit here looking valid.
 */
export type LineCategory = "contemporary" | "premium";

/** A ship as it appears in the picker. Identity only, no judgment. */
export type ShipIdentity = {
  id: string;
  line: string; // "Royal Caribbean"
  name: string; // "Wonder of the Seas"
  shipClass?: string;
  /**
   * Year entered service. The ship page header wants it.
   *
   * Optional and SPARSELY POPULATED on purpose. The years are stated in
   * the signed class-file headers, so they can be transcribed the same
   * way the deck stacks were — but not by pattern-matching. The headers
   * contain "Jewel (2004)" and "Jewel (2005)" for two different ships on
   * two different lines, and "Star (2001)" and "Star (2025)" likewise. An
   * automated sweep would have crossed them, which is the Pride of
   * America error with a regex instead of a press release.
   *
   * So it is filled in per class, deliberately, alongside the deck work.
   * A ship without it renders no year rather than a guessed one.
   */
  serviceYear?: number;
};

/** One cruise line and its fleet. */
export type CruiseLine = {
  id: string;
  name: string;
  category: LineCategory;
  /** `id` is derived from the ship name unless one is given explicitly. */
  ships: { id?: string; name: string; shipClass?: string; serviceYear?: number }[];
};

/** Where a claim came from, and when it was last looked at. */
export type Source = {
  label: string;
  url: string;
  /** ISO date the source was checked. Prices and policies go stale fast. */
  checked: string;
};

/**
 * WHO MAY SAIL AT ALL. Evaluated before any other logic — see
 * `getRead` — because a fit question presumes eligibility.
 *
 * This exists because of the Viking pilot. Every hull covered before it
 * was Carnival, Royal or Norwegian, so nothing in the catalog ever said
 * "children cannot board". The engine's family read opens with "Kid
 * access is the trap on this ship", which on an adults-only line is not
 * a wrong warning but an incoherent one.
 *
 * NO SHIP CURRENTLY SETS THIS. The Viking record it was built for was
 * pulled before sign-off, so the gate is live, tested and unexercised.
 * That is deliberate rather than dead code: the defect was real and
 * always was, the fix is guarded (absent field means no block, and every
 * existing read is verified unchanged), and the next adults-only line
 * added should not have to rediscover it. The same applies to
 * `FareInclusions` below.
 */
export type Eligibility = {
  /** Published minimum guest age. Viking Ocean is 18. */
  minimumGuestAge: number;
  /** Anything that qualifies it — a region or itinerary that differs. */
  note?: string;
};

/**
 * WHAT THE FARE ALREADY COVERS — three states, deliberately.
 *
 * `"none"` and `"not-researched"` must not be the same value. The
 * absence-as-evidence errors (a missing SportSquare, missing kart-noise
 * complaints, missing solo studios in four files) all came from reading
 * "nobody checked" as "nothing there". An engine that can't tell them
 * apart will make that mistake structurally rather than occasionally.
 */
export type FareInclusions =
  | {
      state: "known";
      /** Itemised, as the line words it. */
      includes: string[];
      /**
       * Alcohol specifically, because it is the one the money read turns
       * on. "with-meals" is Viking's shape: beer, wine and soft drinks
       * at lunch and dinner, with an upgrade sold separately.
       */
      alcohol: "none" | "with-meals" | "unlimited";
      /** The paid upgrade, where one exists — Viking's Silver Spirits. */
      upgrade?: { name: string; note: string };
    }
  /** Checked, and the fare genuinely includes nothing beyond passage. */
  | { state: "none" }
  /** Nobody has looked. NOT the same as `none`. */
  | { state: "not-researched" };

/** The operator's knowledge of a hull. Absent until someone works it up. */
export type ShipContent = {
  reviewDue?: string; // freshness date

  /**
   * Where the claims in this record came from. A record with sources is
   * researched and auditable; a record with none is somebody's memory —
   * which is fine once `verified` is true and dangerous before.
   */
  sources?: Source[];

  /**
   * Who may sail. Absent means the ordinary adult-and-child assumption
   * holds, which is true of every contemporary line in the catalog.
   */
  eligibility?: Eligibility;

  /**
   * What the fare already covers. Absent is read as `not-researched`,
   * never as `none` — see the `FareInclusions` comment.
   */
  fareInclusions?: FareInclusions;

  /**
   * THE DECK STACK, when it is known — see `src/lib/decks.ts`.
   *
   * Absent means nobody has recorded it, NOT that the ship has no decks.
   * A ship without this renders no deck table at all rather than an
   * inferred one: `cabin.placementNote` still carries the operator's
   * answer in prose, and prose is where it stays until someone has read
   * a plan or transcribed a signed stack.
   */
  decks?: Deck[];

  /**
   * What is CURRENTLY not running on this hull — see
   * `src/lib/availability.ts` for why this is separated from everything
   * else in the record rather than written into `traps.other`.
   *
   * Per ship, never per class: a class factory must not spread one hull's
   * broken attraction across its sisters. An empty or absent list means
   * nobody checked, NOT that everything is working.
   */
  availability?: ActivityAvailability[];

  /**
   * The three blocks are independently optional. Operator knowledge does
   * not arrive all at once — line-wide money and trap policy can be
   * researched while the cabin call still needs someone who has walked
   * the ship. A missing block is reported as uncharted in the read, never
   * quietly filled in.
   */
  cabin?: {
    /**
     * False until an operator confirms this block against their own
     * knowledge. Verification is per block, not per ship: cabin advice
     * comes from someone who has sailed the hull, while money and trap
     * policy is researched from the line. Those become true at different
     * moments and must be markable separately, or nothing is ever
     * signable without over-claiming the rest.
     */
    verified: boolean;
    /**
     * Reads as "book them midship, ___" — e.g. "decks 8 to 10".
     *
     * Optional on purpose. An operator's real answer is often the rule
     * rather than the numbers ("lower or middle decks, toward the middle
     * of the ship"), and that rule is the call. Forcing a deck range here
     * would manufacture a precision nobody actually has, which is the
     * same failure as a numeric score. Leave it out and the engine falls
     * back to the rule.
     */
    midshipRange?: string;
    /**
     * Placement guidance that doesn't reduce to a deck range — "deck 9 is
     * the lowest full stateroom deck, so it's a strong default, but judge
     * the actual cabin rather than the number". Rendered as its own flag.
     */
    placementNote?: string;
    /**
     * SHIP MOTION only: pitch and roll, the thing a seesaw explains.
     * A complete sentence, rendered as written — not wrapped in "avoid ___
     * entirely", because a blanket veto on both ends is wrong. Forward is
     * the real problem; aft is a relative negative, not a disqualifier.
     */
    motionAvoid: string;
    /**
     * PROPULSION VIBRATION — deliberately a separate concept from motion,
     * and the distinction matters more than it looks.
     *
     * Lower and midship is generally BETTER for motion, closer to the
     * waterline with less to swing. But a low aft cabin can still pick up
     * engine vibration and shake, which is a different complaint with a
     * different cause. Collapsing the two produces the exact wrong advice:
     * "go low" is right for motion and can be wrong for vibration.
     */
    vibrationNote?: string;
    /**
     * What an advisor should know about particular cabin categories or
     * deck bands, for reasons other than pitch and roll — size, value,
     * noise, who else books there. Shown on every read, not just seasick
     * ones, because none of it depends on motion sensitivity.
     *
     * Each entry is a complete heads-up sentence. Entries may carry a
     * tradeoff rather than a veto: "fine on a budget, but ___" is real
     * operator advice and more useful than a flat never.
     */
    categoryWarnings?: string[];
    /**
     * Which of the NOISE_SOURCES this ship has near cabins, and where.
     *
     * `source` is a NoiseSource id; the venue wording, the risk level and
     * what the traveler actually experiences all come from that shared
     * table, so a ship record never restates general judgment. `where` is
     * the only ship-specific part — omit it when the decks aren't known
     * rather than guessing at them.
     *
     * Order here does not matter; the engine sorts by risk.
     */
    hazardsAboveBelow: { source: string; where?: string }[];
    obstructedViewNotes?: string;
    /**
     * WHICH KINDS of obstruction this hull has — see `src/lib/obstruction.ts`
     * for the taxonomy and why the distinction changes the advice.
     *
     * Populate ONLY where the mechanism is actually established. Several
     * records deliberately leave this empty because the line publishes
     * that a cabin is obstructed without saying by what, and guessing
     * would defeat the point of having the field. An empty list renders
     * nothing rather than a hedge.
     */
    obstructionKinds?: ObstructionKind[];
    connectingNote?: string;
    /**
     * A line rule about where minors may be berthed. Fires on family
     * bookings. Kept separate from connectingNote because it is policy,
     * not ship layout — an advisor can satisfy it or fail it, and failing
     * it is a booking that gets rejected or reshuffled at the pier.
     */
    minorPlacementRule?: string;
    elevatorNote?: string;
    accessibilityNote?: string;
  };
  money?: {
    /** See cabin.verified. */
    verified: boolean;
    drinkPackagePrice?: number;
    /**
     * THE SERVICE CHARGE, AND WHETHER THE PRICE ALREADY CARRIES IT.
     *
     * The single most misleading thing on a compare screen. Carnival
     * posts CHEERS! at $83.94 with its 20% service charge already in;
     * Royal posts $75 and adds 18% at checkout. Side by side that reads
     * as Carnival being $9 a day dearer when the all-in figures are
     * $83.94 against $88.50 — the comparison is backwards, and it is
     * backwards on the one screen built to compare them.
     *
     * Recorded as a RATE AND A FLAG rather than as prose naming another
     * line, so the normalisation is derived wherever two lines meet and
     * a rate change stays one edit. A note in Carnival's record saying
     * "Royal adds 18%" would render on 29 Carnival ship pages where
     * nobody is comparing anything, and would rot the day Royal moved
     * its rate.
     *
     * ABSENT MEANS NOBODY CHECKED, not that the price is all-in. The
     * compare page declines to normalise a pair where either side is
     * missing rather than assuming a zero.
     */
    serviceCharge?: {
      /** 0.18 for eighteen percent. */
      rate: number;
      /** True when `drinkPackagePrice` already carries it. */
      includedInPrice: boolean;
    };
    breakEvenDrinksPerDay?: number;
    /**
     * Anything that changes the package maths on this line before the
     * break-even even applies — a package bundled into the fare, a
     * mandatory-for-all-adults rule, a service charge levied separately.
     * Without this the engine's worth-it call is confidently wrong on any
     * line that does not sell the package as a simple daily rate.
     */
    drinkPackageNote?: string;
    specialtyDiningNote: string;
    gratuityPerDayUSD?: number;
  };
  traps?: {
    /** See cabin.verified. */
    verified: boolean;
    kidAgeHeightRules?: string;
    /**
     * Family-program eligibility that is not a ride-height rule — youth
     * club ages, toilet-training requirements, nursery availability and
     * paid care windows. Kept separate because the ride field deliberately
     * renders slide language that would invent an attraction on lines whose
     * family product is programming rather than a waterpark.
     */
    familyProgramRules?: string;
    obstructedBalconyDecks?: string;
    embarkationNote?: string;
    /** Traps specific to THIS ship or class. Shown as flags, like the rest. */
    other?: string[];
    /**
     * Traps that are true of every sailing on the line, not of this ship.
     *
     * Kept apart from `other` because they behave differently in use. A
     * ship-specific trap is news; the line's Wi-Fi pricing is reference
     * material the advisor has already read on the last four ships. Mixed
     * together they crowded the ship-specific flags off the top of the
     * card — Royal and Norwegian records were running eight or nine flags,
     * and the ones that mattered were buried among the ones that didn't.
     *
     * The read renders these behind a disclosure rather than as flags, so
     * they stay available without competing with what's actually
     * particular to this booking. This is presentation only: nothing is
     * dropped, and it does not change what an advisor can see.
     */
    linePolicy?: string[];
  };
};

/** A catalog ship, with operator content when we have it. */
export type Ship = ShipIdentity & {
  content?: ShipContent;
};

/** A ship we can actually produce a read for. */
export type CoveredShip = ShipIdentity & { content: ShipContent };

/** The blocks a record actually carries, and which of them are signed off. */
export function blockStates(c: ShipContent) {
  const present = [c.cabin, c.money, c.traps].filter(Boolean) as {
    verified: boolean;
  }[];
  return {
    present: present.length,
    verified: present.filter((b) => b.verified).length,
    allVerified: present.length > 0 && present.every((b) => b.verified),
    anyVerified: present.some((b) => b.verified),
  };
}

export function isCovered(ship: Ship): ship is CoveredShip {
  const c = ship.content;
  // Content with no blocks at all is not coverage — it would render three
  // "uncharted" cards and tell the advisor nothing.
  return c !== undefined && (c.cabin !== undefined || c.money !== undefined || c.traps !== undefined);
}

/* The five inputs. Every extra input is friction, and friction kills a
   confidence tool — do not add a sixth without a validated reason. */

export type Party = "couple" | "family" | "multigen" | "solo";
export type Seasick = "no" | "yes";
export type Experience = "first" | "seasoned";
export type Itinerary = "port-heavy" | "sea-days";

export type ClientProfile = {
  shipId: string;
  party: Party;
  seasick: Seasick;
  experience: Experience;
  itinerary: Itinerary;
};

/**
 * One category of the read. Same three-part shape every time:
 * the call (plain, no hedging), the flags ("Heads up:"), and the why
 * (the operator's reasoning, collapsed by default).
 *
 * Flags may use `**double asterisks**` for emphasis; they are rendered as
 * text, never as HTML.
 *
 * Note what is deliberately absent: any numeric score. A score is more
 * data to weigh and implies a false precision that raises liability.
 */
export type ReadCategory = {
  call: string;
  flags: string[];
  why: string;
  /** Whether an operator has signed this category off. Drives the marker. */
  verified: boolean;
  /**
   * Line-wide reference shown behind a disclosure, below the flags. Only
   * the traps category populates it today. See `ShipContent.traps
   * .linePolicy` for why it is separated from the flags rather than
   * listed among them.
   */
  linePolicy?: string[];
};

/**
 * Exactly three categories. Do not add a fourth.
 *
 * A null category means nobody has worked that block up for this ship
 * yet. The read shows it as uncharted rather than dropping it, so the
 * advisor can see what is missing instead of assuming it was checked.
 */
export type Read = {
  cabin: ReadCategory | null;
  money: ReadCategory | null;
  traps: ReadCategory | null;
  /**
   * The booking cannot happen at all — an under-age party on an
   * adults-only ship. NOT a fourth category: it replaces the read
   * rather than joining it, because there is nothing to advise on.
   *
   * When this is set, all three categories are null. Rendering a cabin
   * recommendation beside "this party cannot sail" would be worse than
   * useless.
   */
  ineligible?: { reason: string };
};
