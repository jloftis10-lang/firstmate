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
  { label: "Ships", href: "/ships", available: false },
  { label: "Cruise Lines", href: "/cruise-lines", available: false },
  { label: "Ship Classes", href: "/classes", available: false },
  { label: "Compare", href: "/compare", available: false },
  { label: "How It Works", href: "/methodology", available: false },
];

/** The one action every screen offers. Lives at `/` until Phase 7. */
export const PRIMARY_CTA = { label: "Run a Booking Check", href: "/" };

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
 * The Booking Check, pre-loaded with a ship.
 *
 * `ship` is a NEW parameter on `/`, not on `/share` — the five share
 * params are a frozen public contract and this does not touch them.
 */
export const checkPath = (shipId: string) => `/?ship=${encodeURIComponent(shipId)}`;
