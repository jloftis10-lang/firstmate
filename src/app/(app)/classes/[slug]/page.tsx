import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LINES, SHIPS } from "@/content/ships";
import {
  exceptionCount,
  groupedExtras,
  isUniform,
  routedClassRecords,
} from "@/lib/classes";
import type { RoutedClass } from "@/lib/classes";
import { shipProvenance } from "@/lib/provenance";
import { classPath, linePath, shipPath } from "@/lib/nav";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CoverageChips } from "@/components/CoverageChips";
import { DeckTable } from "@/components/DeckTable";
import { ShipSection } from "@/components/ship/ShipSection";
import { FactList, NoteList } from "@/components/ship/ShipFacts";
import { ExceptionField, PartialExtras, UniqueExtras } from "@/components/ship/ClassDiff";

/**
 * THE CLASS PAGE — the inheritance model, made visible.
 *
 * This is the page for an advisor who has learned one hull and is about
 * to quote its sister. It answers exactly two questions: what is true of
 * every ship in this class, and what is true of only one.
 *
 * NOTHING ON IT IS AUTHORED ABOUT A CLASS. Every rule below was computed
 * by diffing the ship records — see `src/lib/classes.ts` for why a
 * hand-written `ClassContent` was refused. The page cannot claim a rule
 * is class-wide when the records say otherwise, because it is reading
 * the records.
 *
 * A ONE-SHIP CLASS IS NOT A UNIFORM CLASS, and the page must not let
 * those look alike. Nine of the twenty-nine charted classes report zero
 * exceptions and five of those hold a single hull, where uniformity is a
 * tautology rather than a finding. Saying "every hull identical" about
 * one ship would be true and useless, and would inflate a real signal —
 * three of the twenty-three multi-ship classes are genuinely uniform.
 */

const RECORDS = routedClassRecords(SHIPS, LINES);
const BY_SLUG = new Map(RECORDS.map((r) => [r.slug, r]));

/** Multi-ship classes only. A single hull cannot vary from itself. */
const COMPARABLE = RECORDS.filter((r) => r.ships.length > 1);
const UNIFORM_COMPARABLE = COMPARABLE.filter(isUniform).length;

export const dynamicParams = false;

export function generateStaticParams() {
  return RECORDS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/classes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const record = BY_SLUG.get(slug);
  if (!record) return {};

  const n = record.ships.length;
  const exceptions = exceptionCount(record);
  const description =
    n === 1
      ? `${record.line}'s ${record.name} class — one hull. Cabin placement, obstructed balconies, money and expectation traps for travel advisors.`
      : `${record.line}'s ${record.name} class — ${n} ships, ${record.inherited.length} rules they share and ${exceptions} place${exceptions === 1 ? "" : "s"} they diverge.`;

  return {
    title: `${record.name} class`,
    description,
    alternates: { canonical: classPath(slug) },
    openGraph: {
      title: `${record.line} ${record.name} class — First Mate Cruise`,
      description,
      url: classPath(slug),
      type: "article",
    },
  };
}

const SECTIONS = [
  { id: "shared", label: "What they share" },
  { id: "differ", label: "Where they differ" },
  { id: "geometry", label: "Class geometry" },
  { id: "ships", label: "The ships" },
];

export default async function ClassPage({ params }: PageProps<"/classes/[slug]">) {
  const { slug } = await params;
  const record: RoutedClass | undefined = BY_SLUG.get(slug);
  if (!record) notFound();

  const single = record.ships.length === 1;
  const exceptions = exceptionCount(record);
  const uniform = !single && isUniform(record);

  // The inherited list entries are class rules too — they belong beside
  // the inherited prose rather than under the exceptions, because every
  // hull carries them.
  const sharedLists = record.lists.filter((l) => l.shared.length > 0);

  // Three tiers, and the middle one is the finding `listDiff` alone
  // cannot express — see `groupedExtras`. A note on three of four hulls
  // is neither a class rule nor one ship's footnote.
  const { partial, unique } = groupedExtras(record);

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-[1180px] px-5 pt-6 pb-20 sm:px-8">
        <Breadcrumbs
          trail={[
            { label: "Ship Classes", href: "/classes" },
            { label: record.line, href: linePath(record.lineId) },
            { label: `${record.name} class` },
          ]}
        />

        <header className="mb-8 max-w-[62ch]">
          <h1 className="font-call text-[2rem] leading-[1.1] tracking-[-0.02em] text-ink sm:text-[2.4rem]">
            {record.name} class
          </h1>
          <p className="mt-2 font-readout text-[0.7rem] leading-[1.7] tracking-[0.08em] uppercase text-ink-3">
            {record.line} · {record.ships.length} ship
            {record.ships.length === 1 ? "" : "s"} · all charted
          </p>

          <p className="mt-4 text-[1rem] leading-[1.6] text-ink-2">
            {single ? (
              <>
                One hull carries this class, so there is nothing here to
                compare it against. Everything below is that ship&apos;s
                record, and its own page carries the rest of it.
              </>
            ) : uniform ? (
              <>
                Every hull in this class carries identical operator content —
                all {record.inherited.length} recorded rules, and every
                category note and trap. That is worth knowing rather than
                assuming: only {UNIFORM_COMPARABLE} of the {COMPARABLE.length}{" "}
                multi-ship classes charted so far are uniform. What you learn
                on one of these ships transfers to the others.
              </>
            ) : (
              <>
                {record.inherited.length} rules hold across all{" "}
                {record.ships.length} hulls, and {exceptions}{" "}
                {exceptions === 1 ? "thing does not" : "things do not"}. The
                exceptions are the reason not to quote a sister ship from
                memory.
              </>
            )}
          </p>

          <p className="mt-3.5 max-w-[58ch] rounded-[10px] border border-line bg-surface px-3.5 py-2.5 text-[0.84rem] leading-[1.55] text-ink-3">
            None of this is written down anywhere. It is computed by
            comparing the {record.ships.length} ship record
            {record.ships.length === 1 ? "" : "s"} field by field, so a class
            rule cannot drift from the hulls that carry it — add an exception
            to a ship and it appears here on the next build.
          </p>
        </header>

        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_13rem] lg:items-start lg:gap-x-12">
          <nav
            aria-label="On this page"
            className="mb-10 border-y border-line py-3 lg:sticky lg:top-6 lg:col-start-2 lg:row-start-1 lg:mb-0 lg:border-y-0 lg:border-l lg:py-0 lg:pl-5"
          >
            <ul className="flex flex-wrap gap-x-4 gap-y-1.5 lg:flex-col lg:gap-y-2.5">
              {SECTIONS.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="font-readout text-[0.66rem] tracking-[0.06em] uppercase text-ink-3 no-underline hover:text-deep"
                  >
                    <span className="text-line">{String(i + 1).padStart(2, "0")}</span>{" "}
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-12 lg:col-start-1 lg:row-start-1">
            <ShipSection
              id="shared"
              number="01"
              title={single ? "The record" : "What every hull in the class shares"}
              lede={
                single
                  ? "One ship, so every field here is simply its own."
                  : "Byte-identical across every ship in the class. Learn it once."
              }
              empty={
                record.inherited.length === 0 && sharedLists.length === 0
                  ? "These hulls agree on nothing that is recorded — every field either differs or is empty across the class."
                  : undefined
              }
            >
              <div className="space-y-6">
                <FactList
                  facts={record.inherited.map((d) => ({
                    label: d.label,
                    value: d.shared,
                  }))}
                />
                {sharedLists.map((l) => (
                  <div key={l.field}>
                    <h3 className="mb-2.5 font-readout text-[0.64rem] font-bold tracking-[0.08em] uppercase text-ink-3">
                      {l.label}
                      {!single && ` — on all ${record.ships.length}`}
                    </h3>
                    <NoteList items={l.shared} />
                  </div>
                ))}
              </div>
            </ShipSection>

            <ShipSection
              id="differ"
              number="02"
              title="Where the hulls differ"
              lede={
                single
                  ? undefined
                  : "The part that does not transfer. Everything here is one ship's, not the class's."
              }
              empty={
                single
                  ? "Nothing to compare — this class holds one ship."
                  : exceptions === 0
                    ? `Nothing. All ${record.ships.length} hulls carry identical operator content, which is rarer than it sounds: ${UNIFORM_COMPARABLE} of the ${COMPARABLE.length} charted multi-ship classes are uniform. This is a checked result, not an unchecked field.`
                    : undefined
              }
            >
              <div className="space-y-8">
                {record.exceptions.length > 0 && (
                  <div>
                    <h3 className="mb-2.5 font-readout text-[0.64rem] font-bold tracking-[0.08em] uppercase text-ink-3">
                      Every hull answers, differently
                    </h3>
                    <div className="space-y-4">
                      {record.exceptions.map((d) => (
                        <ExceptionField key={d.field} diff={d} />
                      ))}
                    </div>
                  </div>
                )}

                {partial.length > 0 && (
                  <div>
                    <h3 className="mb-1.5 font-readout text-[0.64rem] font-bold tracking-[0.08em] uppercase text-ink-3">
                      Carried by some hulls and not others
                    </h3>
                    <p className="mb-2.5 max-w-[62ch] text-[0.86rem] leading-[1.55] text-ink-3">
                      Neither a class rule nor one ship&apos;s footnote. These
                      are the ones most likely to be assumed across a class
                      that does not carry them.
                    </p>
                    <PartialExtras extras={partial} total={record.ships.length} />
                  </div>
                )}

                {unique.length > 0 && (
                  <div>
                    <h3 className="mb-2.5 font-readout text-[0.64rem] font-bold tracking-[0.08em] uppercase text-ink-3">
                      One hull only
                    </h3>
                    <UniqueExtras extras={unique} />
                  </div>
                )}
              </div>
            </ShipSection>

            <ShipSection
              id="geometry"
              number="03"
              title="Class geometry"
              lede="A deck stack counts as the class's only when every hull carries the same one. A single ship differing makes it that ship's data, not the class's."
              empty={
                record.decks
                  ? undefined
                  : record.ships.some((s) => s.content.decks)
                    ? "Some hulls in this class carry a deck stack and others do not, so there is no class stack — see the individual ship pages."
                    : "No deck stack has been transcribed for this class. The placement rule above is the operator's own and stands on its own; there is no table here to check it against."
              }
            >
              {record.decks && <DeckTable decks={record.decks} />}
            </ShipSection>

            <ShipSection
              id="ships"
              number="04"
              title={single ? "The ship" : "The ships"}
              lede="Every hull in the class, with what has been signed off on each."
            >
              <ul className="grid list-none gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {record.ships.map((s) => {
                  const p = shipProvenance(s.content);
                  return (
                    <li key={s.id}>
                      <Link
                        href={shipPath(s.id)}
                        className="block h-full rounded-[12px] border border-line bg-surface p-3.5 no-underline transition-colors hover:border-ink-3"
                      >
                        <span className="block font-call text-[1.02rem] leading-[1.25] text-ink">
                          {s.name}
                        </span>
                        {s.serviceYear && (
                          <span className="mt-1 block font-readout text-[0.62rem] leading-[1.6] tracking-[0.05em] uppercase text-ink-3">
                            {s.serviceYear}
                          </span>
                        )}
                        <CoverageChips
                          cabin={p.cabin}
                          money={p.money}
                          traps={p.traps}
                          className="mt-2.5"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {!single && (
                <p className="mt-5 max-w-[62ch] text-[0.86rem] leading-[1.55] text-ink-3">
                  {exceptions === 0
                    ? "Nothing on those pages contradicts anything above — that is what a uniform class means."
                    : "Each ship page carries its own exceptions in context, alongside the shared rules they sit inside."}
                </p>
              )}
            </ShipSection>

            {/* Sourcing lives on the ship pages. A class has no sources of
                its own — it has the union of its hulls', and printing one
                merged list would imply a source was checked against the
                class when it was checked against a ship. */}
            <p className="max-w-[62ch] rounded-[12px] border border-dashed border-line px-4 py-3 text-[0.86rem] leading-[1.55] text-ink-3">
              Sources are recorded per ship, not per class. Each hull&apos;s
              page carries what its calls were checked against and when.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
