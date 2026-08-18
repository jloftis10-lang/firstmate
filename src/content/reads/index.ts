import type { ShipContent } from "@/lib/types";
import { wonderOfTheSeas } from "./wonder-of-the-seas";
import { carnivalCelebration } from "./carnival-celebration";
import { carnivalMardiGras } from "./carnival-mardi-gras";
import { norwegianPrima } from "./norwegian-prima";
import { CARNIVAL_FLEET_READS } from "./carnival-fleet";

/**
 * Operator read content, keyed by ship id.
 *
 * This map is the actual product. The catalog is just a list of names;
 * what turns a name into a Confidence Read is an entry here. A ship with
 * no entry returns no read — deliberately, because a plausible-sounding
 * call over content nobody has worked is the failure mode this product
 * exists to prevent.
 *
 * Every entry is currently `verified: false`, so every read carries a
 * SAMPLE marker until the content is confirmed.
 */
export const SHIP_READS: Record<string, ShipContent> = {
  // Money and traps for the rest of the Carnival fleet, no cabin block.
  // Listed first so a hand-written file below always wins.
  ...CARNIVAL_FLEET_READS,

  "wonder-of-the-seas": wonderOfTheSeas,
  "carnival-celebration": carnivalCelebration,
  "carnival-mardi-gras": carnivalMardiGras,
  "norwegian-prima": norwegianPrima,
};
