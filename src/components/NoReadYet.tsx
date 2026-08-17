import type { Ship } from "@/lib/types";
import { Wordmark } from "./Wordmark";

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
  onAgain,
}: {
  ship: Ship;
  covered: Ship[];
  onAgain: () => void;
}) {
  return (
    <section className="fm-rise" aria-label="No read available">
      <Wordmark />

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

        {covered.length > 0 && (
          <div className="mt-4 border-t border-[#E3EAEC] pt-4">
            <div className="mb-2 font-readout text-[0.72rem] font-bold tracking-[0.05em] uppercase text-ink-3">
              Covered right now
            </div>
            <ul className="text-[0.93rem] leading-[1.7] text-ink-2">
              {covered.map((s) => (
                <li key={s.id}>
                  {s.line} · {s.name}
                </li>
              ))}
            </ul>
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
