import type { ReactNode } from "react";
import type { Provenance } from "@/lib/provenance";
import { ProvenanceBadge } from "@/components/ProvenanceBadge";

/**
 * One section of a ship page: a numbered heading, its provenance, and
 * either the content or an explicit statement that there isn't any.
 *
 * THE UNCHARTED BRANCH IS THE POINT OF THIS COMPONENT. A section with no
 * data could be dropped from the page, and dropping it is the single
 * substitution this product exists to refuse: a page showing seven
 * sections instead of eight reads as a complete ship, and the missing
 * one reads as "nothing to report here" rather than "nobody looked".
 * Seventy-one of the seventy-nine covered ships have no deck stack on
 * file. If their pages simply had no deck section, an advisor would
 * conclude the deck question had been answered.
 *
 * So `empty` renders a dashed panel that says what is absent and what
 * the advisor should do instead. It is deliberate, not broken, and the
 * dashed treatment carries that meaning consistently with the uncharted
 * provenance badge and the uncharted read card.
 */
export function ShipSection({
  id,
  number,
  title,
  lede,
  provenance,
  empty,
  children,
}: {
  id: string;
  /** "01".."08". Matches the read cards' numbering idiom. */
  number: string;
  title: string;
  /** One line on what this section answers. Optional. */
  lede?: string;
  provenance?: Provenance;
  /**
   * What is missing, in a sentence, when there is nothing to render.
   * Passing this renders the uncharted panel INSTEAD of the children.
   */
  empty?: string;
  children?: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <header className="mb-3.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-line pb-2.5">
        <span className="font-readout text-[0.72rem] font-bold tracking-[0.1em] text-line">
          {number}
        </span>
        <h2 className="font-call text-[1.3rem] leading-[1.2] tracking-[-0.01em] text-ink">
          {title}
        </h2>
        {provenance && <ProvenanceBadge provenance={provenance} className="ml-auto" />}
      </header>

      {lede && (
        <p className="mb-4 max-w-[62ch] text-[0.92rem] leading-[1.6] text-ink-2">{lede}</p>
      )}

      {empty ? <Uncharted note={empty} /> : children}
    </section>
  );
}

/**
 * The absence, stated. Never styled as an error and never greyed to
 * nothing — see the note on the uncharted provenance badge for why
 * "looks disabled" is the wrong signal for "you still have to check
 * this yourself".
 */
export function Uncharted({ note }: { note: string }) {
  return (
    <div className="rounded-[13px] border border-dashed border-line bg-surface/50 px-4 py-3.5">
      <p className="font-call text-[1rem] leading-[1.4] text-ink-2">{note}</p>
      <p className="mt-2 max-w-[62ch] text-[0.86rem] leading-[1.55] text-ink-3">
        That is a gap in what we have looked at, not a clean bill of health.
        Check this part of the booking the way you would without CruiseRead.
      </p>
    </div>
  );
}
