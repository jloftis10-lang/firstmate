/**
 * "Sounding the depths" — the transition while the check runs.
 * Skipped entirely when the user prefers reduced motion (see FirstMate).
 */
export function Sounding() {
  return (
    <div
      className="fixed inset-0 z-20 flex flex-col items-center justify-center gap-[26px] bg-paper/92 backdrop-blur-[2px]"
      role="status"
    >
      <div className="relative h-[90px] w-[90px]">
        <span className="fm-sonar-ring absolute inset-0 rounded-full border-2 border-deep opacity-0" />
        <span
          className="fm-sonar-ring absolute inset-0 rounded-full border-2 border-deep opacity-0"
          style={{ animationDelay: "0.63s" }}
        />
        <span
          className="fm-sonar-ring absolute inset-0 rounded-full border-2 border-deep opacity-0"
          style={{ animationDelay: "1.26s" }}
        />
        <span className="absolute top-1/2 left-1/2 -mt-[4.5px] -ml-[4.5px] h-[9px] w-[9px] rounded-full bg-signal" />
      </div>
      <p className="font-readout text-[0.82rem] tracking-[0.14em] uppercase text-ink-2">
        Sounding the depths…
      </p>
    </div>
  );
}
