import type { ShipContent, Source } from "@/lib/types";
import { MOTION_RULE, VIBRATION_RULE } from "./operator-rules";
import {
  CELEBRITY_TRAPS,
  celebrityShipSources,
} from "./celebrity-common";

type EdgeShip = "edge" | "apex" | "beyond" | "ascent" | "xcel";

const EDGE_VERANDA_SOURCE: Source = {
  label:
    "Celebrity veranda categories — Infinite Veranda design and conventional Sunset/Porthole alternatives",
  url: "https://www.celebritycruises.com/things-to-do-onboard/staterooms/veranda-stateroom",
  checked: "2026-08-24",
};

const XCEL_SOURCE: Source = {
  label: "Celebrity Xcel — The Bazaar is an Xcel-only destination experience",
  url: "https://www.celebritycruises.com/xcel/date-night-all-day/",
  checked: "2026-08-24",
};

const EDGE_CABIN: ShipContent["cabin"] = {
  verified: false,
  motionAvoid: MOTION_RULE,
  vibrationNote: VIBRATION_RULE,
  categoryWarnings: [
    "Treat an Edge Stateroom with Infinite Veranda as its own cabin design, not as a conventional balcony with a different name. Celebrity describes the room’s living area becoming the veranda at the touch of a button. If the client wants a separate outdoor platform, compare it with the Sunset Veranda or Deluxe Porthole View with Veranda categories, which Celebrity describes as outdoor step-out spaces. This is a preference tradeoff, not a verdict on which is better.",
  ],
  hazardsAboveBelow: [],
};

function edgeShip(ship: EdgeShip): ShipContent {
  const name = `Celebrity ${ship.charAt(0).toUpperCase()}${ship.slice(1)}`;
  const isXcel = ship === "xcel";

  return {
    sources: [
      ...celebrityShipSources(`celebrity-${ship}`, name),
      EDGE_VERANDA_SOURCE,
      ...(isXcel ? [XCEL_SOURCE] : []),
    ],
    fareInclusions: { state: "not-researched" },
    cabin: EDGE_CABIN,
    traps: isXcel
      ? {
          ...CELEBRITY_TRAPS,
          other: [
            "The Bazaar is an Xcel-specific experience, not an Edge-series class constant. Do not promise it on Edge, Apex, Beyond or Ascent because a client has seen it in Xcel material.",
          ],
        }
      : CELEBRITY_TRAPS,
  };
}

export const celebrityEdge = edgeShip("edge");
export const celebrityApex = edgeShip("apex");
export const celebrityBeyond = edgeShip("beyond");
export const celebrityAscent = edgeShip("ascent");
export const celebrityXcel = edgeShip("xcel");

