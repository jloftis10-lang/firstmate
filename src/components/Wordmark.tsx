/**
 * The first-mate rank-stripe insignia: two full stripes in navigation blue,
 * one short stripe in brass. Restrained — the boldness is spent on the call
 * typography and the sounding moment, not here.
 */
export function Insignia() {
  return (
    <div className="flex w-[26px] flex-col gap-[3px]" aria-hidden="true">
      <span className="h-[3px] w-full rounded-sm bg-deep" />
      <span className="h-[3px] w-full rounded-sm bg-deep" />
      <span className="h-[3px] w-[60%] rounded-sm bg-signal" />
    </div>
  );
}

export function Wordmark() {
  return (
    <div className="mb-2 flex items-center gap-[11px]">
      <Insignia />
      <div className="text-[1.15rem] font-bold tracking-[-0.01em]">
        First Mate{" "}
        <span className="font-medium text-ink-3">· cruise read</span>
      </div>
    </div>
  );
}
