/**
 * The First Mate domain types.
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

/** Where a line sits in the market — drives grouping in the ship picker. */
export type LineCategory =
  | "contemporary"
  | "premium"
  | "luxury"
  | "expedition";

/** A ship as it appears in the picker. Identity only, no judgment. */
export type ShipIdentity = {
  id: string;
  line: string; // "Royal Caribbean"
  name: string; // "Wonder of the Seas"
  shipClass?: string;
};

/** One cruise line and its fleet. */
export type CruiseLine = {
  id: string;
  name: string;
  category: LineCategory;
  /** `id` is derived from the ship name unless one is given explicitly. */
  ships: { id?: string; name: string; shipClass?: string }[];
};

/** The operator's knowledge of a hull. Absent until someone works it up. */
export type ShipContent = {
  /**
   * False until Jimmy confirms the content against his own operator
   * knowledge. Until it flips true, the UI must visibly mark this ship's
   * read as sample/unverified — an unverified confident claim must never
   * reach a real advisor unlabeled.
   */
  verified: boolean;
  reviewDue?: string; // freshness date

  cabin: {
    /** Reads as "book them midship, ___". e.g. "decks 8–10" */
    midshipRange: string;
    /** Reads as "avoid ___". e.g. "the top decks and the forward third" */
    motionAvoid: string;
    /** Reads as "that means ___" — pool deck, buffet, nightclub locations. */
    hazardsAboveBelow: string[];
    obstructedViewNotes?: string;
    connectingNote?: string;
    elevatorNote?: string;
    accessibilityNote?: string;
  };
  money: {
    drinkPackagePrice?: number;
    breakEvenDrinksPerDay?: number;
    specialtyDiningNote: string;
    gratuityPerDayUSD?: number;
  };
  traps: {
    kidAgeHeightRules?: string;
    obstructedBalconyDecks?: string;
    embarkationNote?: string;
    other?: string[];
  };
};

/** A catalog ship, with operator content when we have it. */
export type Ship = ShipIdentity & {
  content?: ShipContent;
};

/** A ship we can actually produce a read for. */
export type CoveredShip = ShipIdentity & { content: ShipContent };

export function isCovered(ship: Ship): ship is CoveredShip {
  return ship.content !== undefined;
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
};

/** Exactly three categories. Do not add a fourth. */
export type Read = {
  cabin: ReadCategory;
  money: ReadCategory;
  traps: ReadCategory;
};
