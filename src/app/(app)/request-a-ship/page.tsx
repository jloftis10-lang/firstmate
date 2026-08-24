import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ShipRequestForm } from "@/components/ShipRequestForm";

export const metadata: Metadata = {
  title: "Request a ship",
  description:
    "Tell CruiseRead which uncharted cruise ship would be most useful to travel advisors next.",
  alternates: { canonical: "/request-a-ship" },
};

const REQUEST_EMAIL = "jloftis10@gmail.com";

export default async function RequestShipPage({
  searchParams,
}: PageProps<"/request-a-ship">) {
  const params = await searchParams;
  const one = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;
  const initialShip = one(params.ship)?.slice(0, 120) ?? "";
  const initialLine = one(params.line)?.slice(0, 100) ?? "";

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-[760px] px-5 pt-6 pb-20 sm:px-8">
        <Breadcrumbs trail={[{ label: "Request a ship" }]} />

        <header className="mb-8 max-w-[62ch]">
          <p className="mb-3 font-readout text-[0.64rem] font-bold tracking-[0.09em] text-brand-teal uppercase">
            Help set the research order
          </p>
          <h1 className="font-call text-[2rem] leading-[1.1] tracking-[-0.02em] text-ink sm:text-[2.4rem]">
            Which ship should CruiseRead chart next?
          </h1>
          <p className="mt-3.5 text-[1rem] leading-[1.6] text-ink-2">
            CruiseRead would rather publish no answer than a guessed one. Tell
            us which missing hull is getting in your way, and the request will
            help determine what gets researched next.
          </p>
        </header>

        <ShipRequestForm
          emailEnabled={Boolean(process.env.RESEND_API_KEY)}
          destination={REQUEST_EMAIL}
          initialShip={initialShip}
          initialLine={initialLine}
        />
      </div>
    </main>
  );
}
