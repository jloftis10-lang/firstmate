"use client";

import { useId, useState } from "react";
import type { ReadCategory } from "@/lib/types";
import type { Provenance } from "@/lib/provenance";
import { Emphasis } from "./Emphasis";
import { ProvenanceBadge, ProvenanceSource } from "./ProvenanceBadge";
import { RiskFlag } from "./RiskFlag";

type Props = {
  number: string;
  category: string;
  /** null when nobody has worked this block up for this ship yet. */
  read: ReadCategory | null;
  /** Names the line in the line-policy disclosure — "Same on every Carnival sailing". */
  lineName?: string;
  /**
   * Derived once in `lib/provenance.ts`, never re-derived here. The card
   * used to decide for itself that `!verified` meant "not signed off",
   * which is right today only because every covered ship is fully
   * signed — see the note in that file.
   */
  provenance: Provenance;
};

export function ReadCard({ number, category, read, lineName, provenance }: Props) {
  const [open, setOpen] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);
  const bodyId = useId();
  const policyId = useId();

  // An uncharted category keeps its slot rather than disappearing. If it
  // vanished, the advisor would read three cards as three checks and two
  // cards as two checks, with no way to tell a clean bill of health from
  // a gap in the content.
  if (read === null) {
    return (
      <div className="mb-3.5 rounded-2xl border border-dashed border-line bg-surface/60 p-5 pb-[18px]">
        <div className="mb-3 flex items-center gap-2 font-readout text-[0.72rem] font-bold tracking-[0.09em] uppercase text-ink-3">
          <span className="text-line">{number}</span> {category}
          <ProvenanceBadge provenance={provenance} className="ml-auto" />
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
        {/* One badge, one derivation — and it now says what the call was
            checked against, not just that it was. A VERIFIED marker with
            no source behind it is a claim rather than evidence. */}
        <ProvenanceBadge provenance={provenance} className="ml-auto" />
      </div>
      <ProvenanceSource provenance={provenance} className="mb-3" />

      {/* The call — serif, prominent, always the hero. */}
      <p className="border-l-[3px] border-go pl-[15px] font-call text-[1.22rem] leading-[1.34] text-ink">
        {read.call}
      </p>

      {read.flags.length > 0 && (
        <ul className="mt-4 list-none">
          {read.flags.map((flag, i) => (
            <RiskFlag key={i} text={flag} />
          ))}
        </ul>
      )}

      {/* Line policy — true of every sailing on the line, not of this ship.
          Collapsed so it stops crowding out the flags that ARE particular
          to this booking, which is what the advisor opened the card for. */}
      {read.linePolicy && read.linePolicy.length > 0 && (
        <div className="mt-3.5 border-t border-[#E3EAEC] pt-3">
          <button
            type="button"
            onClick={() => setPolicyOpen((v) => !v)}
            aria-expanded={policyOpen}
            aria-controls={policyId}
            className="flex cursor-pointer items-center gap-[7px] font-readout text-[0.72rem] font-bold tracking-[0.05em] uppercase text-ink-3 hover:text-deep"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              aria-hidden="true"
              className={`transition-transform duration-200 ${policyOpen ? "rotate-90" : ""}`}
            >
              <polyline points="9 6 15 12 9 18" />
            </svg>
            {read.linePolicy.length} more, same on every{" "}
            {lineName ?? "sailing on this line"} sailing
          </button>
          <div
            id={policyId}
            className={`grid transition-[grid-template-rows] duration-300 ease-out ${
              policyOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="overflow-hidden">
              <ul className="list-none pt-2">
                {read.linePolicy.map((item, i) => (
                  <li
                    key={i}
                    className="mt-2 rounded-[10px] border border-[#E3EAEC] bg-canvas px-[13px] py-[11px] text-[0.9rem] leading-[1.45] text-ink-2"
                  >
                    <Emphasis text={item} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
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
