import type { ShipContent, Source } from "./types";

/**
 * PROVENANCE — the three states, typed once.
 *
 * The states already exist in the data and have since the first ship
 * record; what did not exist was a name for them. They were implied by a
 * boolean and the absence of an object, and every consumer re-derived
 * them in its own way. `ReadCard` reads a null block; the homepage
 * counts `allVerified`; the share page checks it again. Three
 * derivations of one idea is three places for it to drift.
 *
 *   VERIFIED    an operator has signed this block against real sources
 *   RESEARCHED  content exists and nobody has signed it
 *   UNCHARTED   nobody has worked it up
 *
 * THE DERIVATION IS TOTAL AND LIVES HERE ONLY. There is no fourth case:
 * a block is absent, or present-and-unsigned, or present-and-signed.
 * The risk this file exists to close is a consumer deciding for itself
 * that "not verified" means "uncharted" — which is true today only
 * because every covered ship happens to be fully signed, and would
 * quietly become false the moment a part-signed ship returns. That
 * exact mistake is the one the whole product is built to refuse, so it
 * gets a type and a test rather than a convention.
 *
 * UNCHARTED IS NOT AN ERROR STATE. It is an answer, and the UI must make
 * it look deliberate. "Nobody checked" and "checked and clean" lead to
 * opposite advice, and an empty card that looks like a bug reads as the
 * second when it means the first.
 */

export type ProvenanceState = "verified" | "researched" | "uncharted";

export type Provenance = {
  state: ProvenanceState;
  /**
   * The most recent date any source behind this ship was checked.
   * Absent when there are no sources — which is itself worth showing,
   * because a signed block with no sources is somebody's memory.
   */
  checked?: string;
  /** The source to link to. The most recently checked one. */
  source?: Source;
  sourceCount: number;
};

type Block = { verified: boolean } | undefined;

/**
 * The one derivation. Everything that renders a badge calls this.
 *
 * Sources are ship-level rather than block-level in the current model,
 * so every block on a ship shares them. That is a known imprecision and
 * it is recorded rather than papered over: the badge says when the SHIP
 * was last checked, not when this particular block was.
 */
export function blockProvenance(
  block: Block,
  sources: Source[] | undefined,
): Provenance {
  const list = sources ?? [];
  // Most recent first. ISO dates sort lexically, which is why the model
  // requires that format rather than accepting free text.
  const sorted = [...list].sort((a, b) => b.checked.localeCompare(a.checked));
  const latest = sorted[0];

  const base = {
    checked: latest?.checked,
    source: latest,
    sourceCount: list.length,
  };

  if (block === undefined) return { state: "uncharted", ...base };
  return { state: block.verified ? "verified" : "researched", ...base };
}

/** Provenance for all three blocks of a ship, for coverage chips. */
export function shipProvenance(content: ShipContent) {
  return {
    cabin: blockProvenance(content.cabin, content.sources),
    money: blockProvenance(content.money, content.sources),
    traps: blockProvenance(content.traps, content.sources),
  };
}

/** Copy lives with the type so every surface says the same thing. */
export const PROVENANCE_COPY: Record<
  ProvenanceState,
  { label: string; short: string; detail: string }
> = {
  verified: {
    label: "Verified",
    short: "Signed off",
    detail:
      "An operator has checked this against the line's own deck plans and policy pages and signed it.",
  },
  researched: {
    label: "Researched",
    short: "Not signed off",
    detail:
      "Researched from sources but not signed off by an operator. Check it against what you know before you act on it.",
  },
  uncharted: {
    label: "Uncharted",
    short: "Not checked",
    detail:
      "Not enough reliable evidence to recommend from it. This is not a clean bill of health — nobody has checked it.",
  },
};
