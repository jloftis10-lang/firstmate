import { Emphasis } from "@/components/Emphasis";
import { noiseRank, noiseSource } from "@/lib/noise";
import { obstruction } from "@/lib/obstruction";
import type { ObstructionKind } from "@/lib/obstruction";

/**
 * The record, rendered.
 *
 * Everything in this file prints fields off a `ShipContent` and nothing
 * else. There is no cruise fact authored here — no deck number, no
 * height rule, no venue name. If a sentence is not on the record it does
 * not appear, and a field that is absent renders as absent rather than
 * as a hedge. That constraint is what makes a reference page safe to
 * generate for seventy-nine hulls at once.
 */

export type Fact = { label: string; value: string | undefined };

/**
 * Labelled prose rows. Undefined values are dropped ENTIRELY rather than
 * rendered with a placeholder — a row reading "Accessibility: not
 * recorded" on a page that also carries eight real rows trains the eye
 * to skim, and the section's own uncharted panel is where absence is
 * reported. Absence within a populated section is reported by the count,
 * not by a row per missing field.
 */
export function FactList({ facts }: { facts: Fact[] }) {
  const present = facts.filter((f) => f.value);
  if (present.length === 0) return null;

  return (
    <dl className="divide-y divide-line/60 border-t border-line/60">
      {present.map((f) => (
        <div key={f.label} className="grid gap-x-6 gap-y-1 py-3 sm:grid-cols-[10rem_1fr]">
          <dt className="font-readout text-[0.64rem] font-bold tracking-[0.08em] uppercase text-ink-3">
            {f.label}
          </dt>
          <dd className="max-w-[62ch] text-[0.94rem] leading-[1.6] text-ink-2">
            <Emphasis text={f.value as string} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** A plain list of record sentences — category notes, ship traps. */
export function NoteList({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="list-none space-y-2">
      {items.map((t, i) => (
        <li
          key={i}
          className="rounded-[10px] border border-line/70 bg-canvas px-[13px] py-[11px] text-[0.92rem] leading-[1.5] text-ink-2"
        >
          <Emphasis text={t} />
        </li>
      ))}
    </ul>
  );
}

/**
 * What sits above and below the cabins, worst first.
 *
 * The ranking, the venue wording and what the traveller actually hears
 * all come from `NOISE_SOURCES` — the shared operator table — exactly as
 * the engine reads them. The ship record contributes only which sources
 * this hull has and where, so this table says the same thing on every
 * hull and only the locations change. An entry whose id is not in the
 * table is dropped rather than rendered as a bare id.
 */
export function NoiseList({
  hazards,
}: {
  hazards: { source: string; where?: string }[];
}) {
  const rows = hazards
    .map((h) => ({ h, src: noiseSource(h.source) }))
    .filter((r): r is { h: (typeof hazards)[number]; src: NonNullable<ReturnType<typeof noiseSource>> } =>
      Boolean(r.src),
    )
    .sort((a, b) => noiseRank(a.h.source) - noiseRank(b.h.source));

  if (rows.length === 0) return null;

  return (
    <ul className="list-none space-y-2.5">
      {rows.map(({ h, src }) => (
        <li key={src.id} className="rounded-[11px] border border-line/70 bg-canvas p-3.5">
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <span className="font-call text-[1rem] leading-[1.3] text-ink">
              {src.venue.charAt(0).toUpperCase() + src.venue.slice(1)}
            </span>
            <span className="rounded-[5px] border border-line px-1.5 py-[1px] font-readout text-[0.58rem] font-bold tracking-[0.07em] uppercase text-ink-3">
              {src.risk} risk
            </span>
          </div>
          <p className="mt-1.5 max-w-[62ch] text-[0.9rem] leading-[1.55] text-ink-2">
            {src.experience}
            {src.window ? `, ${src.window}` : ""}.
          </p>
          {h.where ? (
            <p className="mt-1 font-readout text-[0.68rem] leading-[1.6] tracking-[0.03em] text-ink-3">
              ON THIS SHIP — {h.where}
            </p>
          ) : (
            <p className="mt-1 font-readout text-[0.68rem] leading-[1.6] tracking-[0.03em] text-ink-3">
              DECKS NOT RECORDED — confirm against the plan for the sailing
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}

/**
 * WHAT IS ACTUALLY IN THE WAY, and what the client loses by it.
 *
 * The cause/effect split is the whole reason this renders as a list
 * rather than a sentence. "Obstructed" is sold as one thing and is at
 * least five: a steel bulkhead takes the horizon, a lifeboat takes the
 * view straight down and leaves the horizon, a public walkway takes
 * privacy and no view at all. Those lead to opposite advice and the same
 * word on the booking screen.
 *
 * Renders nothing for an empty list. A record that has not established
 * the mechanism must not be made to guess at one — several deliberately
 * leave this empty because the line publishes that a cabin is obstructed
 * without saying by what.
 */
const EFFECT_LABEL: Record<string, string> = {
  "horizon-lost": "Horizon lost",
  "downward-blocked": "View down blocked",
  "sky-blocked": "Sky blocked",
  "space-intrusion": "Balcony space taken",
  "privacy-reduced": "Privacy reduced",
};

export function ObstructionList({ kinds }: { kinds: ObstructionKind[] }) {
  const rows = kinds.map(obstruction).filter(Boolean) as NonNullable<
    ReturnType<typeof obstruction>
  >[];
  if (rows.length === 0) return null;

  return (
    <ul className="list-none space-y-2.5">
      {rows.map((o) => (
        <li key={o.id} className="rounded-[11px] border border-line/70 bg-canvas p-3.5">
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <span className="font-call text-[1rem] leading-[1.3] text-ink">
              {o.cause.charAt(0).toUpperCase() + o.cause.slice(1)}
            </span>
            <span className="rounded-[5px] border border-signal/40 bg-signal-bg px-1.5 py-[1px] font-readout text-[0.58rem] font-bold tracking-[0.07em] uppercase text-signal">
              {EFFECT_LABEL[o.effect] ?? o.effect}
            </span>
          </div>
          <p className="mt-1.5 max-w-[62ch] text-[0.9rem] leading-[1.55] text-ink-2">
            {o.experience.charAt(0).toUpperCase() + o.experience.slice(1)}.
          </p>
        </li>
      ))}
    </ul>
  );
}
