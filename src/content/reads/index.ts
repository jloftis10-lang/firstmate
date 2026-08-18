import type { ShipContent } from "@/lib/types";
import { wonderOfTheSeas } from "./wonder-of-the-seas";
import { carnivalCelebration } from "./carnival-celebration";
import { carnivalMardiGras } from "./carnival-mardi-gras";
import { norwegianPrima } from "./norwegian-prima";
import { carnivalJubilee } from "./carnival-jubilee";
import {
  carnivalHorizon,
  carnivalPanorama,
  carnivalVista,
} from "./carnival-vista-class";
import {
  carnivalBreeze,
  carnivalDream,
  carnivalMagic,
} from "./carnival-dream-class";
import {
  carnivalRadiance,
  carnivalSunrise,
  carnivalSunshine,
} from "./carnival-sunshine-class";
import {
  carnivalConquest,
  carnivalFreedom,
  carnivalGlory,
  carnivalLiberty,
  carnivalValor,
} from "./carnival-conquest-class";
import {
  carnivalLegend,
  carnivalMiracle,
  carnivalPride,
  carnivalSpirit,
} from "./carnival-spirit-class";
import {
  carnivalFirenze,
  carnivalVenezia,
} from "./carnival-italian-class";
import { carnivalLuminosa } from "./carnival-luminosa";
import { carnivalSplendor } from "./carnival-splendor";
import {
  carnivalElation,
  carnivalParadise,
} from "./carnival-fantasy-class";
import {
  carnivalAdventure,
  carnivalEncounter,
} from "./carnival-pacific-class";

/**
 * Operator read content, keyed by ship id.
 *
 * This map is the actual product. The catalog is just a list of names;
 * what turns a name into a Confidence Read is an entry here. A ship with
 * no entry returns no read — deliberately, because a plausible-sounding
 * call over content nobody has worked is the failure mode this product
 * exists to prevent.
 *
 * Verification is per block, not per entry. A block nobody has signed off
 * carries a SAMPLE marker in the read, so a partly-worked ship shows
 * exactly which of its three calls an advisor can act on.
 */
export const SHIP_READS: Record<string, ShipContent> = {
  "carnival-jubilee": carnivalJubilee,
  "carnival-vista": carnivalVista,
  "carnival-horizon": carnivalHorizon,
  "carnival-panorama": carnivalPanorama,

  "carnival-dream": carnivalDream,
  "carnival-magic": carnivalMagic,
  "carnival-breeze": carnivalBreeze,

  "carnival-sunshine": carnivalSunshine,
  "carnival-sunrise": carnivalSunrise,
  "carnival-radiance": carnivalRadiance,

  "carnival-conquest": carnivalConquest,
  "carnival-glory": carnivalGlory,
  "carnival-valor": carnivalValor,
  "carnival-liberty": carnivalLiberty,
  "carnival-freedom": carnivalFreedom,

  "carnival-spirit": carnivalSpirit,
  "carnival-pride": carnivalPride,
  "carnival-legend": carnivalLegend,
  "carnival-miracle": carnivalMiracle,

  "carnival-venezia": carnivalVenezia,
  "carnival-firenze": carnivalFirenze,
  "carnival-luminosa": carnivalLuminosa,
  "carnival-splendor": carnivalSplendor,

  "carnival-elation": carnivalElation,
  "carnival-paradise": carnivalParadise,
  "carnival-adventure": carnivalAdventure,
  "carnival-encounter": carnivalEncounter,

  "wonder-of-the-seas": wonderOfTheSeas,
  "carnival-celebration": carnivalCelebration,
  "carnival-mardi-gras": carnivalMardiGras,
  "norwegian-prima": norwegianPrima,
};
