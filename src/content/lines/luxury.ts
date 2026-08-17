import type { CruiseLine } from "@/lib/types";

/**
 * Luxury and ultra-luxury lines.
 *
 * ROSTER SNAPSHOT, not verified fact. See the note in contemporary.ts.
 * The long tail moves fastest here — small fleets, frequent new builds,
 * and hulls that change brand entirely.
 */
export const LUXURY_LINES: CruiseLine[] = [
  {
    id: "oceania",
    name: "Oceania Cruises",
    category: "luxury",
    ships: [
      { name: "Oceania Vista", shipClass: "Allura" },
      { name: "Oceania Allura", shipClass: "Allura" },
      { name: "Oceania Marina", shipClass: "Oceania" },
      { name: "Oceania Riviera", shipClass: "Oceania" },
      { name: "Oceania Regatta", shipClass: "R" },
      { name: "Oceania Insignia", shipClass: "R" },
      { name: "Oceania Nautica", shipClass: "R" },
      { name: "Oceania Sirena", shipClass: "R" },
    ],
  },
  {
    id: "regent",
    name: "Regent Seven Seas",
    category: "luxury",
    ships: [
      { name: "Seven Seas Grandeur", shipClass: "Explorer" },
      { name: "Seven Seas Splendor", shipClass: "Explorer" },
      { name: "Seven Seas Explorer", shipClass: "Explorer" },
      { name: "Seven Seas Voyager", shipClass: "Voyager" },
      { name: "Seven Seas Mariner", shipClass: "Mariner" },
      { name: "Seven Seas Navigator", shipClass: "Navigator" },
    ],
  },
  {
    id: "seabourn",
    name: "Seabourn",
    category: "luxury",
    ships: [
      { name: "Seabourn Encore", shipClass: "Encore" },
      { name: "Seabourn Ovation", shipClass: "Encore" },
      { name: "Seabourn Sojourn", shipClass: "Odyssey" },
      { name: "Seabourn Odyssey", shipClass: "Odyssey" },
      { name: "Seabourn Quest", shipClass: "Odyssey" },
      { name: "Seabourn Venture", shipClass: "Expedition" },
      { name: "Seabourn Pursuit", shipClass: "Expedition" },
    ],
  },
  {
    id: "silversea",
    name: "Silversea",
    category: "luxury",
    ships: [
      { name: "Silver Nova", shipClass: "Nova" },
      { name: "Silver Ray", shipClass: "Nova" },
      { name: "Silver Muse", shipClass: "Muse" },
      { name: "Silver Moon", shipClass: "Muse" },
      { name: "Silver Dawn", shipClass: "Muse" },
      { name: "Silver Shadow", shipClass: "Shadow" },
      { name: "Silver Whisper", shipClass: "Shadow" },
      { name: "Silver Spirit", shipClass: "Spirit" },
      { name: "Silver Cloud", shipClass: "Cloud (expedition)" },
      { name: "Silver Wind", shipClass: "Cloud (expedition)" },
      { name: "Silver Origin", shipClass: "Galapagos" },
      { name: "Silver Endeavour", shipClass: "Endeavour" },
    ],
  },
  {
    id: "explora-journeys",
    name: "Explora Journeys",
    category: "luxury",
    ships: [
      { name: "Explora I", shipClass: "Explora" },
      { name: "Explora II", shipClass: "Explora" },
    ],
  },
  {
    id: "ritz-carlton",
    name: "The Ritz-Carlton Yacht Collection",
    category: "luxury",
    ships: [
      { name: "Evrima", shipClass: "Evrima" },
      { name: "Ilma", shipClass: "Ilma" },
      { name: "Luminara", shipClass: "Ilma" },
    ],
  },
  {
    id: "windstar",
    name: "Windstar Cruises",
    category: "luxury",
    ships: [
      { name: "Star Breeze", shipClass: "Star" },
      { name: "Star Legend", shipClass: "Star" },
      { name: "Star Pride", shipClass: "Star" },
      { name: "Wind Surf", shipClass: "Sail" },
      { name: "Wind Spirit", shipClass: "Sail" },
      { name: "Wind Star", shipClass: "Sail" },
    ],
  },
];
