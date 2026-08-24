import type { ShipContent } from "@/lib/types";
import {
  CELEBRITY_TRAPS,
  celebrityShipSources,
} from "./celebrity-common";

type MillenniumShip = "millennium" | "infinity" | "summit" | "constellation";

function millenniumShip(ship: MillenniumShip): ShipContent {
  const name = `Celebrity ${ship.charAt(0).toUpperCase()}${ship.slice(1)}`;

  return {
    sources: celebrityShipSources(`celebrity-${ship}`, name),
    fareInclusions: { state: "not-researched" },
    traps: CELEBRITY_TRAPS,
  };
}

export const celebrityMillennium = millenniumShip("millennium");
export const celebrityInfinity = millenniumShip("infinity");
export const celebritySummit = millenniumShip("summit");
export const celebrityConstellation = millenniumShip("constellation");

