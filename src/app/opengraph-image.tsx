import { ImageResponse } from "next/og";
import { SHIPS } from "@/content/ships";
import { blockStates, isCovered } from "@/lib/types";

/**
 * THE SOCIAL CARD.
 *
 * Every route declared `openGraph` metadata and none of them had an
 * image, so every link an advisor pasted anywhere rendered as a blank
 * card. This one sits at the app root, so every page inherits it unless
 * it declares its own.
 *
 * DRAWN, NOT PHOTOGRAPHED. The brief rules out stock photography and
 * cruise-marketing clichés, and a ship at sunset would be exactly the
 * thing this product is positioned against. It is the palette, the two
 * display faces and one derived number — which also means it cannot go
 * stale: the coverage line is reduced from the catalog at build time
 * like every other number on the site.
 *
 * No custom font is loaded. `ImageResponse` ships a sans fallback, and
 * fetching a typeface at build time would put the social card behind a
 * network call that the deploy environment may not permit — a broken
 * build for a decorative asset is a bad trade.
 */

export const alt =
  "First Mate Cruise — a second set of eyes on every cruise booking";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const covered = SHIPS.filter(isCovered);
  const signed = covered.filter((s) => blockStates(s.content).allVerified).length;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#e9eff1",
          padding: "72px 80px",
          color: "#0f2a3d",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div
            style={{
              fontSize: 30,
              letterSpacing: "-0.01em",
              color: "#0b1d33",
              fontWeight: 600,
            }}
          >
            First Mate Cruise
          </div>
          <div
            style={{
              fontSize: 15,
              letterSpacing: "0.22em",
              color: "#6e869a",
            }}
          >
            CRUISEREAD.COM
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              fontSize: 76,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              maxWidth: 900,
            }}
          >
            {/* Satori requires an explicit display on any element with
                more than one child, and JSX turns an entity into its own
                text node — so this is one expression rather than three
                children. */}
            {"Before you book, know what you'd miss."}
          </div>
          <div style={{ fontSize: 27, lineHeight: 1.4, color: "#3a5872", maxWidth: 820 }}>
            {"Cabin, money and the surprises that show up at the gangway — from deck plans and line policy, not marketing copy."}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 46, height: 4, background: "#c8a24d" }} />
          <div style={{ fontSize: 20, letterSpacing: "0.06em", color: "#3a5872" }}>
            {`${covered.length} SHIPS CHARTED${
              signed === covered.length
                ? ", EVERY ONE SIGNED OFF"
                : `, ${signed} SIGNED OFF`
            }`}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
