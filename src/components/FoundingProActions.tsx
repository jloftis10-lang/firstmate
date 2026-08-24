"use client";

import Link from "next/link";
import { useState } from "react";
import type { ClientProfile } from "@/lib/types";
import {
  formatStoredDate,
  profileDescription,
  savedCheckId,
  type SavedCheck,
} from "@/lib/pro";
import { upsertSavedCheck, useProWorkspace } from "@/lib/pro-workspace";

type Props = {
  client: ClientProfile;
  shipName: string;
  line: string;
  summary: string;
  verified: boolean;
  researchFingerprint: string;
  researchChecked?: string;
};

export function FoundingProActions({
  client,
  shipName,
  line,
  summary,
  verified,
  researchFingerprint,
  researchChecked,
}: Props) {
  const workspace = useProWorkspace();
  const id = savedCheckId(client);
  const existing = workspace.checks.find((check) => check.id === id);
  const [label, setLabel] = useState("");
  const [message, setMessage] = useState<"saved" | "error" | null>(null);

  function save() {
    const check: SavedCheck = {
      id,
      profile: client,
      shipName,
      line,
      label: label.trim().slice(0, 120) || existing?.label || "",
      summary,
      verified,
      savedAt: new Date().toISOString(),
      researchFingerprint,
      researchChecked,
    };
    const ok = upsertSavedCheck(check);
    setMessage(ok ? "saved" : "error");
    if (ok) setLabel("");
  }

  const brand = workspace.brand;
  const preparedBy = brand.name || brand.agency;

  return (
    <>
      <div className="my-[22px] rounded-[15px] border border-brand-teal/45 bg-go-bg p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-readout text-[0.62rem] font-bold tracking-[0.08em] text-brand-teal uppercase">
              Founding Pro preview
            </p>
            <h2 className="mt-2 font-call text-[1.2rem] leading-[1.25] text-ink">
              Save this check and send it under your name.
            </h2>
          </div>
          <Link
            href="/pro"
            className="text-[0.8rem] font-semibold text-deep underline decoration-line underline-offset-2"
          >
            My Checks
          </Link>
        </div>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-[0.78rem] font-semibold text-ink">
            Booking label <span className="font-normal text-ink-3">(optional, stored only here)</span>
          </span>
          <input
            maxLength={120}
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder={existing?.label || "For example: Smith family"}
            className="w-full rounded-[10px] border border-line bg-white px-3.5 py-3 text-[0.9rem] text-ink placeholder:text-ink-3"
          />
        </label>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={save}
            className="cursor-pointer rounded-[10px] border-0 bg-go px-4 py-3 text-[0.9rem] font-semibold text-white hover:bg-[#175A50]"
          >
            {existing ? "Update saved check" : "Save this check"}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="cursor-pointer rounded-[10px] border border-brand-teal bg-white px-4 py-3 text-[0.9rem] font-semibold text-deep hover:bg-surface"
          >
            Print / save PDF
          </button>
        </div>
        <p className="mt-2.5 text-[0.76rem] leading-[1.5] text-ink-3" aria-live="polite">
          {message === "saved"
            ? "Saved in this browser. My Checks will watch the underlying research for changes."
            : message === "error"
              ? "This browser could not save the check. Its storage may be full or disabled."
              : preparedBy
                ? `PDF branding: ${preparedBy}. Choose “Save as PDF” in the print dialog.`
                : "Add your advisor name in My Checks to brand the PDF. It will otherwise say “your travel advisor.”"}
        </p>
      </div>

      <article className="cr-pro-print">
        <header className="cr-pro-print-header">
          <p className="cr-pro-print-brand"><span>Cruise</span>Read</p>
          <p className="cr-pro-print-kicker">CLIENT BOOKING NOTE</p>
        </header>
        <p className="cr-pro-print-byline">
          Prepared by {brand.name || "your travel advisor"}
          {brand.agency ? ` · ${brand.agency}` : ""}
        </p>
        {(brand.email || brand.phone) && (
          <p className="cr-pro-print-contact">
            {[brand.email, brand.phone].filter(Boolean).join(" · ")}
          </p>
        )}
        <h1>Your {shipName} plan, sorted.</h1>
        <p className="cr-pro-print-profile">{profileDescription(client)}</p>
        <div className="cr-pro-print-summary">{summary}</div>
        <footer>
          <p>
            {verified ? "Verified CruiseRead guidance." : "Some guidance is researched but not operator-signed."}
            {researchChecked ? ` Research checked ${formatStoredDate(researchChecked)}.` : ""}
          </p>
          <p>
            CruiseRead is a second set of eyes and does not replace current cruise-line terms,
            deck plans or an advisor&apos;s judgment.
          </p>
        </footer>
      </article>
    </>
  );
}
