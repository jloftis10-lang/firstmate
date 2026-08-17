"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  text: string;
  /** When false, the advisor is warned before they send this to a client. */
  verified: boolean;
};

export function ClientSummary({ text, verified }: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard can be blocked (insecure context, denied permission).
      // The text stays on screen and selectable, so the advisor is not stuck.
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
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

      <button
        type="button"
        onClick={copy}
        aria-live="polite"
        className={`mt-[13px] w-full cursor-pointer rounded-[11px] border-none p-[13px] text-[0.94rem] font-semibold transition-colors ${
          copied
            ? "bg-go text-white"
            : "bg-[#EAF2F5] text-deep hover:bg-white"
        }`}
      >
        {copied ? "Copied ✓" : "Copy for the client"}
      </button>
    </div>
  );
}
