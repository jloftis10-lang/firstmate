import type { CruiseLine } from "@/lib/types";

/**
 * Expedition operators.
 *
 * ROSTER SNAPSHOT, not verified fact. See the note in contemporary.ts.
 * This is the fastest-moving and least stable part of the catalog —
 * charters, seasonal redeployments and brand changes are routine.
 *
 * Worth knowing before anyone writes read content here: much of the
 * three-category framework fits these ships poorly. Small expedition hulls
 * have no pool deck to book under, no drink-package break-even worth
 * calculating, and no kids' club height rules. Cover them in the picker so
 * advisors can find them; think hard before writing them a read.
 */
export const EXPEDITION_LINES: CruiseLine[] = [
  {
    id: "viking-expeditions",
    name: "Viking Expeditions",
    category: "expedition",
    ships: [
      { name: "Viking Octantis", shipClass: "Polar" },
      { name: "Viking Polaris", shipClass: "Polar" },
    ],
  },
  {
    id: "hurtigruten-hx",
    name: "HX (Hurtigruten Expeditions)",
    category: "expedition",
    ships: [
      { name: "MS Roald Amundsen", shipClass: "Amundsen" },
      { name: "MS Fridtjof Nansen", shipClass: "Amundsen" },
      { name: "MS Otto Sverdrup", shipClass: "Midnatsol" },
      { name: "MS Maud", shipClass: "Midnatsol" },
      { name: "MS Spitsbergen", shipClass: "Spitsbergen" },
      { name: "MS Santa Cruz II", shipClass: "Galapagos" },
    ],
  },
  {
    id: "lindblad",
    name: "Lindblad Expeditions",
    category: "expedition",
    ships: [
      { name: "National Geographic Endurance", shipClass: "Polar" },
      { name: "National Geographic Resolution", shipClass: "Polar" },
      { name: "National Geographic Explorer", shipClass: "Explorer" },
      { name: "National Geographic Orion", shipClass: "Orion" },
      { name: "National Geographic Islander II", shipClass: "Galapagos" },
      { name: "National Geographic Delfina", shipClass: "Galapagos" },
      { name: "National Geographic Venture", shipClass: "Coastal" },
      { name: "National Geographic Quest", shipClass: "Coastal" },
      { name: "National Geographic Sea Bird", shipClass: "Coastal" },
      { name: "National Geographic Sea Lion", shipClass: "Coastal" },
    ],
  },
  {
    id: "ponant",
    name: "Ponant",
    category: "expedition",
    ships: [
      { name: "Le Commandant Charcot", shipClass: "Icebreaker" },
      { name: "Le Bellot", shipClass: "Explorer" },
      { name: "Le Bougainville", shipClass: "Explorer" },
      { name: "Le Champlain", shipClass: "Explorer" },
      { name: "Le Dumont-d'Urville", shipClass: "Explorer" },
      { name: "Le Jacques-Cartier", shipClass: "Explorer" },
      { name: "Le Lapérouse", shipClass: "Explorer" },
      { name: "Le Boréal", shipClass: "Sisterships" },
      { name: "L'Austral", shipClass: "Sisterships" },
      { name: "Le Lyrial", shipClass: "Sisterships" },
      { name: "Le Soléal", shipClass: "Sisterships" },
      { name: "Le Ponant", shipClass: "Sailing yacht" },
    ],
  },
  {
    id: "quark",
    name: "Quark Expeditions",
    category: "expedition",
    ships: [
      { name: "Ultramarine", shipClass: "Ultramarine" },
      { name: "World Explorer", shipClass: "Infinity" },
      { name: "Ocean Explorer", shipClass: "Infinity" },
      { name: "Ocean Adventurer", shipClass: "Adventurer" },
    ],
  },
  {
    id: "aurora-expeditions",
    name: "Aurora Expeditions",
    category: "expedition",
    ships: [
      { name: "Greg Mortimer", shipClass: "Ulstein X-Bow" },
      { name: "Sylvia Earle", shipClass: "Ulstein X-Bow" },
      { name: "Douglas Mawson", shipClass: "Ulstein X-Bow" },
    ],
  },
  {
    id: "swan-hellenic",
    name: "Swan Hellenic",
    category: "expedition",
    ships: [
      { name: "SH Minerva", shipClass: "SH" },
      { name: "SH Vega", shipClass: "SH" },
      { name: "SH Diana", shipClass: "SH Diana" },
    ],
  },
  {
    id: "atlas-ocean",
    name: "Atlas Ocean Voyages",
    category: "expedition",
    ships: [
      { name: "World Navigator", shipClass: "World" },
      { name: "World Traveller", shipClass: "World" },
      { name: "World Voyager", shipClass: "World" },
    ],
  },
];
