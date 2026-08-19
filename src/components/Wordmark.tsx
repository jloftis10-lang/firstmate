/**
 * THE LIGHTHOUSE MARK, from the brand sheet.
 *
 * Drawn as inline SVG rather than shipped as a raster, for the same
 * reason the select chevron is inlined in `globals.css`: no network
 * request, no layout shift, and it stays sharp from a 16px favicon to a
 * hero lockup. It also means the mark inherits the palette tokens, so a
 * colour change stays a one-file change.
 *
 * A lighthouse is the right mark for this product and worth saying why,
 * because it constrains how it gets used later. It is not decoration and
 * not nautical flavour — a lighthouse marks the hazard you cannot see
 * from the deck. That is the entire proposition: the deck plan does not
 * flag the slide passing through the balcony, and this does. Keep it as
 * a warning instrument, never as a holiday illustration.
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
      {/* Light rays — brass, decorative only. */}
      <g stroke="var(--color-brass)" strokeWidth="1.6" strokeLinecap="round">
        <path d="M20 16.5 H9" />
        <path d="M21 11 L12.5 7.5" />
        <path d="M44 16.5 H55" />
        <path d="M43 11 L51.5 7.5" />
      </g>

      {/* Lantern roof and finial. */}
      <path d="M32 3.5 v3" stroke="var(--color-brand-navy)" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M24 12 L32 6 L40 12 Z" fill="var(--color-brand-navy)" />
      {/* Lantern room — brass glass. */}
      <rect x="26.5" y="12.5" width="11" height="8" rx="1" fill="var(--color-brass)" />
      <path d="M32 12.5 v8" stroke="var(--color-brand-navy)" strokeWidth="1.1" />
      {/* Gallery rail. */}
      <rect x="24" y="20.5" width="16" height="2.6" rx="1" fill="var(--color-brand-navy)" />

      {/* Tower, tapered. */}
      <path d="M26.5 23.5 h11 l2.4 20.5 h-15.8 Z" fill="var(--color-brand-navy)" />
      {/* Tower window. */}
      <rect x="30.4" y="29" width="3.2" height="5" rx="1.6" fill="var(--color-surface)" opacity="0.9" />

      {/* Rocks. */}
      <path
        d="M15 47 L22.5 39.5 L28 44 L33.5 38 L41 44.5 L48 40 L53 47 Z"
        fill="var(--color-brand-navy)"
      />

      {/* Sea — navy, teal, brass, as the sheet has them. */}
      <path d="M6 51.5 c7-3 13 3 20 0 s13-3 20 0 s9 1 12-1" stroke="var(--color-brand-navy)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <path d="M8 56 c7-3 13 3 20 0 s13-3 20 0 s6 1 9-.6" stroke="var(--color-brand-teal)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <path d="M13 60 c6-2.4 11 2.4 17 0 s11-2.4 17 0" stroke="var(--color-brass)" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.85" />
    </svg>
  );
}

/**
 * The horizontal lockup — mark, name, domain.
 *
 * `stacked` gives the brand sheet's vertical variation, for the places a
 * wide lockup would crowd: the share page a client opens, and the
 * uncharted screen.
 */
export function Wordmark({
  stacked = false,
  size = 34,
}: {
  stacked?: boolean;
  size?: number;
}) {
  if (stacked) {
    return (
      <div className="mb-2 flex flex-col items-center gap-1.5 text-center">
        <Insignia size={size + 12} />
        <div className="font-call text-[1.35rem] leading-none tracking-[-0.01em] text-brand-navy">
          First Mate Cruise
        </div>
        <div className="font-readout text-[0.62rem] tracking-[0.22em] text-brand-teal">
          CRUISEREAD.COM
        </div>
      </div>
    );
  }

  return (
    <div className="mb-2 flex items-center gap-[11px]">
      <Insignia size={size} />
      <div className="leading-[1.05]">
        <div className="font-call text-[1.22rem] tracking-[-0.01em] text-brand-navy">
          First Mate Cruise
        </div>
        <div className="font-readout text-[0.58rem] tracking-[0.2em] text-ink-3">
          CRUISEREAD.COM
        </div>
      </div>
    </div>
  );
}
