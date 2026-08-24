import type { Metadata } from "next";
import Link from "next/link";
import { LINES, SHIPS } from "@/content/ships";
import { LINE_RECORDS } from "@/content/lines/records";
import { chartedLines, coveredShips, guaranteeWarnings } from "@/lib/guides";
import { linePath } from "@/lib/nav";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Emphasis } from "@/components/Emphasis";
import { ShipSection, Uncharted } from "@/components/ship/ShipSection";
import { ShipList } from "@/components/ship/GuideBits";

/**
 * GUARANTEE CABINS — and the scope problem this page has to solve first.
 *
 * A guarantee is a real and general booking mechanic, and the temptation
 * is to write the general version. But the only signed content in this
 * catalog is Norwegian's: ten hulls, one line, nothing for Carnival and
 * nothing for Royal. Presenting one line's terms as how guarantees work
 * is precisely the over-reach the product exists to refuse — the terms
 * differ by line and the differences are the part that matters.
 *
 * So the page states its scope in the first paragraph and names the
 * lines it cannot speak for, the same way the ships directory names the
 * eleven uncharted lines rather than quietly showing three.
 *
 * The warnings themselves are found by matching the word against the
 * records rather than from an authored list, so this cannot claim a hull
 * is covered when it is not.
 */

export const metadata: Metadata = {
  title: "Guarantee cabins",
  description:
    "What a guarantee cabin actually commits the line to — from the terms on file, which today means Norwegian only.",
  alternates: { canonical: "/guides/cruise-guarantee-cabins" },
};

export default function GuaranteeCabinsGuide() {
  const covered = coveredShips(SHIPS);
  const warnings = guaranteeWarnings(covered);
  const hulls = new Set(warnings.flatMap((w) => w.ships.map((s) => s.id)));
  const linesWithTerms = [...new Set(warnings.flatMap((w) => w.ships.map((s) => s.line)))];
  const silent = chartedLines(covered).filter((l) => !linesWithTerms.includes(l));

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-[1180px] px-5 pt-6 pb-20 sm:px-8">
        <Breadcrumbs
          trail={[
            { label: "Guides", href: "/guides" },
            { label: "Guarantee cabins" },
          ]}
        />

        <header className="mb-9 max-w-[62ch]">
          <h1 className="font-call text-[2rem] leading-[1.1] tracking-[-0.02em] text-ink sm:text-[2.4rem]">
            A guarantee is a price, not a cabin
          </h1>
          <p className="mt-3.5 text-[1rem] leading-[1.6] text-ink-2">
            You book a category and the line picks the room — which deck, which
            end, which view — and it can pick it late. That is the trade, and
            whether it is a good one depends entirely on what the line&apos;s
            own terms permit it to assign you.
          </p>

          {/* SCOPE FIRST, because the honest answer to "how do guarantees
              work" is "it depends on the line", and this catalog only has
              one line's terms signed. */}
          <p className="mt-4 rounded-[11px] border border-signal/40 bg-signal-bg px-3.5 py-3 text-[0.94rem] leading-[1.55] text-ink">
            <span className="mr-2 font-readout text-[0.6rem] font-bold tracking-[0.08em] uppercase text-signal">
              Scope
            </span>
            The only guarantee terms worked up so far are{" "}
            {linesWithTerms.join(" and ")}&apos;s — {hulls.size} hulls.
            {silent.length > 0 && (
              <>
                {" "}
                {silent.join(" and ")}{" "}
                {silent.length === 1 ? "is" : "are"} charted for everything
                else and not for this, so nothing here should be applied to{" "}
                {silent.length === 1 ? "it" : "them"}. Guarantee terms differ
                by line and the differences are the whole question.
              </>
            )}
          </p>
        </header>

        <div className="space-y-12">
          <ShipSection
            id="mechanic"
            number="01"
            title="What you are actually agreeing to"
            lede="The general shape, which is the part that does not vary."
          >
            <div className="space-y-4 text-[0.96rem] leading-[1.65] text-ink-2">
              <p className="max-w-[62ch]">
                A guarantee fare buys a category, not a room. The line assigns
                the specific cabin at its own convenience, and until it does,
                three things are genuinely unknown: the deck, the position fore
                and aft, and — depending on the line&apos;s terms — whether the
                view is obstructed.
              </p>
              <p className="max-w-[62ch]">
                Which means a guarantee is fine for a client who wants the
                lowest price and will sleep anywhere, and wrong for a client
                who is prone to seasickness, travelling with people they need
                to be near, or buying a balcony for the view. The saving is
                real; it is not free money. What it costs is every other cabin
                decision on this site.
              </p>
              <p className="max-w-[62ch]">
                No category codes appear on this page. The lines change them,
                and a stale code list is worse than none — that is the
                operator&apos;s call, recorded in the terms below.
              </p>
            </div>
          </ShipSection>

          <ShipSection
            id="terms"
            number="02"
            title={`What ${linesWithTerms.join(" and ")} actually permits`}
            lede="Recorded from the line's own terms, and signed. These are the sentences the ship reads carry."
            empty={
              warnings.length === 0
                ? "No line's guarantee terms have been worked up yet."
                : undefined
            }
          >
            <div className="space-y-4">
              {warnings.map((w, i) => (
                <div key={i} className="rounded-[13px] border border-line bg-surface p-4">
                  <h3 className="mb-2.5 font-readout text-[0.62rem] font-bold tracking-[0.08em] uppercase text-ink-3">
                    On {w.ships.length} hull{w.ships.length === 1 ? "" : "s"}
                  </h3>
                  <p className="mb-3 max-w-[62ch] rounded-[10px] border border-line/70 bg-canvas px-[13px] py-[11px] text-[0.94rem] leading-[1.6] text-ink-2">
                    <Emphasis text={w.text} />
                  </p>
                  <ShipList ships={w.ships} />
                </div>
              ))}
            </div>
          </ShipSection>

          <ShipSection
            id="unknown"
            number="03"
            title="The lines this page cannot speak for"
            lede="Charted for cabins, money and traps — and not for this."
            empty={
              silent.length === 0
                ? "Every charted line has its guarantee terms on file."
                : undefined
            }
          >
            <div className="space-y-4">
              <Uncharted
                note={`${silent.join(" and ")} ${silent.length === 1 ? "has" : "have"} no guarantee terms on record.`}
              />
              <p className="max-w-[62ch] text-[0.94rem] leading-[1.6] text-ink-2">
                Do not carry the terms above across. Whether an assigned
                guarantee can land obstructed, how late it can be assigned and
                what an oceanview guarantee is permitted to become are all
                line-specific, and reading one line&apos;s answer onto another
                is the exact error this site is built to stop.
              </p>
              <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
                {LINE_RECORDS.filter((r) =>
                  silent.includes(LINES.find((l) => l.id === r.id)?.name ?? ""),
                ).map((r) => (
                  <li key={r.id}>
                    <Link
                      href={linePath(r.id)}
                      className="text-[0.92rem] leading-[1.7] text-deep underline decoration-line underline-offset-2 hover:decoration-deep"
                    >
                      {r.name} line policy
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </ShipSection>

          <ShipSection
            id="next"
            number="04"
            title="If the cabin matters, don't guarantee it"
            lede="And if you are going to, run the booking first so you know what you are gambling."
          >
            <p className="max-w-[62ch] text-[0.96rem] leading-[1.65] text-ink-2">
              A guarantee gives away the placement call, which on most hulls is
              the single most consequential thing an advisor gets to decide.
              Read{" "}
              <Link
                href="/guides/quiet-cabins"
                className="font-semibold text-deep underline decoration-line underline-offset-2"
              >
                what a quiet cabin actually requires
              </Link>{" "}
              and{" "}
              <Link
                href="/guides/obstructed-balconies"
                className="font-semibold text-deep underline decoration-line underline-offset-2"
              >
                what an obstructed balcony can mean
              </Link>{" "}
              before deciding the saving is worth it — those are the two things
              a guarantee is putting on the table.
            </p>
          </ShipSection>
        </div>
      </div>
    </main>
  );
}
