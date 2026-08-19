import type { Metadata } from "next";
import Link from "next/link";
import { LINES, SHIPS, getShip } from "@/content/ships";
import { compareShips, normalisePackages } from "@/lib/compare";
import { percent, usd } from "@/lib/money";
import { routedClassRecords } from "@/lib/classes";
import { classPath, linePath, shipPath } from "@/lib/nav";
import { isCovered } from "@/lib/types";
import type { CoveredShip } from "@/lib/types";
import { shipProvenance } from "@/lib/provenance";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CoverageChips } from "@/components/CoverageChips";
import { DeckTable } from "@/components/DeckTable";
import { ShipSection, Uncharted } from "@/components/ship/ShipSection";
import { FactList } from "@/components/ship/ShipFacts";
import { ExceptionField, UniqueExtras } from "@/components/ship/ClassDiff";
import { ComparePicker } from "@/components/ship/ComparePicker";
import type { SharedExtra } from "@/lib/classes";

/**
 * TWO SHIPS, SIDE BY SIDE.
 *
 * The question this answers is the one an advisor actually has and no
 * other page here can take: "I know the Radiance — what is different
 * about the Brilliance?" The class pages answer it inside a class; this
 * answers it across them, which is the harder and more common case.
 *
 * DYNAMIC, and that is a deliberate trade. Seventy-nine covered hulls
 * make three thousand pairs, which is not a prerender, and computing a
 * comparison in the browser would mean shipping every ship record to a
 * page that renders a table. So the server does the diff and the URL
 * carries the pair. `canonical` points at the bare `/compare` for every
 * pair, so three thousand permutations do not fragment the index.
 *
 * NOTHING HERE IS AUTHORED ABOUT A SHIP. `compareShips` is the class
 * machinery pointed at an arbitrary pair — `buildClassRecord` never knew
 * it was looking at a class — so the same `ExceptionField` renders the
 * differences with the same shared-framing lifted out. On a same-class
 * pair that framing is the difference between one legible sentence and
 * two 850-character walls of near-identical text.
 */

export const metadata: Metadata = {
  title: "Compare",
  description:
    "Two ships side by side — where the records agree, where they diverge, and what only one of them carries.",
  alternates: { canonical: "/compare" },
};

/**
 * The pair a bare `/compare` shows.
 *
 * Same line, different classes, and the only two classes carrying a
 * transcribed deck stack — so the page arrives demonstrating everything
 * it can do rather than an empty form. Arriving with one ship from a
 * ship page is a different intent and gets a different answer: see the
 * `b` handling below.
 */
const DEFAULT_A = "radiance-of-the-seas";
const DEFAULT_B = "vision-of-the-seas";

const COVERED = SHIPS.filter(isCovered);
const PICKER = COVERED.map((s) => ({ id: s.id, name: s.name, line: s.line }));

const LINE_ID = new Map(LINES.map((l) => [l.name, l.id]));
const CLASS_SLUG = new Map(
  routedClassRecords(SHIPS, LINES).flatMap((c) =>
    c.ships.map((s) => [s.id, c.slug] as const),
  ),
);

function resolve(id: string | undefined): CoveredShip | undefined {
  if (!id) return undefined;
  const ship = getShip(id);
  return ship && isCovered(ship) ? ship : undefined;
}

function ShipHead({ ship }: { ship: CoveredShip }) {
  const p = shipProvenance(ship.content);
  const lineId = LINE_ID.get(ship.line);
  const classSlug = CLASS_SLUG.get(ship.id);

  return (
    <div className="rounded-[13px] border border-line bg-surface p-4">
      <Link
        href={shipPath(ship.id)}
        className="font-call text-[1.25rem] leading-[1.2] text-ink no-underline hover:underline"
      >
        {ship.name}
      </Link>
      <p className="mt-1.5 font-readout text-[0.64rem] leading-[1.7] tracking-[0.06em] uppercase text-ink-3">
        {lineId ? (
          <Link href={linePath(lineId)} className="text-ink-3 no-underline hover:text-deep">
            {ship.line}
          </Link>
        ) : (
          ship.line
        )}
        {ship.shipClass && (
          <>
            {" · "}
            {classSlug ? (
              <Link href={classPath(classSlug)} className="text-ink-3 no-underline hover:text-deep">
                {ship.shipClass} class
              </Link>
            ) : (
              `${ship.shipClass} class`
            )}
          </>
        )}
        {ship.serviceYear ? ` · ${ship.serviceYear}` : ""}
      </p>
      <CoverageChips cabin={p.cabin} money={p.money} traps={p.traps} className="mt-3" />
      <p className="mt-2 font-readout text-[0.62rem] leading-[1.6] tracking-[0.04em] text-ink-3">
        {p.cabin.sourceCount} source{p.cabin.sourceCount === 1 ? "" : "s"}
        {p.cabin.checked ? ` · checked ${p.cabin.checked}` : ""}
        {ship.content.decks ? ` · ${ship.content.decks.length}-deck stack on file` : " · no deck stack"}
      </p>
    </div>
  );
}

export default async function ComparePage({
  searchParams,
}: PageProps<"/compare">) {
  const params = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const rawA = one(params.a);
  const rawB = one(params.b);

  // A bare `/compare` demonstrates the page. Arriving with one ship —
  // which is what the ship pages link — is a different intent: the
  // advisor has half the question and wants to choose the other half,
  // so the second slot stays empty rather than being filled in for them.
  const arrivedWithOne = rawA !== undefined || rawB !== undefined;
  const a = resolve(rawA) ?? (arrivedWithOne ? undefined : resolve(DEFAULT_A));
  const b = resolve(rawB) ?? (arrivedWithOne ? undefined : resolve(DEFAULT_B));

  const ready = a && b && a.id !== b.id;
  const comparison = ready ? compareShips(a, b) : undefined;
  const normalised = comparison ? normalisePackages(comparison) : null;

  const extras: { onlyA: SharedExtra[]; onlyB: SharedExtra[] } = { onlyA: [], onlyB: [] };
  if (comparison) {
    for (const list of comparison.lists) {
      for (const entry of list.extras) {
        const target = entry.slug === comparison.a.id ? extras.onlyA : extras.onlyB;
        for (const text of entry.items) {
          target.push({
            field: list.field,
            label: list.label,
            text,
            ships: [{ ship: entry.ship, slug: entry.slug }],
          });
        }
      }
    }
  }

  const sharedLists = comparison?.lists.filter((l) => l.shared.length > 0) ?? [];

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-[1180px] px-5 pt-6 pb-20 sm:px-8">
        <Breadcrumbs trail={[{ label: "Compare" }]} />

        <header className="mb-8 max-w-[62ch]">
          <h1 className="font-call text-[2rem] leading-[1.1] tracking-[-0.02em] text-ink sm:text-[2.4rem]">
            I know that one. What&apos;s different about this one?
          </h1>
          <p className="mt-3.5 text-[1rem] leading-[1.6] text-ink-2">
            Two hulls, field by field: what both records say the same way,
            where they part, and what only one of them carries. Computed by
            comparing the records rather than written down, so it cannot claim
            a difference the ships do not have.
          </p>
        </header>

        <div className="mb-9 rounded-[14px] border border-line bg-surface/60 p-4">
          <ComparePicker ships={PICKER} a={a?.id ?? ""} b={b?.id ?? ""} />
        </div>

        {!ready ? (
          <div className="rounded-[13px] border border-dashed border-line bg-surface/50 px-4 py-3.5">
            <p className="font-call text-[1.1rem] leading-[1.4] text-ink-2">
              {a && b && a.id === b.id
                ? "That is the same ship twice."
                : "Pick a second ship to compare against."}
            </p>
            <p className="mt-2 max-w-[62ch] text-[0.88rem] leading-[1.55] text-ink-3">
              {a && b && a.id === b.id
                ? "A ship agrees with itself on everything, which is true and not useful. Choose a different hull for one of the two."
                : `Only the ${COVERED.length} charted hulls can be compared — an uncharted ship has nothing on file to compare against, and inventing the other half of the table is the one thing this will not do.`}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-10 grid gap-3 sm:grid-cols-2">
              <ShipHead ship={comparison!.a} />
              <ShipHead ship={comparison!.b} />
            </div>

            <p className="mb-10 max-w-[62ch] rounded-[11px] border border-line bg-surface px-4 py-3 text-[0.94rem] leading-[1.6] text-ink-2">
              <strong className="font-semibold text-ink">
                {comparison!.tally.matched} of {comparison!.tally.total}
              </strong>{" "}
              recorded fields match.{" "}
              {comparison!.sameClass
                ? "These are sisters in the same class, so most of what you know transfers — the exceptions below are the part that does not."
                : comparison!.sameLine
                  ? "Same line, different classes: the line policy carries across and the ship-level calls largely do not."
                  : "Different lines, so the money and the policy differ as much as the hulls do — read those before the cabin advice."}
            </p>

            <div className="space-y-12">
              <ShipSection
                id="differ"
                number="01"
                title="Where they part"
                lede="The part that does not transfer. Where two records share an opening and a closing, those are lifted out and shown once so what differs is what you read."
                empty={
                  comparison!.differ.length === 0
                    ? "Nothing. Every recorded hull field on these two ships is byte-identical, which on two different hulls is worth checking rather than assuming — open both ship pages if that surprises you."
                    : undefined
                }
              >
                <div className="space-y-4">
                  {comparison!.differ.map((d) => (
                    <ExceptionField key={d.field} diff={d} />
                  ))}
                </div>
              </ShipSection>

              <ShipSection
                id="money"
                number="02"
                title="Money"
                lede="Set by the line rather than the hull, which is why two ships on one line agree here and two ships on different lines rarely do."
                empty={
                  comparison!.moneyDiffer.length === 0 && !normalised
                    ? `Identical. ${comparison!.sameLine ? `Both are ${comparison!.a.line} ships and carry the same money block — literally the same record, not a copy of it.` : "Two different lines that happen to record the same rates and rules."}`
                    : undefined
                }
              >
                <div className="space-y-4">
                  {/* THE PRICING ILLUSION, CORRECTED — and the reason
                      this section exists rather than leaving two posted
                      prices to be read side by side. One line's number
                      carries its service charge and the other's does
                      not, so the two are not the same kind of number.
                      Rendered before the field differences because an
                      advisor who reads the raw prices first has already
                      reached the wrong conclusion. */}
                  {normalised && (
                    <div
                      className={`rounded-[13px] border p-4 ${
                        normalised.reverses
                          ? "border-signal bg-signal-bg"
                          : "border-line bg-surface"
                      }`}
                    >
                      <h3 className="mb-1 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                        <span className="font-call text-[1.1rem] leading-[1.3] text-ink">
                          What the package actually costs
                        </span>
                        {normalised.reverses && (
                          <span className="font-readout text-[0.6rem] font-bold tracking-[0.07em] uppercase text-signal">
                            the sticker prices point the wrong way
                          </span>
                        )}
                      </h3>
                      <p className="mb-3.5 max-w-[62ch] text-[0.9rem] leading-[1.55] text-ink-2">
                        Compare checkout prices, not sticker prices — one of
                        these posts its service charge in the number and the
                        other adds it at the till.
                      </p>

                      <dl className="divide-y divide-line/60 border-y border-line/60">
                        {[normalised.a, normalised.b].map((side) => (
                          <div
                            key={side.slug}
                            className="grid gap-x-6 gap-y-1 py-3 sm:grid-cols-[13rem_1fr]"
                          >
                            <dt className="font-readout text-[0.64rem] font-bold tracking-[0.06em] uppercase text-ink-3">
                              {side.ship}
                            </dt>
                            <dd className="text-[0.94rem] leading-[1.6] text-ink-2">
                              <span className="font-call text-[1.15rem] text-ink">
                                {usd(side.cost.allIn)}
                              </span>{" "}
                              per person, per day at checkout —{" "}
                              {side.cost.includedInPrice
                                ? `posted at ${usd(side.cost.base)} with the ${percent(side.cost.rate)} service charge already in it`
                                : `posted at ${usd(side.cost.base)}, plus ${percent(side.cost.rate)} added at checkout`}
                              .
                            </dd>
                          </div>
                        ))}
                      </dl>

                      <p className="mt-3.5 max-w-[62ch] text-[0.92rem] leading-[1.6] text-ink-2">
                        {normalised.cheaper === "level" ? (
                          "The two come out level once the service charges are normalised."
                        ) : (
                          <>
                            On these recorded prices the{" "}
                            <strong className="font-semibold text-ink">
                              {normalised.cheaper === "a"
                                ? normalised.a.ship
                                : normalised.b.ship}{" "}
                              package is {usd(normalised.gap)} a day less
                            </strong>{" "}
                            once the mandatory service charges are normalised
                            {normalised.reverses
                              ? " — the opposite of what the posted prices suggest."
                              : "."}
                          </>
                        )}
                      </p>
                      {/* Royal's package is a tracked fleet median of
                          roughly $55 to $120 by ship and sailing. The
                          RATES are fixed and the dollar gap is not, and
                          presenting a median as though it were a rate is
                          the false precision this product refuses
                          everywhere else. */}
                      <p className="mt-2 max-w-[62ch] text-[0.84rem] leading-[1.55] text-ink-3">
                        The rates are fixed; the prices are not. Package
                        pricing moves by ship and sailing, so run the
                        arithmetic against the actual quote — what carries
                        across every sailing is which line adds its charge at
                        checkout, not the size of the gap.
                      </p>
                    </div>
                  )}

                  {/* The price row is dropped once the panel above has
                      resolved it — the panel says the same thing with
                      the service charges applied, and two versions of
                      one comparison on one screen is one too many. */}
                  {comparison!.moneyDiffer
                    .filter((d) => !(normalised && d.field === "money.drinkPackagePrice"))
                    .map((d) => (
                      <ExceptionField key={d.field} diff={d} />
                    ))}

                  {!normalised && comparison!.moneyDiffer.length > 0 && (
                    <p className="max-w-[62ch] rounded-[11px] border border-dashed border-line px-4 py-3 text-[0.88rem] leading-[1.55] text-ink-3">
                      These two cannot be normalised to a checkout price:{" "}
                      {[comparison!.a, comparison!.b]
                        .filter((s) => !s.content.money?.serviceCharge)
                        .map((s) => s.line)
                        .join(" and ")}{" "}
                      {[comparison!.a, comparison!.b].filter(
                        (s) => !s.content.money?.serviceCharge,
                      ).length === 1
                        ? "has"
                        : "have"}{" "}
                      no service-charge rate on file. Unrecorded is not zero,
                      so the comparison is left as posted rather than
                      normalised on a guess.
                    </p>
                  )}
                </div>
              </ShipSection>

              <ShipSection
                id="only"
                number="03"
                title="What only one of them carries"
                lede="Category notes and ship-specific traps recorded against one hull and not the other."
                empty={
                  extras.onlyA.length === 0 && extras.onlyB.length === 0
                    ? "Neither carries a note the other does not."
                    : undefined
                }
              >
                <div className="space-y-6">
                  {[
                    { ship: comparison!.a, items: extras.onlyA },
                    { ship: comparison!.b, items: extras.onlyB },
                  ].map(({ ship, items }) => (
                    <div key={ship.id}>
                      <h3 className="mb-2.5 font-readout text-[0.64rem] font-bold tracking-[0.08em] uppercase text-ink-3">
                        Only on the {ship.name} — {items.length}
                      </h3>
                      {items.length > 0 ? (
                        <UniqueExtras extras={items} />
                      ) : (
                        <p className="rounded-[10px] border border-dashed border-line px-[13px] py-[11px] text-[0.9rem] leading-[1.5] text-ink-3">
                          Nothing this hull records that the other does not.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </ShipSection>

              <ShipSection
                id="agree"
                number="04"
                title="Where they agree"
                lede="Recorded identically on both. Learn it once."
                empty={
                  comparison!.agree.length === 0 &&
                  comparison!.moneyAgree.length === 0 &&
                  sharedLists.length === 0
                    ? "Nothing recorded on both ships matches. On two hulls from different lines that is the ordinary result rather than a warning."
                    : undefined
                }
              >
                <div className="space-y-6">
                  <FactList
                    facts={[...comparison!.agree, ...comparison!.moneyAgree].map((d) => ({
                      label: d.label,
                      value: d.shared,
                    }))}
                  />
                  {sharedLists.map((l) => (
                    <div key={l.field}>
                      <h3 className="mb-2.5 font-readout text-[0.64rem] font-bold tracking-[0.08em] uppercase text-ink-3">
                        {l.label} — on both
                      </h3>
                      <ul className="list-none space-y-2">
                        {l.shared.map((item, i) => (
                          <li
                            key={i}
                            className="rounded-[10px] border border-line/70 bg-canvas px-[13px] py-[11px] text-[0.92rem] leading-[1.5] text-ink-2"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </ShipSection>

              <ShipSection
                id="decks"
                number="05"
                title="Deck geometry"
                lede="Side by side rather than merged. Two stacks are two ships' arithmetic and averaging them would answer a question about a ship that does not exist."
                empty={
                  !comparison!.a.content.decks && !comparison!.b.content.decks
                    ? "Neither hull has a transcribed deck stack. The placement calls above are the operator's own and stand on their own; there is no table here to check them against."
                    : undefined
                }
              >
                {/* `min-w-0` on the children, not decoration: a grid item
                    defaults to `min-width: auto`, which lets the deck
                    table's 520px minimum push the whole page sideways
                    instead of scrolling inside its own container. The
                    ship page never hit this because its table is not in
                    a grid. */}
                <div className="grid gap-8 lg:grid-cols-2">
                  {[comparison!.a, comparison!.b].map((ship) => (
                    <div key={ship.id} className="min-w-0">
                      <h3 className="mb-2.5 font-call text-[1.05rem] leading-[1.3] text-ink">
                        {ship.name}
                      </h3>
                      {ship.content.decks ? (
                        <DeckTable
                          decks={ship.content.decks}
                          caption={
                            <>
                              A deck is a{" "}
                              <strong className="font-semibold text-ink">
                                quiet candidate
                              </strong>{" "}
                              when it has cabins directly above and directly
                              below it and nothing public sharing it. Compare
                              the two verdict columns, not the deck numbers —
                              deck 8 on one hull is not deck 8 on the other.
                            </>
                          }
                        />
                      ) : (
                        <Uncharted note="No deck stack has been transcribed for this hull." />
                      )}
                    </div>
                  ))}
                </div>
              </ShipSection>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
