import type { Metadata } from "next";
import Link from "next/link";
import { clientSummary } from "@/lib/engine";
import { parseShare } from "@/lib/share";
import { blockStates, isCovered } from "@/lib/types";
import { getShip } from "@/content/ships";
import { Wordmark } from "@/components/Wordmark";

/**
 * The client-facing page behind a shared link.
 *
 * This is what the advisor's CLIENT opens, so it carries the summary in
 * the warm register and nothing else — no flags, no operator jargon, no
 * heads-ups. The advisor's read stays the advisor's.
 *
 * Statically prerendered per query at request of the advisor's link;
 * everything resolves from the same deterministic engine as the app.
 */

export const metadata: Metadata = {
  // ABSOLUTE, because the root layout's template appends the brand and
  // this page's title already ends in it.
  title: { absolute: "Your cruise plan — CruiseRead" },
  description: "A note from your travel advisor.",

  /**
   * NOT INDEXED, and this is the important line in the file.
   *
   * A share URL carries one named client's booking — the ship, who is
   * travelling, whether they get seasick. It is a link an advisor sends
   * to one person, not a page. It has no business in a search index and
   * it has never had a reason to be in one.
   *
   * It was also inheriting `canonical: "/"` from the root layout, which
   * every other route overrides and this one did not — so every share
   * link was telling crawlers it was really the homepage. Dropping the
   * canonical and saying noindex fixes both at once: there is no
   * canonical URL for a page that should not be indexed.
   */
  robots: { index: false, follow: false },
  alternates: {},
};

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SharePage({ searchParams }: Props) {
  const client = parseShare(await searchParams);
  const ship = client ? getShip(client.shipId) : undefined;

  // A malformed or stale link gets a calm dead-end, not an error page.
  if (!client || !ship || !isCovered(ship)) {
    return (
      <main className="mx-auto max-w-[640px] px-5 pt-10 pb-20">
        <Wordmark />
        <h1 className="mt-6 font-call text-[1.6rem] leading-[1.2] tracking-[-0.01em]">
          This link isn&apos;t quite right.
        </h1>
        <p className="mt-3 max-w-[46ch] text-[0.98rem] text-ink-2">
          It may be incomplete or out of date. Ask your travel advisor to send
          it again.
        </p>
      </main>
    );
  }

  const summary = clientSummary(ship, client);
  const { allVerified } = blockStates(ship.content);

  return (
    <main className="mx-auto max-w-[640px] px-5 pt-10 pb-20">
      <Wordmark />

      <div className="mt-8 mb-2 font-readout text-[0.72rem] font-bold tracking-[0.1em] uppercase text-go">
        From your travel advisor
      </div>
      <h1 className="mb-6 font-call text-[1.7rem] leading-[1.2] tracking-[-0.015em]">
        Your {ship.name} plan, sorted.
      </h1>

      <div className="rounded-2xl border border-line bg-surface p-6 shadow-[0_1px_2px_rgba(15,42,61,.05),0_8px_24px_rgba(15,42,61,.06)]">
        <p className="font-call text-[1.15rem] leading-[1.65] text-ink">
          {summary}
        </p>
      </div>

      {!allVerified && (
        <p className="mt-4 rounded-[10px] border border-line bg-surface/60 px-4 py-3 text-[0.8rem] leading-[1.5] text-ink-3">
          Some of the guidance behind this plan is still being confirmed —
          your advisor has the detail.
        </p>
      )}

      <p className="mt-10 text-center text-[0.78rem] leading-[1.6] text-ink-3">
        Put together with{" "}
        <Link href="/" className="font-semibold text-deep">
          CruiseRead
        </Link>{" "}
        — a second set of eyes on every cruise booking.
      </p>
    </main>
  );
}
