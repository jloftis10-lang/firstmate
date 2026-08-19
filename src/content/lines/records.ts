import type { ShipContent, Source } from "@/lib/types";
import {
  CARNIVAL_EMBARKATION,
  CARNIVAL_KIDS_RULES,
  CARNIVAL_MINOR_PLACEMENT,
  CARNIVAL_MONEY,
  CARNIVAL_SLIDE_RULES,
  CARNIVAL_SOURCES,
} from "../reads/carnival-common";
import {
  ROYAL_ATTRACTION_RULES,
  ROYAL_DECK_12_NUMBERING,
  ROYAL_EMBARKATION,
  ROYAL_FLEET_TRAPS,
  ROYAL_KIDS_COST,
  ROYAL_KIDS_RULES,
  ROYAL_MINOR_PLACEMENT,
  ROYAL_MONEY,
  ROYAL_SOURCES,
} from "../reads/royal-common";
import {
  NCL_EMBARKATION,
  NCL_FLEET_TRAPS,
  NCL_FREESTYLE,
  NCL_HAVEN_WARNING,
  NCL_KIDS_RULES,
  NCL_MINOR_PLACEMENT,
  NCL_MONEY,
  NCL_SOURCES,
} from "../reads/ncl-common";

/**
 * LINE RECORDS — the policy a cruise-line page renders.
 *
 * EVERY FIELD HERE IS A REFERENCE, NOT A COPY. That is the whole design
 * constraint and it is not stylistic: these constants are already the
 * source of truth for 79 ship records, and a line page that restated
 * them in its own words would be a second source that drifts the first
 * time a rate changes. If a line page needs a fact this file cannot
 * reach, the fix is to export the constant, never to retype it.
 *
 * You can check that mechanically: nothing below is a string literal
 * about a cruise line. Every value is an identifier imported from the
 * file that already owns it.
 *
 * WHAT IS DELIBERATELY ABSENT. Carnival has no fleet-traps array and no
 * separate kids-cost constant, because those were never factored out of
 * its class files — Royal and Norwegian have them and Carnival does not.
 * That asymmetry is real and it renders as an absence rather than being
 * papered over with invented parity. A Carnival page will show fewer
 * sections than a Royal one, and that is the honest state of the data.
 */

export type LinePolicySection = {
  /** Heading on the line page. */
  title: string;
  /** One paragraph, or a list of them. Always a referenced constant. */
  body: string | string[];
};

export type LineRecord = {
  /** Matches `CruiseLine.id` in the roster files. */
  id: string;
  /** Matches `Ship.line`, which is how ship records are keyed to a line. */
  name: string;
  sources: Source[];
  /** The same money block every ship on the line carries. */
  money: ShipContent["money"];
  sections: LinePolicySection[];
};

export const LINE_RECORDS: LineRecord[] = [
  {
    id: "carnival",
    name: "Carnival",
    sources: CARNIVAL_SOURCES,
    money: CARNIVAL_MONEY,
    sections: [
      { title: "Kids' clubs and age bands", body: CARNIVAL_KIDS_RULES },
      { title: "Where minors may be berthed", body: CARNIVAL_MINOR_PLACEMENT },
      { title: "Embarkation", body: CARNIVAL_EMBARKATION },
      { title: "Waterslides", body: CARNIVAL_SLIDE_RULES },
    ],
  },
  {
    id: "royal-caribbean",
    name: "Royal Caribbean",
    sources: ROYAL_SOURCES,
    money: ROYAL_MONEY,
    sections: [
      { title: "Kids' clubs and age bands", body: ROYAL_KIDS_RULES },
      { title: "What childcare costs", body: ROYAL_KIDS_COST },
      { title: "Where minors may be berthed", body: ROYAL_MINOR_PLACEMENT },
      { title: "Embarkation", body: ROYAL_EMBARKATION },
      { title: "Attraction restrictions", body: ROYAL_ATTRACTION_RULES },
      { title: "Deck numbering", body: ROYAL_DECK_12_NUMBERING },
      { title: "Fleet-wide money traps", body: ROYAL_FLEET_TRAPS },
    ],
  },
  {
    id: "norwegian",
    name: "Norwegian",
    sources: NCL_SOURCES,
    money: NCL_MONEY,
    sections: [
      { title: "Kids' clubs and age bands", body: NCL_KIDS_RULES },
      { title: "Where minors may be berthed", body: NCL_MINOR_PLACEMENT },
      { title: "Embarkation", body: NCL_EMBARKATION },
      { title: "Freestyle dining", body: NCL_FREESTYLE },
      { title: "The Haven", body: NCL_HAVEN_WARNING },
      { title: "Fleet-wide money traps", body: NCL_FLEET_TRAPS },
    ],
  },
];

export function getLineRecord(name: string): LineRecord | undefined {
  return LINE_RECORDS.find((l) => l.name === name);
}
