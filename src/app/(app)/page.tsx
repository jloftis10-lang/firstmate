import type { Metadata } from "next";
import Link from "next/link";
import { LINES, SHIPS, getShip } from "@/content/ships";
import { LINE_RECORDS } from "@/content/lines/records";
import { routedClassRecords, isUniform } from "@/lib/classes";
import { quietCandidates } from "@/lib/decks";
import { getRead } from "@/lib/engine";
import { checkPath } from "@/lib/share";
import { shipPath } from "@/lib/nav";
import { blockStates, isCovered } from "@/lib/types";
import type { ClientProfile, CoveredShip } from "@/lib/types";
import { DeckTable } from "@/components/DeckTable";
import { Emphasis } from "@/components/Emphasis";

/**
 * THE HOMEPAGE.
 *
 * `/` was the Booking Check until Phase 7 and a redirect until now. It
 * is the page a travel advisor who has never seen this lands on, so it
 * has one job: say what this is, prove it, and get out of the way.
 *
 * NOTHING ON IT IS A MOCK-UP. The read below is produced by the real
 * engine from a real ship record at build time, and the deck table is
 * the same component the ship page renders from the same transcribed
 * stack. Both name the ship and link to the live version, so a reader
 * who suspects a marketing screenshot can click through and check. That
 * is not a flourish — a product whose whole claim is "we do not make
 * things up" cannot open with a fabricated example of itself.
 *
 * WHAT IS DELIBERATELY ABSENT: no stock photography of a ship at sunset,
 * no testimonials, no logos, no counts of anything we have not counted.
 * Every number here is reduced from the catalog at build time, so the
 * day a fourth line is worked up the page says so without being edited.
 */

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * The demonstration booking. A real hull, a real party, stated in full.
 *
 * Radiance because it is the best-covered ship in the catalog — signed
 * end to end, fourteen sources, and the only class besides Vision with a
 * transcribed deck stack, which is what lets the same page show both the
 * answer and the arithmetic behind it.
 *
 * Throwing here rather than falling back is deliberate. If this hull
 * ever leaves the catalog the build should stop, not quietly render a
 * homepage with a hole in it.
 */
const DEMO_SHIP_ID = "radiance-of-the-seas";
const DEMO_PROFILE: ClientProfile = {
  shipId: DEMO_SHIP_ID,
  party: "family",
  seasick: "no",
  experience: "first",
  itinerary: "sea-days",
};

function demoShip(): CoveredShip {
  const ship = getShip(DEMO_SHIP_ID);
  if (!ship || !isCovered(ship)) {
    throw new Error(
      `The homepage demonstrates ${DEMO_SHIP_ID}, which is no longer a covered ship. Pick another hull rather than removing the section.`,
    );
  }
  return ship;
}

function Stat({ value, label, href }: { value: string; label: string; href: string }) {
  return (
    <Link
      href={href}
      className="block rounded-[13px] border border-line bg-surface p-4 no-underline transition-colors hover:border-ink-3"
    >
      <span className="block font-call text-[1.6rem] leading-[1.1] text-ink">
        {value}
      </span>
      <span className="mt-1.5 block text-[0.88rem] leading-[1.5] text-ink-2">
        {label}
      </span>
    </Link>
  );
}

const HERO_INPUTS = ["Ship", "Party", "Motion", "Experience", "Sea days"];
const HERO_OUTPUTS = [
  { number: "01", label: "Cabin & deck", detail: "Placement, adjacency, obstruction" },
  { number: "02", label: "Money", detail: "Gratuities, packages, inclusions" },
  { number: "03", label: "Expectations", detail: "The surprises to explain before booking" },
] as const;

function HeroReadMap({
  covered,
  lines,
  reads,
}: {
  covered: number;
  lines: number;
  reads: number;
}) {
  return (
    <div className="relative overflow-hidden rounded-[18px] border border-brand-navy/15 bg-brand-navy p-5 text-white shadow-[0_18px_50px_rgba(11,29,51,.16)] sm:p-6">
      <div
        aria-hidden="true"
        className="absolute -top-20 -right-20 h-56 w-56 rounded-full border border-white/8"
      />
      <div className="relative">
        <div className="flex items-center justify-between gap-4 border-b border-white/12 pb-4">
          <span className="font-readout text-[0.62rem] font-bold tracking-[0.1em] text-[#9EC4D4] uppercase">
            Pre-booking read
          </span>
          <span className="rounded-full border border-go/70 bg-go/20 px-2.5 py-1 font-readout text-[0.58rem] tracking-[0.06em] text-[#D5ECE7] uppercase">
            Deterministic
          </span>
        </div>

        <div className="py-4">
          <div className="mb-2 font-readout text-[0.58rem] tracking-[0.08em] text-[#9EC4D4] uppercase">
            Five booking details in
          </div>
          <div className="flex flex-wrap gap-1.5">
            {HERO_INPUTS.map((input) => (
              <span
                key={input}
                className="rounded-[6px] border border-white/15 bg-white/8 px-2 py-1.5 text-[0.72rem] text-[#EAF2F5]"
              >
                {input}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-3 flex items-center gap-2" aria-hidden="true">
          <span className="h-px flex-1 bg-white/12" />
          <span className="font-readout text-[0.62rem] text-brass">↓</span>
          <span className="h-px flex-1 bg-white/12" />
        </div>

        <div className="space-y-2.5">
          {HERO_OUTPUTS.map((output) => (
            <div
              key={output.number}
              className="grid grid-cols-[1.6rem_minmax(0,1fr)] gap-2.5 rounded-[10px] border border-white/12 bg-white/6 p-3"
            >
              <span className="font-readout text-[0.6rem] text-[#9EC4D4]">
                {output.number}
              </span>
              <span>
                <span className="block text-[0.84rem] font-semibold text-white">
                  {output.label}
                </span>
                <span className="mt-0.5 block text-[0.72rem] leading-[1.45] text-[#B7D0DB]">
                  {output.detail}
                </span>
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/12 pt-4 text-center">
          {[
            [`${covered}`, "ships charted"],
            [`${lines}`, "line records"],
            [reads.toLocaleString("en-US"), "reads replayed"],
          ].map(([value, label]) => (
            <span key={label}>
              <span className="block font-call text-[1.12rem] text-white">{value}</span>
              <span className="mt-0.5 block font-readout text-[0.5rem] leading-[1.35] tracking-[0.04em] text-[#9EC4D4] uppercase">
                {label}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const ship = demoShip();
  const read = getRead(ship, DEMO_PROFILE);
  const flagCount =
    (read.cabin?.flags.length ?? 0) +
    (read.money?.flags.length ?? 0) +
    (read.traps?.flags.length ?? 0);
  const decks = ship.content.decks;
  const candidates = decks ? quietCandidates(decks) : [];

  // Narrowed through `isCovered` rather than asserted: `COVERED_SHIPS`
  // is typed as ships that merely have content, and `blockStates` needs
  // the record itself.
  const coveredShips = SHIPS.filter(isCovered);
  const covered = coveredShips.length;
  const signed = coveredShips.filter((s) => blockStates(s.content).allVerified).length;
  const classes = routedClassRecords(SHIPS, LINES);
  const comparable = classes.filter((c) => c.ships.length > 1);
  const uniform = comparable.filter(isUniform).length;

  const calls: { n: string; label: string; call: string | undefined }[] = [
    { n: "01", label: "Cabin & deck", call: read.cabin?.call },
    { n: "02", label: "Money surprises", call: read.money?.call },
    { n: "03", label: "Expectation traps", call: read.traps?.call },
  ];

  return (
    <main className="flex-1">
      {/* ---- Hero ---------------------------------------------------- */}
      <section className="mx-auto w-full max-w-[1180px] px-5 pt-10 pb-14 sm:px-8 sm:pt-14">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_27rem] lg:gap-14">
          <div>
            <p className="mb-4 font-readout text-[0.66rem] font-bold tracking-[0.1em] text-brand-teal uppercase">
              Cruise booking intelligence for travel advisors
            </p>
            <h1 className="max-w-[20ch] font-call text-[2.35rem] leading-[1.06] tracking-[-0.03em] text-ink sm:text-[3.25rem]">
              Catch the booking problems before your client does.
            </h1>
            <p className="mt-5 max-w-[55ch] text-[1.08rem] leading-[1.6] text-ink-2">
              CruiseRead turns five booking details into three clear calls:
              cabin and deck, money, and expectation traps tied to this ship
              and this client.
            </p>
            <p className="mt-3.5 max-w-[55ch] text-[1.02rem] leading-[1.6] text-ink-2">
              The answer comes from deck plans, line policy and signed operator
              records — never generated copy. Where nobody has checked, it
              says so.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/check"
                className="rounded-[11px] bg-go px-5 py-3 text-[1rem] font-semibold text-white no-underline transition-colors hover:bg-[#175A50]"
              >
                Run a Booking Check
              </Link>
              <Link
                href="/guides"
                className="rounded-[11px] border border-line px-5 py-3 text-[1rem] font-semibold text-ink-2 no-underline transition-colors hover:border-ink-3 hover:text-ink"
              >
                Explore advisor guides
              </Link>
            </div>
          </div>

          <HeroReadMap
            covered={covered}
            lines={LINE_RECORDS.length}
            reads={covered * 4 * 2 * 2 * 2}
          />
        </div>
      </section>

      {/* ---- One real read ------------------------------------------- */}
      <section className="border-t border-line/70 bg-surface/40">
        <div className="mx-auto w-full max-w-[1180px] px-5 py-14 sm:px-8">
          <h2 className="font-call text-[1.7rem] leading-[1.15] tracking-[-0.015em] text-ink">
            See one real read, in full
          </h2>
          <p className="mt-3 max-w-[58ch] text-[0.98rem] leading-[1.6] text-ink-2">
            Not a mock-up. The three calls below came out of the engine at
            build time, for a real booking on a real ship — and the link runs
            the same one so you can read every word behind them.
          </p>

          <p className="mt-5 inline-block rounded-[9px] border border-line bg-surface px-3 py-2.5 font-readout text-[0.7rem] leading-[1.7] tracking-[0.04em] text-ink-2">
            <span className="text-deep">◎</span>
            &nbsp; {ship.name.toUpperCase()} &nbsp;·&nbsp; FAMILY +KIDS
            &nbsp;·&nbsp; 1ST CRUISE &nbsp;·&nbsp; SEA DAYS
          </p>

          <div className="mt-6 grid gap-3 lg:grid-cols-3">
            {calls.map((c) => (
              <div
                key={c.n}
                className="rounded-[13px] border border-line bg-surface p-4"
              >
                <span className="mb-2.5 block font-readout text-[0.66rem] font-bold tracking-[0.09em] uppercase text-ink-3">
                  <span className="text-line">{c.n}</span> {c.label}
                </span>
                <p className="border-l-[3px] border-go pl-[14px] font-call text-[1.06rem] leading-[1.4] text-ink">
                  {c.call ? <Emphasis text={c.call} /> : "Not worked up yet."}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-5 text-[0.94rem] leading-[1.6] text-ink-2">
            Behind those three calls sit{" "}
            <strong className="font-semibold text-ink">
              {flagCount} heads-ups
            </strong>{" "}
            particular to this booking — which cabins on this hull have a
            lifeboat roof under the balcony, what the kids clear and what they
            do not, what the drink package really costs once the gratuity
            lands.{" "}
            <Link
              href={checkPath(DEMO_PROFILE)}
              className="font-semibold text-deep underline decoration-line underline-offset-2 hover:decoration-deep"
            >
              Run this exact check
            </Link>{" "}
            or read{" "}
            <Link
              href={shipPath(ship.id)}
              className="font-semibold text-deep underline decoration-line underline-offset-2 hover:decoration-deep"
            >
              everything on the {ship.name}
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ---- It shows the working ------------------------------------ */}
      {decks && (
        <section className="border-t border-line/70">
          <div className="mx-auto w-full max-w-[1180px] px-5 py-14 sm:px-8">
            <div className="lg:grid lg:grid-cols-[24rem_minmax(0,1fr)] lg:items-start lg:gap-x-14">
              <div>
                <h2 className="font-call text-[1.7rem] leading-[1.15] tracking-[-0.015em] text-ink">
                  And it shows the working
                </h2>
                <p className="mt-3 max-w-[46ch] text-[0.98rem] leading-[1.6] text-ink-2">
                  A quiet cabin deck has cabins directly above it and directly
                  below it, and nothing public sharing it. Plenty of cabins on
                  the deck itself proves nothing — the deck above is what wakes
                  people up.
                </p>
                <p className="mt-3.5 max-w-[46ch] text-[0.98rem] leading-[1.6] text-ink-2">
                  That rule is arithmetic, so it runs rather than being
                  asserted. On the {ship.name} it clears{" "}
                  {candidates.length} deck{candidates.length === 1 ? "" : "s"}{" "}
                  of {decks.length}. The operator&apos;s own call is narrower
                  still, and the table says which — an advisor can disagree
                  with the answer because they can see how it was reached.
                </p>
                <p className="mt-4">
                  <Link
                    href={shipPath(ship.id)}
                    className="font-readout text-[0.72rem] font-bold tracking-[0.05em] uppercase text-deep underline decoration-line underline-offset-[3px] hover:decoration-deep"
                  >
                    The full deck stack &rarr;
                  </Link>
                </p>
              </div>

              <div className="mt-8 lg:mt-0">
                {/* The default caption points at "the placement call
                    above", which there is not one of here. */}
                <DeckTable
                  decks={decks}
                  caption={
                    <>
                      A deck is a{" "}
                      <strong className="font-semibold text-ink">
                        quiet candidate
                      </strong>{" "}
                      when it has cabins directly above and directly below it
                      and nothing public sharing it. That narrows the field; it
                      does not pick the cabin. The operator&apos;s own call is
                      allowed to be narrower than this table, and on the ship
                      page it is.
                    </>
                  }
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ---- What it refuses to do ----------------------------------- */}
      <section className="border-t border-line/70 bg-surface/40">
        <div className="mx-auto w-full max-w-[1180px] px-5 py-14 sm:px-8">
          <h2 className="font-call text-[1.7rem] leading-[1.15] tracking-[-0.015em] text-ink">
            What it will not do
          </h2>
          <p className="mt-3 max-w-[58ch] text-[0.98rem] leading-[1.6] text-ink-2">
            The failure mode of a confidence tool is being confidently wrong.
            Four things are built in to stop that, and they cost coverage on
            purpose.
          </p>

          <ul className="mt-6 grid list-none gap-3 sm:grid-cols-2">
            {[
              {
                title: "No scores",
                body: "There is no rating, no percentage and no confidence number anywhere in this product. A score is more to weigh and it implies a precision nobody has. You get the call, the reasoning, and the sources.",
              },
              {
                title: "No guessing at a hull nobody has worked",
                body: `${SHIPS.length - covered} of the ${SHIPS.length} ships in the catalog have no read. They are listed so you can find them and they say so plainly. An empty answer is not a clean bill of health, and the pages say that too.`,
              },
              {
                title: "No language model deciding anything",
                body: "The read is a deterministic engine over structured records. The same booking returns the same answer every time, and a snapshot of all 2,528 combinations is checked on every build — so a change to the reasoning cannot slip through unnoticed.",
              },
              {
                title: "No unsigned call passing as a signed one",
                body: "Cabin, money and traps are verified separately, because the person who has walked a ship and the research behind a line's policy are not the same thing. Every card carries what it was checked against and when.",
              },
            ].map((item) => (
              <li
                key={item.title}
                className="rounded-[13px] border border-line bg-surface p-4"
              >
                <h3 className="font-call text-[1.1rem] leading-[1.3] text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-[52ch] text-[0.92rem] leading-[1.6] text-ink-2">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- What's covered ------------------------------------------ */}
      <section className="border-t border-line/70">
        <div className="mx-auto w-full max-w-[1180px] px-5 py-14 sm:px-8">
          <h2 className="font-call text-[1.7rem] leading-[1.15] tracking-[-0.015em] text-ink">
            What is charted so far
          </h2>
          <p className="mt-3 max-w-[58ch] text-[0.98rem] leading-[1.6] text-ink-2">
            {signed === covered
              ? `Every one of the ${covered} is signed off end to end — an operator has confirmed the cabin, money and trap calls against the current deck plans.`
              : `${signed} of the ${covered} are signed off end to end. The rest are researched rather than confirmed, and every unsigned call is marked on the card it appears on.`}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Stat
              value={`${covered} ships`}
              label={`of ${SHIPS.length} in the catalog. Each with a page: where to book, what the balconies look at, what the client will be surprised by.`}
              href="/ships"
            />
            <Stat
              value={`${classes.length} classes`}
              label={`What transfers between sister ships and what does not — only ${uniform} of the ${comparable.length} multi-ship classes are uniform.`}
              href="/classes"
            />
            <Stat
              value={`${LINE_RECORDS.length} lines`}
              label="Gratuities, package rules, kids'-club age bands and where minors may be berthed — set by the line, not the hull."
              href="/cruise-lines"
            />
          </div>

          <p className="mt-6 max-w-[58ch] text-[0.9rem] leading-[1.6] text-ink-3">
            The other {SHIPS.length - covered} are in the catalog so you can
            find your ship and get a straight answer about it. The order they
            get worked up in is driven by what advisors actually ask for, so
            if one of those lines is one you book often, that is worth saying.
          </p>
        </div>
      </section>

      {/* ---- Close --------------------------------------------------- */}
      <section className="border-t border-line/70 bg-surface/40">
        <div className="mx-auto w-full max-w-[1180px] px-5 py-14 sm:px-8">
          <h2 className="max-w-[24ch] font-call text-[1.7rem] leading-[1.15] tracking-[-0.015em] text-ink">
            Five questions, and you know what to watch.
          </h2>
          <p className="mt-3 max-w-[54ch] text-[0.98rem] leading-[1.6] text-ink-2">
            The ship, who&apos;s sailing, whether they get seasick, whether
            they have cruised before, and how many sea days. That is the whole
            form.
          </p>
          <Link
            href="/check"
            className="mt-6 inline-block rounded-[11px] bg-go px-5 py-3 text-[1rem] font-semibold text-white no-underline transition-colors hover:bg-[#175A50]"
          >
            Run a Booking Check
          </Link>
        </div>
      </section>
    </main>
  );
}
