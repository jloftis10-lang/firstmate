import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PricingInterestForm } from "@/components/PricingInterestForm";

export const metadata: Metadata = {
  title: "Pricing for travel advisors",
  description:
    "CruiseRead launch pricing: a free Booking Check, Founding Pro for individual advisors, and an Agency plan for teams.",
  alternates: { canonical: "/pricing" },
};

const REQUEST_EMAIL = "jloftis10@gmail.com";

const PLANS = [
  {
    name: "Free",
    marker: "Available now",
    price: "$0",
    cadence: "No card required",
    description: "Use the public research and run a Booking Check before a client pays.",
    features: [
      "Ship, class and cruise-line research",
      "Booking Check with cabin, money and expectation calls",
      "Shareable browser result",
      "Requests for uncharted ships",
    ],
    cta: "Run a free Booking Check",
    href: "/check",
    featured: false,
  },
  {
    name: "Founding Pro",
    marker: "Preview available — no charge",
    price: "$19",
    cadence: "per month · or $190/year",
    description: "For individual advisors who want to save, brand and monitor repeat booking work.",
    features: [
      "Everything in Free",
      "Saved Booking Checks on this browser",
      "Advisor-branded printable and PDF summaries",
      "In-app alerts when checked research changes",
    ],
    cta: "Open Founding Pro preview",
    href: "/pro",
    featured: true,
  },
  {
    name: "Agency",
    marker: "Early access — planned",
    price: "$79",
    cadence: "per month · includes 5 advisors",
    description: "For a travel agency evaluating CruiseRead for a small advisor team.",
    features: [
      "Planned Pro features for five advisors",
      "One agency plan",
      "$12/month for each additional advisor",
      "A rollout conversation before billing",
    ],
    cta: "Ask about agency access",
    href: "#founding-access",
    featured: false,
  },
] as const;

const FAQ = [
  {
    question: "Is CruiseRead charging now?",
    answer:
      "No. The Free product and browser-local Founding Pro preview are available now. The preview and interest form do not collect a card or start a subscription.",
  },
  {
    question: "When would billing begin?",
    answer:
      "Only after the preview has been validated and an advisor accepts an invitation with the price and billing terms shown before checkout.",
  },
  {
    question: "What is the founding price?",
    answer:
      "Founding Pro is planned at $19 per month or $190 per year. The later standard Pro price is planned at $29 per month or $290 per year.",
  },
] as const;

export default function PricingPage() {
  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-[1180px] px-5 pt-6 pb-20 sm:px-8">
        <Breadcrumbs trail={[{ label: "Pricing" }]} />

        <header className="mx-auto max-w-[760px] text-center">
          <p className="mb-3 font-readout text-[0.64rem] font-bold tracking-[0.09em] text-brand-teal uppercase">
            Simple launch pricing
          </p>
          <h1 className="font-call text-[2.1rem] leading-[1.08] tracking-[-0.025em] text-ink sm:text-[2.7rem]">
            Start free. Pay when CruiseRead saves repeat work.
          </h1>
          <p className="mx-auto mt-4 max-w-[62ch] text-[1rem] leading-[1.65] text-ink-2">
            The public research and Booking Check are free now. The Founding
            Pro workflow is also open as a browser-local preview; CruiseRead is
            not accepting payment while advisors test it.
          </p>
        </header>

        <section aria-label="Plans" className="mt-10 grid gap-4 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <article
              key={plan.name}
              className={`flex flex-col rounded-[16px] border p-5 sm:p-6 ${
                plan.featured
                  ? "border-brand-teal bg-go-bg shadow-[0_12px_32px_rgba(16,70,66,0.08)]"
                  : "border-line bg-surface"
              }`}
            >
              <p className="font-readout text-[0.62rem] font-bold tracking-[0.07em] text-brand-teal uppercase">
                {plan.marker}
              </p>
              <h2 className="mt-3 font-call text-[1.45rem] text-ink">{plan.name}</h2>
              <p className="mt-4 flex items-baseline gap-2 text-ink">
                <span className="font-call text-[2.15rem] leading-none">{plan.price}</span>
                <span className="text-[0.78rem] leading-[1.35] text-ink-3">{plan.cadence}</span>
              </p>
              <p className="mt-4 text-[0.9rem] leading-[1.55] text-ink-2">{plan.description}</p>
              <ul className="mt-5 flex-1 space-y-3 border-t border-line/80 pt-5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2.5 text-[0.86rem] leading-[1.5] text-ink-2">
                    <span aria-hidden="true" className="mt-[0.38rem] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-teal" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`mt-6 rounded-[10px] px-4 py-3 text-center text-[0.9rem] font-semibold no-underline transition-colors ${
                  plan.featured
                    ? "bg-go text-white hover:bg-[#175A50]"
                    : "border border-line bg-white text-deep hover:border-brand-teal"
                }`}
              >
                {plan.cta}
              </Link>
            </article>
          ))}
        </section>

        <p className="mx-auto mt-5 max-w-[68ch] text-center text-[0.78rem] leading-[1.55] text-ink-3">
          Founding and standard prices are launch plans, not active offers.
          Using the preview or joining the list does not purchase, reserve or
          renew anything.
        </p>

        <section id="founding-access" className="scroll-mt-6 border-t border-line pt-12 mt-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start">
            <div>
              <p className="font-readout text-[0.64rem] font-bold tracking-[0.09em] text-brand-teal uppercase">
                Founding access
              </p>
              <h2 className="mt-3 font-call text-[1.7rem] leading-[1.15] text-ink">
                Tell CruiseRead what has to earn the subscription.
              </h2>
              <p className="mt-3 max-w-[52ch] text-[0.94rem] leading-[1.65] text-ink-2">
                This is an interest list, not checkout. Share the repeated task
                or client output you need, and CruiseRead can build the paid
                plan around real advisor work instead of guessed demand.
              </p>
            </div>
            <PricingInterestForm
              emailEnabled={Boolean(process.env.RESEND_API_KEY)}
              destination={REQUEST_EMAIL}
            />
          </div>
        </section>

        <section className="mt-12 border-t border-line pt-10">
          <h2 className="font-call text-[1.5rem] text-ink">Pricing questions</h2>
          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            {FAQ.map((item) => (
              <article key={item.question} className="rounded-[14px] border border-line bg-surface p-4">
                <h3 className="font-call text-[1.08rem] leading-[1.3] text-ink">{item.question}</h3>
                <p className="mt-2 text-[0.86rem] leading-[1.6] text-ink-2">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
