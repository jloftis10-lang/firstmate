"use client";

import { useState } from "react";

const PLANS = ["Founding Pro", "Agency"] as const;
type Plan = (typeof PLANS)[number];

type SubmitState =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "error"; message: string };

function mailtoInterest({
  destination,
  plan,
  name,
  email,
  company,
  advisorCount,
  note,
}: {
  destination: string;
  plan: Plan;
  name: string;
  email: string;
  company: string;
  advisorCount: string;
  note: string;
}) {
  const subject = `CruiseRead pricing interest: ${plan}`;
  const body = [
    `Plan: ${plan}`,
    `Name: ${name}`,
    `Email: ${email}`,
    company ? `Agency or company: ${company}` : "",
    advisorCount ? `Advisor seats: ${advisorCount}` : "",
    note ? `\nWhat would make CruiseRead useful:\n${note}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return `mailto:${destination}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function PricingInterestForm({
  emailEnabled,
  destination,
}: {
  emailEnabled: boolean;
  destination: string;
}) {
  const [plan, setPlan] = useState<Plan>("Founding Pro");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [advisorCount, setAdvisorCount] = useState("");
  const [note, setNote] = useState("");
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<SubmitState>({ kind: "idle" });

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ kind: "sending" });

    const interest = {
      plan,
      name,
      email,
      company,
      advisorCount,
      note,
      website,
    };
    if (!emailEnabled) {
      window.location.href = mailtoInterest({ destination, ...interest });
      setState({ kind: "idle" });
      return;
    }

    try {
      const response = await fetch("/api/pricing-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(interest),
      });

      if (response.ok) {
        setState({ kind: "sent" });
        return;
      }

      const data = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      if (response.status === 503) {
        window.location.href = mailtoInterest({ destination, ...interest });
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
          You&apos;re on the interest list.
        </p>
        <p className="mt-2 text-[0.9rem] leading-[1.55] text-ink-2">
          CruiseRead will use your note to shape the paid plan and will contact
          you before any billing begins. This form did not start a subscription.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-[16px] border border-line bg-surface p-5 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[0.82rem] font-semibold text-ink">Plan</span>
          <select
            value={plan}
            onChange={(event) => setPlan(event.target.value as Plan)}
            className="w-full rounded-[10px] border border-line bg-white px-3.5 py-3 text-[0.94rem] text-ink"
          >
            {PLANS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[0.82rem] font-semibold text-ink">Your name</span>
          <input
            required
            maxLength={100}
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-[10px] border border-line bg-white px-3.5 py-3 text-[0.94rem] text-ink"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[0.82rem] font-semibold text-ink">Email</span>
          <input
            required
            type="email"
            maxLength={254}
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-[10px] border border-line bg-white px-3.5 py-3 text-[0.94rem] text-ink"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[0.82rem] font-semibold text-ink">
            Agency or company <span className="font-normal text-ink-3">(optional)</span>
          </span>
          <input
            maxLength={120}
            autoComplete="organization"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            className="w-full rounded-[10px] border border-line bg-white px-3.5 py-3 text-[0.94rem] text-ink"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-[0.82rem] font-semibold text-ink">
            Number of advisors <span className="font-normal text-ink-3">(optional)</span>
          </span>
          <input
            type="number"
            min={1}
            max={999}
            inputMode="numeric"
            value={advisorCount}
            onChange={(event) => setAdvisorCount(event.target.value)}
            className="w-full rounded-[10px] border border-line bg-white px-3.5 py-3 text-[0.94rem] text-ink sm:max-w-[14rem]"
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-[0.82rem] font-semibold text-ink">
          What would make CruiseRead useful? <span className="font-normal text-ink-3">(optional)</span>
        </span>
        <textarea
          maxLength={1000}
          rows={4}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="The checks you repeat, the output you share, or the change you need tracked."
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
        {state.kind === "sending" ? "Sending…" : "Request founding access"}
      </button>
      <p className="mt-3 max-w-[62ch] text-[0.78rem] leading-[1.5] text-ink-3" aria-live="polite">
        {state.kind === "error"
          ? state.message
          : emailEnabled
            ? "No card required. This records your interest; it does not start a subscription."
            : "This opens a pre-filled email to CruiseRead; the site does not store your details."}
      </p>
    </form>
  );
}
