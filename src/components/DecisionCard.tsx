"use client";

import { useId, useState } from "react";
import type { Provenance } from "@/lib/provenance";
import { Emphasis } from "./Emphasis";
import { ProvenanceBadge } from "./ProvenanceBadge";
import { Reasoning, type ReasonMark } from "./Reasoning";

/**
 * A quick decision card — the answer, what it rests on, and the long
 * version behind a disclosure.
 *
 * The order is deliberate and it is the product's whole posture: the
 * CALL first, the REASONING visible without a click, the detail on
 * demand. An advisor who has to expand something to find out whether to
 * trust it will not expand it.
 *
 * Uncharted cards render the same shape rather than disappearing. A card
 * that vanishes when there is no data turns "nobody checked" into "no
 * problem here", which is the one substitution this product exists to
 * refuse.
 */
export function DecisionCard({
  label,
  call,
  reasoning = [],
  detail,
  provenance,
}: {
  /** "Quiet starting point", "Watch for", "Solo". */
  label: string;
  /** The answer, in one line. Null when uncharted. */
  call: string | null;
  reasoning?: { mark: ReasonMark; text: string }[];
  /** The long version, revealed by "Why". */
  detail?: string;
  provenance: Provenance;
}) {
  const [open, setOpen] = useState(false);
  const bodyId = useId();
  const uncharted = provenance.state === "uncharted" || call === null;

  return (
    <div
      className={`rounded-[13px] border p-4 ${
        uncharted
          ? "border-dashed border-line bg-surface/50"
          : "border-line bg-surface"
      }`}
    >
      <div className="mb-2 flex items-start gap-2">
        <span className="font-readout text-[0.62rem] font-bold tracking-[0.09em] uppercase text-ink-3">
          {label}
        </span>
        <ProvenanceBadge provenance={provenance} className="ml-auto" />
      </div>

      <p
        className={`font-call leading-[1.35] ${
          uncharted ? "text-[1rem] text-ink-3" : "text-[1.08rem] text-ink"
        }`}
      >
        {uncharted ? "Not worked up for this ship yet." : <Emphasis text={call} />}
      </p>

      {!uncharted && reasoning.length > 0 && (
        <Reasoning items={reasoning} className="mt-3" />
      )}

      {uncharted && (
        <p className="mt-2 text-[0.84rem] leading-[1.5] text-ink-3">
          Not a clean bill of health — nobody has checked it. Treat this part
          of the booking the way you would without CruiseRead.
        </p>
      )}

      {!uncharted && detail && (
        <div className="mt-3 border-t border-[#E3EAEC] pt-2.5">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={bodyId}
            className="flex cursor-pointer items-center gap-[7px] font-readout text-[0.68rem] font-bold tracking-[0.05em] uppercase text-ink-3 hover:text-deep"
          >
            <span
              aria-hidden="true"
              className={`transition-transform ${open ? "rotate-90" : ""}`}
            >
              ▸
            </span>
            Why
          </button>
          {open && (
            <p id={bodyId} className="mt-2 text-[0.9rem] leading-[1.55] text-ink-2">
              <Emphasis text={detail} />
            </p>
          )}
        </div>
      )}
    </div>
  );
}
