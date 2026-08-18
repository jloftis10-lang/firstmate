/**
 * What sits above or below a cabin, ranked by how much it will bite.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-17), transcribed from his risk table
 * and confirmed correct as recorded. This is general judgment — it holds on any hull, any line — so
 * it lives here rather than being repeated in every ship record. A ship
 * record's job is only to say WHICH of these it has and WHERE.
 *
 * The order of this array is the ranking: worst first. Nothing here is a
 * score to weigh, it is a sort order for deciding what to warn about.
 */
export type NoiseSource = {
  id: string;
  /** The venue, as an advisor would name it. */
  venue: string;
  /** Jimmy's risk label, verbatim. */
  risk: string;
  /** What the traveler actually experiences, verbatim. */
  experience: string;
};

export const NOISE_SOURCES: NoiseSource[] = [
  {
    id: "lido",
    venue: "the pool or Lido deck",
    risk: "Very high",
    experience:
      "chairs scraping, cleaning, footsteps, music, deck parties",
  },
  {
    id: "buffet",
    venue: "the buffet or a large restaurant",
    risk: "High",
    experience: "carts, chairs, cleaning, early breakfast setup",
  },
  {
    id: "galley",
    venue: "a galley or service area",
    risk: "High",
    experience: "carts, equipment, dishes, overnight and early prep",
  },
  {
    id: "gym",
    venue: "the gym",
    risk: "High",
    experience: "treadmills, dropped weights, classes",
  },
  {
    id: "nightclub",
    venue: "a nightclub or music venue",
    risk: "High",
    experience: "bass and vibration late at night",
  },
  {
    id: "sports",
    venue: "a sports court or running track",
    risk: "High",
    experience: "bouncing balls, running, stomping",
  },
  {
    id: "kids",
    venue: "a kids' or water-play area",
    risk: "High",
    experience: "running, activity noise, daytime traffic",
  },
  {
    id: "theater",
    venue: "the theater or a show venue",
    risk: "High",
    experience: "bass, rehearsals, shows",
  },
  {
    id: "bar",
    venue: "a bar or lounge",
    risk: "Medium-high",
    experience: "music, chairs, late crowds",
  },
  {
    id: "restaurant-quiet",
    venue: "a quiet restaurant",
    risk: "Medium",
    experience: "mostly chairs and carts at opening and closing",
  },
  {
    id: "spa",
    venue: "spa treatment rooms",
    risk: "Low",
    experience: "relatively quiet",
  },
  {
    id: "cabins",
    venue: "other cabins",
    risk: "Best",
    experience: "normal passenger noise",
  },
];

const BY_ID = new Map(NOISE_SOURCES.map((s) => [s.id, s]));
const RANK = new Map(NOISE_SOURCES.map((s, i) => [s.id, i]));

export function noiseSource(id: string): NoiseSource | undefined {
  return BY_ID.get(id);
}

/** Lower is worse. Unknown ids sort last. */
export function noiseRank(id: string): number {
  return RANK.get(id) ?? Number.MAX_SAFE_INTEGER;
}
