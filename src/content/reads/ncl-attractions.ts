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
  | "the-rush"
  | "epic-waterslides";

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
  /**
   * Epic's slides are one entry rather than several on purpose. NCL's
   * current FAQ sets a SINGLE rule for the whole complex — "Norwegian
   * Epic, All Waterslides" — which is the opposite of the Icon Category 6
   * situation where every ride differs. An earlier version of the Epic
   * record carried three conflicting figures and told the advisor to
   * check; the line publishes one number and it covers everything.
   */
  "epic-waterslides": {
    id: "epic-waterslides",
    name: "the three multi-storey waterslides, including the 200-foot Epic Plunge",
    rule: "every waterslide on this ship runs the same rule — 42 inches minimum and a 300-pound maximum, across all of them. That's unusually simple for a slide complex this size, and it means clearing one really does clear the rest here",
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
