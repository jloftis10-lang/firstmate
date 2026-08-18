"use client";

import { useId, useState } from "react";
import type { ReadCategory } from "@/lib/types";
import { Emphasis } from "./Emphasis";

type Props = {
  number: string;
  category: string;
  /** null when nobody has worked this block up for this ship yet. */
  read: ReadCategory | null;
};

export function ReadCard({ number, category, read }: Props) {
  const [open, setOpen] = useState(false);
  const bodyId = useId();

  // An uncharted category keeps its slot rather than disappearing. If it
  // vanished, the advisor would read three cards as three checks and two
  // cards as two checks, with no way to tell a clean bill of health from
  // a gap in the content.
  if (read === null) {
    return (
      <div className="mb-3.5 rounded-2xl border border-dashed border-line bg-surface/60 p-5 pb-[18px]">
        <div className="mb-3 flex items-center gap-2 font-readout text-[0.72rem] font-bold tracking-[0.09em] uppercase text-ink-3">
          <span className="text-line">{number}</span> {category}
        </div>
        <p className="border-l-[3px] border-line pl-[15px] font-call text-[1.1rem] leading-[1.34] text-ink-2">
          Not worked up for this ship yet.
        </p>
        <p className="mt-3 text-[0.88rem] leading-[1.5] text-ink-3">
          An empty card is not a clean bill of health — it means nobody has
          checked this one yet. Treat this part of the booking the way you
          would without First Mate.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-3.5 rounded-2xl border border-line bg-surface p-5 pb-[18px] shadow-[0_1px_2px_rgba(15,42,61,.05),0_8px_24px_rgba(15,42,61,.06)]">
      <div className="mb-3 flex items-center gap-2 font-readout text-[0.72rem] font-bold tracking-[0.09em] uppercase text-ink-3">
        <span className="text-line">{number}</span> {category}
      </div>

      {/* The call — serif, prominent, always the hero. */}
      <p className="border-l-[3px] border-go pl-[15px] font-call text-[1.22rem] leading-[1.34] text-ink">
        {read.call}
      </p>

      {read.flags.length > 0 && (
        <ul className="mt-4 list-none">
          {read.flags.map((flag, i) => (
            <li
              key={i}
              className="mt-2 flex items-start gap-2.5 rounded-[10px] bg-signal-bg px-[13px] py-[11px] text-[0.92rem] leading-[1.45] text-ink"
            >
              <span className="mt-px flex-none rounded-[5px] bg-signal px-1.5 py-[3px] font-readout text-[0.6rem] font-bold tracking-[0.08em] text-white">
                HEADS UP
              </span>
              <span>
                <Emphasis text={flag} />
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* The why — the moat, collapsed by default. */}
      <div className="mt-3.5 border-t border-[#E3EAEC] pt-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={bodyId}
          className="flex cursor-pointer items-center gap-[7px] font-readout text-[0.72rem] font-bold tracking-[0.05em] uppercase text-deep"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            aria-hidden="true"
            className={`transition-transform duration-200 ${open ? "rotate-90" : ""}`}
          >
            <polyline points="9 6 15 12 9 18" />
          </svg>
          Why
        </button>
        <div
          id={bodyId}
          className={`grid transition-[grid-template-rows] duration-300 ease-out ${
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <p className="pt-[11px] text-[0.93rem] leading-[1.55] text-ink-2">
              {read.why}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
