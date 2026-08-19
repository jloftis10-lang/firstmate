import type { Provenance, ProvenanceState } from "@/lib/provenance";
import { PROVENANCE_COPY } from "@/lib/provenance";

/**
 * The provenance badge. Built once, used everywhere provenance exists.
 *
 * Three states, three visual treatments, all contrast-checked against
 * `paper` and `surface`:
 *
 *   VERIFIED    teal, solid  — the call has an operator behind it
 *   RESEARCHED  brass, outlined — content exists, nobody signed it
 *   UNCHARTED   dashed, muted — nobody checked. NOT an error state.
 *
 * The uncharted treatment is dashed rather than greyed-to-nothing on
 * purpose. Greyed-out reads as disabled, disabled reads as broken, and
 * broken reads as "ignore this" — when the actual meaning is "this is
 * the part you still have to check yourself". A dashed border says
 * deliberately empty.
 *
 * `detail` renders the sourced date and a link when there is one. A
 * badge that says VERIFIED without saying verified-against-what is a
 * claim, not evidence.
 */

const STYLE: Record<ProvenanceState, string> = {
  verified: "border-go bg-go-bg text-go",
  researched: "border-signal/60 bg-signal-bg text-signal",
  uncharted: "border-dashed border-ink-3/50 bg-transparent text-ink-3",
};

export function ProvenanceBadge({
  provenance,
  className = "",
}: {
  provenance: Provenance;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-[5px] border px-1.5 py-[2px] font-readout text-[0.6rem] font-bold tracking-[0.08em] uppercase ${STYLE[provenance.state]} ${className}`}
    >
      {PROVENANCE_COPY[provenance.state].label}
    </span>
  );
}

/**
 * What the badge was checked against — kept separate from the chip
 * because they belong in different places on the page. The chip sits in
 * a header row; the sourcing wants a line of its own.
 *
 * Renders nothing for an uncharted block. There is no source to cite for
 * something nobody looked at, and an empty "0 sources" line would read
 * as a failure rather than as an absence.
 */
export function ProvenanceSource({
  provenance,
  className = "",
}: {
  provenance: Provenance;
  className?: string;
}) {
  const { checked, source, sourceCount, state } = provenance;
  if (state === "uncharted" || !checked) return null;

  return (
    <p
      className={`font-readout text-[0.62rem] leading-[1.6] tracking-[0.04em] text-ink-3 ${className}`}
    >
      {sourceCount} source{sourceCount === 1 ? "" : "s"} · checked {checked}
      {source && (
        <>
          {" · "}
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-deep underline decoration-line underline-offset-2 hover:decoration-deep"
          >
            {state === "verified" ? "View source" : "View evidence"}
          </a>
        </>
      )}
    </p>
  );
}

/** The full sentence, for a card that has room for it. */
export function ProvenanceNote({ provenance }: { provenance: Provenance }) {
  return (
    <p className="text-[0.84rem] leading-[1.5] text-ink-2">
      {PROVENANCE_COPY[provenance.state].detail}
    </p>
  );
}
