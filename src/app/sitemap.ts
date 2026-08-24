import type { MetadataRoute } from "next";
import { LINES, SHIPS } from "@/content/ships";
import { LINE_RECORDS } from "@/content/lines/records";
import { routedClassRecords } from "@/lib/classes";
import { shipProvenance } from "@/lib/provenance";
import { isCovered } from "@/lib/types";
import type { CoveredShip } from "@/lib/types";

/**
 * THE SITEMAP, derived from the same data every page reads.
 *
 * `public/robots.txt` has been pointing at `/sitemap.xml` since it was
 * written and the file did not exist — a promise to every crawler that
 * 404'd. This is that file, and it is generated rather than listed so a
 * route cannot be forgotten: the ship URLs come from the covered ships,
 * the class URLs from the same `routedClassRecords` the class pages
 * build from, the line URLs from `LINE_RECORDS`.
 *
 * WHAT IS DELIBERATELY OUT:
 *
 *   `/share`   one client's booking in a URL. Noindex on the page and
 *              disallowed in robots; listing it here would contradict
 *              both.
 *   `/api/*`   not content.
 *   `/compare?a=&b=`  about three thousand pair permutations, all
 *              canonical to the bare `/compare` — which is listed. A
 *              sitemap full of permutations is index bloat that the
 *              canonical tag would then have to undo.
 *
 * `lastModified` is the real thing rather than the build clock: the most
 * recent date any source behind that page was checked. A ship page whose
 * sources were last read in August says August, and an index says the
 * most recent date among the pages it lists. A sitemap that stamps
 * everything with the deploy time tells a crawler that 195 pages changed
 * every time one did.
 */

const BASE = "https://cruiseread.com";

/** Most recent source date behind a ship, as a Date. */
function checkedAt(ship: CoveredShip): Date | undefined {
  const checked = shipProvenance(ship.content).cabin.checked;
  return checked ? new Date(checked) : undefined;
}

/** The latest of a set of dates, or undefined when there are none. */
function latest(dates: (Date | undefined)[]): Date | undefined {
  const real = dates.filter((d): d is Date => d instanceof Date && !isNaN(+d));
  if (real.length === 0) return undefined;
  return real.reduce((a, b) => (a > b ? a : b));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const covered = SHIPS.filter(isCovered);
  const classes = routedClassRecords(SHIPS, LINES);

  const shipEntries = covered.map((ship) => ({
    url: `${BASE}/ships/${ship.id}`,
    lastModified: checkedAt(ship),
  }));

  const classEntries = classes.map((record) => ({
    url: `${BASE}/classes/${record.slug}`,
    lastModified: latest(record.ships.map(checkedAt)),
  }));

  const lineEntries = LINE_RECORDS.map((record) => ({
    url: `${BASE}/cruise-lines/${record.id}`,
    lastModified: latest(
      covered.filter((s) => s.line === record.name).map(checkedAt),
    ),
  }));

  const newest = latest(covered.map(checkedAt));

  const staticEntries = [
    "",
    "/check",
    "/ships",
    "/classes",
    "/cruise-lines",
    "/compare",
    "/methodology",
    "/about",
    "/guides",
    "/pricing",
    "/request-a-ship",
    "/guides/quiet-cabins",
    "/guides/obstructed-balconies",
    "/guides/cruise-guarantee-cabins",
  ].map((path) => ({ url: `${BASE}${path}`, lastModified: newest }));

  return [...staticEntries, ...lineEntries, ...classEntries, ...shipEntries];
}
