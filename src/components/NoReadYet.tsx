import type { Ship } from "@/lib/types";
import { blockStates } from "@/lib/types";

/**
 * Coverage stated by LINE, not by hull.
 *
 * This screen used to render every covered ship as a flat list. At 79
 * ships that was 2.7 screens of scrolling on a phone, on the screen that
 * 116 of 195 picks land on — the majority experience of the product was
 * a ship dump. And it told the advisor nothing: the covered lines are
 * covered COMPLETELY, so three line names carry the same information as
 * seventy-nine rows.
 *
 * Derived rather than written down, so a partially covered line added
 * later reports itself honestly as "12 of 17" instead of quietly
 * claiming the whole fleet.
 */
function coverageByLine(covered: Ship[], all: Ship[]) {
  const totals = new Map<string, number>();
  for (const s of all) totals.set(s.line, (totals.get(s.line) ?? 0) + 1);

  const done = new Map<string, { covered: number; signed: number }>();
  for (const s of covered) {
    const entry = done.get(s.line) ?? { covered: 0, signed: 0 };
    entry.covered += 1;
    if (s.content && blockStates(s.content).allVerified) entry.signed += 1;
    done.set(s.line, entry);
  }

  return [...done.entries()]
    .map(([line, { covered: c, signed }]) => ({
      line,
      covered: c,
      total: totals.get(line) ?? c,
      signed,
    }))
    .sort((a, b) => b.covered - a.covered);
}

/**
 * What an advisor gets for a ship nobody has worked up yet.
 *
 * This screen is the guardrail made visible. The catalog carries every
 * major line so advisors can find their ship; the read only exists where
 * there is operator knowledge behind it. Saying "not yet" plainly is the
 * whole point — a fabricated call here would be the exact failure this
 * product exists to prevent.
 */
export function NoReadYet({
  ship,
  covered,
  all,
  onAgain,
}: {
  ship: Ship;
  covered: Ship[];
  all: Ship[];
  onAgain: () => void;
}) {
  const lines = coverageByLine(covered, all);

  return (
    <section className="fm-rise" aria-label="No read available">

      <div className="mb-[22px]">
        <div
          className="mb-2.5 font-readout text-[0.72rem] font-bold tracking-[0.1em] uppercase text-signal"
          role="status"
        >
          Not charted yet
        </div>
        <h1 className="font-call text-[1.5rem] leading-[1.2] tracking-[-0.01em]">
          No read for the {ship.name} yet.
        </h1>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(15,42,61,.05),0_8px_24px_rgba(15,42,61,.06)]">
        <p className="border-l-[3px] border-signal pl-[15px] font-call text-[1.22rem] leading-[1.34] text-ink">
          This hull hasn&apos;t been worked up, so I&apos;m not going to guess
          at it.
        </p>
        <p className="mt-4 text-[0.93rem] leading-[1.55] text-ink-2">
          First Mate only returns a call where there&apos;s operator knowledge
          behind it. Inventing a deck number for the {ship.name} would make this
          exactly the thing you were trying to avoid — a confident answer that
          turns out to be wrong at the gangway.
        </p>

        {lines.length > 0 && (
          <div className="mt-4 border-t border-[#E3EAEC] pt-4">
            <div className="mb-2 font-readout text-[0.72rem] font-bold tracking-[0.05em] uppercase text-ink-3">
              Covered right now
            </div>
            <ul className="text-[0.93rem] leading-[1.7] text-ink-2">
              {lines.map((l) => (
                <li key={l.line}>
                  <span className="font-semibold text-ink">{l.line}</span>
                  {" — "}
                  {l.covered === l.total
                    ? `the whole fleet, all ${l.total}`
                    : `${l.covered} of ${l.total}`}
                  {l.signed === l.covered ? ", every one signed off" : `, ${l.signed} signed off`}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[0.85rem] leading-[1.55] text-ink-3">
              If the {ship.line} is one you book often, that&apos;s worth
              saying — the order these get worked up in is driven by what
              advisors actually ask for.
            </p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onAgain}
        className="mx-auto mt-[26px] block cursor-pointer rounded-[11px] border border-line px-[26px] py-[13px] text-[0.94rem] font-semibold text-ink-2 transition-colors hover:border-ink-3 hover:text-ink"
      >
        Run another booking
      </button>
    </section>
  );
}
