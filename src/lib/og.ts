/**
 * THE SOCIAL CARD, for pages that build their own `openGraph` block.
 *
 * Next attaches the root `opengraph-image` automatically — until a page
 * declares an `openGraph` object of its own, at which point that object
 * replaces the inherited one and the image goes with it. Every page
 * using `generateMetadata` did exactly that, so 111 of the site's 121
 * pages were pasting as blank cards: all 79 ship pages, all 29 class
 * pages and all 3 line pages. The ten static pages were fine, which is
 * why it was invisible until something checked a ship page.
 *
 * So any page setting `openGraph` spreads this in. One constant rather
 * than three copies of a URL, and a verification asserts the tag is
 * present on a page of each kind.
 */
export const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "CruiseRead — cruise booking intelligence for travel advisors",
};
