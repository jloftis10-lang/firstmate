"use client";

import { useState } from "react";

type SubmitState =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "error"; message: string };

function mailtoRequest({
  destination,
  ship,
  line,
  name,
  email,
  note,
}: {
  destination: string;
  ship: string;
  line: string;
  name: string;
  email: string;
  note: string;
}) {
  const subject = `CruiseRead ship request: ${ship}`;
  const body = [
    `Ship: ${ship}`,
    `Cruise line: ${line}`,
    name ? `Advisor name: ${name}` : "",
    email ? `Advisor email: ${email}` : "",
    note ? `\nWhy this one matters:\n${note}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return `mailto:${destination}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function ShipRequestForm({
  emailEnabled,
  destination,
  initialShip,
  initialLine,
}: {
  emailEnabled: boolean;
  destination: string;
  initialShip: string;
  initialLine: string;
}) {
  const [ship, setShip] = useState(initialShip);
  const [line, setLine] = useState(initialLine);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<SubmitState>({ kind: "idle" });

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ kind: "sending" });

    const request = { ship, line, name, email, note, website };
    if (!emailEnabled) {
      window.location.href = mailtoRequest({ destination, ...request });
      setState({ kind: "idle" });
      return;
    }

    try {
      const response = await fetch("/api/request-ship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      if (response.ok) {
        setState({ kind: "sent" });
        setNote("");
        return;
      }

      const data = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      if (response.status === 503) {
        window.location.href = mailtoRequest({ destination, ...request });
        setState({ kind: "idle" });
        return;
      }
      setState({
        kind: "error",
        message: data?.error ?? "The request did not go through. Try again in a moment.",
      });
    } catch {
      setState({
        kind: "error",
        message: "The request did not go through. Try again in a moment.",
      });
    }
  }

  if (state.kind === "sent") {
    return (
      <div className="rounded-[14px] border border-go/40 bg-go-bg p-5" role="status">
        <p className="font-call text-[1.2rem] leading-[1.35] text-ink">
          Request received.
        </p>
        <p className="mt-2 text-[0.9rem] leading-[1.55] text-ink-2">
          {ship} is now in the advisor-request queue. A request helps set the
          research order; it does not mean a read is ready yet.
        </p>
        <button
          type="button"
          onClick={() => setState({ kind: "idle" })}
          className="mt-4 cursor-pointer border-0 bg-transparent p-0 text-[0.86rem] font-semibold text-deep underline decoration-line underline-offset-2"
        >
          Request another ship
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-[16px] border border-line bg-surface p-5 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[0.82rem] font-semibold text-ink">Ship</span>
          <input
            required
            maxLength={120}
            value={ship}
            onChange={(event) => setShip(event.target.value)}
            placeholder="Ship name"
            className="w-full rounded-[10px] border border-line bg-white px-3.5 py-3 text-[0.94rem] text-ink placeholder:text-ink-3"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[0.82rem] font-semibold text-ink">Cruise line</span>
          <input
            required
            maxLength={100}
            value={line}
            onChange={(event) => setLine(event.target.value)}
            placeholder="Cruise line"
            className="w-full rounded-[10px] border border-line bg-white px-3.5 py-3 text-[0.94rem] text-ink placeholder:text-ink-3"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[0.82rem] font-semibold text-ink">
            Your name <span className="font-normal text-ink-3">(optional)</span>
          </span>
          <input
            maxLength={100}
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-[10px] border border-line bg-white px-3.5 py-3 text-[0.94rem] text-ink"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[0.82rem] font-semibold text-ink">
            Your email <span className="font-normal text-ink-3">(optional)</span>
          </span>
          <input
            type="email"
            maxLength={254}
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-[10px] border border-line bg-white px-3.5 py-3 text-[0.94rem] text-ink"
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-[0.82rem] font-semibold text-ink">
          Why this ship matters <span className="font-normal text-ink-3">(optional)</span>
        </span>
        <textarea
          maxLength={800}
          rows={4}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="For example: how often you book it or the booking question you keep running into."
          className="w-full resize-y rounded-[10px] border border-line bg-white px-3.5 py-3 text-[0.94rem] leading-[1.5] text-ink placeholder:text-ink-3"
        />
      </label>

      <label className="sr-only" aria-hidden="true">
        Website
        <input
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </label>

      <button
        type="submit"
        disabled={state.kind === "sending"}
        className="mt-5 cursor-pointer rounded-[10px] border-0 bg-go px-5 py-3 text-[0.94rem] font-semibold text-white transition-colors hover:bg-[#175A50] disabled:cursor-wait disabled:opacity-60"
      >
        {state.kind === "sending" ? "Sending request…" : "Request this ship"}
      </button>
      <p className="mt-3 max-w-[62ch] text-[0.78rem] leading-[1.5] text-ink-3" aria-live="polite">
        {state.kind === "error"
          ? state.message
          : emailEnabled
            ? "Sent directly to CruiseRead. Your contact details are used only to follow up on this request."
            : "This opens a pre-filled email to CruiseRead; the site does not store your details."}
      </p>
    </form>
  );
}
