import type { ShipContent } from "@/lib/types";
import { carnivalCelebration } from "./carnival-celebration";
import { carnivalMardiGras } from "./carnival-mardi-gras";
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
import {
  iconOfTheSeas,
  legendOfTheSeas,
  starOfTheSeas,
} from "./royal-icon-class";
import {
  allureOfTheSeas,
  harmonyOfTheSeas,
  oasisOfTheSeas,
  symphonyOfTheSeas,
  utopiaOfTheSeas,
  wonderOfTheSeas,
} from "./royal-oasis-class";
import {
  anthemOfTheSeas,
  odysseyOfTheSeas,
  ovationOfTheSeas,
  quantumOfTheSeas,
  spectrumOfTheSeas,
} from "./royal-quantum-class";
import {
  adventureOfTheSeas,
  explorerOfTheSeas,
  freedomOfTheSeas,
  independenceOfTheSeas,
  libertyOfTheSeas,
  marinerOfTheSeas,
  navigatorOfTheSeas,
  voyagerOfTheSeas,
} from "./royal-voyager-freedom";
import {
  brillianceOfTheSeas,
  jewelOfTheSeas,
  radianceOfTheSeas,
  serenadeOfTheSeas,
} from "./royal-radiance-class";
import {
  enchantmentOfTheSeas,
  grandeurOfTheSeas,
  rhapsodyOfTheSeas,
  visionOfTheSeas,
} from "./royal-vision-class";
import {
  norwegianAqua,
  norwegianLuna,
  norwegianPrima,
  norwegianViva,
} from "./ncl-prima-class";
import { norwegianEpic } from "./ncl-epic";
import {
  norwegianBliss,
  norwegianBreakaway,
  norwegianEncore,
  norwegianEscape,
  norwegianGetaway,
  norwegianJoy,
} from "./ncl-breakaway-class";
import {
  norwegianDawn,
  norwegianGem,
  norwegianJade,
  norwegianJewel,
  norwegianPearl,
  norwegianStar,
} from "./ncl-jewel-dawn";
import {
  norwegianSky,
  norwegianSpirit,
  norwegianSun,
} from "./ncl-sun-sky-spirit";
import {
  celebrityApex,
  celebrityAscent,
  celebrityBeyond,
  celebrityEdge,
  celebrityXcel,
} from "./celebrity-edge-class";
import {
  celebrityEclipse,
  celebrityEquinox,
  celebrityReflection,
  celebritySilhouette,
  celebritySolstice,
} from "./celebrity-solstice-class";
import {
  celebrityConstellation,
  celebrityInfinity,
  celebrityMillennium,
  celebritySummit,
} from "./celebrity-millennium-class";

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

  "icon-of-the-seas": iconOfTheSeas,
  "star-of-the-seas": starOfTheSeas,
  "legend-of-the-seas": legendOfTheSeas,

  "oasis-of-the-seas": oasisOfTheSeas,
  "allure-of-the-seas": allureOfTheSeas,
  "harmony-of-the-seas": harmonyOfTheSeas,
  "symphony-of-the-seas": symphonyOfTheSeas,
  "wonder-of-the-seas": wonderOfTheSeas,
  "utopia-of-the-seas": utopiaOfTheSeas,

  "quantum-of-the-seas": quantumOfTheSeas,
  "anthem-of-the-seas": anthemOfTheSeas,
  "ovation-of-the-seas": ovationOfTheSeas,
  "spectrum-of-the-seas": spectrumOfTheSeas,
  "odyssey-of-the-seas": odysseyOfTheSeas,

  "voyager-of-the-seas": voyagerOfTheSeas,
  "explorer-of-the-seas": explorerOfTheSeas,
  "adventure-of-the-seas": adventureOfTheSeas,
  "navigator-of-the-seas": navigatorOfTheSeas,
  "mariner-of-the-seas": marinerOfTheSeas,
  "freedom-of-the-seas": freedomOfTheSeas,
  "liberty-of-the-seas": libertyOfTheSeas,
  "independence-of-the-seas": independenceOfTheSeas,

  "radiance-of-the-seas": radianceOfTheSeas,
  "brilliance-of-the-seas": brillianceOfTheSeas,
  "serenade-of-the-seas": serenadeOfTheSeas,
  "jewel-of-the-seas": jewelOfTheSeas,

  "grandeur-of-the-seas": grandeurOfTheSeas,
  "enchantment-of-the-seas": enchantmentOfTheSeas,
  "rhapsody-of-the-seas": rhapsodyOfTheSeas,
  "vision-of-the-seas": visionOfTheSeas,

  "norwegian-prima": norwegianPrima,
  "norwegian-viva": norwegianViva,
  "norwegian-aqua": norwegianAqua,
  "norwegian-luna": norwegianLuna,

  "norwegian-epic": norwegianEpic,
  "norwegian-breakaway": norwegianBreakaway,
  "norwegian-getaway": norwegianGetaway,
  "norwegian-escape": norwegianEscape,
  "norwegian-joy": norwegianJoy,
  "norwegian-bliss": norwegianBliss,
  "norwegian-encore": norwegianEncore,

  "norwegian-jewel": norwegianJewel,
  "norwegian-jade": norwegianJade,
  "norwegian-pearl": norwegianPearl,
  "norwegian-gem": norwegianGem,
  "norwegian-dawn": norwegianDawn,
  "norwegian-star": norwegianStar,

  "norwegian-sun": norwegianSun,
  "norwegian-sky": norwegianSky,
  "norwegian-spirit": norwegianSpirit,

  "celebrity-edge": celebrityEdge,
  "celebrity-apex": celebrityApex,
  "celebrity-beyond": celebrityBeyond,
  "celebrity-ascent": celebrityAscent,
  "celebrity-xcel": celebrityXcel,

  "celebrity-solstice": celebritySolstice,
  "celebrity-equinox": celebrityEquinox,
  "celebrity-eclipse": celebrityEclipse,
  "celebrity-silhouette": celebritySilhouette,
  "celebrity-reflection": celebrityReflection,

  "celebrity-millennium": celebrityMillennium,
  "celebrity-infinity": celebrityInfinity,
  "celebrity-summit": celebritySummit,
  "celebrity-constellation": celebrityConstellation,

  "carnival-celebration": carnivalCelebration,
  "carnival-mardi-gras": carnivalMardiGras,
};
