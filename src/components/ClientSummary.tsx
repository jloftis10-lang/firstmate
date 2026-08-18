"use client";

import { useEffect, useRef, useState } from "react";

import type { ClientProfile } from "@/lib/types";
import { shareParams } from "@/lib/share";

type Props = {
  text: string;
  /** When false, the advisor is warned before they send this to a client. */
  verified: boolean;
  /** Relative path to the client-facing share page for this booking. */
  sharePath: string;
  /** The booking, so the email route can rebuild the summary server-side. */
  client: ClientProfile;
  /**
   * Whether this deployment has email configured. When false the option
   * isn't offered at all — showing it would walk the advisor through
   * typing an address only to be told the feature is off.
   */
  emailEnabled: boolean;
};

export function ClientSummary({
  text,
  verified,
  sharePath,
  client,
  emailEnabled,
}: Props) {
  const [done, setDone] = useState<"text" | "link" | null>(null);
  const [emailOpen, setEmailOpen] = useState(false);
  const [to, setTo] = useState("");
  const [sendState, setSendState] = useState<
    { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string }
  >({ kind: "idle" });
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setSendState({ kind: "sending" });
    try {
      const res = await fetch("/api/send-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to,
          ...Object.fromEntries(shareParams(client)),
        }),
      });
      if (res.ok) {
        setSendState({ kind: "sent" });
        setTo("");
        return;
      }
      const data = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;
      setSendState({
        kind: "error",
        message: data?.error ?? "The email didn't go through. Try again in a moment.",
      });
    } catch {
      setSendState({
        kind: "error",
        message: "The email didn't go through. Try again in a moment.",
      });
    }
  }

  async function copy(value: string, kind: "text" | "link") {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard can be blocked (insecure context, denied permission).
      // The text stays on screen and selectable, so the advisor is not stuck.
      return;
    }
    setDone(kind);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setDone(null), 1800);
  }

  return (
    <div className="my-[22px] mb-2 rounded-2xl bg-deep px-5 py-[22px] text-[#EAF2F5]">
      <h3 className="mb-1.5 font-readout text-[0.72rem] font-bold tracking-[0.09em] uppercase text-[#9EC4D4]">
        Client-ready summary
      </h3>
      <p className="mb-[15px] text-[0.86rem] leading-[1.45] text-[#B7D0DB]">
        The bit you send the client — so you sound like you&apos;ve sailed it a
        hundred times.
      </p>

      <p className="rounded-[11px] border border-white/12 bg-white/8 p-[15px] font-call text-[0.95rem] leading-[1.6] text-[#F1F7F9]">
        {text}
      </p>

      {!verified && (
        <p className="mt-3 rounded-[9px] border border-signal/50 bg-signal/15 px-3 py-2.5 text-[0.8rem] leading-[1.45] text-[#F6E4CB]">
          This ship&apos;s content is unverified sample data. Check it against
          what you know before you send this to a client.
        </p>
      )}

      <div className="mt-[13px] flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => copy(text, "text")}
          aria-live="polite"
          className={`flex-1 cursor-pointer rounded-[11px] border-none p-[13px] text-[0.94rem] font-semibold transition-colors ${
            done === "text"
              ? "bg-go text-white"
              : "bg-[#EAF2F5] text-deep hover:bg-white"
          }`}
        >
          {done === "text" ? "Copied ✓" : "Copy the text"}
        </button>
        <button
          type="button"
          onClick={() =>
            copy(new URL(sharePath, window.location.origin).toString(), "link")
          }
          aria-live="polite"
          className={`flex-1 cursor-pointer rounded-[11px] border p-[13px] text-[0.94rem] font-semibold transition-colors ${
            done === "link"
              ? "border-go bg-go text-white"
              : "border-[#EAF2F5]/40 bg-transparent text-[#EAF2F5] hover:border-[#EAF2F5]"
          }`}
        >
          {done === "link" ? "Link copied ✓" : "Copy a link to send"}
        </button>
      </div>
      <p className="mt-2 text-[0.76rem] leading-[1.5] text-[#9EC4D4]">
        The link opens a clean page with just this note on it — no flags, no
        shop talk.
      </p>

      {!emailEnabled ? null : !emailOpen ? (
        <button
          type="button"
          onClick={() => setEmailOpen(true)}
          className="mt-3 cursor-pointer border-none bg-transparent p-0 font-readout text-[0.72rem] font-bold tracking-[0.05em] uppercase text-[#9EC4D4] hover:text-[#EAF2F5]"
        >
          Or email it to them →
        </button>
      ) : (
        <form onSubmit={send} className="mt-3">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              required
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="client@example.com"
              aria-label="Client's email address"
              className="flex-1 rounded-[11px] border border-[#EAF2F5]/40 bg-white/10 px-4 py-3 text-[0.94rem] text-[#F1F7F9] placeholder-[#9EC4D4] outline-none focus:border-[#EAF2F5]"
            />
            <button
              type="submit"
              disabled={sendState.kind === "sending"}
              className={`cursor-pointer rounded-[11px] border-none px-6 py-3 text-[0.94rem] font-semibold transition-colors disabled:opacity-60 ${
                sendState.kind === "sent"
                  ? "bg-go text-white"
                  : "bg-[#EAF2F5] text-deep hover:bg-white"
              }`}
            >
              {sendState.kind === "sending"
                ? "Sending…"
                : sendState.kind === "sent"
                  ? "Sent ✓"
                  : "Send"}
            </button>
          </div>
          <p className="mt-2 text-[0.76rem] leading-[1.5] text-[#9EC4D4]" aria-live="polite">
            {sendState.kind === "error"
              ? sendState.message
              : sendState.kind === "sent"
                ? "On its way. It reads exactly like the link page."
                : "Sends this note from First Mate, exactly as it reads above."}
          </p>
        </form>
      )}
    </div>
  );
}
