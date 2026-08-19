import type { CruiseLine, LineCategory, Ship } from "@/lib/types";
import { CONTEMPORARY_LINES } from "../lines/contemporary";
import { PREMIUM_LINES } from "../lines/premium";
import { SHIP_READS } from "../reads";

/**
 * LUXURY AND EXPEDITION WERE CUT on 2026-08-19, and the reason is worth
 * recording because it is not "we ran out of time".
 *
 * They were 87 ships across 43 classes — roughly two ships per review
 * unit, against Royal Caribbean's thirty ships in eight. So they were
 * the most expensive coverage in the catalog by a factor of four.
 *
 * The deciding argument was the product's thesis rather than the cost.
 * First Mate exists because a five-thousand-passenger ship has cabin
 * traps an advisor cannot see from a booking screen: a Lido deck
 * overhead, a lifeboat roof under the balcony, a dry slide passing
 * through it, deck 9 versus deck 11. A two-hundred-passenger expedition
 * hull has one cabin arrangement, no pool deck to sit beneath and a
 * client already getting concierge attention. Forty-three review units
 * would have produced reads that said "midship, and there is not much to
 * warn you about" — which is a true answer nobody needs a tool for.
 *
 * The expedition roster file said as much itself before it was removed:
 * "much of the three-category framework fits these ships poorly."
 *
 * The rosters are not lost. They are in git history at the commit that
 * removed them, and restoring either is a file and two imports.
 */
export const LINES: CruiseLine[] = [
  ...CONTEMPORARY_LINES,
  ...PREMIUM_LINES,
];

/** Order the picker groups by how often a generalist advisor books them. */
export const CATEGORY_ORDER: LineCategory[] = [
  "contemporary",
  "premium",
];

export const CATEGORY_LABEL: Record<LineCategory, string> = {
  contemporary: "Contemporary",
  premium: "Premium",
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents: Laperouse
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Flatten the catalog into Ship records, attaching read content where we
 * have it. Ids are derived from the ship name so a new hull is one line in
 * a line file, not a hand-maintained id.
 */
function buildCatalog(): Ship[] {
  const ships: Ship[] = [];
  const seen = new Map<string, string>();

  for (const line of LINES) {
    for (const entry of line.ships) {
      const id = entry.id ?? slugify(entry.name);
      const previous = seen.get(id);
      if (previous) {
        // Fail the build rather than silently shadow a ship: two hulls
        // sharing an id would quietly hand one of them the other's read.
        throw new Error(
          `Duplicate ship id "${id}" — ${previous} and ${line.name} · ${entry.name}. Give one of them an explicit id.`,
        );
      }
      seen.set(id, `${line.name} · ${entry.name}`);

      ships.push({
        id,
        line: line.name,
        name: entry.name,
        shipClass: entry.shipClass,
        serviceYear: entry.serviceYear,
        content: SHIP_READS[id],
      });
    }
  }
  return ships;
}

export const SHIPS: Ship[] = buildCatalog();

export function getShip(id: string): Ship | undefined {
  return SHIPS.find((s) => s.id === id);
}

/** Ships we can actually produce a read for — the content worklist's done pile. */
export const COVERED_SHIPS: Ship[] = SHIPS.filter((s) => s.content);

/** Catalog grouped for the picker: category → line → ships. */
export function groupedForPicker() {
  return CATEGORY_ORDER.map((category) => ({
    category,
    label: CATEGORY_LABEL[category],
    lines: LINES.filter((l) => l.category === category).map((line) => ({
      line,
      ships: SHIPS.filter((s) => s.line === line.name),
    })),
  })).filter((g) => g.lines.length > 0);
}
