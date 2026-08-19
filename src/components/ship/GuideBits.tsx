import Link from "next/link";
import { shipPath } from "@/lib/nav";
import type { ShipRef } from "@/lib/guides";

/**
 * The pieces a guide page is made of.
 *
 * A guide states a rule that was already signed and then lists the hulls
 * the records say it applies to. These render the second half — and the
 * count always comes from the list rather than beside it, so a page
 * cannot say "twenty ships" above nineteen links.
 */

/** Ship links, wrapped, grouped by line so the shape of a rule shows. */
export function ShipList({ ships }: { ships: ShipRef[] }) {
  if (ships.length === 0) {
    return (
      <p className="rounded-[10px] border border-dashed border-line px-[13px] py-[11px] text-[0.88rem] leading-[1.5] text-ink-3">
        No hull in the catalog has this on record yet. That is an unexercised
        entry in the taxonomy, not an absence in the fleet.
      </p>
    );
  }

  const lines = [...new Set(ships.map((s) => s.line))];

  return (
    <div className="space-y-2">
      {lines.map((line) => {
        const fleet = ships.filter((s) => s.line === line);
        return (
          <div key={line} className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <span className="font-readout text-[0.6rem] font-bold tracking-[0.07em] uppercase text-ink-3">
              {line} — {fleet.length}
            </span>
            {fleet.map((s) => (
              <Link
                key={s.id}
                href={shipPath(s.id)}
                className="text-[0.88rem] leading-[1.6] text-deep underline decoration-line underline-offset-2 hover:decoration-deep"
              >
                {s.name}
              </Link>
            ))}
          </div>
        );
      })}
    </div>
  );
}

/** A rule, its consequence, and the hulls it lands on. */
export function RuleCard({
  title,
  badge,
  body,
  ships,
  count,
}: {
  title: string;
  badge?: string;
  body: string;
  ships: ShipRef[];
  /** Wording for the count line — "on 24 hulls", "not yet matched". */
  count?: string;
}) {
  return (
    <div className="rounded-[13px] border border-line bg-surface p-4">
      <h3 className="mb-1.5 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        <span className="font-call text-[1.1rem] leading-[1.3] text-ink">{title}</span>
        {badge && (
          <span className="rounded-[5px] border border-signal/40 bg-signal-bg px-1.5 py-[1px] font-readout text-[0.58rem] font-bold tracking-[0.07em] uppercase text-signal">
            {badge}
          </span>
        )}
        <span className="font-readout text-[0.62rem] tracking-[0.05em] text-ink-3">
          {count ?? `${ships.length} hull${ships.length === 1 ? "" : "s"}`}
        </span>
      </h3>
      <p className="mb-3 max-w-[62ch] text-[0.92rem] leading-[1.6] text-ink-2">{body}</p>
      <ShipList ships={ships} />
    </div>
  );
}
