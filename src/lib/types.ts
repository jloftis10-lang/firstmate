/**
 * The First Mate domain types.
 *
 * The Confidence Read is produced by a deterministic engine over structured
 * ship data — never by an LLM. An LLM hallucinating a deck number is a
 * lawsuit-shaped risk, and the encoded operator judgment is the moat.
 */

/** A structured ship record. One file per ship under src/content/ships. */
export type Ship = {
  id: string;
  line: string; // "Royal Caribbean"
  name: string; // "Wonder of the Seas"
  shipClass?: string;
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
