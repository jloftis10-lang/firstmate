import Link from "next/link";
import { FOOTER_NAV, availableNav } from "@/lib/nav";

/**
 * The footer, and the one place the product states its own posture.
 *
 * The refusal line is not filler. It is the same promise the uncharted
 * screen makes and the same one the SAMPLE marker makes, said once more
 * where a first-time visitor will read it before they have run anything.
 */
export function SiteFooter({ coveredCount, shipCount }: { coveredCount: number; shipCount: number }) {
  const items = availableNav(FOOTER_NAV);

  return (
    <footer className="mt-auto border-t border-line/70 bg-surface/50">
      <div className="mx-auto w-full max-w-[1180px] px-5 py-8 sm:px-8">
        <p className="max-w-[54ch] text-[0.86rem] leading-[1.6] text-ink-2">
          CruiseRead is a second set of eyes on a cruise booking — cabin,
          money and expectation traps, from deck plans and line policy rather
          than marketing copy.{" "}
          <span className="text-ink">
            Where we don&apos;t know, we say so rather than inventing an answer.
          </span>
        </p>

        {items.length > 0 && (
          <nav aria-label="More" className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
            {items.map((i) => (
              <Link
                key={i.href}
                href={i.href}
                className="text-[0.86rem] text-ink-2 no-underline hover:text-ink"
              >
                {i.label}
              </Link>
            ))}
          </nav>
        )}

        <p className="mt-6 text-[0.78rem] text-ink-3">
          CruiseRead is built for travel advisors. It does not replace cruise-line
          terms, current deck plans or an advisor&apos;s own judgment.
        </p>

        <p className="mt-4 font-readout text-[0.66rem] leading-[1.7] tracking-[0.06em] text-ink-3">
          {coveredCount} OF {shipCount} SHIPS CARRY A READ &nbsp;·&nbsp; EVERY
          ONE SIGNED OFF BY AN OPERATOR
        </p>
      </div>
          <div style={{ marginTop: "1.5rem", borderTop: "1px solid rgba(212,175,55,.25)", paddingTop: "1rem", textAlign: "center" }}>
        <a href="https://www.jimloftis.com/" rel="author" aria-label="A Jim Loftis Project" style={{ display: "inline-flex", alignItems: "center", gap: ".55rem", color: "inherit", textDecoration: "none", opacity: .78 }}>
          <span aria-hidden="true" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1rem", fontWeight: 700, letterSpacing: "-.08em", color: "#D4AF37" }}>JL</span>
          <span style={{ fontFamily: "Montserrat, Inter, sans-serif", fontSize: ".65rem", fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase" }}>A Jim Loftis Project</span>
        </a>
      </div>
</footer>
  );
}
