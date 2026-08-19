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
      <div className="mx-auto flex w-full max-w-[1180px] items-center gap-4 px-5 py-3.5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-[6px] text-ink no-underline"
          aria-label="First Mate — home"
        >
          <Insignia size={30} />
          <span className="leading-[1.05]">
            <span className="block font-call text-[1.06rem] tracking-[-0.01em] text-brand-navy">
              First Mate Cruise
            </span>
            <span className="hidden font-readout text-[0.55rem] tracking-[0.2em] text-ink-3 sm:block">
              CRUISEREAD.COM
            </span>
          </span>
        </Link>

        {items.length > 0 && (
          <nav aria-label="Sections" className="ml-3 hidden gap-1 md:flex">
            {items.map((i) => (
              <Link
                key={i.href}
                href={i.href}
                className="rounded-[7px] px-2.5 py-1.5 text-[0.88rem] text-ink-2 no-underline transition-colors hover:bg-paper hover:text-ink"
              >
                {i.label}
              </Link>
            ))}
          </nav>
        )}

        <Link
          href={PRIMARY_CTA.href}
          className="ml-auto rounded-[9px] bg-go px-3.5 py-2 text-[0.84rem] font-semibold text-white no-underline transition-colors hover:bg-[#175A50]"
        >
          {PRIMARY_CTA.label}
        </Link>
      </div>
    </header>
  );
}
