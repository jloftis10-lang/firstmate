import type { CruiseLine } from "@/lib/types";

/**
 * Premium lines — a step up from contemporary, still mainstream enough
 * that a generalist advisor books them regularly.
 *
 * ROSTER SNAPSHOT, not verified fact. See the note in contemporary.ts.
 */
export const PREMIUM_LINES: CruiseLine[] = [
  {
    id: "princess",
    name: "Princess Cruises",
    category: "premium",
    ships: [
      { name: "Sun Princess", shipClass: "Sphere" },
      { name: "Star Princess", shipClass: "Sphere" },
      { name: "Royal Princess", shipClass: "Royal" },
      { name: "Regal Princess", shipClass: "Royal" },
      { name: "Majestic Princess", shipClass: "Royal" },
      { name: "Sky Princess", shipClass: "Royal" },
      { name: "Enchanted Princess", shipClass: "Royal" },
      { name: "Discovery Princess", shipClass: "Royal" },
      { name: "Grand Princess", shipClass: "Grand" },
      { name: "Ruby Princess", shipClass: "Grand" },
      { name: "Emerald Princess", shipClass: "Grand" },
      { name: "Caribbean Princess", shipClass: "Grand" },
      { name: "Crown Princess", shipClass: "Grand" },
      { name: "Coral Princess", shipClass: "Coral" },
      { name: "Island Princess", shipClass: "Coral" },
      { name: "Diamond Princess", shipClass: "Diamond" },
      { name: "Sapphire Princess", shipClass: "Diamond" },
    ],
  },
  {
    id: "celebrity",
    name: "Celebrity Cruises",
    category: "premium",
    ships: [
      { name: "Celebrity Edge", shipClass: "Edge" },
      { name: "Celebrity Apex", shipClass: "Edge" },
      { name: "Celebrity Beyond", shipClass: "Edge" },
      { name: "Celebrity Ascent", shipClass: "Edge" },
      { name: "Celebrity Xcel", shipClass: "Edge" },
      { name: "Celebrity Solstice", shipClass: "Solstice" },
      { name: "Celebrity Equinox", shipClass: "Solstice" },
      { name: "Celebrity Eclipse", shipClass: "Solstice" },
      { name: "Celebrity Silhouette", shipClass: "Solstice" },
      { name: "Celebrity Reflection", shipClass: "Solstice" },
      { name: "Celebrity Millennium", shipClass: "Millennium" },
      { name: "Celebrity Infinity", shipClass: "Millennium" },
      { name: "Celebrity Summit", shipClass: "Millennium" },
      { name: "Celebrity Constellation", shipClass: "Millennium" },
      { name: "Celebrity Flora", shipClass: "Galapagos" },
      { name: "Celebrity Xpedition", shipClass: "Galapagos" },
      { name: "Celebrity Xploration", shipClass: "Galapagos" },
    ],
  },
  {
    id: "holland-america",
    name: "Holland America Line",
    category: "premium",
    ships: [
      { name: "Koningsdam", shipClass: "Pinnacle" },
      { name: "Nieuw Statendam", shipClass: "Pinnacle" },
      { name: "Rotterdam", shipClass: "Pinnacle" },
      { name: "Eurodam", shipClass: "Signature" },
      { name: "Nieuw Amsterdam", shipClass: "Signature" },
      { name: "Zuiderdam", shipClass: "Vista" },
      { name: "Oosterdam", shipClass: "Vista" },
      { name: "Westerdam", shipClass: "Vista" },
      { name: "Noordam", shipClass: "Vista" },
      { name: "Volendam", shipClass: "Rotterdam" },
      { name: "Zaandam", shipClass: "Rotterdam" },
    ],
  },
  {
    id: "cunard",
    name: "Cunard",
    category: "premium",
    ships: [
      { name: "Queen Mary 2", shipClass: "Ocean liner" },
      { name: "Queen Victoria", shipClass: "Vista" },
      { name: "Queen Elizabeth", shipClass: "Vista" },
      { name: "Queen Anne", shipClass: "Pinnacle" },
    ],
  },
  {
    id: "azamara",
    name: "Azamara",
    category: "premium",
    ships: [
      { name: "Azamara Journey", shipClass: "R" },
      { name: "Azamara Quest", shipClass: "R" },
      { name: "Azamara Pursuit", shipClass: "R" },
      { name: "Azamara Onward", shipClass: "R" },
    ],
  },
  {
    id: "viking-ocean",
    name: "Viking",
    category: "premium",
    /**
     * CORRECTED 2026-08-19 from the Viking extraction. Three changes,
     * and the second one is the reason this line was chosen as the
     * pilot in the first place — it broke the premise.
     *
     * 1. VIKING SUN IS GONE. She is now Viking Yi Dun, PRC-registered
     *    and operated by China Merchants Viking Cruises on China
     *    itineraries. Viking's own press release describes Yi Dun as
     *    formerly Viking Sun. She is not a Viking-branded ocean ship a
     *    North American advisor can book, so she is out of the catalog
     *    rather than renamed in it. Add Yi Dun deliberately if China
     *    coverage is ever wanted; do not let her linger under a name
     *    that no longer exists.
     *
     * 2. THIS IS TWO CLASSES, NOT ONE. Vela, Vesta and Mira are a
     *    larger generation: 998 guests against 930, 784ft against
     *    745ft, 101ft beam against 94ft, and every stateroom category
     *    bigger. Viking calls Vela the first of a new generation of
     *    larger ocean ships at 54,300 GT, about 13% larger than the
     *    earlier hulls. The catalog had all twelve as one class.
     *
     *    That matters more than the correction itself. Viking was
     *    picked as the pilot BECAUSE it looked like twelve sisters and
     *    one deck plan — the best ships-per-review-unit ratio in the
     *    catalog. It is nine and three. The sister-difference check
     *    caught it before twelve records were written assuming
     *    sameness, which is precisely the failure it exists to prevent.
     *
     *    The newer class is named for its lead ship, as every other
     *    class in this catalog is. Viking's own deck-plan PDF filename
     *    suggests "Ocean XI" — Vela was the eleventh hull — but that is
     *    not stated on any page anyone read, so it is not asserted here.
     *
     * 3. VIKING MIRA WAS MISSING. Delivered 26 May 2026 and in service.
     *
     * Also confirmed and deliberately NOT added: Libra (delivery
     * November 2026) and Astrea (2027) are announced and not sailing.
     */
    ships: [
      { name: "Viking Star", shipClass: "Viking Ocean" },
      { name: "Viking Sea", shipClass: "Viking Ocean" },
      { name: "Viking Sky", shipClass: "Viking Ocean" },
      { name: "Viking Orion", shipClass: "Viking Ocean" },
      { name: "Viking Jupiter", shipClass: "Viking Ocean" },
      { name: "Viking Venus", shipClass: "Viking Ocean" },
      { name: "Viking Mars", shipClass: "Viking Ocean" },
      { name: "Viking Neptune", shipClass: "Viking Ocean" },
      { name: "Viking Saturn", shipClass: "Viking Ocean" },
      { name: "Viking Vela", shipClass: "Viking Vela" },
      { name: "Viking Vesta", shipClass: "Viking Vela" },
      { name: "Viking Mira", shipClass: "Viking Vela" },
    ],
  },
];
