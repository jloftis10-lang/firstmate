import type { ShipContent, Source } from "@/lib/types";

/**
 * Celebrity policy research shared by the 14 mainstream ocean ships in this
 * phase. The two line-policy warnings and the matching family-program rule
 * were SIGNED OFF by Jimmy on 2026-08-24. Galapagos is deliberately excluded:
 * its fare and family product are different enough that inheriting this record
 * would be the exact absence-as-evidence error the intake guards against.
 */
export const CELEBRITY_COMMON_SOURCES: Source[] = [
  {
    label: "Celebrity fare options — Cruise-Only, All Included and The Retreat",
    url: "https://www.celebritycruises.com/gb/cruise-fare-options",
    checked: "2026-08-24",
  },
  {
    label: "Celebrity All Included FAQ — eligible categories and included packages",
    url: "https://www.celebritycruises.com/gb/faqs/all-included",
    checked: "2026-08-24",
  },
  {
    label: "Celebrity Camp at Sea — age bands, potty-training rule and paid late-night care",
    url: "https://www.celebritycruises.com/things-to-do-onboard/camp-at-sea",
    checked: "2026-08-24",
  },
];

export const CELEBRITY_LINE_POLICY = [
  "Do not read the words “All Included” as a fleet-wide fare inclusion. Celebrity currently sells Cruise-Only and All Included choices: Cruise-Only does not include a drinks package or Wi-Fi; All Included adds the Classic Drinks Package and Basic Wi-Fi; Retreat bookings carry Premium drinks and Premium Wi-Fi. Onboard staff gratuities remain separate. Check the booked rate, not just the ship or cabin category.",
  "Camp at Sea separates children into Shipmates ages 3–5, Cadets 6–9 and Captains 10–12, with a separate teen programme for ages 13–17. Children under 3 have no drop-off nursery, ages 3–5 must be fully potty trained, and the 10 p.m.–1 a.m. late-night service costs extra.",
];

export const CELEBRITY_TRAPS: NonNullable<ShipContent["traps"]> = {
  // Signed off by Jimmy, 2026-08-24.
  verified: true,
  familyProgramRules:
    "Camp at Sea begins at age 3, and children in the 3–5 Shipmates group must be fully potty trained. There is no nursery or drop-off service for children under 3. Ages 13–17 use the separate teen programme, while late-night care from 10 p.m. to 1 a.m. is an extra-charge service.",
  linePolicy: CELEBRITY_LINE_POLICY,
};

export function celebrityShipSources(
  shipSlug: string,
  label: string,
): Source[] {
  return [
    ...CELEBRITY_COMMON_SOURCES,
    {
      label: `${label} current official deck-plan entry — hull-level difference check`,
      url: `https://www.celebritycruises.com/cruise-ships/${shipSlug}/deck-plans`,
      checked: "2026-08-24",
    },
  ];
}
