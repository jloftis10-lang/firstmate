import type { Metadata } from "next";
import Link from "next/link";
import { SHIPS } from "@/content/ships";
import {
  coveredShips,
  guaranteeWarnings,
  obstructedButUnexplained,
  stackedShips,
} from "@/lib/guides";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Cruise advisor guides",
  description:
    "Practical cruise booking guides built from the same signed rules and ship records that power CruiseRead.",
  alternates: { canonical: "/guides" },
};

const GUIDES = [
  {
    href: "/guides/quiet-cabins",
    number: "01",
    title: "Quiet cabins",
    description:
      "Use the deck-sandwich test, then check the operator noise ranking and the hulls where each hazard is recorded.",
  },
  {
    href: "/guides/obstructed-balconies",
    number: "02",
    title: "Obstructed balconies",
    description:
      "Separate the cause from what the client actually loses: horizon, downward view, shade, space or privacy.",
  },
  {
    href: "/guides/cruise-guarantee-cabins",
    number: "03",
    title: "Guarantee cabins",
    description:
      "Understand what a guarantee fare leaves to the line, with the scope limited to the terms actually on file.",
  },
] as const;

export default function GuidesPage() {
  const covered = coveredShips(SHIPS);
  const stacks = stackedShips(covered);
  const unexplained = obstructedButUnexplained(covered);
  const guaranteeHulls = new Set(
    guaranteeWarnings(covered).flatMap((warning) => warning.ships.map((ship) => ship.id)),
  );
  const scopes = [
    `${stacks.length} transcribed deck stack${stacks.length === 1 ? "" : "s"}`,
    `${unexplained.length} hull${unexplained.length === 1 ? "" : "s"} explicitly marked unexplained`,
    `${guaranteeHulls.size} hull${guaranteeHulls.size === 1 ? "" : "s"} with terms on file`,
  ];

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-[1180px] px-5 pt-6 pb-20 sm:px-8">
        <Breadcrumbs trail={[{ label: "Guides" }]} />

        <header className="mb-9 max-w-[64ch]">
          <p className="mb-3 font-readout text-[0.64rem] font-bold tracking-[0.09em] text-brand-teal uppercase">
            Advisor field notes
          </p>
          <h1 className="font-call text-[2rem] leading-[1.1] tracking-[-0.02em] text-ink sm:text-[2.4rem]">
            The booking questions that need more than a label
          </h1>
          <p className="mt-3.5 text-[1rem] leading-[1.6] text-ink-2">
            These are not general travel articles. Each guide applies the same
            signed rule across the charted catalog, shows where the records are
            complete, and gives the gaps equal space.
          </p>
        </header>

        <div className="grid gap-4 lg:grid-cols-3">
          {GUIDES.map((guide, index) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="group flex min-h-[17rem] flex-col rounded-[16px] border border-line bg-surface p-5 no-underline transition-[border-color,transform,box-shadow] hover:-translate-y-0.5 hover:border-ink-3 hover:shadow-[0_10px_30px_rgba(15,42,61,.08)]"
            >
              <span className="font-readout text-[0.62rem] font-bold tracking-[0.09em] text-brand-teal uppercase">
                Guide {guide.number}
              </span>
              <h2 className="mt-5 font-call text-[1.45rem] leading-[1.2] text-ink">
                {guide.title}
              </h2>
              <p className="mt-3 text-[0.94rem] leading-[1.6] text-ink-2">
                {guide.description}
              </p>
              <div className="mt-auto border-t border-line pt-4">
                <span className="block font-readout text-[0.59rem] tracking-[0.05em] text-ink-3 uppercase">
                  Current scope
                </span>
                <span className="mt-1.5 block text-[0.84rem] leading-[1.45] text-ink-2">
                  {scopes[index]}
                </span>
                <span className="mt-3 block text-[0.86rem] font-semibold text-deep">
                  Open guide <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>

        <section className="mt-12 rounded-[16px] border border-brand-navy/15 bg-brand-navy px-5 py-7 text-white sm:px-7">
          <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
            <div>
              <h2 className="font-call text-[1.35rem] leading-[1.2]">
                Need the answer for a particular booking?
              </h2>
              <p className="mt-2 max-w-[58ch] text-[0.92rem] leading-[1.55] text-[#B7D0DB]">
                A guide explains the rule. The Booking Check applies the
                charted record to the ship and client in front of you.
              </p>
            </div>
            <Link
              href="/check"
              className="inline-block justify-self-start rounded-[10px] bg-white px-4 py-2.5 text-[0.9rem] font-semibold text-brand-navy no-underline hover:bg-[#EAF2F5]"
            >
              Run a Booking Check
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
