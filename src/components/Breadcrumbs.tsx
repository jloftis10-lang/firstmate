import Link from "next/link";

/**
 * Line → Class → Ship, as the platform spec requires on detail pages.
 *
 * Built in Phase 1 with the rest of the shell so the detail pages have
 * it waiting rather than inventing their own. The last crumb is the
 * current page and is never a link — `aria-current="page"` says so for
 * a screen reader, and dropping the href says so for a mouse.
 */
export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  if (trail.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 font-readout text-[0.66rem] tracking-[0.06em] uppercase text-ink-3">
        {trail.map((c, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
              {c.href && !last ? (
                <Link href={c.href} className="no-underline hover:text-ink-2">
                  {c.label}
                </Link>
              ) : (
                <span className={last ? "text-ink-2" : undefined} aria-current={last ? "page" : undefined}>
                  {c.label}
                </span>
              )}
              {!last && <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
