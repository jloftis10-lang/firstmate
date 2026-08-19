import type { LineCategory, Ship } from "./types";
import { blockStates } from "./types";
import type { ProvenanceState } from "./provenance";
import { shipProvenance } from "./provenance";

/**
 * THE DIRECTORY, shaped for the client and no wider.
 *
 * The catalog is 195 ships across 14 lines and the directory filters
 * them in the browser, so every field here crosses the wire. That is the
 * constraint this file exists to hold: a `Ship` carries its whole
 * `ShipContent` — every placement note, every trap, every source — and
 * handing the directory `SHIPS` directly would serialise the entire
 * knowledge base into the payload of a page that renders three chips per
 * ship. So the entry carries the three provenance STATES and nothing
 * else from the record.
 *
 * THE SHAPE OF COVERAGE IS THE PAGE'S REAL FINDING. Three lines are
 * covered completely — 30 of 30, 29 of 29, 20 of 20 — and eleven are
 * covered not at all. There is no partially covered line in the catalog
 * today. That is why the directory groups by line rather than listing
 * 195 hulls: for eleven lines the line name and a count say everything
 * 116 rows would, which is the same lesson the no-read screen learned
 * when it stopped dumping 79 ships at an advisor.
 *
 * It is nonetheless DERIVED, not written down. The day a line is half
 * worked up it reports "12 of 17" and renders its covered hulls, with
 * nothing here to edit.
 */

export type DirectoryEntry = {
  id: string;
  name: string;
  line: string;
  shipClass?: string;
  serviceYear?: number;
  /**
   * Absent when the hull is uncharted — which is also how the component
   * knows there is no page to link to. `/ships/[slug]` builds params
   * from the covered ships alone, so an entry without this has no URL,
   * and rendering it as a link would be an orphan by construction.
   */
  coverage?: {
    cabin: ProvenanceState;
    money: ProvenanceState;
    traps: ProvenanceState;
  };
};

export type DirectoryLine = {
  id: string;
  name: string;
  category: LineCategory;
  total: number;
  covered: number;
  /** Covered AND all present blocks signed off. */
  signed: number;
  ships: DirectoryEntry[];
};

export function buildDirectory(
  ships: Ship[],
  lines: { id: string; name: string; category: LineCategory }[],
): DirectoryLine[] {
  return lines
    .map((line) => {
      const fleet = ships.filter((s) => s.line === line.name);
      const entries: DirectoryEntry[] = fleet.map((s) => {
        const base: DirectoryEntry = {
          id: s.id,
          name: s.name,
          line: s.line,
          shipClass: s.shipClass,
          serviceYear: s.serviceYear,
        };
        if (!s.content) return base;
        const p = shipProvenance(s.content);
        return {
          ...base,
          coverage: {
            cabin: p.cabin.state,
            money: p.money.state,
            traps: p.traps.state,
          },
        };
      });

      return {
        id: line.id,
        name: line.name,
        category: line.category,
        total: fleet.length,
        covered: fleet.filter((s) => s.content).length,
        signed: fleet.filter((s) => s.content && blockStates(s.content).allVerified)
          .length,
        ships: entries,
      };
    })
    .filter((l) => l.total > 0)
    // Covered lines first, then by how much of them there is. A line
    // nobody can read yet is not the first thing an advisor should meet.
    .sort((a, b) => b.covered - a.covered || b.total - a.total || a.name.localeCompare(b.name));
}

/**
 * Does this ship match what was typed?
 *
 * Name, line and class, because those are the three things an advisor
 * knows when they arrive. Deliberately NOT a fuzzy match: "Radiance"
 * must not surface Carnival Radiance and Radiance of the Seas alongside
 * six near-misses, and a directory that guesses at intent on a product
 * whose whole claim is that it does not guess would be a poor joke.
 */
export function matches(entry: DirectoryEntry, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    entry.name.toLowerCase().includes(q) ||
    entry.line.toLowerCase().includes(q) ||
    (entry.shipClass?.toLowerCase().includes(q) ?? false)
  );
}

/** Totals for the page header. Derived, never stated. */
export function directoryTotals(lines: DirectoryLine[]) {
  return lines.reduce(
    (acc, l) => ({
      ships: acc.ships + l.total,
      covered: acc.covered + l.covered,
      signed: acc.signed + l.signed,
      lines: acc.lines + 1,
      coveredLines: acc.coveredLines + (l.covered > 0 ? 1 : 0),
    }),
    { ships: 0, covered: 0, signed: 0, lines: 0, coveredLines: 0 },
  );
}
