import { PROVENANCE_COPY } from "@/lib/provenance";
import type { Provenance } from "@/lib/provenance";
import { ProvenanceBadge } from "@/components/ProvenanceBadge";
import type { Source } from "@/lib/types";

/**
 * SOURCES AND VERIFICATION — the page that makes the rest of the page
 * checkable.
 *
 * Two different things live here and they are deliberately not merged.
 *
 * WHAT WAS SIGNED is per block. Cabin advice comes from someone who has
 * worked the hull; money and trap policy is researched off the line.
 * Those become true at different moments, which is why `verified` is a
 * field on each block rather than on the ship, and why this section
 * reports three states rather than one.
 *
 * WHAT IT WAS CHECKED AGAINST is per ship. The model has no block-level
 * sourcing, so every block on a hull shares one list. That is a real
 * imprecision and it is stated in the caption rather than hidden by
 * printing the same list three times under three headings.
 *
 * Links open in a new tab and carry `rel="noopener noreferrer"`. Several
 * of these hosts are blocked from the build environment's egress proxy,
 * which is recorded in the record files themselves — the URL is still
 * the right thing to publish, because the advisor's browser is not
 * behind our proxy.
 */
export function ShipSources({
  blocks,
  sources,
}: {
  blocks: { label: string; provenance: Provenance }[];
  sources: Source[];
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2.5 font-readout text-[0.64rem] font-bold tracking-[0.08em] uppercase text-ink-3">
          What has been signed off
        </h3>
        <ul className="list-none space-y-2">
          {blocks.map((b) => (
            <li
              key={b.label}
              className="rounded-[10px] border border-line/70 bg-canvas px-[13px] py-[11px]"
            >
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-call text-[1rem] text-ink">{b.label}</span>
                <ProvenanceBadge provenance={b.provenance} />
              </div>
              <p className="mt-1.5 max-w-[62ch] text-[0.88rem] leading-[1.55] text-ink-2">
                {PROVENANCE_COPY[b.provenance.state].detail}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-1.5 font-readout text-[0.64rem] font-bold tracking-[0.08em] uppercase text-ink-3">
          Checked against
        </h3>
        <p className="mb-2.5 max-w-[62ch] text-[0.86rem] leading-[1.55] text-ink-3">
          {sources.length} source{sources.length === 1 ? "" : "s"} for this
          ship. Sourcing is recorded per ship rather than per block, so this
          list stands behind all three sections above — it does not tell you
          which source backed which call. Prices and policies go stale; the
          date is when someone last looked.
        </p>
        <ol className="list-none space-y-2">
          {sources.map((s) => (
            <li
              key={`${s.url}-${s.label}`}
              className="rounded-[10px] border border-line/70 bg-canvas px-[13px] py-[11px]"
            >
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[0.92rem] leading-[1.5] text-deep underline decoration-line underline-offset-2 hover:decoration-deep"
              >
                {s.label}
              </a>
              <p className="mt-1 font-readout text-[0.62rem] tracking-[0.05em] text-ink-3">
                CHECKED {s.checked}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
