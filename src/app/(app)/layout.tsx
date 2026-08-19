import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SHIPS } from "@/content/ships";
import { SHIP_READS } from "@/content/reads";

/**
 * The ADVISOR shell — header, section nav, footer.
 *
 * Split from `(client)` deliberately. The share page is opened by the
 * traveller, not the advisor, and wrapping it in this shell would put
 * "Run a Booking Check" and a coverage count in front of somebody who is
 * a client rather than a customer. The advisor's tools stay on the
 * advisor's side of the link; that separation already governs the copy
 * in `clientSummary()` and now governs the chrome too.
 *
 * Counts are derived here, never written down.
 */
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter
        coveredCount={SHIPS.filter((s) => SHIP_READS[s.id]).length}
        shipCount={SHIPS.length}
      />
    </>
  );
}
