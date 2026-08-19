import type { Metadata } from "next";
import Link from "next/link";
import { LINES, SHIPS } from "@/content/ships";
import {
  exceptionCount,
  isUniform,
  routedClassRecords,
} from "@/lib/classes";
import { classPath, linePath } from "@/lib/nav";
import { Breadcrumbs } from "@/components/Breadcrumbs";

/**
 * THE CLASS DIRECTORY.
 *
 * One signal per class and it is deliberately the only one: how much the
 * hulls diverge. Ship counts are on every other page; what an advisor
 * cannot get anywhere else is whether the class they are about to quote
 * from memory actually behaves as one thing.
 *
 * A ONE-SHIP CLASS IS REPORTED AS A ONE-SHIP CLASS, not as a uniform
 * one. Nine classes show zero exceptions and five of those hold a single
 * hull, where uniformity is a tautology. Collapsing the two would
 * roughly triple an honest number.
 *
 * Only charted classes appear. `buildClassRecords` is built from ships
 * with content, so an uncharted line contributes nothing — which is the
 * same rule the ships directory and the ship pages keep, and it is why
 * the note at the foot points at the directory rather than listing class
 * names nobody has worked up.
 */

export const metadata: Metadata = {
  title: "Ship Classes",
  description:
    "What every ship in a class shares, and where the hulls diverge — computed by comparing the ship records rather than written down.",
  alternates: { canonical: "/classes" },
};

export default function ClassesPage() {
  const records = routedClassRecords(SHIPS, LINES);
  const comparable = records.filter((r) => r.ships.length > 1);
  const uniform = comparable.filter(isUniform).length;
  const byLine = LINES.map((l) => ({
    line: l,
    classes: records.filter((r) => r.lineId === l.id),
  })).filter((g) => g.classes.length > 0);

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-[1180px] px-5 pt-6 pb-20 sm:px-8">
        <Breadcrumbs trail={[{ label: "Ship Classes" }]} />

        <header className="mb-9 max-w-[62ch]">
          <h1 className="font-call text-[2rem] leading-[1.1] tracking-[-0.02em] text-ink sm:text-[2.4rem]">
            What transfers between sister ships, and what does not
          </h1>
          <p className="mt-3.5 text-[1rem] leading-[1.6] text-ink-2">
            {records.length} charted classes. Each page shows what every hull
            shares and where they diverge — computed by comparing the ship
            records field by field, so a class rule cannot drift from the
            ships that carry it.
          </p>
          <p className="mt-3 max-w-[58ch] text-[0.92rem] leading-[1.6] text-ink-2">
            Only {uniform} of the {comparable.length} multi-ship classes are
            uniform. That is the case for reading one of these before quoting
            a sister ship from memory.
          </p>
        </header>

        <div className="space-y-9">
          {byLine.map(({ line, classes }) => (
            <section key={line.id} aria-labelledby={`line-${line.id}`}>
              <h2
                id={`line-${line.id}`}
                className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-line pb-2"
              >
                <Link
                  href={linePath(line.id)}
                  className="font-call text-[1.15rem] leading-[1.25] text-ink no-underline hover:underline"
                >
                  {line.name}
                </Link>
                <span className="font-readout text-[0.64rem] tracking-[0.06em] uppercase text-ink-3">
                  {classes.length} classes ·{" "}
                  {classes.reduce((n, c) => n + c.ships.length, 0)} ships
                </span>
              </h2>

              <ul className="grid list-none gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {classes.map((c) => {
                  const single = c.ships.length === 1;
                  const n = exceptionCount(c);
                  return (
                    <li key={c.slug}>
                      <Link
                        href={classPath(c.slug)}
                        className="block h-full rounded-[12px] border border-line bg-surface p-3.5 no-underline transition-colors hover:border-ink-3"
                      >
                        <span className="block font-call text-[1.02rem] leading-[1.25] text-ink">
                          {c.name} class
                        </span>
                        <span className="mt-1 block font-readout text-[0.62rem] leading-[1.6] tracking-[0.05em] uppercase text-ink-3">
                          {c.ships.length} ship{single ? "" : "s"}
                        </span>
                        <span
                          className={`mt-2.5 inline-block rounded-[6px] border px-2 py-[3px] font-readout text-[0.6rem] font-bold tracking-[0.06em] uppercase ${
                            single
                              ? "border-line text-ink-3"
                              : n === 0
                                ? "border-go/40 bg-go-bg text-go"
                                : "border-signal/40 bg-signal-bg text-signal"
                          }`}
                        >
                          {/* Three distinct states. "Nothing to compare" is
                              not "identical", and neither is a number. */}
                          {single
                            ? "Nothing to compare"
                            : n === 0
                              ? "Hulls identical"
                              : `${n} exception${n === 1 ? "" : "s"}`}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>

        <p className="mt-9 max-w-[62ch] text-[0.88rem] leading-[1.55] text-ink-3">
          Classes appear here once a ship in them has been worked up. The
          eleven uncharted lines have classes too and none of them is listed,
          for the same reason none of their hulls has a page —{" "}
          <Link href="/ships" className="text-deep underline decoration-line underline-offset-2">
            the ships directory
          </Link>{" "}
          says which lines those are.
        </p>
      </div>
    </main>
  );
}
