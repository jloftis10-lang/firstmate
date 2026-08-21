"use client";

import type { CatalogShip } from "@/lib/check-catalog";
import { CATEGORY_LABEL, CATEGORY_ORDER, LINES } from "@/content/ships";

/**
 * One field, every ship afloat.
 *
 * A native select stays a native select — on a phone that means the OS
 * picker, which is the fastest thing an advisor mid-call can use. The
 * ships we can actually read are hoisted into a group at the top so the
 * coverage state is legible at the moment of choosing, not after.
 *
 * Takes identity rather than ships: the picker only ever needed a name,
 * a line and whether a read exists, and handing it full records put the
 * entire knowledge base in the page. See `src/lib/check-catalog.ts`.
 */
export function ShipPicker({
  ships,
  value,
  onChange,
}: {
  ships: CatalogShip[];
  value: string;
  onChange: (id: string) => void;
}) {
  const covered = ships.filter((s) => s.charted);

  return (
    <div className="mb-[22px]">
      <label
        htmlFor="ship"
        className="mb-[9px] block font-readout text-[0.72rem] font-semibold tracking-[0.09em] uppercase text-ink-3"
      >
        The ship
      </label>
      <select
        id="ship"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="fm-select w-full cursor-pointer rounded-xl border border-line bg-surface px-4 py-3.5 text-base text-ink"
      >
        {covered.length > 0 && (
          <optgroup label="── Full read available ──">
            {covered.map((s) => (
              <option key={s.id} value={s.id}>
                {s.line} · {s.name}
              </option>
            ))}
          </optgroup>
        )}

        {CATEGORY_ORDER.map((category) => {
          const lines = LINES.filter((l) => l.category === category);
          if (lines.length === 0) return null;
          return lines.map((line) => {
            const fleet = ships.filter((s) => s.line === line.name);
            if (fleet.length === 0) return null;
            return (
              <optgroup
                key={line.id}
                label={`${line.name} — ${CATEGORY_LABEL[category]}`}
              >
                {fleet.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </optgroup>
            );
          });
        })}
      </select>
    </div>
  );
}
