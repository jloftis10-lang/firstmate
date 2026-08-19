import type { CoveredShip, Ship } from "./types";
import { isCovered } from "./types";
import { OBSTRUCTION_KINDS } from "./obstruction";
import type { Obstruction, ObstructionKind } from "./obstruction";
import { NOISE_SOURCES } from "./noise";
import type { NoiseSource } from "./noise";
import { quietCandidates } from "./decks";
import type { Deck } from "./decks";

/**
 * THE GUIDES, DERIVED.
 *
 * A guide on this site is a cross-cut of the catalog, not an essay. The
 * general rule already exists as signed operator content — the noise
 * ranking, the obstruction taxonomy, the sandwich test — and every ship
 * that the rule applies to is already in the records. What no page
 * answers today is the cross-cut: *which hulls have a lifeboat roof
 * under the balcony*, *which have the pool deck directly over cabins*.
 * That question is one `filter` away and it is the whole value of a
 * guide page.
 *
 * So nothing here is written. A guide states a rule that was already
 * signed, then lists the ships the records say it applies to, and the
 * count comes out of the same filter that produced the list. A guide
 * cannot claim a ship has a lifeboat roof unless that ship's record
 * says so, and it cannot go stale relative to the records because there
 * is no second copy of them.
 */

export type ShipRef = { id: string; name: string; line: string };

const ref = (s: CoveredShip): ShipRef => ({ id: s.id, name: s.name, line: s.line });

export function coveredShips(ships: Ship[]): CoveredShip[] {
  return ships.filter(isCovered);
}

/* ------------------------------------------------------------------ *
 * Obstructed balconies
 * ------------------------------------------------------------------ */

export type ObstructionUse = {
  kind: Obstruction;
  ships: ShipRef[];
  /** Lines the kind appears on. Several are one line's geometry only. */
  lines: string[];
};

/**
 * Every obstruction mechanism, with the hulls whose records establish
 * it. Kinds with no ships are still returned — a taxonomy entry nobody
 * has matched to a hull is a real state, and dropping it would make the
 * page look like the taxonomy is fully exercised when it is not.
 */
export function obstructionUse(ships: CoveredShip[]): ObstructionUse[] {
  return OBSTRUCTION_KINDS.map((kind) => {
    const matched = ships.filter((s) =>
      s.content.cabin?.obstructionKinds?.includes(kind.id),
    );
    return {
      kind,
      ships: matched.map(ref),
      lines: [...new Set(matched.map((s) => s.line))],
    };
  });
}

/** Hulls the line publishes as obstructed without saying by what. */
export function obstructedButUnexplained(ships: CoveredShip[]): ShipRef[] {
  return ships
    .filter(
      (s) =>
        (s.content.cabin?.obstructedViewNotes ||
          s.content.traps?.obstructedBalconyDecks) &&
        !s.content.cabin?.obstructionKinds?.length,
    )
    .map(ref);
}

export function obstructionKindOf(id: ObstructionKind): Obstruction | undefined {
  return OBSTRUCTION_KINDS.find((k) => k.id === id);
}

/* ------------------------------------------------------------------ *
 * Quiet cabins
 * ------------------------------------------------------------------ */

export type NoiseUse = {
  source: NoiseSource;
  ships: ShipRef[];
  /** Hulls where the record names the decks, not just the venue. */
  located: number;
};

/**
 * The operator's risk table, with the hulls that carry each source.
 *
 * `located` is the honest half of the count: a record can say a ship has
 * a buffet above cabins without saying which decks, and an advisor needs
 * to know which of those two they are looking at. Sixty-something ships
 * naming a hazard is not sixty-something ships that tell you where.
 */
export function noiseUse(ships: CoveredShip[]): NoiseUse[] {
  return NOISE_SOURCES.map((source) => {
    const matched = ships.filter((s) =>
      s.content.cabin?.hazardsAboveBelow.some((h) => h.source === source.id),
    );
    return {
      source,
      ships: matched.map(ref),
      located: matched.filter((s) =>
        s.content.cabin?.hazardsAboveBelow.some(
          (h) => h.source === source.id && h.where,
        ),
      ).length,
    };
  });
}

export type StackedShip = ShipRef & {
  decks: Deck[];
  candidates: number[];
  /** The operator's own answer, which may be narrower than the arithmetic. */
  placementNote?: string;
};

/** The hulls whose deck stack has been transcribed, with the arithmetic run. */
export function stackedShips(ships: CoveredShip[]): StackedShip[] {
  return ships
    .filter((s) => s.content.decks)
    .map((s) => ({
      ...ref(s),
      decks: s.content.decks as Deck[],
      candidates: quietCandidates(s.content.decks as Deck[]),
      placementNote: s.content.cabin?.placementNote,
    }));
}

/* ------------------------------------------------------------------ *
 * Guarantee cabins
 * ------------------------------------------------------------------ */

export type GuaranteeWarning = { text: string; ships: ShipRef[] };

/**
 * WHAT THE RECORDS ACTUALLY SAY ABOUT GUARANTEES, and no more.
 *
 * Found by matching the word against the recorded traps and category
 * notes rather than by an authored list, so this cannot claim a hull is
 * covered when it is not — and it reports zero for a line nobody has
 * worked up rather than borrowing another line's terms.
 *
 * Today that means Norwegian and only Norwegian: ten hulls, no Carnival
 * and no Royal. The page states that scope in its first paragraph
 * instead of presenting one line's terms as how guarantees work.
 */
export function guaranteeWarnings(ships: CoveredShip[]): GuaranteeWarning[] {
  const byText = new Map<string, ShipRef[]>();
  for (const ship of ships) {
    const notes = [
      ...(ship.content.traps?.other ?? []),
      ...(ship.content.cabin?.categoryWarnings ?? []),
    ];
    for (const note of notes) {
      if (!/guarantee/i.test(note)) continue;
      byText.set(note, [...(byText.get(note) ?? []), ref(ship)]);
    }
  }
  return [...byText.entries()]
    .map(([text, ships]) => ({ text, ships }))
    .sort((a, b) => b.ships.length - a.ships.length);
}

/** Lines with at least one hull charted, for stating a guide's scope. */
export function chartedLines(ships: CoveredShip[]): string[] {
  return [...new Set(ships.map((s) => s.line))].sort();
}
