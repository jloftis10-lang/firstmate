import type { ShipContent } from "@/lib/types";
import {
  AQUA_TUNNEL_TALL_RULES,
  carnivalFleetContent,
} from "./carnival-common";

/**
 * The rest of the Carnival fleet: money and traps only.
 *
 * These hulls carry researched line-wide policy — gratuity, Cheers!, the
 * youth age bands, the Arrival Appointment, ride minimums — and NO cabin
 * block. The read shows "Cabin & deck" as uncharted for every ship here,
 * which is the honest position: nobody has walked them.
 *
 * The three Excel hulls are not in this map. They have their own
 * files because they carry operator-confirmed cabin content. When a ship
 * here gets its cabin block worked up, promote it out of this map into
 * its own file the same way.
 */

/** Ex-Costa hulls — the Aqua Tunnel minimum is higher here. */
const COSTA_BUILT = () =>
  carnivalFleetContent({ thrillRules: AQUA_TUNNEL_TALL_RULES });

const STANDARD = () => carnivalFleetContent({});

export const CARNIVAL_FLEET_READS: Record<string, ShipContent> = {
  "carnival-venezia": COSTA_BUILT(),
  "carnival-firenze": COSTA_BUILT(),

  "carnival-vista": STANDARD(),
  "carnival-horizon": STANDARD(),
  "carnival-panorama": STANDARD(),
  "carnival-dream": STANDARD(),
  "carnival-magic": STANDARD(),
  "carnival-breeze": STANDARD(),
  "carnival-splendor": STANDARD(),
  "carnival-conquest": STANDARD(),
  "carnival-glory": STANDARD(),
  "carnival-valor": STANDARD(),
  "carnival-liberty": STANDARD(),
  "carnival-freedom": STANDARD(),
  "carnival-spirit": STANDARD(),
  "carnival-pride": STANDARD(),
  "carnival-legend": STANDARD(),
  "carnival-miracle": STANDARD(),
  "carnival-luminosa": STANDARD(),
  "carnival-sunshine": STANDARD(),
  "carnival-sunrise": STANDARD(),
  "carnival-radiance": STANDARD(),
  "carnival-elation": STANDARD(),
  "carnival-paradise": STANDARD(),
  "carnival-adventure": STANDARD(),
  "carnival-encounter": STANDARD(),
};
