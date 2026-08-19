import {
  attractionNames as namesFrom,
  attractionRules as rulesFrom,
  type AttractionEntry,
  type AttractionTable,
} from "@/lib/attractions";

/**
 * Royal Caribbean's attractions and their actual restrictions, as
 * constants a ship maps onto rather than prose each ship repeats.
 *
 * The shape and the joining live in `src/lib/attractions.ts`; this file
 * is only Royal's table. Norwegian has its own.
 *
 * OPERATOR-DIRECTED (Jimmy, 2026-08-19) at the Voyager/Freedom review:
 * "Instead of putting child restrictions in eight ship records, I would
 * make them attraction constants and map the current ship inventory onto
 * them. Then the ship overlay simply says which attractions are actually
 * present now."
 *
 * The reason this is worth a table rather than a paragraph is the
 * Navigator case. Everyone quotes "the Perfect Storm slides" for the
 * Voyager family; Navigator's slides are the Blaster and the Riptide,
 * which are different rides with different minimums — 47 inches and 42
 * inches against Perfect Storm's 48. Promise a family Cyclone and Typhoon
 * on Navigator and you are wrong twice: wrong about the ride and wrong
 * about who can get on it.
 *
 * A ship record lists WHICH of these it currently has. It does not
 * restate the numbers, so a Royal-wide change is one edit here.
 *
 * IMPORTANT: presence in a ship's list is a claim about TODAY, and
 * attractions get retired. The Sky Pad is the cautionary case — Royal
 * retired the bungee/VR experience fleetwide from 2023, and the domes
 * stayed up on Mariner and Independence after the attraction inside them
 * went away. It is deliberately NOT in this table: a record that could
 * name it would eventually quote its rules. If an attraction is gone,
 * delete it from the ship rather than keeping it with a caveat.
 */

export type AttractionId =
  | "flowrider"
  | "perfect-storm"
  | "blaster"
  | "riptide"
  | "tidal-wave"
  | "rock-wall"
  | "mini-golf"
  | "sports-court";

export type Attraction = AttractionEntry<AttractionId>;

export const ROYAL_ATTRACTIONS: AttractionTable<AttractionId> = {
  flowrider: {
    id: "flowrider",
    name: "FlowRider",
    rule: "the FlowRider needs 52 inches to bodyboard and 58 inches to stand up on a flowboard — that six-inch gap catches families out, because a child can ride it lying down and be turned away from standing",
  },
  "perfect-storm": {
    id: "perfect-storm",
    name: "The Perfect Storm (Typhoon and Cyclone)",
    rule: "the Perfect Storm racers, Typhoon and Cyclone, need 48 inches",
  },
  blaster: {
    id: "blaster",
    name: "The Blaster",
    rule: "the Blaster, the aqua coaster, needs 47 inches",
  },
  riptide: {
    id: "riptide",
    name: "The Riptide",
    rule: "the Riptide, the head-first mat racer, needs 42 inches and caps at 300 pounds",
  },
  "tidal-wave": {
    id: "tidal-wave",
    name: "Tidal Wave",
    rule: "Tidal Wave, the boomerang slide, needs 52 inches and has a weight range rather than just a cap — 75 pounds minimum and 280 pounds maximum, so it can turn away a small child AND a large adult",
  },
  "rock-wall": {
    id: "rock-wall",
    name: "the rock wall",
    rule: "the rock wall is age 6 and up with a signed waiver, and 6 to 12 need supervision",
  },
  "mini-golf": {
    id: "mini-golf",
    name: "the nine-hole mini-golf course",
  },
  "sports-court": {
    id: "sports-court",
    name: "the sports court",
  },
};

/** Royal's rules for exactly the rides a hull currently carries. */
export function attractionRules(ids: AttractionId[]): string {
  return rulesFrom(ROYAL_ATTRACTIONS, ids);
}

/** What's aboard, for a plain "here's what this hull has" sentence. */
export function attractionNames(ids: AttractionId[]): string {
  return namesFrom(ROYAL_ATTRACTIONS, ids);
}
