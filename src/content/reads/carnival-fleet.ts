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
 * The classes that have been worked up are not in this map — Excel, Vista,
 * Dream, Sunshine, Conquest and Spirit each have their own file. Those
 * files carry a real cabin block; this map carries the fleet baseline.
 * When a ship here gets its decks worked up, promote it out into a class
 * file the same way.
 *
 * Luminosa stays here on purpose. It's usually listed as Spirit class and
 * isn't one — it was built as Costa Luminosa to a Vista/Spirit hybrid
 * design, bigger than the four real Spirit-class hulls, and nobody has
 * researched its deck plan. Inheriting the Spirit-class file would be
 * claiming deck numbers that don't describe this ship.
 */

/** Ex-Costa hulls — the Aqua Tunnel minimum is higher here. */
const COSTA_BUILT = () =>
  carnivalFleetContent({ thrillRules: AQUA_TUNNEL_TALL_RULES });

const STANDARD = () => carnivalFleetContent({});

export const CARNIVAL_FLEET_READS: Record<string, ShipContent> = {
  "carnival-venezia": COSTA_BUILT(),
  "carnival-firenze": COSTA_BUILT(),

  "carnival-splendor": STANDARD(),
  "carnival-luminosa": STANDARD(),
  "carnival-elation": STANDARD(),
  "carnival-paradise": STANDARD(),
  "carnival-adventure": STANDARD(),
  "carnival-encounter": STANDARD(),
};
