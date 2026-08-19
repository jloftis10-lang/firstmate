import type { Metadata } from "next";
import Link from "next/link";
import { LINES, SHIPS } from "@/content/ships";
import { LINE_RECORDS } from "@/content/lines/records";
import { isUniform, routedClassRecords } from "@/lib/classes";
import { coveredShips, obstructedButUnexplained } from "@/lib/guides";
import { OBSTRUCTION_KINDS } from "@/lib/obstruction";
import { NOISE_SOURCES } from "@/lib/noise";
import { PROVENANCE_COPY } from "@/lib/provenance";
import type { ProvenanceState } from "@/lib/provenance";
import { blockStates } from "@/lib/types";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ShipSection } from "@/components/ship/ShipSection";

/**
 * HOW IT WORKS — where the homepage's four refusals get their argument.
 *
 * This is the page an advisor reads before deciding whether to trust
 * anything else here, so it has to be checkable rather than reassuring.
 * Every number on it is reduced from the catalog at build time and every
 * rule it states is a rule the code actually runs — the provenance copy
 * is the same constant the badges render, the taxonomy counts are the
 * length of the same arrays the engine reads.
 *
 * It states the rules and links out; the guides carry the full tables
 * and the ship-by-ship cross-cut. Rendering both in both places would
 * have been two copies of one thing, which is the failure this whole
 * codebase is organised against.
 */

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "How a Confidence Read is produced: a deterministic engine over operator records, verified per block, with no scores and no language model anywhere in it.",
  alternates: { canonical: "/methodology" },
};

const SECTIONS = [
  { id: "read", label: "How a read is made" },
  { id: "verified", label: "What verified means" },
  { id: "rules", label: "The rules it runs" },
  { id: "classes", label: "Where class rules come from" },
  { id: "refuse", label: "What it refuses" },
  { id: "coverage", label: "Coverage" },
];

const STATE_ORDER: ProvenanceState[] = ["verified", "researched", "uncharted"];

export default function MethodologyPage() {
  const covered = coveredShips(SHIPS);
  const signed = covered.filter((s) => blockStates(s.content).allVerified).length;
  const classes = routedClassRecords(SHIPS, LINES);
  const comparable = classes.filter((c) => c.ships.length > 1);
  const uniform = comparable.filter(isUniform).length;
  const unexplained = obstructedButUnexplained(covered).length;
  const withKinds = covered.filter(
    (s) => (s.content.cabin?.obstructionKinds?.length ?? 0) > 0,
  ).length;

  // 4 parties x 2 x 2 x 2. Written as the arithmetic rather than as 32,
  // because the number is only meaningful as what it is a count of.
  const profiles = 4 * 2 * 2 * 2;

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-[1180px] px-5 pt-6 pb-20 sm:px-8">
        <Breadcrumbs trail={[{ label: "How It Works" }]} />

        <header className="mb-8 max-w-[62ch]">
          <h1 className="font-call text-[2rem] leading-[1.1] tracking-[-0.02em] text-ink sm:text-[2.4rem]">
            How a read is made, and what it will not do
          </h1>
          <p className="mt-3.5 text-[1rem] leading-[1.6] text-ink-2">
            The failure mode of a confidence tool is being confidently wrong.
            Everything below is the machinery for not being — and it is stated
            so you can check it rather than take it, because a page that just
            promised carefulness would be the least trustworthy page here.
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
              id="read"
              number="01"
              title="How a read is made"
              lede="Five questions in, three categories out, by a rules engine over structured records. No language model is involved at any point."
            >
              <div className="space-y-4 text-[0.96rem] leading-[1.65] text-ink-2">
                <p className="max-w-[62ch]">
                  A ship record holds what an operator knows about a hull —
                  where to put people, what sits above and below the cabins,
                  what the balconies actually look at, what the client will be
                  surprised by. The engine reads that record and the five
                  answers about the booking, and emits a call, the flags that
                  qualify it, and the reasoning behind it. Nothing is
                  generated: every ship-specific sentence in a read is a
                  sentence somebody wrote into a record and signed.
                </p>
                <p className="max-w-[62ch]">
                  The consequence is that the same booking returns the same
                  answer every time. That is testable, so it is tested: a
                  snapshot of all {covered.length} covered hulls against all{" "}
                  {profiles} combinations of the four client questions —{" "}
                  {(covered.length * profiles).toLocaleString("en-US")} reads — is hashed and checked on
                  every build. A change to the reasoning that nobody intended
                  fails the build; a change that was intended has to be
                  regenerated and committed, so it shows up in review as a
                  diff rather than passing unnoticed.
                </p>
                <p className="max-w-[62ch]">
                  There are exactly three categories — cabin, money, traps —
                  and there is deliberately no fourth. A category nobody has
                  worked up for a ship renders as uncharted rather than
                  disappearing, because a read showing two cards and a read
                  showing three look identical if the missing one is simply
                  not drawn, and they mean opposite things.
                </p>
              </div>
            </ShipSection>

            <ShipSection
              id="verified"
              number="02"
              title="What verified means, and what it does not"
              lede="Three states, and the distance between the second and the third is the one that matters."
            >
              <div className="space-y-4">
                <ul className="grid list-none gap-3 sm:grid-cols-3">
                  {STATE_ORDER.map((state) => (
                    <li
                      key={state}
                      className={`rounded-[13px] border p-4 ${
                        state === "verified"
                          ? "border-go/50 bg-go-bg"
                          : state === "researched"
                            ? "border-signal/40 bg-signal-bg"
                            : "border-dashed border-line bg-surface/50"
                      }`}
                    >
                      <span className="mb-2 block font-readout text-[0.62rem] font-bold tracking-[0.09em] uppercase text-ink-3">
                        {PROVENANCE_COPY[state].label}
                      </span>
                      <p className="text-[0.9rem] leading-[1.55] text-ink-2">
                        {PROVENANCE_COPY[state].detail}
                      </p>
                    </li>
                  ))}
                </ul>
                {/* The copy above is the same constant the badges render.
                    A methodology page describing what a badge means in
                    its own words would be a second definition, and the
                    day they disagreed the badge would be the honest one
                    and this page the reassuring one. */}
                <p className="max-w-[62ch] text-[0.96rem] leading-[1.65] text-ink-2">
                  Those three words are the same ones the badges use, drawn
                  from the same constant — this page does not get its own
                  definition of them.
                </p>
                <p className="max-w-[62ch] text-[0.96rem] leading-[1.65] text-ink-2">
                  Verification is per block, not per ship. Cabin advice comes
                  from somebody who has walked the hull; money and trap policy
                  is researched off the line. Those become true at different
                  moments, so they are markable separately — otherwise nothing
                  could ever be signed without over-claiming the rest. Of the{" "}
                  {covered.length} charted hulls, {signed}{" "}
                  {signed === covered.length
                    ? "are signed end to end."
                    : "are signed end to end and the rest carry the unsigned blocks marked."}
                </p>
                <p className="max-w-[62ch] text-[0.96rem] leading-[1.65] text-ink-2">
                  Sourcing is recorded per ship rather than per block, which is
                  a real imprecision and is stated on every ship page rather
                  than hidden: the badge says when the ship was last checked,
                  not when that particular block was.
                </p>
              </div>
            </ShipSection>

            <ShipSection
              id="rules"
              number="03"
              title="The rules it runs"
              lede="General operator judgment, held once and applied everywhere, rather than restated on every hull."
            >
              <div className="space-y-5">
                <div className="rounded-[13px] border border-line bg-surface p-4">
                  <h3 className="mb-1.5 font-call text-[1.1rem] leading-[1.3] text-ink">
                    The sandwich test
                  </h3>
                  <p className="mb-2 max-w-[62ch] text-[0.94rem] leading-[1.6] text-ink-2">
                    A deck is a quiet candidate when it has cabins directly
                    above it and directly below it and nothing public sharing
                    it. Plenty of cabins on the deck itself proves nothing —
                    the deck above is what wakes people up. It is arithmetic,
                    so it runs rather than being asserted, and it narrows the
                    field without picking the cabin: the operator&apos;s own
                    call is allowed to be narrower than the table and often is.
                  </p>
                  <Link
                    href="/guides/quiet-cabins"
                    className="font-readout text-[0.7rem] font-bold tracking-[0.05em] uppercase text-deep underline decoration-line underline-offset-[3px] hover:decoration-deep"
                  >
                    The quiet-cabin guide &rarr;
                  </Link>
                </div>

                <div className="rounded-[13px] border border-line bg-surface p-4">
                  <h3 className="mb-1.5 font-call text-[1.1rem] leading-[1.3] text-ink">
                    What sits above and below, ranked
                  </h3>
                  <p className="mb-2 max-w-[62ch] text-[0.94rem] leading-[1.6] text-ink-2">
                    {NOISE_SOURCES.length} sources of noise, ordered worst
                    first, with what a traveller actually hears from each. The
                    ranking and the wording are operator judgment and hold on
                    any hull, so a ship record says only which of them it has
                    and where — it never restates the judgment.
                  </p>
                  <Link
                    href="/guides/quiet-cabins"
                    className="font-readout text-[0.7rem] font-bold tracking-[0.05em] uppercase text-deep underline decoration-line underline-offset-[3px] hover:decoration-deep"
                  >
                    The full ranking &rarr;
                  </Link>
                </div>

                <div className="rounded-[13px] border border-line bg-surface p-4">
                  <h3 className="mb-1.5 font-call text-[1.1rem] leading-[1.3] text-ink">
                    &ldquo;Obstructed&rdquo; is at least {OBSTRUCTION_KINDS.length} things
                  </h3>
                  <p className="mb-2 max-w-[62ch] text-[0.94rem] leading-[1.6] text-ink-2">
                    A steel bulkhead takes the horizon; a lifeboat roof takes
                    the view straight down and leaves the horizon; a public
                    walkway takes privacy and no view at all. Those lead to
                    opposite advice and arrive as the same word on a booking
                    screen, so the taxonomy separates the cause from the
                    effect. It is populated only where the mechanism is
                    actually established — {withKinds} hulls have one on
                    record, and {unexplained} are published as obstructed with
                    no mechanism stated, which renders as exactly that rather
                    than as a guess.
                  </p>
                  <Link
                    href="/guides/obstructed-balconies"
                    className="font-readout text-[0.7rem] font-bold tracking-[0.05em] uppercase text-deep underline decoration-line underline-offset-[3px] hover:decoration-deep"
                  >
                    The obstruction guide &rarr;
                  </Link>
                </div>
              </div>
            </ShipSection>

            <ShipSection
              id="classes"
              number="04"
              title="Where class rules come from"
              lede="Computed by comparing the ships, never written down."
            >
              <div className="space-y-4 text-[0.96rem] leading-[1.65] text-ink-2">
                <p className="max-w-[62ch]">
                  A hand-written class rule is a second source of truth that
                  agrees with the ship records until somebody edits one of
                  them. So there is no class content: a field byte-identical
                  across every hull in a class is reported as inherited, a
                  field that varies is reported as a per-ship exception, and
                  both fall out of the records with nothing restated. Add an
                  exception to a ship and the class page reports it on the next
                  build. The page cannot claim a rule is class-wide when the
                  records say otherwise, because it is reading the records.
                </p>
                <p className="max-w-[62ch]">
                  That also surfaces something no written page would: how much
                  a class actually behaves as one thing. Only{" "}
                  <strong className="font-semibold text-ink">
                    {uniform} of the {comparable.length}
                  </strong>{" "}
                  charted multi-ship classes are uniform. The rest diverge
                  somewhere, which is the case for reading a{" "}
                  <Link
                    href="/classes"
                    className="text-deep underline decoration-line underline-offset-2"
                  >
                    class page
                  </Link>{" "}
                  before quoting a sister ship from memory.
                </p>
              </div>
            </ShipSection>

            <ShipSection
              id="refuse"
              number="05"
              title="What it refuses to do"
              lede="Each of these costs coverage or convenience. They are the product."
            >
              <ul className="grid list-none gap-3 sm:grid-cols-2">
                {[
                  {
                    title: "No score, ever",
                    body: "No rating, no percentage, no confidence number anywhere. A score is one more thing to weigh and it implies a precision nobody has — and a number is harder to argue with than a sentence, which is the wrong property for advice that might be wrong.",
                  },
                  {
                    title: "No inferred cabin facts between sisters",
                    body: "Cabin numbers, obstruction lists and deck bands are not carried from one hull to another even inside a class. Several records say explicitly that a documented pair on one ship does not reproduce on its sister — that is a finding, and inheritance would have erased it.",
                  },
                  {
                    title: "Uncharted is never a clean bill of health",
                    body: "An empty block, an empty section and an empty availability list all say so in words. They are drawn rather than hidden, because a page with one fewer section reads as a ship with one fewer problem.",
                  },
                  {
                    title: "Absence is not evidence",
                    body: "\"Nobody checked\" and \"there is nothing there\" are different values in the data model, not the same empty field. Reading the first as the second is the error that produced several of the corrections in this project's history.",
                  },
                ].map((item) => (
                  <li key={item.title} className="rounded-[13px] border border-line bg-surface p-4">
                    <h3 className="font-call text-[1.1rem] leading-[1.3] text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-[52ch] text-[0.92rem] leading-[1.6] text-ink-2">
                      {item.body}
                    </p>
                  </li>
                ))}
              </ul>
            </ShipSection>

            <ShipSection
              id="coverage"
              number="06"
              title="Coverage, and how it grows"
              lede="Breadth in the picker must never become breadth in the calls."
            >
              <div className="space-y-4 text-[0.96rem] leading-[1.65] text-ink-2">
                <p className="max-w-[62ch]">
                  The catalog carries {SHIPS.length} ships across {LINES.length}{" "}
                  lines so an advisor can find their ship.{" "}
                  {covered.length} of them have a read, on{" "}
                  {LINE_RECORDS.length} lines. The other{" "}
                  {SHIPS.length - covered.length} say plainly that nobody has
                  worked them up — they have no page at all, because a page
                  that exists reads as a page that has been checked.
                </p>
                <p className="max-w-[62ch]">
                  Coverage grows by somebody working a hull up and signing it,
                  one class at a time, and the order is driven by what advisors
                  actually ask for.{" "}
                  <Link
                    href="/ships"
                    className="text-deep underline decoration-line underline-offset-2"
                  >
                    The directory
                  </Link>{" "}
                  says which lines are which.
                </p>
              </div>
            </ShipSection>
          </div>
        </div>
      </div>
    </main>
  );
}
