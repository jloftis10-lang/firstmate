/**
 * The reasoning list — ticks and crosses, inline.
 *
 * The brief's instruction, and it is the right one: "do not bury the
 * logic behind tiny Why toggles". An advisor trusts a call when they can
 * see what it was made of, and three lines of ✓/✗ do that faster than a
 * paragraph. The paragraph still exists underneath for anyone who wants
 * it; this is what earns them opening it.
 *
 * `unknown` is a third mark, not a missing one. A check that was never
 * run must not look like a check that passed, and it must not look like
 * one that failed either.
 */
export type ReasonMark = "yes" | "no" | "unknown";

const MARK: Record<ReasonMark, { glyph: string; tone: string; sr: string }> = {
  yes: { glyph: "✓", tone: "text-go", sr: "confirmed" },
  no: { glyph: "✗", tone: "text-signal", sr: "not met" },
  unknown: { glyph: "–", tone: "text-ink-3", sr: "not checked" },
};

export function Reasoning({
  items,
  className = "",
}: {
  items: { mark: ReasonMark; text: string }[];
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <ul className={`list-none space-y-1 ${className}`}>
      {items.map((it, i) => {
        const m = MARK[it.mark];
        return (
          <li key={i} className="flex items-start gap-2 text-[0.88rem] leading-[1.5] text-ink-2">
            <span className={`mt-px flex-none font-bold ${m.tone}`} aria-hidden="true">
              {m.glyph}
            </span>
            <span className="sr-only">{m.sr}:</span>
            <span className={it.mark === "unknown" ? "text-ink-3" : undefined}>{it.text}</span>
          </li>
        );
      })}
    </ul>
  );
}
