import type { Provenance } from "@/lib/provenance";

/**
 * The three-block coverage summary for one ship, as chips.
 *
 * Designed for a directory card, where an advisor is scanning rather
 * than reading: which of cabin, money and traps has anything behind it,
 * and how solid.
 *
 * A chip is never omitted. All three always render, because "this ship
 * has no traps chip" and "this ship's traps are unchecked" look
 * identical if the absent one simply is not drawn — and they mean
 * opposite things. The uncharted chip carries a dash, not a tick.
 */
export function CoverageChips({
  cabin,
  money,
  traps,
  className = "",
}: {
  cabin: Provenance;
  money: Provenance;
  traps: Provenance;
  className?: string;
}) {
  const blocks: [string, Provenance][] = [
    ["Cabin", cabin],
    ["Money", money],
    ["Traps", traps],
  ];

  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`}>
      {blocks.map(([label, p]) => {
        const signed = p.state === "verified";
        const uncharted = p.state === "uncharted";
        return (
          <li
            key={label}
            className={`inline-flex items-center gap-1 rounded-[6px] border px-1.5 py-[2px] font-readout text-[0.62rem] tracking-[0.05em] ${
              signed
                ? "border-go/40 bg-go-bg text-go"
                : uncharted
                  ? "border-dashed border-ink-3/40 text-ink-3"
                  : "border-signal/40 bg-signal-bg text-signal"
            }`}
          >
            <span aria-hidden="true">{signed ? "✓" : uncharted ? "–" : "~"}</span>
            {label}
            <span className="sr-only">
              {signed ? "verified" : uncharted ? "not checked" : "researched"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
