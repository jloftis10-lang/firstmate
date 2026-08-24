import type { Metadata } from "next";
import Link from "next/link";
import { SHIPS } from "@/content/ships";
import { LINE_RECORDS } from "@/content/lines/records";
import { blockStates, isCovered } from "@/lib/types";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "About CruiseRead",
  description:
    "What CruiseRead is, who it is built for, and how its cruise booking guidance is researched, signed and kept separate from generated copy.",
  alternates: { canonical: "/about" },
};

const PRINCIPLES = [
  {
    title: "The call has to be inspectable",
    body: "A read shows the answer, the reasoning and the source state. The advisor can see why it reached the call and disagree with it from evidence.",
  },
  {
    title: "Missing is a real answer",
    body: "An uncharted category stays visible. It never disappears and it never becomes a clean bill of health just because nobody has checked it yet.",
  },
  {
    title: "The engine does not improvise",
    body: "The same five inputs run through the same deterministic rules over structured records. No language model writes or decides a booking read.",
  },
] as const;

export default function AboutPage() {
  const covered = SHIPS.filter(isCovered);
  const signed = covered.filter((ship) => blockStates(ship.content).allVerified).length;
  const reads = covered.length * 4 * 2 * 2 * 2;

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-[1180px] px-5 pt-6 pb-20 sm:px-8">
        <Breadcrumbs trail={[{ label: "About CruiseRead" }]} />

        <header className="grid gap-8 border-b border-line pb-10 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-end">
          <div className="max-w-[65ch]">
            <p className="mb-3 font-readout text-[0.64rem] font-bold tracking-[0.09em] text-brand-teal uppercase">
              Built for the advisor side of the booking
            </p>
            <h1 className="font-call text-[2rem] leading-[1.08] tracking-[-0.025em] text-ink sm:text-[2.5rem]">
              CruiseRead is a second set of eyes before the client pays.
            </h1>
            <p className="mt-4 text-[1rem] leading-[1.65] text-ink-2">
              It turns the ship and four client details into cabin, money and
              expectation calls an advisor can use before booking. It is not a
              review score, a cruise search engine or a replacement for current
              line terms and deck plans.
            </p>
          </div>

          <dl className="grid grid-cols-3 gap-2 rounded-[14px] border border-line bg-surface p-4 lg:grid-cols-1">
            {[
              [`${covered.length}`, "charted ships"],
              [`${LINE_RECORDS.length}`, "line records"],
              [reads.toLocaleString("en-US"), "reads replayed per build"],
            ].map(([value, label]) => (
              <div key={label} className="border-line lg:border-b lg:pb-3 lg:last:border-b-0 lg:last:pb-0">
                <dt className="font-call text-[1.3rem] text-ink">{value}</dt>
                <dd className="mt-0.5 text-[0.72rem] leading-[1.35] text-ink-3">{label}</dd>
              </div>
            ))}
          </dl>
        </header>

        <section className="py-10">
          <h2 className="font-call text-[1.6rem] leading-[1.2] text-ink">
            The product rules
          </h2>
          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            {PRINCIPLES.map((principle, index) => (
              <div key={principle.title} className="rounded-[14px] border border-line bg-surface p-4">
                <span className="font-readout text-[0.6rem] text-brand-teal">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-call text-[1.12rem] leading-[1.3] text-ink">
                  {principle.title}
                </h3>
                <p className="mt-2 text-[0.9rem] leading-[1.6] text-ink-2">
                  {principle.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-8 border-t border-line pt-10 lg:grid-cols-2">
          <div>
            <h2 className="font-call text-[1.4rem] leading-[1.2] text-ink">
              What “signed off” means
            </h2>
            <p className="mt-3 max-w-[58ch] text-[0.94rem] leading-[1.65] text-ink-2">
              Cabin, money and expectation records are checked separately.
              CruiseRead distinguishes verified, researched and uncharted on
              the page where the claim appears. Right now {signed} of the {covered.length}{" "}
              charted ships are signed end to end.
            </p>
            <Link
              href="/methodology"
              className="mt-4 inline-block text-[0.9rem] font-semibold text-deep underline decoration-line underline-offset-2"
            >
              Read the full methodology
            </Link>
          </div>
          <div>
            <h2 className="font-call text-[1.4rem] leading-[1.2] text-ink">
              What CruiseRead will not claim
            </h2>
            <p className="mt-3 max-w-[58ch] text-[0.94rem] leading-[1.65] text-ink-2">
              Coverage is not completeness. A ship can be listed without a
              read, a category can be uncharted on an otherwise charted hull,
              and an older source date stays visible until that source is
              checked again. The site says which state applies instead of
              filling the gap.
            </p>
            <Link
              href="/ships"
              className="mt-4 inline-block text-[0.9rem] font-semibold text-deep underline decoration-line underline-offset-2"
            >
              See the current coverage
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
