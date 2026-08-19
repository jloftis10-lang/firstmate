import {
  attractionNames as namesFrom,
  attractionRules as rulesFrom,
  type AttractionEntry,
  type AttractionTable,
} from "@/lib/attractions";

/**
 * Norwegian's attractions and their restrictions.
 *
 * The shape and the joining live in `src/lib/attractions.ts`; this file
 * is only NCL's table. Royal has its own.
 *
 * The case that forced it here is the same one that forced it on Royal,
 * one class earlier: Prima and Viva have the Speedway go-kart track;
 * Aqua and Luna do not and have the Slidecoaster instead. Those are
 * different rides with different minimums — 55 inches against 48 — so a
 * class-level "go-kart rule" would turn a child away on one hull and let
 * a too-short one queue on another.
 *
 * SPEEDWAY IS 55 INCHES, not 48. The earlier record said NCL's own FAQ
 * and the ship material disagreed and told the advisor to check. Jimmy
 * resolved it against NCL's current activity FAQ: 55 inch minimum, 82
 * inch maximum. Recording a real conflict is honest; leaving one
 * recorded after it's been resolved is just an unfinished job.
 *
 * The Speedway WEIGHT cap stays source-dated inside its own sentence,
 * because NCL's pages have carried different figures in different
 * locales. That is a live conflict, unlike the height.
 */

export type NclAttractionId =
  | "speedway"
  | "slidecoaster"
  | "the-drop"
  | "the-rush";

export type NclAttraction = AttractionEntry<NclAttractionId>;

export const NCL_ATTRACTIONS: AttractionTable<NclAttractionId> = {
  speedway: {
    id: "speedway",
    name: "the Speedway go-kart track",
    rule: "the Speedway go-karts need 55 inches minimum and cap at 82 inches maximum — it's a height WINDOW, not just a floor, so a tall teenager can be turned away too. NCL's pages have carried different weight caps in different locales; the figure seen in August 2026 was 265 pounds, so quote it as approximate and confirm for the sailing. Closed flat shoes only — no Crocs and no flip-flops, which is the thing that actually sends families back to the cabin",
  },
  slidecoaster: {
    id: "slidecoaster",
    name: "the Aqua Slidecoaster",
    rule: "the Slidecoaster needs 48 inches",
  },
  "the-drop": {
    id: "the-drop",
    name: "The Drop",
    rule: "The Drop, the free-fall slide, needs 55 inches and caps at 330 pounds",
  },
  "the-rush": {
    id: "the-rush",
    name: "The Rush",
    rule: "The Rush needs 48 inches and caps at 330 pounds",
  },
};

/** NCL's rules for exactly the rides a hull currently carries. */
export function nclAttractionRules(ids: NclAttractionId[]): string {
  return rulesFrom(NCL_ATTRACTIONS, ids);
}

/** What's aboard, for a plain "here's what this hull has" sentence. */
export function nclAttractionNames(ids: NclAttractionId[]): string {
  return namesFrom(NCL_ATTRACTIONS, ids);
}
