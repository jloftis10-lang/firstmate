import type { Metadata } from "next";
import Link from "next/link";
import { SHIPS } from "@/content/ships";
import { coveredShips, noiseUse, stackedShips } from "@/lib/guides";
import { shipPath } from "@/lib/nav";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DeckTable } from "@/components/DeckTable";
import { ShipSection } from "@/components/ship/ShipSection";
import { ShipList } from "@/components/ship/GuideBits";

/**
 * QUIET CABINS — the rule, the ranking, and which hulls carry what.
 *
 * A guide here is a cross-cut of the catalog rather than an essay. The
 * rule and the risk ranking are signed operator content that already
 * drives every read; what no other page answers is which ships have the
 * pool deck directly over cabins, or which have a galley near them. That
 * is one filter away and it is the whole point of the page.
 *
 * Every count below is the length of the list beneath it. A guide cannot
 * say "58 hulls" above 57 links, because it never writes the number
 * down.
 */

export const metadata: Metadata = {
  title: "Quiet cabins",
  description:
    "How to pick a quiet cabin: the deck sandwich test, the operator's noise ranking worst-first, and which charted hulls carry each hazard.",
  alternates: { canonical: "/guides/quiet-cabins" },
};

export default function QuietCabinsGuide() {
  const covered = coveredShips(SHIPS);
  const noise = noiseUse(covered).filter((n) => n.ships.length > 0);
  const stacks = stackedShips(covered);
  const worst = noise.slice(0, 3);

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-[1180px] px-5 pt-6 pb-20 sm:px-8">
        <Breadcrumbs
          trail={[
            { label: "Guides", href: "/guides" },
            { label: "Quiet cabins" },
          ]}
        />

        <header className="mb-9 max-w-[62ch]">
          <h1 className="font-call text-[2rem] leading-[1.1] tracking-[-0.02em] text-ink sm:text-[2.4rem]">
            The deck above is what wakes people up
          </h1>
          <p className="mt-3.5 text-[1rem] leading-[1.6] text-ink-2">
            Cabin noise is mostly a question about the two decks you are not
            booking. Here is the test, the operator&apos;s ranking of what
            sits on those decks, and which of the {covered.length} charted
            hulls carry each one.
          </p>
        </header>

        <div className="space-y-12">
          <ShipSection
            id="rule"
            number="01"
            title="The sandwich test"
            lede="A deck is a quiet candidate when it has cabins directly above it and directly below it, and nothing public sharing it."
          >
            <div className="space-y-4 text-[0.96rem] leading-[1.65] text-ink-2">
              <p className="max-w-[62ch]">
                Plenty of cabins on the deck itself proves nothing. The
                question is what is overhead at six in the morning and what is
                underfoot at midnight, and a deck plan answers it if you read
                the two neighbouring decks rather than the one you are booking.
              </p>
              <p className="max-w-[62ch]">
                It narrows the field; it does not pick the cabin. On the
                Radiance the arithmetic clears three decks and the operator
                answer is two of them — a rule can only rule things out, and
                the last step is somebody who knows the ship. It also cannot
                see a deck it has no data for: where a stack stops, the table
                says &ldquo;not checked&rdquo; rather than assuming the deck
                below is cabins.
              </p>
              <p className="max-w-[62ch]">
                One numbering trap worth knowing on any hull: several lines
                skip the number 13, so the physical deck directly above deck 12
                is labelled 14. An advisor counting numerically looks for a
                deck 13, finds none, and concludes there is nothing overhead.
              </p>
            </div>
          </ShipSection>

          <ShipSection
            id="ranking"
            number="02"
            title="What sits above and below, worst first"
            lede="Operator judgment, and it holds on any hull — a ship record only says which of these it has and where."
          >
            <div className="space-y-3">
              {noise.map(({ source, ships, located }) => (
                <div key={source.id} className="rounded-[13px] border border-line bg-surface p-4">
                  <h3 className="mb-1.5 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                    <span className="font-call text-[1.1rem] leading-[1.3] text-ink">
                      {source.venue.charAt(0).toUpperCase() + source.venue.slice(1)}
                    </span>
                    <span className="rounded-[5px] border border-line px-1.5 py-[1px] font-readout text-[0.58rem] font-bold tracking-[0.07em] uppercase text-ink-3">
                      {source.risk} risk
                    </span>
                    <span className="font-readout text-[0.62rem] tracking-[0.05em] text-ink-3">
                      {/* Two different numbers, because they mean two
                          different things: a record can name a hazard
                          without naming the decks it sits on, and an
                          advisor needs to know which one they have. */}
                      {ships.length} hull{ships.length === 1 ? "" : "s"} ·{" "}
                      {located} with the decks recorded
                    </span>
                  </h3>
                  <p className="mb-3 max-w-[62ch] text-[0.92rem] leading-[1.6] text-ink-2">
                    {source.experience}
                    {source.window ? `, ${source.window}` : ""}.
                  </p>
                  <ShipList ships={ships} />
                </div>
              ))}
            </div>

            <p className="mt-5 max-w-[62ch] text-[0.9rem] leading-[1.6] text-ink-3">
              The top three — {worst.map((w) => w.source.venue).join(", ")} —
              are the ones worth checking on every booking. The pool deck is on
              every charted hull for the obvious reason: every ship has one,
              and on most of them it is directly over somebody.
            </p>
          </ShipSection>

          <ShipSection
            id="stacks"
            number="03"
            title="The hulls with the arithmetic run"
            lede="A transcribed deck stack means the test can be run rather than reasoned about. These are the ones that have one."
            empty={
              stacks.length === 0
                ? "No deck stack has been transcribed yet."
                : undefined
            }
          >
            <div className="space-y-8">
              <p className="max-w-[62ch] text-[0.94rem] leading-[1.6] text-ink-2">
                {stacks.length} of the {covered.length} charted hulls carry one.
                On the rest the placement call is the operator&apos;s own and
                stands on its own — there is simply no table to check it
                against, which each ship page says rather than implying the
                question was answered.
              </p>

              <ul className="grid list-none gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                {stacks.map((s) => (
                  <li key={s.id}>
                    <Link
                      href={shipPath(s.id)}
                      className="block h-full rounded-[12px] border border-line bg-surface p-3.5 no-underline transition-colors hover:border-ink-3"
                    >
                      <span className="block font-call text-[1rem] leading-[1.25] text-ink">
                        {s.name}
                      </span>
                      <span className="mt-1 block font-readout text-[0.62rem] leading-[1.6] tracking-[0.05em] uppercase text-ink-3">
                        clears deck{s.candidates.length === 1 ? "" : "s"}{" "}
                        {s.candidates.join(", ")}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              {stacks[0] && (
                <div>
                  <h3 className="mb-2.5 font-readout text-[0.64rem] font-bold tracking-[0.08em] uppercase text-ink-3">
                    What one looks like — {stacks[0].name}
                  </h3>
                  <DeckTable
                    decks={stacks[0].decks}
                    caption={
                      <>
                        A deck is a{" "}
                        <strong className="font-semibold text-ink">
                          quiet candidate
                        </strong>{" "}
                        when it has cabins directly above and directly below it
                        and nothing public sharing it. Read the verdict column,
                        not the deck numbers — this arithmetic is about one
                        hull and deck 8 here is not deck 8 anywhere else.
                      </>
                    }
                  />
                </div>
              )}
            </div>
          </ShipSection>

          <ShipSection
            id="next"
            number="04"
            title="Then run the booking"
            lede="The rule narrows a hull. The client narrows it further."
          >
            <p className="max-w-[62ch] text-[0.96rem] leading-[1.65] text-ink-2">
              Motion sensitivity changes the answer, and so does who is
              sailing: the same deck that is quiet for a couple is a long walk
              for a multigen group.{" "}
              <Link
                href="/check"
                className="font-semibold text-deep underline decoration-line underline-offset-2"
              >
                Run a Booking Check
              </Link>{" "}
              for the actual client, or read{" "}
              <Link
                href="/methodology"
                className="font-semibold text-deep underline decoration-line underline-offset-2"
              >
                how the read is made
              </Link>
              .
            </p>
          </ShipSection>
        </div>
      </div>
    </main>
  );
}
