"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { checkPath, sharePath } from "@/lib/share";
import { loadShipContent } from "@/lib/ship-content";
import {
  formatStoredDate,
  profileDescription,
  researchFingerprint,
  type AdvisorBrand,
} from "@/lib/pro";
import {
  removeSavedCheck,
  saveAdvisorBrand,
  useProWorkspace,
} from "@/lib/pro-workspace";

type ResearchState = "checking" | "current" | "changed" | "unavailable";

function BrandForm({ initial }: { initial: AdvisorBrand }) {
  const [brand, setBrand] = useState(initial);
  const [result, setResult] = useState<"saved" | "error" | null>(null);

  const change = (field: keyof AdvisorBrand, value: string) =>
    setBrand((current) => ({ ...current, [field]: value }));

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const clean: AdvisorBrand = {
      name: brand.name.trim().slice(0, 100),
      agency: brand.agency.trim().slice(0, 120),
      email: brand.email.trim().slice(0, 254),
      phone: brand.phone.trim().slice(0, 50),
    };
    const ok = saveAdvisorBrand(clean);
    setBrand(clean);
    setResult(ok ? "saved" : "error");
  }

  return (
    <form onSubmit={submit} className="rounded-[15px] border border-line bg-surface p-5 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[0.8rem] font-semibold text-ink">Advisor name</span>
          <input maxLength={100} autoComplete="name" value={brand.name} onChange={(event) => change("name", event.target.value)} className="w-full rounded-[10px] border border-line bg-white px-3.5 py-3 text-[0.92rem] text-ink" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[0.8rem] font-semibold text-ink">Agency</span>
          <input maxLength={120} autoComplete="organization" value={brand.agency} onChange={(event) => change("agency", event.target.value)} className="w-full rounded-[10px] border border-line bg-white px-3.5 py-3 text-[0.92rem] text-ink" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[0.8rem] font-semibold text-ink">Advisor email</span>
          <input type="email" maxLength={254} autoComplete="email" value={brand.email} onChange={(event) => change("email", event.target.value)} className="w-full rounded-[10px] border border-line bg-white px-3.5 py-3 text-[0.92rem] text-ink" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[0.8rem] font-semibold text-ink">Advisor phone</span>
          <input type="tel" maxLength={50} autoComplete="tel" value={brand.phone} onChange={(event) => change("phone", event.target.value)} className="w-full rounded-[10px] border border-line bg-white px-3.5 py-3 text-[0.92rem] text-ink" />
        </label>
      </div>
      <button type="submit" className="mt-5 cursor-pointer rounded-[10px] border-0 bg-go px-5 py-3 text-[0.9rem] font-semibold text-white hover:bg-[#175A50]">
        Save PDF branding
      </button>
      <p className="mt-2.5 text-[0.76rem] leading-[1.5] text-ink-3" aria-live="polite">
        {result === "saved"
          ? "Branding saved in this browser. It will appear on new PDFs."
          : result === "error"
            ? "This browser could not save your branding. Storage may be full or disabled."
            : "All fields are optional and stay in this browser. CruiseRead does not receive them."}
      </p>
    </form>
  );
}

export function ProWorkspace() {
  const workspace = useProWorkspace();
  const [research, setResearch] = useState<Record<string, ResearchState>>({});
  const checkKey = workspace.checks
    .map((check) => `${check.id}:${check.researchFingerprint}`)
    .join("|");

  useEffect(() => {
    let live = true;
    const checks = workspace.checks;
    if (checks.length === 0) return;
    void Promise.all(
      checks.map(async (check) => {
        try {
          const current = await loadShipContent(check.profile.shipId);
          return [check.id, researchFingerprint(current) === check.researchFingerprint ? "current" : "changed"] as const;
        } catch {
          return [check.id, "unavailable"] as const;
        }
      }),
    ).then((entries) => {
      if (live) setResearch(Object.fromEntries(entries));
    });
    return () => {
      live = false;
    };
  }, [checkKey, workspace.checks]);

  const changedCount = workspace.checks.filter((check) => research[check.id] === "changed").length;

  function remove(id: string) {
    if (window.confirm("Remove this saved check from this browser?")) removeSavedCheck(id);
  }

  return (
    <div>
      <section className="grid gap-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-start">
        <div>
          <p className="font-readout text-[0.64rem] font-bold tracking-[0.09em] text-brand-teal uppercase">Advisor identity</p>
          <h2 className="mt-3 font-call text-[1.55rem] leading-[1.2] text-ink">Put your name on the client PDF.</h2>
          <p className="mt-3 max-w-[48ch] text-[0.9rem] leading-[1.65] text-ink-2">
            CruiseRead uses this only when your browser creates a printable summary. Nothing here is sent to CruiseRead or added to a client link.
          </p>
        </div>
        <BrandForm key={JSON.stringify(workspace.brand)} initial={workspace.brand} />
      </section>

      <section className="mt-12 border-t border-line pt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-readout text-[0.64rem] font-bold tracking-[0.09em] text-brand-teal uppercase">Saved Booking Checks</p>
            <h2 className="mt-3 font-call text-[1.55rem] leading-[1.2] text-ink">Your working list, watched for research changes.</h2>
          </div>
          <Link href="/check" className="rounded-[10px] bg-go px-4 py-3 text-[0.86rem] font-semibold text-white no-underline hover:bg-[#175A50]">Run a Booking Check</Link>
        </div>

        {changedCount > 0 && (
          <p role="alert" className="mt-5 rounded-[12px] border border-signal bg-signal-bg px-4 py-3 text-[0.88rem] leading-[1.55] text-ink">
            {changedCount} saved {changedCount === 1 ? "check has" : "checks have"} newer research behind it. Open and save {changedCount === 1 ? "it" : "them"} again before relying on the old summary.
          </p>
        )}

        {workspace.checks.length === 0 ? (
          <div className="mt-6 rounded-[15px] border border-dashed border-line bg-surface/60 p-6 text-center">
            <h3 className="font-call text-[1.2rem] text-ink">No saved checks yet.</h3>
            <p className="mx-auto mt-2 max-w-[48ch] text-[0.86rem] leading-[1.6] text-ink-2">Run a Booking Check, then use “Save this check” beneath the result. It will appear here on this device.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-3">
            {workspace.checks.map((check) => {
              const state = research[check.id] ?? "checking";
              const stateCopy = {
                checking: { label: "Checking research…", classes: "border-line bg-surface text-ink-3" },
                current: { label: "Research current", classes: "border-go/40 bg-go-bg text-go" },
                changed: { label: "Research changed — rerun", classes: "border-signal bg-signal-bg text-signal" },
                unavailable: { label: "Could not check research", classes: "border-line bg-surface text-ink-3" },
              }[state];

              return (
                <article key={check.id} className="rounded-[15px] border border-line bg-surface p-4 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-readout text-[0.6rem] tracking-[0.06em] text-brand-teal uppercase">{check.line}</p>
                      <h3 className="mt-1.5 font-call text-[1.2rem] leading-[1.25] text-ink">{check.label || check.shipName}</h3>
                      {check.label && <p className="mt-1 text-[0.82rem] text-ink-3">{check.shipName}</p>}
                    </div>
                    <span className={`rounded-full border px-2.5 py-1 font-readout text-[0.58rem] font-bold tracking-[0.05em] uppercase ${stateCopy.classes}`}>{stateCopy.label}</span>
                  </div>
                  <p className="mt-3 text-[0.8rem] leading-[1.5] text-ink-2">{profileDescription(check.profile)}</p>
                  <p className="mt-1.5 text-[0.72rem] leading-[1.5] text-ink-3">
                    Saved {formatStoredDate(check.savedAt)}{check.researchChecked ? ` · research checked ${formatStoredDate(check.researchChecked)}` : ""}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-line/70 pt-4">
                    <Link href={checkPath(check.profile)} className="rounded-[9px] bg-go px-3.5 py-2.5 text-[0.82rem] font-semibold text-white no-underline hover:bg-[#175A50]">{state === "changed" ? "Open current read" : "Open check"}</Link>
                    <Link href={sharePath(check.profile)} target="_blank" className="rounded-[9px] border border-line bg-white px-3.5 py-2.5 text-[0.82rem] font-semibold text-deep no-underline hover:border-brand-teal">Client page</Link>
                    <button type="button" onClick={() => remove(check.id)} className="cursor-pointer border-0 bg-transparent px-2 py-2 text-[0.78rem] text-ink-3 underline decoration-line underline-offset-2 hover:text-ink">Remove</button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <p className="mt-8 rounded-[12px] border border-line bg-surface/60 px-4 py-3 text-[0.76rem] leading-[1.6] text-ink-3">
        Founding Pro preview data stays in this browser and does not sync across devices. Clearing site data removes it. Research alerts are checked when this workspace opens; they are not email notifications yet.
      </p>
    </div>
  );
}
