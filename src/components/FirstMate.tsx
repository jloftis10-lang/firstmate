"use client";

import { useEffect, useRef, useState } from "react";
import { blockStates, isCovered } from "@/lib/types";
import type {
  ClientProfile,
  Experience,
  Itinerary,
  Party,
  Seasick,
  Ship,
  CoveredShip,
} from "@/lib/types";
import { clientSummary, getRead } from "@/lib/engine";
import { sharePath } from "@/lib/share";
import { ReadCard } from "./ReadCard";
import { ClientSummary } from "./ClientSummary";
import { Sounding } from "./Sounding";
import { Wordmark } from "./Wordmark";
import { ShipPicker } from "./ShipPicker";
import { NoReadYet } from "./NoReadYet";

const PARTY_OPTIONS: { value: Party; label: string; readout: string }[] = [
  { value: "couple", label: "Couple", readout: "COUPLE" },
  { value: "family", label: "Family + kids", readout: "FAMILY +KIDS" },
  { value: "multigen", label: "Multigen / mobility", readout: "MULTIGEN/MOBILITY" },
  { value: "solo", label: "Solo", readout: "SOLO" },
];

const SEASICK_OPTIONS: { value: Seasick; label: string }[] = [
  { value: "no", label: "No" },
  { value: "yes", label: "Yes, prone to it" },
];

const EXPERIENCE_OPTIONS: { value: Experience; label: string }[] = [
  { value: "first", label: "First cruise" },
  { value: "seasoned", label: "Seasoned" },
];

const ITINERARY_OPTIONS: { value: Itinerary; label: string }[] = [
  { value: "port-heavy", label: "Port-heavy" },
  { value: "sea-days", label: "Lots of sea days" },
];

function Segmented<T extends string>({
  label,
  hint,
  options,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="mb-[22px]">
      <span className="mb-[9px] block font-readout text-[0.72rem] font-semibold tracking-[0.09em] uppercase text-ink-3">
        {label}
        {hint && (
          <span className="font-normal normal-case tracking-normal text-ink-3">
            {" "}
            {hint}
          </span>
        )}
      </span>
      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(o.value)}
              className={`cursor-pointer rounded-full border px-4 py-2.5 text-[0.94rem] font-medium transition-colors ${
                active
                  ? "border-deep bg-deep text-white"
                  : "border-line bg-surface text-ink-2 hover:border-ink-3"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function FirstMate({
  ships,
  emailEnabled,
}: {
  ships: Ship[];
  emailEnabled: boolean;
}) {
  // Default to a ship we can actually read, so the first run shows the product.
  const [shipId, setShipId] = useState(
    (ships.find((s) => s.content) ?? ships[0]).id,
  );
  const [party, setParty] = useState<Party>("couple");
  const [seasick, setSeasick] = useState<Seasick>("no");
  const [experience, setExperience] = useState<Experience>("first");
  const [itinerary, setItinerary] = useState<Itinerary>("port-heavy");

  const [result, setResult] = useState<ClientProfile | null>(null);
  const [sounding, setSounding] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function run() {
    const profile: ClientProfile = {
      shipId,
      party,
      seasick,
      experience,
      itinerary,
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setResult(profile);
      window.scrollTo(0, 0);
      return;
    }
    setSounding(true);
    timer.current = setTimeout(() => {
      setSounding(false);
      setResult(profile);
      window.scrollTo(0, 0);
    }, 1250);
  }

  function reset() {
    setResult(null);
    window.scrollTo(0, 0);
  }

  const ship = ships.find((s) => s.id === (result?.shipId ?? shipId))!;
  const coveredShips = ships.filter((s) => s.content);
  const coveredCount = coveredShips.length;
  // Signed end to end — all three blocks confirmed by an operator. The rest
  // carry researched content with the unsigned blocks marked, which is a
  // weaker and different claim, so the footer states both numbers.
  const signedCount = coveredShips.filter(
    (s) => blockStates(s.content!).allVerified,
  ).length;

  return (
    <div className="mx-auto max-w-[640px] px-5 pt-7 pb-20">
      {sounding && <Sounding />}

      {result === null ? (
        <section aria-label="Run a booking check">
          <Wordmark />

          <h1 className="mt-[22px] mb-1.5 max-w-[15ch] font-call text-[1.5rem] leading-[1.18] tracking-[-0.015em] sm:text-[1.72rem]">
            Before you book, know what you&apos;d{" "}
            <em className="font-medium text-deep">miss</em>.
          </h1>
          <p className="mb-[30px] max-w-[46ch] text-[0.98rem] text-ink-2">
            Tell me the ship and who&apos;s sailing. I&apos;ll flag what bites
            this booking — cabin, money, and the surprises that show up at the
            gangway — the way someone who sold these for a living would.
          </p>

          <ShipPicker ships={ships} value={shipId} onChange={setShipId} />

          <Segmented
            label="Who's traveling"
            options={PARTY_OPTIONS}
            value={party}
            onChange={setParty}
          />
          <Segmented
            label="Gets seasick?"
            hint="— changes the cabin call"
            options={SEASICK_OPTIONS}
            value={seasick}
            onChange={setSeasick}
          />
          <Segmented
            label="Cruise experience"
            options={EXPERIENCE_OPTIONS}
            value={experience}
            onChange={setExperience}
          />
          <Segmented
            label="Itinerary"
            options={ITINERARY_OPTIONS}
            value={itinerary}
            onChange={setItinerary}
          />

          <button
            type="button"
            onClick={run}
            className="mt-2.5 w-full cursor-pointer rounded-[13px] bg-go p-[17px] text-[1.04rem] font-semibold tracking-[0.005em] text-white shadow-[0_1px_2px_rgba(15,42,61,.05),0_8px_24px_rgba(15,42,61,.06)] transition-colors hover:bg-[#175A50] active:translate-y-px"
          >
            Run the check
          </button>

          <p className="mt-[34px] text-center text-[0.76rem] leading-[1.6] text-ink-3">
            {coveredCount} of {ships.length} ships carry a read so far. The rest
            are listed so you can find them, but they&apos;ll say plainly that
            they aren&apos;t charted yet rather than guess.
            <br />
            {/* Derived, not written down. An earlier version of this
                paragraph hard-coded the idea that some covered ships were
                still unconfirmed; the day every block got signed, the
                sentence became false and nothing caught it. Now the copy
                follows the data. */}
            {signedCount === coveredCount ? (
              <>
                Every one of them is signed off end to end &mdash; an operator
                has confirmed the cabin, money and trap calls against the
                current deck plans.
              </>
            ) : (
              <>
                {signedCount} are signed off end to end. The others are
                researched rather than confirmed, and every unsigned call is
                marked as such on the card it appears on.
              </>
            )}
          </p>
        </section>
      ) : isCovered(ship) ? (
        <ReadView
          ship={ship}
          client={result}
          onAgain={reset}
          emailEnabled={emailEnabled}
        />
      ) : (
        <NoReadYet
          ship={ship}
          covered={coveredShips}
          all={ships}
          onAgain={reset}
        />
      )}
    </div>
  );
}

function ReadView({
  ship,
  client,
  onAgain,
  emailEnabled,
}: {
  ship: CoveredShip;
  client: ClientProfile;
  onAgain: () => void;
  emailEnabled: boolean;
}) {
  const read = getRead(ship, client);
  const summary = clientSummary(ship, client);
  const { allVerified, anyVerified } = blockStates(ship.content);

  const bits = [
    ship.name.toUpperCase(),
    PARTY_OPTIONS.find((p) => p.value === client.party)!.readout,
  ];
  if (client.seasick === "yes") bits.push("MOTION-SENSITIVE");
  bits.push(client.experience === "first" ? "1ST CRUISE" : "SEASONED");
  bits.push(client.itinerary === "sea-days" ? "SEA DAYS" : "PORT-HEAVY");

  return (
    <section className="fm-rise" aria-label="The confidence read">
      <Wordmark />

      <div className="mb-[22px]">
        <div
          className="mb-2.5 font-readout text-[0.72rem] font-bold tracking-[0.1em] uppercase text-go"
          role="status"
        >
          {read.ineligible ? "Stop here" : "Read complete"}
        </div>
        <h1 className="font-call text-[1.5rem] leading-[1.2] tracking-[-0.01em]">
          {/* "Here's what to watch on this booking" is the wrong sentence
              above a notice saying the booking cannot be made. */}
          {read.ineligible
            ? "This one can't be booked as asked."
            : "Here's what to watch on this booking."}
        </h1>
        <p className="mt-3.5 rounded-[9px] border border-[#E3EAEC] bg-surface px-3 py-2.5 font-readout text-[0.72rem] leading-[1.7] tracking-[0.02em] text-ink-2">
          <span className="text-deep">◎</span>
          &nbsp; {bits.join("  ·  ")}
        </p>

        {/* Suppressed when the booking is blocked: the banner points at
            per-card markers, and no cards render in that state. */}
        {!allVerified && !read.ineligible && (
          <p className="mt-2.5 rounded-[9px] border border-signal bg-signal-bg px-3 py-2.5 text-[0.82rem] leading-[1.5] text-ink">
            <span className="mr-2 inline-block rounded-[5px] bg-signal px-1.5 py-[3px] font-readout text-[0.6rem] font-bold tracking-[0.08em] text-white align-[1px]">
              SAMPLE
            </span>
            {anyVerified
              ? `Parts of this read aren't signed off yet — look for the marker on each card below. Those sections are researched, not an operator's call.`
              : `Nothing in this read is signed off yet for the ${ship.name}. It's researched, not an operator's call you can act on.`}
          </p>
        )}
      </div>

      {/* The booking cannot happen. Rendering three cards of cabin and
          money advice underneath "this party cannot sail" would be worse
          than useless, so the read is replaced rather than annotated. */}
      {read.ineligible ? (
        <div className="mt-5 rounded-[13px] border border-signal bg-signal-bg p-5">
          <p className="font-readout text-[0.62rem] font-bold tracking-[0.09em] text-ink-3">
            00 &nbsp;·&nbsp; NOT A BOOKING THIS SHIP CAN TAKE
          </p>
          <p className="mt-2.5 text-[0.98rem] leading-[1.55] text-ink">
            {read.ineligible.reason}
          </p>
        </div>
      ) : (
        <>
      <ReadCard number="01" category="Cabin & deck" read={read.cabin} />
      <ReadCard number="02" category="Money surprises" read={read.money} />
      <ReadCard
        number="03"
        category="Expectation traps"
        read={read.traps}
        lineName={ship.line}
      />
        </>
      )}

      <ClientSummary
        text={summary}
        verified={allVerified}
        sharePath={sharePath(client)}
        client={client}
        emailEnabled={emailEnabled}
      />

      <button
        type="button"
        onClick={onAgain}
        className="mx-auto mt-[26px] block cursor-pointer rounded-[11px] border border-line px-[26px] py-[13px] text-[0.94rem] font-semibold text-ink-2 transition-colors hover:border-ink-3 hover:text-ink"
      >
        Run another booking
      </button>
    </section>
  );
}
