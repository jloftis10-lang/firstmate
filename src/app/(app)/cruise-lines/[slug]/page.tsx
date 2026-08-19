import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LINES, SHIPS } from "@/content/ships";
import { LINE_RECORDS } from "@/content/lines/records";
import { exceptionCount, isUniform, routedClassRecords } from "@/lib/classes";
import { blockProvenance } from "@/lib/provenance";
import { classPath, linePath, shipPath } from "@/lib/nav";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ShipSection } from "@/components/ship/ShipSection";
import { FactList, NoteList } from "@/components/ship/ShipFacts";
import { ShipSources } from "@/components/ship/ShipSources";

/**
 * THE CRUISE LINE PAGE.
 *
 * Gratuity rates, the beverage-package rules, the kids'-club age bands,
 * the minor-placement waiver and the arrival-window process are set by
 * the line, not the hull. Thirty Royal ship pages currently repeat all
 * of it. This is where it actually lives.
 *
 * EVERY FIELD ON THIS PAGE IS A REFERENCE, NOT A COPY — see
 * `src/content/lines/records.ts`. The money block rendered below is the
 * same object every ship on the line carries, by identity and not by
 * equality, and each policy section's body is an imported constant. If a
 * line page ever needs a fact this record cannot reach, the fix is to
 * export the constant, never to retype it here.
 *
 * ONLY LINES WITH A RECORD GET A PAGE. Three of the fourteen in the
 * catalog have one; the other eleven have no operator content at all, so
 * they 404 rather than serving a page that looks like coverage. The
 * directory at `/cruise-lines` is where they are named.
 *
 * WHAT IS DELIBERATELY ABSENT is as real as what is here. Carnival
 * carries no fleet-traps array and no separate childcare-cost constant
 * because those were never factored out of its class files. A Carnival
 * page therefore shows fewer sections than a Royal one, and that
 * asymmetry renders rather than being papered over with invented parity.
 */

const BY_ID = new Map(LINE_RECORDS.map((r) => [r.id, r]));

export const dynamicParams = false;

export function generateStaticParams() {
  return LINE_RECORDS.map((r) => ({ slug: r.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/cruise-lines/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const record = BY_ID.get(slug);
  if (!record) return {};
  const fleet = SHIPS.filter((s) => s.line === record.name);
  const description = `${record.name} line policy for travel advisors — gratuities, drink packages, kids' clubs, where minors may be berthed and embarkation. ${fleet.length} ships charted.`;
  return {
    title: record.name,
    description,
    alternates: { canonical: linePath(slug) },
    openGraph: {
      title: `${record.name} — First Mate Cruise`,
      description,
      url: linePath(slug),
      type: "article",
    },
  };
}

/** A whole-dollar rate reads as "$17"; anything with cents needs both. */
function usd(amount: number): string {
  return Number.isInteger(amount) ? `$${amount}` : `$${amount.toFixed(2)}`;
}

export default async function LinePage({
  params,
}: PageProps<"/cruise-lines/[slug]">) {
  const { slug } = await params;
  const record = BY_ID.get(slug);
  if (!record) notFound();

  const fleet = SHIPS.filter((s) => s.line === record.name);
  const covered = fleet.filter((s) => s.content);
  const classes = routedClassRecords(SHIPS, LINES).filter((c) => c.lineId === slug);
  const money = record.money;
  const moneyProv = blockProvenance(money, record.sources);

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-[1180px] px-5 pt-6 pb-20 sm:px-8">
        <Breadcrumbs
          trail={[
            { label: "Cruise Lines", href: "/cruise-lines" },
            { label: record.name },
          ]}
        />

        <header className="mb-9 max-w-[62ch]">
          <h1 className="font-call text-[2rem] leading-[1.1] tracking-[-0.02em] text-ink sm:text-[2.4rem]">
            {record.name}
          </h1>
          <p className="mt-2 font-readout text-[0.7rem] leading-[1.7] tracking-[0.08em] uppercase text-ink-3">
            {covered.length === fleet.length
              ? `all ${fleet.length} ships charted`
              : `${covered.length} of ${fleet.length} ships charted`}{" "}
            · {classes.length} classes
          </p>
          <p className="mt-4 text-[1rem] leading-[1.6] text-ink-2">
            What holds on every {record.name} sailing, whichever hull it is.
            The rates, the package rules and the age bands are the line&apos;s,
            not the ship&apos;s — so an advisor reads them once here rather
            than on each of {covered.length} ship pages.
          </p>
          <p className="mt-3.5 max-w-[58ch] rounded-[10px] border border-line bg-surface px-3.5 py-2.5 text-[0.84rem] leading-[1.55] text-ink-3">
            Nothing below is written twice. Every paragraph on this page is the
            same value the ship pages read — the money block is literally the
            same object, not a copy of it, so a rate change is one edit and
            this page cannot fall out of step with the {covered.length} hulls.
          </p>
        </header>

        <div className="space-y-12">
          <ShipSection
            id="money"
            number="01"
            title="Money"
            lede="The rates and the structural rules. Whether a package is worth buying depends on the sailing, and that call lives in the Booking Check."
            provenance={moneyProv}
            empty={money ? undefined : "No money block for this line."}
          >
            {money && (
              <FactList
                facts={[
                  {
                    label: "Gratuities",
                    value: money.gratuityPerDayUSD
                      ? `${usd(money.gratuityPerDayUSD)} per person, per day, added to the folio automatically.`
                      : undefined,
                  },
                  {
                    label: "Drink package",
                    value: money.drinkPackagePrice
                      ? `Around ${usd(money.drinkPackagePrice)} per person, per day.`
                      : undefined,
                  },
                  { label: "Before you price it", value: money.drinkPackageNote },
                  {
                    label: "Break-even",
                    value: money.breakEvenDrinksPerDay
                      ? `Around ${money.breakEvenDrinksPerDay} drinks a day.`
                      : undefined,
                  },
                  { label: "Specialty dining", value: money.specialtyDiningNote },
                ]}
              />
            )}
          </ShipSection>

          <ShipSection
            id="policy"
            number="02"
            title="Line policy"
            lede="Set by the line and true of every hull in the fleet. A section this line has not had factored out of its ship records is absent rather than approximated."
          >
            <div className="space-y-6">
              {record.sections.map((s) => (
                <div key={s.title}>
                  <h3 className="mb-2 font-call text-[1.08rem] leading-[1.3] text-ink">
                    {s.title}
                  </h3>
                  {Array.isArray(s.body) ? (
                    <NoteList items={s.body} />
                  ) : (
                    <p className="max-w-[62ch] text-[0.94rem] leading-[1.6] text-ink-2">
                      {s.body}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </ShipSection>

          <ShipSection
            id="classes"
            number="03"
            title="Classes"
            lede="How much a class actually behaves as one thing — the reason not to quote a sister ship from memory."
          >
            <ul className="grid list-none gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {classes.map((c) => {
                const single = c.ships.length === 1;
                const n = exceptionCount(c);
                return (
                  <li key={c.slug}>
                    <Link
                      href={classPath(c.slug)}
                      className="block h-full rounded-[12px] border border-line bg-surface p-3.5 no-underline transition-colors hover:border-ink-3"
                    >
                      <span className="block font-call text-[1.02rem] leading-[1.25] text-ink">
                        {c.name} class
                      </span>
                      <span className="mt-1 block font-readout text-[0.62rem] leading-[1.6] tracking-[0.05em] uppercase text-ink-3">
                        {c.ships.length} ship{single ? "" : "s"} ·{" "}
                        {single
                          ? "nothing to compare"
                          : isUniform(c)
                            ? "hulls identical"
                            : `${n} exception${n === 1 ? "" : "s"}`}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </ShipSection>

          <ShipSection
            id="fleet"
            number="04"
            title="The fleet"
            lede="Every hull on the line, and whether it carries a read."
          >
            <ul className="flex list-none flex-wrap gap-x-4 gap-y-1.5">
              {fleet.map((s) =>
                s.content ? (
                  <li key={s.id}>
                    <Link
                      href={shipPath(s.id)}
                      className="text-[0.94rem] leading-[1.7] text-deep underline decoration-line underline-offset-2 hover:decoration-deep"
                    >
                      {s.name}
                    </Link>
                  </li>
                ) : (
                  // No page exists for an uncharted hull, so it is not a
                  // link. Listing it is still worth doing: it answers "is
                  // my ship even in there" without implying a read.
                  <li key={s.id} className="text-[0.94rem] leading-[1.7] text-ink-3">
                    {s.name} <span className="text-[0.8rem]">(not charted)</span>
                  </li>
                ),
              )}
            </ul>
          </ShipSection>

          <ShipSection
            id="sources"
            number="05"
            title="Sources and verification"
            lede="What the line's money block was signed against, and what the policy above was checked against."
          >
            <ShipSources
              blocks={[{ label: "Money", provenance: moneyProv }]}
              sources={record.sources}
            />
          </ShipSection>
        </div>
      </div>
    </main>
  );
}
