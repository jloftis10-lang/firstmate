import type { ShipContent } from "./types";

/**
 * ONE HULL'S RECORD, FETCHED WHEN IT IS NEEDED.
 *
 * The other half of the split described in `check-catalog.ts`. Each
 * covered ship's content is a static JSON file generated at build time,
 * so this is a CDN read rather than a server call and the site stays
 * statically hostable.
 *
 * PER SHIP RATHER THAN ONE BUNDLE, and the difference is the whole
 * point. A single dynamic `import()` of the content module would be one
 * request and one cached chunk — but it would still download all 79
 * records to read one, and it would still grow with coverage. Per hull
 * is about 12 KB raw for the ship actually being checked, and it stays
 * that size when the catalog doubles.
 *
 * CACHED IN THE MODULE, so an advisor running four bookings against the
 * same hull pays for it once, and so does one who goes to the ship page
 * and comes back. The cache holds promises rather than results, which
 * means two overlapping requests for the same hull — the picker warming
 * it and the check asking for it — share one fetch instead of racing.
 */

const inFlight = new Map<string, Promise<ShipContent>>();

export const shipContentPath = (id: string) =>
  `/data/ships/${encodeURIComponent(id)}`;

export function loadShipContent(id: string): Promise<ShipContent> {
  const cached = inFlight.get(id);
  if (cached) return cached;

  const request = fetch(shipContentPath(id))
    .then((res) => {
      if (!res.ok) throw new Error(`ship content ${id}: ${res.status}`);
      return res.json() as Promise<ShipContent>;
    })
    .catch((err) => {
      // A failed fetch must not poison the cache — an advisor on a bad
      // connection who retries should get a real second attempt rather
      // than the first failure replayed.
      inFlight.delete(id);
      throw err;
    });

  inFlight.set(id, request);
  return request;
}

/** Already loaded, or loading. Lets the caller skip a needless await. */
export function isShipContentCached(id: string): boolean {
  return inFlight.has(id);
}
