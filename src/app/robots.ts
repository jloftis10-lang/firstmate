import type { MetadataRoute } from "next";

/**
 * ROBOTS, as a route rather than a file in `public/`.
 *
 * It was a static `public/robots.txt` with the production domain typed
 * into its `Sitemap:` line — a second copy of the domain that
 * `metadataBase` already holds, and the kind of pair that goes out of
 * step the first time a domain changes. A static file at the same path
 * also wins over this route, so the old one had to go rather than sit
 * there quietly shadowing it.
 *
 * The disallow list is the same set the sitemap omits, for the same
 * reasons: a share URL carries one client's booking and is noindex on
 * the page itself, and the API is not content.
 */

const BASE = "https://cruiseread.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/share", "/api/"],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
