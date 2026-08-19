import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COVERED_SHIPS, getShip } from "@/content/ships";
import { isCovered } from "@/lib/types";
import type { CoveredShip } from "@/lib/types";
import { shipProvenance } from "@/lib/provenance";
import { shipFit } from "@/lib/fit";
import { checkPath } from "@/lib/nav";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CoverageChips } from "@/components/CoverageChips";
import { DecisionCard } from "@/components/DecisionCard";
import { DeckTable } from "@/components/DeckTable";
import { ProvenanceSource } from "@/components/ProvenanceBadge";
import { ShipSection, Uncharted } from "@/components/ship/ShipSection";
import { FactList, NoteList, NoiseList, ObstructionList } from "@/components/ship/ShipFacts";
import { ShipFitSection } from "@/components/ship/ShipFit";
import { ShipSources } from "@/components/ship/ShipSources";
import { quietCandidates } from "@/lib/decks";

/**
 * THE SHIP PAGE — the reference view of one hull.
 *
 * It answers a different question from the Booking Check and the
 * difference governs everything on it. The check knows the client and
 * prints one read. This page has no client, so it prints what is true of
 * the SHIP and shows separately what changes once a client exists.
 *
 * NOTHING HERE IS AUTHORED ABOUT A CRUISE SHIP. Every deck number,
 * height rule, cabin number and venue on this page comes off the ship
 * record or off a shared operator table the engine already reads. The
 * only prose written in this file is about our own data — what a section
 * covers, what an absence means, where a caveat came from. Grep it: no
 * ship name, no deck, no price is hardcoded.
 *
 * ONLY COVERED SHIPS GET A PAGE. `generateStaticParams` returns the 79
 * hulls with content and `dynamicParams = false` 404s the other 116.
 * The alternative — a page per catalog ship, most of them empty — is the
 * brief's explicit prohibition on indexable pages without real coverage,
 * and it would also be the absence-as-evidence error at the scale of a
 * whole site.
 *
 * SECTIONS ARE NEVER DROPPED. A hull with no deck stack still renders
 * section 02, saying so. Seventy-one of the seventy-nine are in exactly
 * that position, and a page that quietly showed seven sections would
 * read as a ship whose decks had been checked and cleared.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return COVERED_SHIPS.map((s) => ({ slug: s.id }));
}

/**
 * Metadata composed from the record, never written down. The description
 * names what the page actually carries and how recently it was checked,
 * which is both more useful and more honest than a template sentence
 * asserting depth we may not have on this hull.
 */
export async function generateMetadata({
  params,
}: PageProps<"/ships/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const ship = getShip(slug);
  if (!ship || !isCovered(ship)) return {};

  const prov = shipProvenance(ship.content);
  const parts = [
    ship.shipClass ? `${ship.shipClass} class, ${ship.line}.` : `${ship.line}.`,
    "Cabin placement, obstructed balconies, money and expectation traps for travel advisors.",
    prov.cabin.checked ? `Sources last checked ${prov.cabin.checked}.` : "",
  ].filter(Boolean);

  return {
    title: ship.name,
    description: parts.join(" "),
    alternates: { canonical: `/ships/${ship.id}` },
    openGraph: {
      title: `${ship.name} — First Mate Cruise`,
      description: parts.join(" "),
      url: `/ships/${ship.id}`,
      type: "article",
    },
  };
}

/** A whole-dollar rate reads as "$17"; anything with cents needs both. */
function usd(amount: number): string {
  return Number.isInteger(amount) ? `$${amount}` : `$${amount.toFixed(2)}`;
}

/**
 * The operator's placement answer, split at its first sentence.
 *
 * Every one of the seventeen distinct placement notes in the catalog
 * opens with a complete, self-contained answer — "Midship on decks 8 or
 * 9." — and then spends several hundred characters on the reasoning.
 * That is exactly the call-then-why shape `DecisionCard` was built for,
 * so the split is a display transform on one authored paragraph, not a
 * new claim: the head becomes the call, the tail becomes the Why, and
 * nothing is dropped or reworded.
 *
 * Returns the whole note as the call when it has no sentence break,
 * which degrades to a long headline rather than to a truncated one.
 */
function splitNote(note: string): { head: string; tail?: string } {
  const m = note.match(/^[^.!?]*[.!?]/);
  if (!m) return { head: note };
  const tail = note.slice(m[0].length).trim();
  return { head: m[0].trim(), tail: tail || undefined };
}

const SECTIONS = [
  { id: "cabin", label: "Cabin intelligence" },
  { id: "decks", label: "Deck by deck" },
  { id: "views", label: "Balcony views" },
  { id: "money", label: "Money" },
  { id: "fit", label: "Who's sailing" },
  { id: "traps", label: "Expectation traps" },
  { id: "running", label: "Currently running" },
  { id: "sources", label: "Sources" },
];

export default async function ShipPage({ params }: PageProps<"/ships/[slug]">) {
  const { slug } = await params;
  const found = getShip(slug);
  if (!found || !isCovered(found)) notFound();
  const ship: CoveredShip = found;
  const c = ship.content;
  const prov = shipProvenance(c);
  const fit = shipFit(ship);

  const cabin = c.cabin;
  const money = c.money;
  const traps = c.traps;

  const placement = cabin?.midshipRange
    ? { head: `Midship, ${cabin.midshipRange}.`, tail: cabin.placementNote }
    : cabin?.placementNote
      ? splitNote(cabin.placementNote)
      : undefined;

  const candidates = c.decks ? quietCandidates(c.decks) : [];

  const meta = [
    ship.line,
    ship.shipClass ? `${ship.shipClass} class` : undefined,
    ship.serviceYear ? `entered service ${ship.serviceYear}` : undefined,
  ].filter(Boolean) as string[];

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-[1180px] px-5 pt-6 pb-20 sm:px-8">
        {/* Line and class are not links yet — those pages land in Phase 6,
            and a crumb pointing at a 404 is worse than a crumb that is
            only a label. `Breadcrumbs` renders an href-less crumb as
            plain text, so each becomes one edit when its route exists —
            which is what just happened to the directory crumb. */}
        <Breadcrumbs
          trail={[
            { label: "Ships", href: "/ships" },
            { label: ship.line },
            ...(ship.shipClass ? [{ label: `${ship.shipClass} class` }] : []),
            { label: ship.name },
          ]}
        />

        <header className="mb-8 max-w-[62ch]">
          <h1 className="font-call text-[2rem] leading-[1.1] tracking-[-0.02em] text-ink sm:text-[2.4rem]">
            {ship.name}
          </h1>
          <p className="mt-2 font-readout text-[0.7rem] leading-[1.7] tracking-[0.08em] uppercase text-ink-3">
            {meta.join("  ·  ")}
          </p>

          <CoverageChips
            cabin={prov.cabin}
            money={prov.money}
            traps={prov.traps}
            className="mt-4"
          />
          <ProvenanceSource provenance={prov.cabin} className="mt-2" />

          {/* Eligibility is a gate, so it goes above everything it would
              otherwise sit inside. No ship in the catalog sets it today —
              see the note on the type — but a hull that does must say so
              before a single word of cabin advice. */}
          {c.eligibility && (
            <p className="mt-4 rounded-[11px] border border-signal/40 bg-signal-bg px-3.5 py-3 text-[0.94rem] leading-[1.55] text-ink">
              <span className="mr-2 font-readout text-[0.6rem] font-bold tracking-[0.08em] uppercase text-signal">
                Who may sail
              </span>
              Minimum guest age {c.eligibility.minimumGuestAge}.
              {c.eligibility.note ? ` ${c.eligibility.note}` : ""}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href={checkPath(ship.id)}
              className="rounded-[10px] bg-go px-4 py-2.5 text-[0.9rem] font-semibold text-white no-underline transition-colors hover:bg-[#175A50]"
            >
              Run a Booking Check on this ship
            </Link>
            <span className="max-w-[34ch] text-[0.82rem] leading-[1.5] text-ink-3">
              This page is the ship. The check is the booking — it asks who is
              sailing and narrows all of this to them.
            </span>
          </div>
        </header>

        {/* The short version. Three calls that do not depend on the
            client, so they can be stated on a page that has no client. */}
        <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <DecisionCard
            label="Where to book"
            call={placement?.head ?? null}
            reasoning={
              c.decks
                ? [
                    {
                      mark: "yes" as const,
                      text: `Deck stack on file — the arithmetic clears ${candidates.length} deck${candidates.length === 1 ? "" : "s"} (${candidates.join(", ")}). The call above may be narrower.`,
                    },
                  ]
                : [
                    {
                      mark: "unknown" as const,
                      text: "No deck stack transcribed for this hull — the call above is the operator's, not a table's.",
                    },
                  ]
            }
            detail={placement?.tail}
            provenance={prov.cabin}
          />
          <DecisionCard
            label="Balcony views"
            call={
              cabin?.obstructedViewNotes || traps?.obstructedBalconyDecks
                ? "Some balconies here are obstructed — section 03 has what by, and which."
                : null
            }
            reasoning={
              cabin?.obstructionKinds?.length
                ? [
                    {
                      mark: "yes" as const,
                      text: `${cabin.obstructionKinds.length} mechanism${cabin.obstructionKinds.length === 1 ? "" : "s"} established, and they call for different advice.`,
                    },
                  ]
                : [
                    {
                      mark: "unknown" as const,
                      text: "What is physically in the way is not established on this hull.",
                    },
                  ]
            }
            provenance={prov.cabin}
          />
          <DecisionCard
            label="Gratuities"
            call={
              money?.gratuityPerDayUSD
                ? `${usd(money.gratuityPerDayUSD)} per person per day, added to the folio automatically.`
                : null
            }
            reasoning={[
              {
                mark: "unknown" as const,
                text: "Whether the drink package earns its keep depends on the itinerary — that call lives in the Booking Check.",
              },
            ]}
            provenance={prov.money}
          />
        </div>

        {/* Contents. A strip above the page on narrow screens, a sticky
            rail beside it from `lg` — the shell is 1180 wide and the
            prose inside it is capped at a reading measure, so the right
            third was empty. Explicit grid placement rather than `order`,
            so the DOM order is the reading order on mobile and no
            keyboard user tabs backwards. */}
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
            {/* 01 ---------------------------------------------------- */}
            <ShipSection
              id="cabin"
              number="01"
              title="Cabin intelligence"
              lede="Where the operator puts people on this hull, and what is above and below them when they get there."
              provenance={prov.cabin}
              empty={cabin ? undefined : "No cabin block has been worked up for this ship."}
            >
              {cabin && (
                <div className="space-y-6">
                  <FactList
                    facts={[
                      { label: "Motion", value: cabin.motionAvoid },
                      { label: "Vibration", value: cabin.vibrationNote },
                      { label: "Connecting cabins", value: cabin.connectingNote },
                      { label: "Minors", value: cabin.minorPlacementRule },
                      { label: "Lifts", value: cabin.elevatorNote },
                      { label: "Accessibility", value: cabin.accessibilityNote },
                    ]}
                  />

                  {(cabin.categoryWarnings?.length ?? 0) > 0 && (
                    <div>
                      <h3 className="mb-2.5 font-readout text-[0.64rem] font-bold tracking-[0.08em] uppercase text-ink-3">
                        Category notes
                      </h3>
                      <NoteList items={cabin.categoryWarnings ?? []} />
                    </div>
                  )}

                  <div>
                    <h3 className="mb-1.5 font-readout text-[0.64rem] font-bold tracking-[0.08em] uppercase text-ink-3">
                      What is above and below the cabins
                    </h3>
                    <p className="mb-2.5 max-w-[62ch] text-[0.86rem] leading-[1.55] text-ink-3">
                      Worst first. The venue, the risk and what a traveller
                      actually hears are the same on every hull — they come from
                      the operator&apos;s own risk table. Only the locations are
                      this ship&apos;s.
                    </p>
                    {cabin.hazardsAboveBelow.length > 0 ? (
                      <NoiseList hazards={cabin.hazardsAboveBelow} />
                    ) : (
                      <Uncharted note="Nothing has been recorded above or below the cabins on this hull." />
                    )}
                  </div>
                </div>
              )}
            </ShipSection>

            {/* 02 ---------------------------------------------------- */}
            <ShipSection
              id="decks"
              number="02"
              title="Deck by deck"
              lede="The working behind the placement call: for every deck, what is above it, what is below it, and what that makes it."
              provenance={prov.cabin}
              empty={
                c.decks
                  ? undefined
                  : "No deck stack has been transcribed for this hull. The placement call above is the operator's own, and it stands on its own — but there is no table here to check it against."
              }
            >
              {c.decks && <DeckTable decks={c.decks} />}
            </ShipSection>

            {/* 03 ---------------------------------------------------- */}
            <ShipSection
              id="views"
              number="03"
              title="Balcony views and obstructions"
              lede="Obstructed is sold as one thing and is at least five. What is in the way decides the advice, not the label."
              provenance={prov.cabin}
              empty={
                cabin?.obstructedViewNotes ||
                traps?.obstructedBalconyDecks ||
                cabin?.obstructionKinds?.length
                  ? undefined
                  : "Nobody has worked up which balconies are obstructed on this hull, or by what."
              }
            >
              <div className="space-y-6">
                <FactList
                  facts={[
                    { label: "On this ship", value: cabin?.obstructedViewNotes },
                    { label: "Which cabins", value: traps?.obstructedBalconyDecks },
                  ]}
                />
                {cabin?.obstructionKinds?.length ? (
                  <div>
                    <h3 className="mb-2.5 font-readout text-[0.64rem] font-bold tracking-[0.08em] uppercase text-ink-3">
                      What is actually in the way
                    </h3>
                    <ObstructionList kinds={cabin.obstructionKinds} />
                  </div>
                ) : (
                  <Uncharted note="The mechanism is not established on this hull — the line publishes that a cabin is obstructed without saying by what, and we do not fill that in with a guess." />
                )}
              </div>
            </ShipSection>

            {/* 04 ---------------------------------------------------- */}
            <ShipSection
              id="money"
              number="04"
              title="Money"
              lede="The rates and the structural rules. Whether a package is worth buying depends on the sailing, and that call is in section 05."
              provenance={prov.money}
              empty={money ? undefined : "No money block has been worked up for this ship."}
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
                    {
                      label: "In the fare",
                      value:
                        c.fareInclusions?.state === "known"
                          ? c.fareInclusions.includes.join(", ")
                          : undefined,
                    },
                  ]}
                />
              )}
            </ShipSection>

            {/* 05 ---------------------------------------------------- */}
            <ShipSection
              id="fit"
              number="05"
              title="What changes with who's sailing"
              lede="This page has no client, so it cannot print one read. Here is everything the read engine says differently depending on who is on the booking — the alternative was to pick a default client and not mention it."
            >
              <ShipFitSection fit={fit} />
            </ShipSection>

            {/* 06 ---------------------------------------------------- */}
            <ShipSection
              id="traps"
              number="06"
              title="Expectation traps"
              lede="What the client pictures and what they get, where those come apart on this hull."
              provenance={prov.traps}
              empty={traps ? undefined : "No traps block has been worked up for this ship."}
            >
              {traps && (
                <div className="space-y-6">
                  {(traps.other?.length ?? 0) > 0 && (
                    <div>
                      <h3 className="mb-2.5 font-readout text-[0.64rem] font-bold tracking-[0.08em] uppercase text-ink-3">
                        Particular to this ship
                      </h3>
                      <NoteList items={traps.other ?? []} />
                    </div>
                  )}

                  <FactList
                    facts={[
                      { label: "Height and age", value: traps.kidAgeHeightRules },
                      { label: "Embarkation", value: traps.embarkationNote },
                    ]}
                  />

                  {/* Line policy behind a native disclosure — no JavaScript,
                      and the same separation the read card makes. It is
                      reference the advisor has read on every other hull of
                      the line, and mixing it in buries what is particular to
                      this one. */}
                  {(traps.linePolicy?.length ?? 0) > 0 && (
                    <details className="rounded-[11px] border border-line/70 bg-canvas px-3.5 py-3">
                      <summary className="cursor-pointer font-readout text-[0.68rem] font-bold tracking-[0.05em] uppercase text-ink-3 hover:text-deep">
                        {traps.linePolicy?.length} more, same on every {ship.line}{" "}
                        sailing
                      </summary>
                      <div className="mt-3">
                        <NoteList items={traps.linePolicy ?? []} />
                      </div>
                    </details>
                  )}
                </div>
              )}
            </ShipSection>

            {/* 07 ---------------------------------------------------- */}
            <ShipSection
              id="running"
              number="07"
              title="What's running right now"
              lede="A status rather than a fact about the ship. It changes without this record changing, which is why it is dated and kept apart from everything else."
              empty={
                (c.availability?.length ?? 0) > 0
                  ? undefined
                  : "Nobody has checked what is currently in service on this hull. An empty list is not a working ship — it is an unchecked one, and an attraction that is shut is a refund conversation rather than a heads-up."
              }
            >
              <ul className="list-none space-y-2.5">
                {(c.availability ?? []).map((a) => (
                  <li
                    key={a.activity}
                    className="rounded-[11px] border border-signal/40 bg-signal-bg p-3.5"
                  >
                    <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                      <span className="font-call text-[1rem] leading-[1.3] text-ink">
                        {a.activity}
                      </span>
                      <span className="rounded-[5px] border border-signal/50 px-1.5 py-[1px] font-readout text-[0.58rem] font-bold tracking-[0.07em] uppercase text-signal">
                        {a.status.replace(/-/g, " ")}
                      </span>
                    </div>
                    {a.note && (
                      <p className="mt-1.5 max-w-[62ch] text-[0.9rem] leading-[1.55] text-ink-2">
                        {a.note}
                      </p>
                    )}
                    <p className="mt-1 font-readout text-[0.62rem] tracking-[0.05em] text-ink-3">
                      CHECKED {a.checked} · {a.source}
                    </p>
                  </li>
                ))}
              </ul>
            </ShipSection>

            {/* 08 ---------------------------------------------------- */}
            <ShipSection
              id="sources"
              number="08"
              title="Sources and verification"
              lede="What has been signed off, by block, and what it was checked against."
            >
              <ShipSources
                blocks={[
                  { label: "Cabin", provenance: prov.cabin },
                  { label: "Money", provenance: prov.money },
                  { label: "Traps", provenance: prov.traps },
                ]}
                sources={c.sources ?? []}
              />
            </ShipSection>
          </div>
        </div>
      </div>
    </main>
  );
}
