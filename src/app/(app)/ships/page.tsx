import type { Metadata } from "next";
import { LINES, SHIPS } from "@/content/ships";
import { LINE_RECORDS } from "@/content/lines/records";
import { buildDirectory, directoryTotals } from "@/lib/directory";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ShipsDirectory } from "@/components/ship/ShipsDirectory";

/**
 * THE SHIPS DIRECTORY.
 *
 * Static. The whole catalog is in the payload and the filtering happens
 * in the browser, so the prerendered HTML carries every covered ship and
 * every link to one — a crawler and a reader with JavaScript off see the
 * same directory, just without the search box narrowing it.
 *
 * The header states coverage as numbers this file does not know. Every
 * figure on the page is reduced from the catalog at build time, which is
 * the same discipline the footer and the no-read screen already keep:
 * the day a fourth line is worked up, the sentence changes itself.
 */

export const metadata: Metadata = {
  title: "Ships",
  description:
    "Every ship First Mate covers, and every ship it does not. Cabin placement, obstructed balconies, money and expectation traps, per hull.",
  alternates: { canonical: "/ships" },
};

export default function ShipsPage() {
  // Only lines with a record have a page; the directory links exactly those.
  const lines = buildDirectory(SHIPS, LINES, new Set(LINE_RECORDS.map((r) => r.id)));
  const totals = directoryTotals(lines);

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-[1180px] px-5 pt-6 pb-20 sm:px-8">
        <Breadcrumbs trail={[{ label: "Ships" }]} />

        <header className="mb-9 max-w-[62ch]">
          <h1 className="font-call text-[2rem] leading-[1.1] tracking-[-0.02em] text-ink sm:text-[2.4rem]">
            Every ship, and what we actually know about it
          </h1>
          <p className="mt-3.5 text-[1rem] leading-[1.6] text-ink-2">
            {totals.covered} of {totals.ships} hulls carry a full read
            {totals.signed === totals.covered
              ? ", every one signed off by an operator"
              : `, ${totals.signed} of them signed off by an operator`}
            . The rest are listed so you can find your ship and get a straight
            answer, rather than a page that looks like knowledge and is not.
          </p>
          <p className="mt-3 font-readout text-[0.66rem] leading-[1.7] tracking-[0.07em] uppercase text-ink-3">
            {totals.coveredLines} of {totals.lines} lines charted
          </p>
        </header>

        <ShipsDirectory lines={lines} />
      </div>
    </main>
  );
}
