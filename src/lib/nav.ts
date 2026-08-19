/**
 * THE INFORMATION ARCHITECTURE, as data.
 *
 * Every destination the platform will have is listed here from the
 * start, each with an `available` flag. Only available ones render as
 * links; the rest are not rendered at all.
 *
 * WHY A FLAG RATHER THAN JUST OMITTING THEM. Two reasons, and the second
 * is the real one. First, each later phase becomes a one-line change
 * here plus the route — the nav does not get rewritten five times.
 * Second, and more useful: this file is the single answer to "what is
 * this site supposed to be", which means a reviewer can see the shape of
 * the whole thing without reading the plan. A nav assembled ad hoc in
 * JSX cannot do that.
 *
 * A link to a route that does not exist is worse than a missing link —
 * "no orphans" cuts both ways. Nothing here renders until it resolves.
 */

export type NavItem = {
  label: string;
  href: string;
  /** Renders only when true. Flip it in the phase that ships the route. */
  available: boolean;
  /** Shown in the footer's fuller listing, not the header. */
  footerOnly?: boolean;
};

export const NAV: NavItem[] = [
  { label: "Ships", href: "/ships", available: true },
  { label: "Cruise Lines", href: "/cruise-lines", available: true },
  { label: "Ship Classes", href: "/classes", available: true },
  { label: "Compare", href: "/compare", available: true },
  { label: "How It Works", href: "/methodology", available: false },
];

/**
 * The one action every screen offers.
 *
 * It moved off `/` in Phase 7. The check is a tool and the root is about
 * to be a homepage; `/` redirects there in the meantime so an advisor's
 * bookmark still lands on the thing they bookmarked.
 */
export const PRIMARY_CTA = { label: "Run a Booking Check", href: "/check" };

export const FOOTER_NAV: NavItem[] = [
  ...NAV,
  { label: "Quiet cabins", href: "/guides/quiet-cabins", available: false, footerOnly: true },
  { label: "Obstructed balconies", href: "/guides/obstructed-balconies", available: false, footerOnly: true },
  { label: "Guarantee cabins", href: "/guides/cruise-guarantee-cabins", available: false, footerOnly: true },
];

export const availableNav = (items: NavItem[]) => items.filter((i) => i.available);

/**
 * The canonical URL for a ship page, in one place.
 *
 * Only COVERED ships have one — `generateStaticParams` builds pages for
 * those alone and `dynamicParams` is off, so an uncharted hull 404s
 * rather than serving an empty page under a real URL. That is the
 * brief's "no indexable pages for ships without real coverage", enforced
 * by the router rather than by a robots directive.
 */
export const shipPath = (id: string) => `/ships/${id}`;

/**
 * The Booking Check, pre-loaded with a ship and nothing else.
 *
 * `ship` is one of the five params `/share` already uses, so this is a
 * partial version of the same query rather than a second encoding —
 * `parseShare` returns null for it, which the check reads as "preselect
 * this hull and still ask the four questions". The full-profile link is
 * `checkPath` in `src/lib/share.ts`.
 */
export const checkShipPath = (shipId: string) =>
  `/check?ship=${encodeURIComponent(shipId)}`;

/**
 * A cruise line's page. Keyed by `CruiseLine.id`, and only the three
 * lines with a `LineRecord` have one — same rule as ships.
 */
export const linePath = (lineId: string) => `/cruise-lines/${lineId}`;

/**
 * A ship class's page. The slug is built in `src/lib/classes.ts`, which
 * also asserts it is unique — class names collide across lines.
 */
export const classPath = (slug: string) => `/classes/${slug}`;
