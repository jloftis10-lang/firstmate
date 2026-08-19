import { Emphasis } from "./Emphasis";

/**
 * A single heads-up, as its own component.
 *
 * Lifted out of `ReadCard` so the ship pages, the compare view and the
 * Booking Check all render a flag identically. They were about to grow
 * three versions of the same brass box.
 *
 * `tone` exists because not every flag is a warning. A meaningful share
 * of what this product tells an advisor is that something they have
 * heard is NOT a problem here — no lifeboat band on deck 6, nothing
 * under the go-kart track, the kids' club moved. Rendering a
 * false-alarm-killed in warning brass trains an advisor to read every
 * flag as bad news and to skim them all.
 */
export function RiskFlag({
  text,
  tone = "warn",
  label,
}: {
  text: string;
  tone?: "warn" | "clear";
  /** Overrides the default chip text. */
  label?: string;
}) {
  const warn = tone === "warn";
  return (
    <li
      className={`mt-2 flex items-start gap-2.5 rounded-[10px] px-[13px] py-[11px] text-[0.92rem] leading-[1.45] text-ink ${
        warn ? "bg-signal-bg" : "bg-go-bg"
      }`}
    >
      <span
        className={`mt-px flex-none rounded-[5px] px-1.5 py-[3px] font-readout text-[0.6rem] font-bold tracking-[0.08em] text-white ${
          warn ? "bg-signal" : "bg-go"
        }`}
      >
        {label ?? (warn ? "HEADS UP" : "GOOD NEWS")}
      </span>
      <span>
        <Emphasis text={text} />
      </span>
    </li>
  );
}
