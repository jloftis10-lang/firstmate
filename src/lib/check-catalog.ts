import type { Ship, ShipContent, ShipIdentity, CoveredShip } from "./types";
import { blockStates } from "./types";

/**
 * WHAT THE CHECK ACTUALLY NEEDS IN THE BROWSER.
 *
 * The check runs the engine client-side, which is what makes it static,
 * instant and usable after the page has loaded. To do that it was handed
 * `SHIPS` — all 195 hulls with every placement note, every trap and
 * every source serialised into the HTML of the page. That is 906 KB raw
 * and 88 KB gzipped against 12 KB for the homepage, and **98% of it is
 * unused** until the advisor picks a hull: only one ship's content is
 * ever read.
 *
 * Worse than the size is the slope. It grows about 12 KB of raw payload
 * per covered ship, so the tool gets heavier every time coverage — the
 * thing this product exists to grow — goes up. At full catalog coverage
 * it would be roughly 2.4 MB on the page an advisor opens mid-call.
 *
 * So the page ships THIS instead: identity, and the two booleans the
 * form needs to describe its own coverage. Twenty-one kilobytes for all
 * 195 hulls, and flat forever — adding a ship adds a row, not a record.
 * The content for the one hull being read is fetched on demand; see
 * `src/lib/ship-content.ts`.
 */
export type CatalogShip = {
  id: string;
  name: string;
  line: string;
  /** A read exists for this hull. */
  charted: boolean;
  /**
   * Charted AND every block an operator signed. Computed here because
   * `blockStates` needs the record, which is exactly what does not cross
   * the wire — the form states both counts and must not guess either.
   */
  signed: boolean;
};

export function checkCatalog(ships: Ship[]): CatalogShip[] {
  return ships.map((s) => ({
    id: s.id,
    name: s.name,
    line: s.line,
    charted: Boolean(s.content),
    signed: Boolean(s.content && blockStates(s.content).allVerified),
  }));
}

/**
 * Rejoin an identity with the content that was fetched for it.
 *
 * Built field by field rather than spread: `CatalogShip` carries two
 * booleans that are not part of a ship, and handing the engine an object
 * with `charted` on it would be the beginning of somebody reading it.
 */
export function withContent(ship: CatalogShip, content: ShipContent): CoveredShip {
  const identity: ShipIdentity = { id: ship.id, name: ship.name, line: ship.line };
  return { ...identity, content };
}
