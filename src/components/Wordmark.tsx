/**
 * THE CRUISEREAD MARK.
 *
 * Two open chart leaves meet in a centre line that continues into a
 * ship's bow. It is deliberately geometric rather than illustrative:
 * "read" is the open chart, "cruise" is the prow, and the result still
 * reads at favicon size. Inline SVG keeps it sharp with no request or
 * layout shift and lets it inherit the brand tokens.
 */

/** The mark alone. Sized by the caller; scales cleanly to 16px. */
export function Insignia({ size = 26 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className="shrink-0"
    >
      <path
        d="M7 11.5c9.8-.8 18.2 2.5 25 10.2v31.8c-6.8-7.5-15.2-10.7-25-9.8V11.5Z"
        fill="var(--color-brand-navy)"
      />
      <path
        d="M57 11.5c-9.8-.8-18.2 2.5-25 10.2v31.8c6.8-7.5 15.2-10.7 25-9.8V11.5Z"
        fill="var(--color-brand-teal)"
      />
      <path
        d="M14 20c4.8.2 9 1.6 12.7 4.4M14 28c4.8.2 9 1.6 12.7 4.4"
        stroke="var(--color-surface)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity=".82"
      />
      <path
        d="M50 20c-4.8.2-9 1.6-12.7 4.4M50 28c-4.8.2-9 1.6-12.7 4.4"
        stroke="var(--color-surface)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity=".82"
      />
      <path
        d="M32 21.7v31.8"
        stroke="var(--color-brass)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M12 50.5c7.2-2.8 13.3 2.8 20 0 6.7-2.8 12.8 2.8 20 0"
        stroke="var(--color-brass)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** The horizontal and stacked CruiseRead lockups. */
export function Wordmark({
  stacked = false,
  size = 34,
}: {
  stacked?: boolean;
  size?: number;
}) {
  const name = (
    <div className="font-sans text-[1.24rem] leading-none font-bold tracking-[-0.035em]">
      <span className="text-brand-navy">Cruise</span>
      <span className="text-brand-teal">Read</span>
    </div>
  );

  if (stacked) {
    return (
      <div className="mb-2 flex flex-col items-center gap-1.5 text-center">
        <Insignia size={size + 12} />
        {name}
        <div className="font-readout text-[0.58rem] tracking-[0.18em] text-ink-3">
          BOOKING INTELLIGENCE
        </div>
      </div>
    );
  }

  return (
    <div className="mb-2 flex items-center gap-[11px]">
      <Insignia size={size} />
      <div className="leading-[1.05]">
        {name}
        <div className="mt-1 font-readout text-[0.54rem] tracking-[0.16em] text-ink-3">
          BOOKING INTELLIGENCE
        </div>
      </div>
    </div>
  );
}
