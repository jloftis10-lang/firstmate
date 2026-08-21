"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import type {
  ClientProfile,
  Experience,
  Itinerary,
  Party,
  Seasick,
  ShipContent,
  CoveredShip,
} from "@/lib/types";
import { blockStates } from "@/lib/types";
import type { CatalogShip } from "@/lib/check-catalog";
import { withContent } from "@/lib/check-catalog";
import { isShipContentCached, loadShipContent } from "@/lib/ship-content";
import { clientSummary, getRead } from "@/lib/engine";
import { checkPath, parseShare, sharePath } from "@/lib/share";
import { shipPath } from "@/lib/nav";
import { currentSearch, pushUrl, serverSearch, subscribeToUrl } from "@/lib/url-state";
import { track } from "@/lib/analytics";
import { ReadCard } from "./ReadCard";
import { shipProvenance } from "@/lib/provenance";
import { ClientSummary } from "./ClientSummary";
import { Sounding } from "./Sounding";
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
  lineHrefs = {},
}: {
  /**
   * IDENTITY ONLY. The engine runs in the browser, so this used to be
   * handed every ship record — 906 KB of HTML on the page an advisor
   * opens mid-call, 98% of it unread until a hull is picked, and growing
   * about 12 KB with every ship added to the coverage. The one record
   * being read is fetched instead; see `src/lib/check-catalog.ts`.
   */
  ships: CatalogShip[];
  emailEnabled: boolean;
  /**
   * Line name to line-page URL, for the lines that have a page.
   *
   * Passed in rather than derived here. `LINE_RECORDS` is the authority
   * on which lines have a page and it pulls the whole policy corpus in
   * with it — every fleet trap, every package note — which has no
   * business in the client bundle of a form. Three strings do.
   */
  lineHrefs?: Record<string, string>;
}) {
  // THE URL IS THE STATE — see `src/lib/url-state.ts`.
  //
  // A run used to live in a `useState` no URL described, which made it
  // un-bookmarkable, un-sendable, and invisible to the back button: an
  // advisor who ran a check, clicked through to the ship page and
  // pressed back landed on an empty form and answered five questions
  // again. The five params are the same ones `/share` has always used.
  const search = useSyncExternalStore(
    subscribeToUrl,
    currentSearch,
    serverSearch,
  );
  const params = useMemo(
    () => Object.fromEntries(new URLSearchParams(search)),
    [search],
  );

  // A COMPLETE, VALID profile means results; anything less means the
  // form. `parseShare` returns null on a partial or malformed query, and
  // a ship id that is not in the catalog is treated the same way — a
  // stale link must land an advisor on the form, never on a crash. The
  // old code asserted the ship was findable, which was true only while
  // the id could only come from the picker.
  const byId = useMemo(
    () => new Map(ships.map((s) => [s.id, s])),
    [ships],
  );

  const result = useMemo(() => {
    const parsed = parseShare(params);
    if (!parsed) return null;
    return byId.has(parsed.shipId) ? parsed : null;
  }, [params, byId]);

  // Default to a ship we can actually read, so the first run shows the product.
  const fallbackShip = (ships.find((s) => s.charted) ?? ships[0]).id;
  // What the advisor has changed on the form. Empty until they touch it,
  // so a linked ship or a profile they came back from wins by default.
  const [draft, setDraft] = useState<Partial<ClientProfile>>({});

  // `/check?ship=<id>` — how a ship page hands a hull to the check
  // without answering the other four questions for the advisor. An
  // unknown id falls through to the default: a link naming a ship we
  // cannot read must not blank the picker.
  const linkedShip =
    params.ship && byId.has(params.ship) ? params.ship : undefined;

  const shipId = draft.shipId ?? linkedShip ?? fallbackShip;
  const party = draft.party ?? "couple";
  const seasick = draft.seasick ?? "no";
  const experience = draft.experience ?? "first";
  const itinerary = draft.itinerary ?? "port-heavy";

  const setShipId = (shipId: string) => setDraft((d) => ({ ...d, shipId }));
  const setParty = (party: Party) => setDraft((d) => ({ ...d, party }));
  const setSeasick = (seasick: Seasick) => setDraft((d) => ({ ...d, seasick }));
  const setExperience = (experience: Experience) =>
    setDraft((d) => ({ ...d, experience }));
  const setItinerary = (itinerary: Itinerary) =>
    setDraft((d) => ({ ...d, itinerary }));

  const [sounding, setSounding] = useState(false);
  // Records fetched so far, keyed by ship. The module-level cache in
  // `ship-content.ts` dedupes the requests; this is what React renders
  // from, so a load has to land in state as well.
  const [contents, setContents] = useState<Record<string, ShipContent>>({});
  // The ship whose record would not load. Held rather than thrown: a
  // failed fetch on a bad connection is something to retry, not an
  // error page.
  const [loadFailed, setLoadFailed] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const remember = (id: string, content: ShipContent) =>
    setContents((prev) => (prev[id] ? prev : { ...prev, [id]: content }));

  // WARM THE RECORD AS SOON AS A HULL IS CHOSEN.
  //
  // The advisor picks the ship and then answers four more questions,
  // which is several seconds of a fetch that takes one. By the time they
  // press the button the record is almost always there, which is what
  // makes the split invisible rather than a wait. Fire and forget: a
  // failure here is not reported, because `run` will try again and it is
  // the one that can tell them.
  //
  // CHOSEN OR LINKED, NEVER THE FALLBACK — and that distinction is not
  // pedantry. `useSyncExternalStore` hands back the empty query during
  // hydration and the real one on the pass after, so for one committed
  // render `shipId` is the default hull. Warming on `shipId` therefore
  // fetched the first covered ship's record on every single page load,
  // including every arrival on a link for a different ship. Warming only
  // what somebody actually asked for costs nothing when nobody has.
  const intendedShip = draft.shipId ?? linkedShip;
  useEffect(() => {
    if (!intendedShip) return;
    const ship = byId.get(intendedShip);
    if (!ship?.charted || isShipContentCached(intendedShip)) return;
    let live = true;
    void loadShipContent(intendedShip).then(
      (content) => {
        if (live) remember(intendedShip, content);
      },
      () => {},
    );
    return () => {
      live = false;
    };
  }, [intendedShip, byId]);

  // ARRIVING ON A LINK is the other way a read gets asked for, and there
  // is no button press to hang a fetch on. `run` handles its own; this
  // covers a shared URL, a bookmark and the forward button.
  useEffect(() => {
    const id = result?.shipId;
    if (!id || !byId.get(id)?.charted || contents[id]) return;
    let live = true;
    loadShipContent(id).then(
      (content) => {
        if (live) remember(id, content);
      },
      () => {
        if (live) setLoadFailed(id);
      },
    );
    return () => {
      live = false;
    };
  }, [result, contents, byId]);

  function show(profile: ClientProfile) {
    // The demand signal — see `src/lib/analytics.ts`. Ship id and whether
    // it is charted, and nothing about the traveller: the party and the
    // seasickness answer are facts about a real person and the question
    // "which hulls do advisors ask for" does not need them. Sends
    // nothing unless an endpoint is configured.
    const charted = Boolean(byId.get(profile.shipId)?.charted);
    track({ name: "check.run", ship: profile.shipId, charted });
    if (!charted) track({ name: "check.uncharted", ship: profile.shipId });

    pushUrl(checkPath(profile));
    window.scrollTo(0, 0);
  }

  /**
   * Run the check: fetch the record and play the sounding at the same
   * time, and navigate only when both are done.
   *
   * Waiting for both rather than navigating first is what keeps the
   * split from being visible. It also puts the failure in the right
   * place: a record that will not load leaves the advisor on the form
   * with a message and their answers intact, rather than on a read page
   * that cannot render one.
   */
  async function run() {
    const profile: ClientProfile = {
      shipId,
      party,
      seasick,
      experience,
      itinerary,
    };
    setLoadFailed(null);

    const ship = byId.get(shipId);
    const needed =
      ship?.charted && !contents[shipId]
        ? loadShipContent(shipId)
        : Promise.resolve(null);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const settle = reduce
      ? Promise.resolve()
      : new Promise<void>((resolve) => {
          timer.current = setTimeout(resolve, 1250);
        });
    if (!reduce) setSounding(true);

    try {
      const [content] = await Promise.all([needed, settle]);
      if (content) remember(shipId, content);
      setSounding(false);
      show(profile);
    } catch {
      setSounding(false);
      setLoadFailed(shipId);
    }
  }

  function reset() {
    // Seed the form from the run being left, so an advisor who arrived on
    // a link and wants to change one answer does not start from defaults.
    if (result) setDraft(result);
    pushUrl("/check");
    window.scrollTo(0, 0);
  }

  const ship = byId.get(result?.shipId ?? shipId)!;
  const coveredShips = ships.filter((s) => s.charted);
  const coveredCount = coveredShips.length;
  // Signed end to end — all three blocks confirmed by an operator. The rest
  // carry researched content with the unsigned blocks marked, which is a
  // weaker and different claim, so the footer states both numbers.
  const signedCount = coveredShips.filter((s) => s.signed).length;

  // What the read view can be handed right now. Null while the record is
  // still in the air, which is the one state this split introduced.
  const loaded = result ? contents[result.shipId] : undefined;

  // The shell is wide; this column is not. A five-question form and a
  // column of prose want a reading measure, so the Booking Check keeps one
  // while the platform pages around it get the full 1180. Widening this
  // would make the check worse, not better.
  return (
    <div className="mx-auto max-w-[640px] px-5 pt-7 pb-20 sm:px-8">
      {sounding && <Sounding />}

      {result === null ? (
        <section aria-label="Run a booking check">

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
            disabled={sounding}
            className="mt-2.5 w-full cursor-pointer rounded-[13px] bg-go p-[17px] text-[1.04rem] font-semibold tracking-[0.005em] text-white shadow-[0_1px_2px_rgba(15,42,61,.05),0_8px_24px_rgba(15,42,61,.06)] transition-colors hover:bg-[#175A50] active:translate-y-px disabled:cursor-wait"
          >
            Run the check
          </button>

          {/* The record would not load. The advisor stays on the form with
              their five answers intact and a button that will try again —
              a failed fetch on a hotel connection is a retry, not an
              error page. Nothing about the booking is lost. */}
          {loadFailed && (
            <p
              role="alert"
              className="mt-3 rounded-[11px] border border-signal bg-signal-bg px-3.5 py-3 text-[0.9rem] leading-[1.55] text-ink"
            >
              Couldn&apos;t load the record for the{" "}
              {byId.get(loadFailed)?.name ?? "ship"} — that&apos;s a connection
              problem on our side, not a gap in the coverage. Your answers are
              still here; press the button again.
            </p>
          )}

          <p className="mt-[34px] text-center text-[0.76rem] leading-[1.6] text-ink-3">
            {/* The directory exists now, so the sentence that describes
                coverage points at the page that shows it. */}
            <Link
              href="/ships"
              className="text-deep underline decoration-line underline-offset-2 hover:decoration-deep"
            >
              {coveredCount} of {ships.length} ships
            </Link>{" "}
            carry a read so far. The rest are listed so you can find them, but
            they&apos;ll say plainly that they aren&apos;t charted yet rather
            than guess.
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
      ) : !ship.charted ? (
        // No record to wait for — the uncharted screen needs identity
        // only, which is already here.
        <NoReadYet
          ship={ship}
          covered={coveredShips}
          all={ships}
          lineHrefs={lineHrefs}
          onAgain={reset}
        />
      ) : loaded ? (
        <ReadView
          ship={withContent(ship, loaded)}
          client={result}
          onAgain={reset}
          emailEnabled={emailEnabled}
        />
      ) : (
        // ARRIVED ON A LINK and the record is still in the air. Running
        // the check from the form never lands here — `run` waits for the
        // fetch and the sounding together before it navigates — so this
        // is a shared URL, a bookmark or the forward button, and it is
        // usually a single frame.
        <LoadingRead
          shipName={ship.name}
          failed={loadFailed === ship.id}
          onRetry={() => {
            setLoadFailed(null);
            void loadShipContent(ship.id).then(
              (content) => remember(ship.id, content),
              () => setLoadFailed(ship.id),
            );
          }}
        />
      )}
    </div>
  );
}

/**
 * The record is on its way, or it did not arrive.
 *
 * Quiet on purpose. This is a frame or two on a good connection and the
 * advisor did not ask for a status report — but it says which ship, so
 * that on a slow one it reads as a wait rather than as a blank page.
 *
 * The failure copy separates the two things an advisor would otherwise
 * conflate: the network did not deliver a record that exists, which is
 * nothing like the hull being uncharted. Getting that wrong would turn a
 * dropped connection into a false claim about coverage.
 */
function LoadingRead({
  shipName,
  failed,
  onRetry,
}: {
  shipName: string;
  failed: boolean;
  onRetry: () => void;
}) {
  return (
    <section className="fm-rise" aria-label="Loading the read">
      <div
        className="mb-2.5 font-readout text-[0.72rem] font-bold tracking-[0.1em] uppercase text-ink-3"
        role="status"
      >
        {failed ? "Couldn't load it" : "Reading the record"}
      </div>
      <h1 className="font-call text-[1.5rem] leading-[1.2] tracking-[-0.01em]">
        {failed ? `The ${shipName} record didn't load.` : `Pulling the ${shipName}.`}
      </h1>
      {failed && (
        <>
          <p className="mt-3.5 max-w-[52ch] text-[0.96rem] leading-[1.6] text-ink-2">
            That&apos;s a connection problem rather than a gap in the coverage
            — this hull is charted and the read is there.
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-5 cursor-pointer rounded-[11px] border border-line px-[26px] py-[13px] text-[0.94rem] font-semibold text-ink-2 transition-colors hover:border-ink-3 hover:text-ink"
          >
            Try again
          </button>
        </>
      )}
    </section>
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
  // Derived in one place; the cards no longer decide for themselves.
  const prov = shipProvenance(ship.content);
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

        {/* Out to the reference view. The read answers this booking; the
            ship page answers the hull, and an advisor quoting a second
            client on the same ship wants the second one. Rendered for
            covered ships only, which is all ReadView ever receives — the
            uncovered path is NoReadYet and there is no page to point at. */}
        <p className="mt-2">
          <Link
            href={shipPath(ship.id)}
            className="font-readout text-[0.7rem] tracking-[0.05em] uppercase text-deep underline decoration-line underline-offset-[3px] hover:decoration-deep"
          >
            Everything we know about {ship.name} &rarr;
          </Link>
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
      <ReadCard number="01" category="Cabin & deck" read={read.cabin} provenance={prov.cabin} />
      <ReadCard number="02" category="Money surprises" read={read.money} provenance={prov.money} />
      <ReadCard
        number="03"
        category="Expectation traps"
        read={read.traps}
        provenance={prov.traps}
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
