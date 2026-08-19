"use client";

import { useId } from "react";
import { useRouter } from "next/navigation";

/**
 * The two ship pickers, and the swap.
 *
 * WHY `useRouter` HERE AND `url-state.ts` ON THE CHECK. The check is a
 * static page that computes its read in the browser from records already
 * in the bundle, so it can change its own URL and re-render without
 * touching the server — which is why it has a hand-rolled history store.
 * This page cannot: comparing two hulls means reading two ship records,
 * and shipping all seventy-nine to the client to avoid a round trip
 * would put the entire knowledge base in a page that renders a table.
 * So a change here is a navigation, and `useRouter` is the right tool
 * for a navigation.
 *
 * Native selects on purpose, as on the check. On a phone that is the OS
 * picker, which is the fastest thing an advisor mid-call can use.
 */
export type PickerShip = { id: string; name: string; line: string };

/**
 * Declared at module scope, not inside `ComparePicker`.
 *
 * A component defined during render is a new component type on every
 * render, so React unmounts and remounts it and any state inside it is
 * lost. Nothing here holds state today, which is exactly why it would
 * have been an easy trap to leave in place for whoever adds some.
 */
function ShipSelect({
  id,
  label,
  ships,
  value,
  onPick,
  placeholder,
}: {
  id: string;
  label: string;
  ships: PickerShip[];
  value: string;
  onPick: (v: string) => void;
  placeholder?: string;
}) {
  const lines = [...new Set(ships.map((s) => s.line))];

  return (
    <div className="min-w-0 flex-1">
      <label
        htmlFor={id}
        className="mb-[9px] block font-readout text-[0.66rem] font-semibold tracking-[0.09em] uppercase text-ink-3"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onPick(e.target.value)}
        className="fm-select w-full cursor-pointer rounded-xl border border-line bg-surface px-4 py-3 text-base text-ink"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {lines.map((line) => (
          <optgroup key={line} label={line}>
            {ships
              .filter((s) => s.line === line)
              .map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}

export function ComparePicker({
  ships,
  a,
  b,
}: {
  ships: PickerShip[];
  a: string;
  /** Empty when the advisor arrived with one ship and no second. */
  b: string;
}) {
  const router = useRouter();
  const aId = useId();
  const bId = useId();

  const go = (next: { a?: string; b?: string }) => {
    const params = new URLSearchParams();
    const first = next.a ?? a;
    const second = next.b ?? b;
    if (first) params.set("a", first);
    if (second) params.set("b", second);
    router.push(`/compare?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <ShipSelect
        id={aId}
        label="First ship"
        ships={ships}
        value={a}
        onPick={(v) => go({ a: v })}
      />

      <button
        type="button"
        onClick={() => router.push(`/compare?a=${b}&b=${a}`)}
        disabled={!a || !b}
        aria-label="Swap the two ships"
        className="cursor-pointer self-center rounded-[10px] border border-line px-3 py-2.5 font-readout text-[0.66rem] font-bold tracking-[0.06em] uppercase text-ink-3 transition-colors hover:border-ink-3 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 sm:mb-[3px] sm:self-end"
      >
        Swap
      </button>

      <ShipSelect
        id={bId}
        label="Second ship"
        ships={ships}
        value={b}
        onPick={(v) => go({ b: v })}
        placeholder={b ? undefined : "Pick a second ship…"}
      />
    </div>
  );
}
