"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { CoverageChips } from "@/components/CoverageChips";
import { matches } from "@/lib/directory";
import type { DirectoryLine } from "@/lib/directory";
import { shipPath } from "@/lib/nav";

/**
 * THE FLEET, browsable.
 *
 * Two populations on one page and they are not rendered alike, because
 * they are not alike. Seventy-nine hulls have a page, three signed
 * blocks and a URL. A hundred and sixteen have a name in the catalog and
 * nothing else — no page, so no link, so no orphan.
 *
 * WHY THE UNCHARTED LINES COLLAPSE. Every one of them is uncharted
 * COMPLETELY: eleven lines at zero. Rendering 116 rows to say the same
 * thing eleven line names already say is the ship dump the no-read
 * screen removed for exactly this reason, and on a phone it would bury
 * the covered lines under two screens of ships an advisor cannot use.
 * They expand, because "is my ship even in there" is a real question and
 * a closed count does not answer it — but they do not expand by default.
 *
 * FILTERING IS CLIENT-SIDE AND UNFILTERED IS THE SERVER STATE. The
 * initial render is the whole directory, so the static HTML carries
 * every covered ship and its link. Typing narrows what is already there;
 * nothing is fetched and nothing appears that was not in the payload.
 *
 * A search reaches uncharted hulls too, and shows them as what they are.
 * An advisor who types "Sky Princess" deserves "we know the ship, nobody
 * has worked it up" rather than "no results", which reads as a catalog
 * gap and sends them looking somewhere else.
 */
export function ShipsDirectory({ lines }: { lines: DirectoryLine[] }) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string[]>([]);
  const searchId = useId();
  const searching = query.trim().length > 0;

  const filtered = useMemo(
    () =>
      lines
        .map((l) => ({ ...l, ships: l.ships.filter((s) => matches(s, query)) }))
        .filter((l) => l.ships.length > 0),
    [lines, query],
  );

  const hits = filtered.reduce((n, l) => n + l.ships.length, 0);
  const covered = filtered.filter((l) => l.covered > 0);
  const uncharted = filtered.filter((l) => l.covered === 0);

  return (
    <div>
      <div className="mb-8 max-w-[26rem]">
        <label
          htmlFor={searchId}
          className="mb-[9px] block font-readout text-[0.7rem] font-semibold tracking-[0.09em] uppercase text-ink-3"
        >
          Find a ship
        </label>
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ship, line or class"
          className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-base text-ink placeholder:text-ink-3"
        />
        <p className="mt-2 font-readout text-[0.64rem] leading-[1.6] tracking-[0.05em] text-ink-3" role="status">
          {searching
            ? `${hits} MATCH${hits === 1 ? "" : "ES"}`
            : "MATCHES SHIP NAME, LINE OR CLASS"}
        </p>
      </div>

      {hits === 0 && (
        <div className="rounded-[13px] border border-dashed border-line bg-surface/50 px-4 py-3.5">
          <p className="font-call text-[1.05rem] leading-[1.4] text-ink-2">
            Nothing in the catalog matches that.
          </p>
          <p className="mt-2 max-w-[62ch] text-[0.88rem] leading-[1.55] text-ink-3">
            The catalog carries the major lines rather than every hull afloat.
            If the ship is real and it is not here, that is a gap in the
            catalog and worth telling us about — it is not a judgment on the
            ship.
          </p>
        </div>
      )}

      {covered.length > 0 && (
        <section aria-labelledby="charted" className="mb-12">
          <h2
            id="charted"
            className="mb-1.5 font-call text-[1.3rem] leading-[1.2] tracking-[-0.01em] text-ink"
          >
            Charted
          </h2>
          <p className="mb-6 max-w-[62ch] text-[0.9rem] leading-[1.55] text-ink-2">
            Every hull here has a page: where to book, what is above and below
            it, what the balconies actually look at, and what the client will
            be surprised by.
          </p>

          <div className="space-y-9">
            {covered.map((line) => (
              <div key={line.id}>
                <h3 className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-line pb-2">
                  {/* A charted line always has a page — `LINE_RECORDS`
                      and coverage are the same three lines today. If that
                      ever comes apart the link would be an orphan, which
                      is why the page passes the href in rather than this
                      component deriving one from an id it cannot check. */}
                  {line.href ? (
                    <Link
                      href={line.href}
                      className="font-call text-[1.1rem] leading-[1.25] text-ink no-underline hover:underline"
                    >
                      {line.name}
                    </Link>
                  ) : (
                    <span className="font-call text-[1.1rem] leading-[1.25] text-ink">
                      {line.name}
                    </span>
                  )}
                  <span className="font-readout text-[0.64rem] tracking-[0.06em] uppercase text-ink-3">
                    {/* Derived. A half-worked-up line will say so here
                        without anything in this file changing. */}
                    {line.covered === line.total
                      ? `the whole fleet, all ${line.total}`
                      : `${line.covered} of ${line.total} charted`}
                    {line.signed === line.covered
                      ? " · every one signed off"
                      : ` · ${line.signed} signed off`}
                  </span>
                </h3>

                <ul className="grid list-none gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {line.ships.map((s) => (
                    <li key={s.id}>
                      {s.coverage ? (
                        <Link
                          href={shipPath(s.id)}
                          className="block h-full rounded-[12px] border border-line bg-surface p-3.5 no-underline transition-colors hover:border-ink-3"
                        >
                          <span className="block font-call text-[1.02rem] leading-[1.25] text-ink">
                            {s.name}
                          </span>
                          <span className="mt-1 block font-readout text-[0.62rem] leading-[1.6] tracking-[0.05em] uppercase text-ink-3">
                            {[
                              s.shipClass ? `${s.shipClass} class` : undefined,
                              s.serviceYear,
                            ]
                              .filter(Boolean)
                              .join(" · ") || " "}
                          </span>
                          <CoverageChips
                            cabin={{ state: s.coverage.cabin }}
                            money={{ state: s.coverage.money }}
                            traps={{ state: s.coverage.traps }}
                            className="mt-2.5"
                          />
                        </Link>
                      ) : (
                        // A covered LINE can still hold an uncharted hull.
                        // No page exists for it, so it is not a link.
                        <div className="h-full rounded-[12px] border border-dashed border-line bg-surface/50 p-3.5">
                          <span className="block font-call text-[1.02rem] leading-[1.25] text-ink-2">
                            {s.name}
                          </span>
                          <span className="mt-1 block font-readout text-[0.62rem] leading-[1.6] tracking-[0.05em] uppercase text-ink-3">
                            Not charted yet
                          </span>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {uncharted.length > 0 && (
        <section aria-labelledby="uncharted">
          <h2
            id="uncharted"
            className="mb-1.5 font-call text-[1.3rem] leading-[1.2] tracking-[-0.01em] text-ink"
          >
            In the catalog, not charted
          </h2>
          <p className="mb-6 max-w-[62ch] text-[0.9rem] leading-[1.55] text-ink-2">
            These lines are here so you can find the ship and get a straight
            answer about it. Not charted is not a verdict on the ship — it
            means nobody has worked the hull up, and we would rather say that
            than generate a page that reads like knowledge.
          </p>

          <ul className="list-none space-y-2">
            {uncharted.map((line) => {
              const open = searching || expanded.includes(line.id);
              const panelId = `fleet-${line.id}`;
              return (
                <li
                  key={line.id}
                  className="rounded-[12px] border border-dashed border-line bg-surface/50 px-4 py-3"
                >
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-call text-[1.05rem] leading-[1.25] text-ink-2">
                      {line.name}
                    </span>
                    <span className="font-readout text-[0.64rem] tracking-[0.06em] uppercase text-ink-3">
                      {line.total} ship{line.total === 1 ? "" : "s"} · none
                      charted
                    </span>
                    {!searching && (
                      <button
                        type="button"
                        onClick={() =>
                          setExpanded((prev) =>
                            prev.includes(line.id)
                              ? prev.filter((i) => i !== line.id)
                              : [...prev, line.id],
                          )
                        }
                        aria-expanded={open}
                        aria-controls={panelId}
                        className="ml-auto cursor-pointer font-readout text-[0.64rem] font-bold tracking-[0.05em] uppercase text-deep"
                      >
                        {open ? "Hide the fleet" : "Show the fleet"}
                      </button>
                    )}
                  </div>

                  {open && (
                    <ul
                      id={panelId}
                      className="mt-2.5 flex list-none flex-wrap gap-x-4 gap-y-1 border-t border-line/60 pt-2.5"
                    >
                      {line.ships.map((s) => (
                        <li key={s.id} className="text-[0.88rem] leading-[1.6] text-ink-3">
                          {s.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>

          <p className="mt-5 max-w-[62ch] text-[0.88rem] leading-[1.55] text-ink-3">
            The order these get worked up in is driven by what advisors
            actually ask for. If one of these is a line you book often, that is
            worth saying.
          </p>
        </section>
      )}
    </div>
  );
}
