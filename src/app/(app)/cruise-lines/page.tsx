import type { Metadata } from "next";
import Link from "next/link";
import { LINES, SHIPS } from "@/content/ships";
import { LINE_RECORDS } from "@/content/lines/records";
import { routedClassRecords } from "@/lib/classes";
import { linePath } from "@/lib/nav";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProvenanceBadge } from "@/components/ProvenanceBadge";
import { blockProvenance } from "@/lib/provenance";

/**
 * THE LINE DIRECTORY.
 *
 * Fourteen lines, three of which have a record. The other eleven get a
 * row and no link, for the same reason their hulls get no page: there is
 * nothing behind them yet, and a page that exists reads as a page that
 * has been worked up.
 *
 * The split is stark and it is stated rather than softened. Eleven of
 * fourteen is the honest coverage picture of this platform today, and an
 * advisor is better served by seeing it than by a directory that lists
 * fourteen lines in one undifferentiated grid.
 */

export const metadata: Metadata = {
  title: "Cruise Lines",
  description:
    "Line policy for travel advisors — gratuities, drink packages, kids' clubs, where minors may be berthed and embarkation, per cruise line.",
  alternates: { canonical: "/cruise-lines" },
};

export default function CruiseLinesPage() {
  const classes = routedClassRecords(SHIPS, LINES);
  const rows = LINES.map((l) => {
    const record = LINE_RECORDS.find((r) => r.id === l.id);
    const fleet = SHIPS.filter((s) => s.line === l.name);
    return {
      line: l,
      record,
      total: fleet.length,
      covered: fleet.filter((s) => s.content).length,
      classes: classes.filter((c) => c.lineId === l.id).length,
    };
  }).sort((a, b) => b.covered - a.covered || b.total - a.total);

  const charted = rows.filter((r) => r.record);
  const rest = rows.filter((r) => !r.record);

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-[1180px] px-5 pt-6 pb-20 sm:px-8">
        <Breadcrumbs trail={[{ label: "Cruise Lines" }]} />

        <header className="mb-9 max-w-[62ch]">
          <h1 className="font-call text-[2rem] leading-[1.1] tracking-[-0.02em] text-ink sm:text-[2.4rem]">
            What holds on every sailing, whichever ship it is
          </h1>
          <p className="mt-3.5 text-[1rem] leading-[1.6] text-ink-2">
            Gratuity rates, package rules, kids&apos;-club age bands, where
            minors may be berthed and how embarkation actually runs are set by
            the line rather than the hull. {charted.length} of {rows.length}{" "}
            lines have that worked up.
          </p>
        </header>

        <section aria-labelledby="charted" className="mb-12">
          <h2
            id="charted"
            className="mb-5 font-call text-[1.3rem] leading-[1.2] tracking-[-0.01em] text-ink"
          >
            Charted
          </h2>
          <ul className="grid list-none gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {charted.map((r) => {
              const prov = blockProvenance(r.record!.money, r.record!.sources);
              return (
                <li key={r.line.id}>
                  <Link
                    href={linePath(r.line.id)}
                    className="block h-full rounded-[13px] border border-line bg-surface p-4 no-underline transition-colors hover:border-ink-3"
                  >
                    <span className="flex items-start gap-2">
                      <span className="font-call text-[1.15rem] leading-[1.25] text-ink">
                        {r.line.name}
                      </span>
                      <ProvenanceBadge provenance={prov} className="ml-auto" />
                    </span>
                    <span className="mt-1.5 block font-readout text-[0.62rem] leading-[1.7] tracking-[0.05em] uppercase text-ink-3">
                      {r.covered === r.total
                        ? `all ${r.total} ships`
                        : `${r.covered} of ${r.total} ships`}{" "}
                      · {r.classes} classes
                    </span>
                    <span className="mt-2.5 block text-[0.88rem] leading-[1.5] text-ink-2">
                      {r.record!.sections.length} policy sections, and the money
                      block every hull on the line carries.
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="rest">
          <h2
            id="rest"
            className="mb-1.5 font-call text-[1.3rem] leading-[1.2] tracking-[-0.01em] text-ink"
          >
            In the catalog, not charted
          </h2>
          <p className="mb-5 max-w-[62ch] text-[0.9rem] leading-[1.55] text-ink-2">
            These lines carry the same kinds of rules and nobody has worked
            them up. They get a row and no page — a page that exists reads as
            a page that has been checked.
          </p>
          <ul className="grid list-none gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((r) => (
              <li
                key={r.line.id}
                className="rounded-[12px] border border-dashed border-line bg-surface/50 px-3.5 py-3"
              >
                <span className="block font-call text-[1.02rem] leading-[1.25] text-ink-2">
                  {r.line.name}
                </span>
                <span className="mt-1 block font-readout text-[0.62rem] leading-[1.6] tracking-[0.05em] uppercase text-ink-3">
                  {r.total} ships · none charted
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-5 max-w-[62ch] text-[0.88rem] leading-[1.55] text-ink-3">
            The order these get worked up in is driven by what advisors
            actually ask for. The{" "}
            <Link href="/ships" className="text-deep underline decoration-line underline-offset-2">
              ships directory
            </Link>{" "}
            lists their hulls.
          </p>
        </section>
      </div>
    </main>
  );
}
