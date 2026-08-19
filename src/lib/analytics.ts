/**
 * THE INSTRUMENTATION SEAM — and it sends nothing by default.
 *
 * WHY THIS EXISTS. Three pages tell an advisor that "the order these get
 * worked up in is driven by what advisors actually ask for". Nothing in
 * this product can observe that. It is a promise with no mechanism
 * behind it, which is the one kind of claim this codebase is least
 * willing to leave standing.
 *
 * WHY IT IS EMPTY. Choosing an analytics provider is not a code
 * decision. Session-recording tools capture an advisor's screen while
 * they work a real client's booking, and the check's own URL carries
 * that client's profile — the ship, whether they get seasick, who is
 * travelling. Turning that on is Jimmy's call to make, not one to
 * inherit from a build brief, so this ships as a seam with the call
 * sites chosen and the payload constrained, and no provider wired up.
 *
 * WHAT AN EVENT MAY CARRY, and this is the part that matters more than
 * the transport: a ship id and whether that hull is charted. Never the
 * party, the seasickness answer, the itinerary or the URL — those are
 * facts about a real traveller, and the demand question does not need
 * them. The type below makes that a compile-time constraint rather than
 * a guideline.
 *
 * TO TURN IT ON: set `NEXT_PUBLIC_ANALYTICS_ENDPOINT` and the events
 * below post to it. Nothing else changes, and nothing loads a
 * third-party script.
 */

export type AnalyticsEvent =
  /** An advisor ran a check. `charted` says whether a read came back. */
  | { name: "check.run"; ship: string; charted: boolean }
  /** An advisor asked for a hull nobody has worked up. The demand signal. */
  | { name: "check.uncharted"; ship: string }
  /** An advisor sent the client summary on. The end of a successful use. */
  | { name: "summary.shared"; ship: string };

const ENDPOINT = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT;

/**
 * Fire and forget, and forget quietly.
 *
 * An analytics failure must never surface to an advisor mid-booking or
 * break a click — so this swallows everything, and `keepalive` lets the
 * request outlive a navigation rather than being cancelled by it.
 */
export function track(event: AnalyticsEvent): void {
  if (!ENDPOINT) return;
  if (typeof window === "undefined") return;
  try {
    void fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(event),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Deliberately silent. See above.
  }
}

/** Whether anything is wired up. Rendered on the methodology page. */
export const analyticsEnabled = Boolean(ENDPOINT);
