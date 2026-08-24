import type { ClientProfile, ShipContent } from "./types";

export const PRO_STORAGE_VERSION = 1 as const;

export type AdvisorBrand = {
  name: string;
  agency: string;
  email: string;
  phone: string;
};

export type SavedCheck = {
  id: string;
  profile: ClientProfile;
  shipName: string;
  line: string;
  label: string;
  summary: string;
  verified: boolean;
  savedAt: string;
  researchFingerprint: string;
  researchChecked?: string;
};

export type ProWorkspaceState = {
  version: typeof PRO_STORAGE_VERSION;
  brand: AdvisorBrand;
  checks: SavedCheck[];
};

export const EMPTY_BRAND: AdvisorBrand = {
  name: "",
  agency: "",
  email: "",
  phone: "",
};

export const EMPTY_PRO_WORKSPACE: ProWorkspaceState = {
  version: PRO_STORAGE_VERSION,
  brand: EMPTY_BRAND,
  checks: [],
};

const PARTIES = new Set(["couple", "family", "multigen", "solo"]);
const SEASICK = new Set(["no", "yes"]);
const EXPERIENCE = new Set(["first", "seasoned"]);
const ITINERARY = new Set(["port-heavy", "sea-days"]);

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function profile(value: unknown): ClientProfile | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const item = value as Record<string, unknown>;
  const shipId = text(item.shipId, 160);
  const party = text(item.party, 20);
  const seasick = text(item.seasick, 10);
  const experience = text(item.experience, 20);
  const itinerary = text(item.itinerary, 20);
  if (
    !shipId ||
    !PARTIES.has(party) ||
    !SEASICK.has(seasick) ||
    !EXPERIENCE.has(experience) ||
    !ITINERARY.has(itinerary)
  ) {
    return null;
  }
  return {
    shipId,
    party: party as ClientProfile["party"],
    seasick: seasick as ClientProfile["seasick"],
    experience: experience as ClientProfile["experience"],
    itinerary: itinerary as ClientProfile["itinerary"],
  };
}

/**
 * Parse browser storage as untrusted input. A user can edit localStorage,
 * an old build can leave an obsolete shape, and a browser extension can
 * write anything. Invalid records are dropped rather than reaching the UI.
 */
export function parseProWorkspace(value: unknown): ProWorkspaceState {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return EMPTY_PRO_WORKSPACE;
  }
  const input = value as Record<string, unknown>;
  if (input.version !== PRO_STORAGE_VERSION) return EMPTY_PRO_WORKSPACE;

  const rawBrand =
    input.brand && typeof input.brand === "object" && !Array.isArray(input.brand)
      ? (input.brand as Record<string, unknown>)
      : {};
  const brand: AdvisorBrand = {
    name: text(rawBrand.name, 100),
    agency: text(rawBrand.agency, 120),
    email: text(rawBrand.email, 254),
    phone: text(rawBrand.phone, 50),
  };

  const checks = (Array.isArray(input.checks) ? input.checks : [])
    .slice(0, 100)
    .flatMap((value): SavedCheck[] => {
      if (!value || typeof value !== "object" || Array.isArray(value)) return [];
      const item = value as Record<string, unknown>;
      const savedProfile = profile(item.profile);
      const id = text(item.id, 500);
      const shipName = text(item.shipName, 160);
      const line = text(item.line, 120);
      const summary = text(item.summary, 5000);
      const savedAt = text(item.savedAt, 40);
      const researchFingerprint = text(item.researchFingerprint, 32);
      if (
        !savedProfile ||
        !id ||
        !shipName ||
        !line ||
        !summary ||
        !savedAt ||
        !researchFingerprint
      ) {
        return [];
      }
      return [
        {
          id,
          profile: savedProfile,
          shipName,
          line,
          label: text(item.label, 120),
          summary,
          verified: item.verified === true,
          savedAt,
          researchFingerprint,
          researchChecked: text(item.researchChecked, 20) || undefined,
        },
      ];
    });

  return { version: PRO_STORAGE_VERSION, brand, checks };
}

/** Stable id for one exact set of the product's five inputs. */
export function savedCheckId(profile: ClientProfile): string {
  return new URLSearchParams({
    ship: profile.shipId,
    who: profile.party,
    seasick: profile.seasick,
    sailed: profile.experience,
    itinerary: profile.itinerary,
  }).toString();
}

/**
 * FNV-1a is not a security primitive and is not used as one. It is a small,
 * deterministic change detector over the complete structured record. If a
 * source, signed state or call-driving field changes, a saved check can say
 * it needs to be rerun without storing the whole ship record twice.
 */
export function researchFingerprint(content: ShipContent): string {
  const value = JSON.stringify(content);
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function latestResearchChecked(content: ShipContent): string | undefined {
  return [...(content.sources ?? [])]
    .map((source) => source.checked)
    .filter(Boolean)
    .sort()
    .at(-1);
}

export function profileDescription(profile: ClientProfile): string {
  const party = {
    couple: "Couple",
    family: "Family + kids",
    multigen: "Multigen / mobility",
    solo: "Solo",
  }[profile.party];
  const motion = profile.seasick === "yes" ? "motion-sensitive" : "not motion-sensitive";
  const experience = profile.experience === "first" ? "first cruise" : "seasoned";
  const itinerary = profile.itinerary === "sea-days" ? "sea days" : "port-heavy";
  return `${party} · ${motion} · ${experience} · ${itinerary}`;
}

export function formatStoredDate(value: string): string {
  const date = new Date(value.length === 10 ? `${value}T00:00:00Z` : value);
  if (Number.isNaN(+date)) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
