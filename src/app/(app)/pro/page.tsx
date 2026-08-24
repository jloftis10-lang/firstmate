import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProWorkspace } from "@/components/ProWorkspace";

export const metadata: Metadata = {
  title: "My Checks",
  description: "CruiseRead Founding Pro preview: save Booking Checks, set advisor PDF branding, and watch saved research for changes.",
  robots: { index: false, follow: false },
  alternates: {},
};

export default function ProPage() {
  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-[980px] px-5 pt-6 pb-20 sm:px-8">
        <Breadcrumbs trail={[{ label: "My Checks" }]} />
        <header className="mb-10 max-w-[700px]">
          <p className="mb-3 font-readout text-[0.64rem] font-bold tracking-[0.09em] text-brand-teal uppercase">Founding Pro preview</p>
          <h1 className="font-call text-[2rem] leading-[1.08] tracking-[-0.025em] text-ink sm:text-[2.5rem]">Your saved checks, client-ready and watched.</h1>
          <p className="mt-4 text-[1rem] leading-[1.65] text-ink-2">Save the bookings you are working, put your advisor identity on a printable client summary, and see when the underlying CruiseRead research changes. This preview is free and does not start billing.</p>
        </header>
        <ProWorkspace />
      </div>
    </main>
  );
}
