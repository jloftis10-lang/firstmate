import type { Metadata } from "next";
import Link from "next/link";
import { SHIPS } from "@/content/ships";
import { coveredShips, obstructedButUnexplained, obstructionUse } from "@/lib/guides";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ShipSection } from "@/components/ship/ShipSection";
import { ShipList, RuleCard } from "@/components/ship/GuideBits";

/**
 * OBSTRUCTED BALCONIES — the word that hides five different problems.
 *
 * The taxonomy is signed operator content and already drives the read;
 * what this page adds is the cross-cut. "Which hulls have a lifeboat
 * roof under the balcony" is a real advisor question and no other page
 * answers it.
 *
 * The unexplained count is rendered as prominently as the explained
 * ones. Twenty-one charted hulls are published as having obstructed
 * cabins with no mechanism established, and a guide that listed only the
 * mechanisms it knew would read as though the taxonomy were complete.
 */

export const metadata: Metadata = {
  title: "Obstructed balconies",
  description:
    "\"Obstructed\" is at least five different problems, and they lead to opposite advice. The taxonomy, what each one costs a client, and which charted hulls carry it.",
  alternates: { canonical: "/guides/obstructed-balconies" },
};

const EFFECT_COPY: Record<string, string> = {
  "horizon-lost": "The sea view is materially gone. This is the one people mean.",
  "downward-blocked":
    "Can't see straight down at the water; the horizon is untouched. A disclosure, not a veto.",
  "sky-blocked": "Permanent shade from above; the horizon survives.",
  "space-intrusion": "Structure physically occupies the balcony itself.",
  "privacy-reduced": "The view is fine. Other people can see in.",
};

export default function ObstructedBalconiesGuide() {
  const covered = coveredShips(SHIPS);
  const uses = obstructionUse(covered);
  const established = uses.filter((u) => u.ships.length > 0);
  const unmatched = uses.filter((u) => u.ships.length === 0);
  const unexplained = obstructedButUnexplained(covered);
  const withKinds = covered.filter(
    (s) => (s.content.cabin?.obstructionKinds?.length ?? 0) > 0,
  ).length;

  // Grouped by what the client actually loses, because that is what the
  // advice turns on — two mechanisms with the same effect get the same
  // recommendation and two with different effects get opposite ones.
  const byEffect = [...new Set(established.map((u) => u.kind.effect))];

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-[1180px] px-5 pt-6 pb-20 sm:px-8">
        <Breadcrumbs
          trail={[
            { label: "Guides", href: "/guides" },
            { label: "Obstructed balconies" },
          ]}
        />

        <header className="mb-9 max-w-[62ch]">
          <h1 className="font-call text-[2rem] leading-[1.1] tracking-[-0.02em] text-ink sm:text-[2.4rem]">
            One word, {uses.length} different problems
          </h1>
          <p className="mt-3.5 text-[1rem] leading-[1.6] text-ink-2">
            A steel bulkhead takes the horizon. A lifeboat roof takes the view
            straight down and leaves the horizon open. A public walkway takes
            the privacy and no view at all. All three arrive on a booking
            screen as &ldquo;obstructed&rdquo;, and they lead to opposite
            advice — one is a veto, one is a disclosure, one is a bargain for
            the right client.
          </p>
        </header>

        <div className="space-y-12">
          <ShipSection
            id="effects"
            number="01"
            title="What the client actually loses"
            lede="The cause is what is in the way. The effect is what it costs them — and the advice keys off the effect, not the cause."
          >
            <ul className="grid list-none gap-3 sm:grid-cols-2">
              {byEffect.map((effect) => (
                <li key={effect} className="rounded-[13px] border border-line bg-surface p-4">
                  <h3 className="font-call text-[1.08rem] leading-[1.3] text-ink">
                    {effect.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase())}
                  </h3>
                  <p className="mt-1.5 max-w-[52ch] text-[0.92rem] leading-[1.6] text-ink-2">
                    {EFFECT_COPY[effect] ?? ""}
                  </p>
                  <p className="mt-2 font-readout text-[0.62rem] tracking-[0.05em] text-ink-3">
                    {established.filter((u) => u.kind.effect === effect).length}{" "}
                    mechanism
                    {established.filter((u) => u.kind.effect === effect).length === 1
                      ? ""
                      : "s"}
                  </p>
                </li>
              ))}
            </ul>
          </ShipSection>

          <ShipSection
            id="kinds"
            number="02"
            title="What is actually in the way, and where"
            lede="Established on a hull only where the mechanism is known. Several are one line's geometry and appear nowhere else."
          >
            <div className="space-y-3">
              {established.map((u) => (
                <RuleCard
                  key={u.kind.id}
                  title={u.kind.cause.charAt(0).toUpperCase() + u.kind.cause.slice(1)}
                  badge={u.kind.effect.replace(/-/g, " ")}
                  body={u.kind.experience.charAt(0).toUpperCase() + u.kind.experience.slice(1) + "."}
                  ships={u.ships}
                />
              ))}
            </div>

            {unmatched.length > 0 && (
              <div className="mt-6 rounded-[13px] border border-dashed border-line bg-surface/50 p-4">
                <h3 className="mb-1.5 font-call text-[1.05rem] leading-[1.3] text-ink-2">
                  {unmatched.length} in the taxonomy, not yet matched to a hull
                </h3>
                <p className="max-w-[62ch] text-[0.9rem] leading-[1.55] text-ink-3">
                  {unmatched.map((u) => u.kind.cause).join("; ")}. Rendered
                  rather than dropped: an unexercised entry says the taxonomy
                  is ahead of the coverage, and a page listing only the
                  matched ones would read as though it were complete.
                </p>
              </div>
            )}
          </ShipSection>

          <ShipSection
            id="unexplained"
            number="03"
            title="Obstructed, mechanism unknown"
            lede="The most useful number on this page, and the least satisfying."
            empty={
              unexplained.length === 0
                ? "Every hull recorded as having obstructed cabins also has the mechanism established."
                : undefined
            }
          >
            <div className="space-y-4">
              <p className="max-w-[62ch] text-[0.96rem] leading-[1.65] text-ink-2">
                {withKinds} charted hulls have a mechanism on record.{" "}
                <strong className="font-semibold text-ink">
                  {unexplained.length} are published as having obstructed
                  cabins without saying by what
                </strong>
                , and those render as exactly that. Filling the field in with
                the likeliest cause would defeat the point of having it: the
                whole reason to separate cause from effect is that the wrong
                cause produces confidently wrong advice.
              </p>
              <p className="max-w-[62ch] text-[0.94rem] leading-[1.6] text-ink-2">
                On these, read the deck plan for the specific cabin rather than
                the category. The ship pages carry whatever the line does say
                about which cabins, which is often more useful than the
                mechanism anyway.
              </p>
              <ShipList ships={unexplained} />
            </div>
          </ShipSection>

          <ShipSection
            id="rules"
            number="04"
            title="Three things that catch advisors"
            lede="Drawn from what the records repeatedly have to correct."
          >
            <ul className="grid list-none gap-3 sm:grid-cols-3">
              {[
                {
                  t: "Don't inherit cabin numbers between sisters",
                  b: "Several records say explicitly that a documented obstructed pair on one hull does not reproduce on its sister — different numbers, or not established at all. That is a finding, and carrying the numbers across erases it.",
                },
                {
                  t: "Down-blocked is not view-blocked",
                  b: "A roof below the rail costs the view straight down at the water and leaves the outward sea view open. Selling that as \"obstructed balcony\" loses a booking that would have been perfectly happy.",
                },
                {
                  t: "Privacy is an obstruction too",
                  b: "A balcony overlooked from a public deck has a fine view and no privacy. It is the one kind a client never thinks to ask about and always notices.",
                },
              ].map((x) => (
                <li key={x.t} className="rounded-[13px] border border-line bg-surface p-4">
                  <h3 className="font-call text-[1.05rem] leading-[1.3] text-ink">{x.t}</h3>
                  <p className="mt-2 max-w-[52ch] text-[0.9rem] leading-[1.6] text-ink-2">{x.b}</p>
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-[62ch] text-[0.96rem] leading-[1.65] text-ink-2">
              Every ship page carries its own obstruction section with what the
              line publishes and which cabins.{" "}
              <Link
                href="/compare"
                className="font-semibold text-deep underline decoration-line underline-offset-2"
              >
                Compare two hulls
              </Link>{" "}
              to see where a class agrees and where it does not.
            </p>
          </ShipSection>
        </div>
      </div>
    </main>
  );
}
