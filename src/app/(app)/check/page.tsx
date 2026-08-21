import type { Metadata } from "next";
import { FirstMate } from "@/components/FirstMate";
import { LINES, SHIPS } from "@/content/ships";
import { LINE_RECORDS } from "@/content/lines/records";
import { linePath } from "@/lib/nav";
import { checkCatalog } from "@/lib/check-catalog";

/**
 * THE BOOKING CHECK, now at its own route.
 *
 * It lived at `/` from the beginning, which was right while `/` was the
 * whole product and wrong the moment the platform grew five sections
 * around it. The root redirects here — see `next.config.ts` — so an
 * advisor's bookmark still lands on the thing they bookmarked, and
 * Phase 8 takes `/` for the homepage.
 *
 * STATIC. The check reads its five params in the browser rather than on
 * the server, so this page prerenders as the empty form: what a crawler
 * sees, and what anyone arriving without a link sees. See
 * `src/lib/url-state.ts` for why not `useSearchParams`.
 */

export const metadata: Metadata = {
  title: "Booking Check",
  description:
    "Tell First Mate the ship and who's sailing. It flags what bites this booking — cabin, money, and the surprises that show up at the gangway.",
  alternates: { canonical: "/check" },
};

export default function CheckPage() {
  // Whether the email path is wired up on THIS deployment. Read on the
  // server so the client never sees the key, and so the affordance simply
  // isn't offered until it would work — rather than failing at the point
  // the advisor has already typed an address.
  const emailEnabled = Boolean(process.env.RESEND_API_KEY);

  // Resolved on the server so `LINE_RECORDS` — and the whole policy
  // corpus it imports — stays out of the client bundle. Three strings
  // cross the wire instead.
  const lineHrefs = Object.fromEntries(
    LINE_RECORDS.flatMap((record) => {
      const line = LINES.find((l) => l.id === record.id);
      return line ? [[line.name, linePath(line.id)] as const] : [];
    }),
  );

  return (
    <main className="flex-1">
      <FirstMate
        // Identity only. The engine still runs in the browser; the one
        // record it needs is fetched. See `src/lib/check-catalog.ts`.
        ships={checkCatalog(SHIPS)}
        emailEnabled={emailEnabled}
        lineHrefs={lineHrefs}
      />
    </main>
  );
}
