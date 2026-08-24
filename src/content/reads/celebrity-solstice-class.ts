import type { ShipContent, Source } from "@/lib/types";
import {
  CELEBRITY_TRAPS,
  celebrityShipSources,
} from "./celebrity-common";

type SolsticeShip =
  | "solstice"
  | "equinox"
  | "eclipse"
  | "silhouette"
  | "reflection";

const SOLSTICE_TEEN_SOURCE: Source = {
  label:
    "Celebrity Camp at Sea FAQ — Solstice has teen programming but no dedicated teen facility",
  url: "https://www.celebritycruises.com/things-to-do-onboard/camp-at-sea",
  checked: "2026-08-24",
};

function solsticeShip(ship: SolsticeShip): ShipContent {
  const name = `Celebrity ${ship.charAt(0).toUpperCase()}${ship.slice(1)}`;
  const isSolstice = ship === "solstice";

  return {
    sources: [
      ...celebrityShipSources(`celebrity-${ship}`, name),
      ...(isSolstice ? [SOLSTICE_TEEN_SOURCE] : []),
    ],
    fareInclusions: { state: "not-researched" },
    traps: isSolstice
      ? {
          ...CELEBRITY_TRAPS,
          other: [
            "Celebrity Solstice currently offers teen programming without a dedicated teen facility; Celebrity says those activities use other venues. Do not inherit that exception across Equinox, Eclipse, Silhouette or Reflection.",
          ],
        }
      : CELEBRITY_TRAPS,
  };
}

export const celebritySolstice = solsticeShip("solstice");
export const celebrityEquinox = solsticeShip("equinox");
export const celebrityEclipse = solsticeShip("eclipse");
export const celebritySilhouette = solsticeShip("silhouette");
export const celebrityReflection = solsticeShip("reflection");

