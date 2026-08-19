import Link from "next/link";
import { Emphasis } from "@/components/Emphasis";
import type { FieldDiff, SharedExtra } from "@/lib/classes";
import { sentenceFraming } from "@/lib/classes";
import { shipPath } from "@/lib/nav";

/**
 * THE INHERITANCE MODEL, RENDERED.
 *
 * Everything here comes out of `buildClassRecord`, which computes it by
 * diffing the ships. Nothing on a class page is authored about a class,
 * which is the point: a hand-written class rule is a second source of
 * truth that agrees with the ship records until somebody edits one of
 * them, and this codebase has spent weeks establishing that class rules
 * must not drift from the hulls that inherit them.
 *
 * The consequence is that these components cannot lie about a class.
 * They are reading the same records the ship pages read.
 */

/**
 * One field the hulls disagree on, laid out ship by ship.
 *
 * BY FIELD, not by ship, and that is the useful axis. An advisor looking
 * at an exception wants to read the three placement notes against each
 * other — the comparison IS the information. Grouping by ship would give
 * three paragraphs on three cards and leave the reader to hold them in
 * their head.
 *
 * A ship with nothing recorded for a diverging field says so explicitly.
 * That is a real state — the field is populated on its sisters and empty
 * here — and rendering it as blank would read as agreement.
 */
export function ExceptionField({ diff }: { diff: FieldDiff }) {
  if (!diff.perShip) return null;
  const n = diff.perShip.length;

  // Where the hulls share an opening and a closing, show those once and
  // give each ship only its own middle. See `sentenceFraming` — it
  // declines when there is no frame worth lifting, and this falls back
  // to the whole value rather than approximating one.
  const framing = sentenceFraming(diff.perShip);
  const rows =
    framing?.perShip.map((p) => ({ ship: p.ship, slug: p.slug, value: p.middle })) ??
    diff.perShip;

  return (
    <div className="rounded-[12px] border border-signal/30 bg-signal-bg/40 p-4">
      <h3 className="mb-3 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        <span className="font-call text-[1.05rem] leading-[1.3] text-ink">
          {diff.label}
        </span>
        <span className="font-readout text-[0.6rem] font-bold tracking-[0.07em] uppercase text-signal">
          differs by ship
        </span>
      </h3>

      {framing && framing.lead.length > 0 && (
        <Frame
          // "All 2 hulls" is what a count reads like when nobody checked
          // it against two. The compare page always has exactly two.
          label={n === 2 ? "Both ships open with" : `All ${n} hulls open with`}
          sentences={framing.lead}
          className="mb-3"
        />
      )}

      <dl className="divide-y divide-line/60 border-t border-line/60">
        {rows.map((s) => (
          <div key={s.slug} className="grid gap-x-6 gap-y-1 py-3 sm:grid-cols-[11rem_1fr]">
            <dt>
              <Link
                href={shipPath(s.slug)}
                className="font-readout text-[0.64rem] font-bold tracking-[0.06em] uppercase text-deep no-underline hover:underline"
              >
                {s.ship}
              </Link>
            </dt>
            <dd className="max-w-[62ch] text-[0.92rem] leading-[1.6] text-ink-2">
              {s.value ? (
                <Emphasis text={s.value} />
              ) : (
                <span className="text-ink-3">
                  {/* "Its sisters" is true on a class page and false on
                      the compare page, which routinely puts a Carnival
                      hull beside a Royal one. */}
                  {n === 2
                    ? "Nothing recorded for this hull — the other one carries a note here and this one does not."
                    : "Nothing recorded for this hull — its sisters carry a note here and it does not."}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>

      {framing && framing.tail.length > 0 && (
        <Frame
          label={n === 2 ? "and both close with" : `and all ${n} close with`}
          sentences={framing.tail}
          className="mt-3"
        />
      )}
    </div>
  );
}

/**
 * The shared part of a diverging field, shown once.
 *
 * Rendered plainly and in full rather than behind a disclosure. It is
 * context for every entry below it, and a reader who has to open
 * something to find out what the four hulls agree on will read four
 * fragments out of context instead.
 */
function Frame({
  label,
  sentences,
  className = "",
}: {
  label: string;
  sentences: string[];
  className?: string;
}) {
  return (
    <div className={`rounded-[10px] border border-line/70 bg-canvas px-[13px] py-[11px] ${className}`}>
      <span className="mb-1 block font-readout text-[0.58rem] font-bold tracking-[0.07em] uppercase text-ink-3">
        {label}
      </span>
      <p className="max-w-[62ch] text-[0.9rem] leading-[1.55] text-ink-2">
        <Emphasis text={sentences.join(" ")} />
      </p>
    </div>
  );
}

/**
 * List entries carried by SOME hulls but not all.
 *
 * By item, with the hulls named — the opposite axis from the unique
 * extras below, and the axis the finding lives on. "Three of these four
 * carry the solo-studios note and the fourth does not" is a statement
 * about the class; three copies of the same paragraph under three ship
 * headings is not.
 *
 * The text renders once because the hulls carry it byte-identically.
 * That is what put them in this group — see `groupedExtras`, which
 * matches on exact text and never on similarity.
 */
export function PartialExtras({
  extras,
  total,
}: {
  extras: SharedExtra[];
  /** Hulls in the class, so "3 of 4" can be stated rather than implied. */
  total: number;
}) {
  if (extras.length === 0) return null;

  return (
    <div className="space-y-3">
      {extras.map((e) => (
        <div
          key={`${e.field}-${e.text}`}
          className="rounded-[12px] border border-signal/30 bg-signal-bg/40 p-4"
        >
          <h3 className="mb-2 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <span className="font-readout text-[0.6rem] font-bold tracking-[0.07em] uppercase text-signal">
              {e.ships.length} of {total} hulls
            </span>
            <span className="font-readout text-[0.6rem] font-bold tracking-[0.07em] uppercase text-ink-3">
              {e.label}
            </span>
          </h3>
          <ul className="mb-2.5 flex list-none flex-wrap gap-x-3 gap-y-1">
            {e.ships.map((s) => (
              <li key={s.slug}>
                <Link
                  href={shipPath(s.slug)}
                  className="font-readout text-[0.64rem] font-bold tracking-[0.06em] uppercase text-deep no-underline hover:underline"
                >
                  {s.ship}
                </Link>
              </li>
            ))}
          </ul>
          <p className="max-w-[62ch] rounded-[10px] border border-line/70 bg-canvas px-[13px] py-[11px] text-[0.92rem] leading-[1.5] text-ink-2">
            <Emphasis text={e.text} />
          </p>
        </div>
      ))}
    </div>
  );
}

/**
 * List entries carried by exactly one hull, BY SHIP.
 *
 * The right axis for these: they are additive rather than competing —
 * Jade's Pride of Hawaii history, Joy's three configurations, Spirit
 * class's converted nightclub levels are things one hull has and its
 * sisters simply do not. There is no side-by-side comparison to make,
 * and "what does THIS ship add" is the question an advisor has.
 *
 * Collapsed across fields so a hull with a category note and a trap of
 * its own appears once rather than under two headings.
 */
export function UniqueExtras({ extras }: { extras: SharedExtra[] }) {
  const byShip = new Map<
    string,
    { ship: string; slug: string; items: { label: string; text: string }[] }
  >();
  for (const e of extras) {
    const s = e.ships[0];
    const entry = byShip.get(s.slug) ?? { ship: s.ship, slug: s.slug, items: [] };
    entry.items.push({ label: e.label, text: e.text });
    byShip.set(s.slug, entry);
  }
  const ships = [...byShip.values()];
  if (ships.length === 0) return null;

  return (
    <div className="space-y-3">
      {ships.map((s) => (
        <div key={s.slug} className="rounded-[12px] border border-line bg-surface p-4">
          <h3 className="mb-2.5 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <Link
              href={shipPath(s.slug)}
              className="font-call text-[1.05rem] leading-[1.3] text-ink no-underline hover:underline"
            >
              {s.ship}
            </Link>
            <span className="font-readout text-[0.6rem] font-bold tracking-[0.07em] uppercase text-ink-3">
              {s.items.length} of its own
            </span>
          </h3>
          <ul className="list-none space-y-2">
            {s.items.map((i, n) => (
              <li
                key={n}
                className="rounded-[10px] border border-line/70 bg-canvas px-[13px] py-[11px] text-[0.92rem] leading-[1.5] text-ink-2"
              >
                <span className="mr-2 font-readout text-[0.58rem] font-bold tracking-[0.07em] uppercase text-ink-3">
                  {i.label}
                </span>
                <Emphasis text={i.text} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
