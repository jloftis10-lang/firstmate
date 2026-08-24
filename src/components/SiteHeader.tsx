import Link from "next/link";
import { Insignia } from "./Wordmark";
import { NAV, PRIMARY_CTA, availableNav } from "@/lib/nav";

/**
 * The site header.
 *
 * Deliberately quiet while the platform has one route. It carries the
 * wordmark and the primary action; the section nav appears as each
 * section ships, driven by `src/lib/nav.ts` rather than by editing this
 * file. Today `availableNav` returns nothing and the nav row does not
 * render at all — an empty nav bar advertising an empty site is worse
 * than no nav bar.
 */
export function SiteHeader() {
  const items = availableNav(NAV);

  return (
    <header className="border-b border-line/70 bg-surface/60 backdrop-blur-[2px]">
      {/* SKIP LINK. The wordmark is the first focusable element on every
          page, so without this a keyboard or screen-reader user tabs the
          brand, four nav items and the CTA before reaching content — on
          every one of a hundred and twenty pages.
          
          Visible only when focused, and it moves focus rather than only
          scrolling: `#main` carries `tabIndex={-1}` in the layout so the
          jump lands somewhere the next Tab continues from. A skip link
          that scrolls without moving focus is the common broken version
          and is worse than none, because it looks like it worked. */}
      <a
        href="#main"
        // Padding lives on the focus variant. `sr-only` sets `padding: 0`, but
        // a plain `px-4` outranks it and left the hidden link a 32x16 box —
        // clipped and invisible, but not the 1x1 the utility promises, and not
        // something a test can assert on.
        className="sr-only rounded-[8px] bg-deep text-[0.9rem] font-semibold text-white focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <div className="mx-auto flex w-full max-w-[1180px] flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3 sm:px-8 sm:py-3.5 lg:flex-nowrap">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-[6px] text-ink no-underline lg:order-1"
          aria-label="CruiseRead — home"
        >
          <Insignia size={30} />
          <span className="leading-[1.05]">
            <span className="block font-sans text-[1.08rem] font-bold tracking-[-0.035em]">
              <span className="text-brand-navy">Cruise</span>
              <span className="text-brand-teal">Read</span>
            </span>
            <span className="hidden font-readout text-[0.51rem] tracking-[0.15em] text-ink-3 sm:block">
              BOOKING INTELLIGENCE
            </span>
          </span>
        </Link>

        <Link
          href={PRIMARY_CTA.href}
          className="ml-auto rounded-[9px] bg-go px-3.5 py-2 text-[0.84rem] font-semibold whitespace-nowrap text-white no-underline transition-colors hover:bg-[#175A50] lg:order-3"
        >
          {PRIMARY_CTA.label}
        </Link>

        {/* A SECOND ROW ON PHONES AND TABLETS, inline from `lg`.
            
            It was hidden below `md` while it was empty, which cost
            nothing. Now it holds the only route to the ships directory,
            and hiding it on a phone would leave a mobile advisor with the
            footer as the only way in. Inline it does not fit: at 390px
            the wordmark and the CTA both wrap, and a wrapped header to
            gain one link is a bad trade.
            
            So it wraps to its own full-width row instead, scrolling
            sideways if it ever outgrows the screen. That is the treatment
            Phase 6 needs anyway when this becomes four or five items —
            a wider breakpoint would only have deferred the same problem.
            
            The nav sits AFTER the CTA in the DOM so that tab order and
            reading order agree on the layout most people are looking at.
            From `lg` the order classes put it back between the wordmark
            and the CTA. */}
        {items.length > 0 && (
          <nav
            aria-label="Sections"
            className="-mx-1 order-last w-full overflow-x-auto lg:order-2 lg:mx-0 lg:ml-3 lg:w-auto lg:overflow-visible"
          >
            <div className="flex gap-1">
              {items.map((i) => (
                <Link
                  key={i.href}
                  href={i.href}
                  className="rounded-[7px] px-2.5 py-1.5 text-[0.88rem] whitespace-nowrap text-ink-2 no-underline transition-colors hover:bg-paper hover:text-ink"
                >
                  {i.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
