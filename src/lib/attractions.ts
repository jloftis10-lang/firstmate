/**
 * The machinery behind a line's attraction table. The TABLES are
 * line-specific and live in `src/content/reads/<line>-attractions.ts`;
 * only the shape and the joining live here.
 *
 * This was extracted when Norwegian needed the same structure Royal
 * already had. Copying fifteen lines of join logic into a second file
 * would have been the cheaper move and exactly the drift risk
 * `operator-rules.ts` exists to prevent — two tables rendering the same
 * facts in subtly different sentences is worse than either alone.
 *
 * Why a table at all: the Navigator case on Royal and the Aqua/Luna case
 * on Norwegian are the same problem. A class name does not tell you what
 * rides a hull has, and quoting one sister's height minimum for another
 * turns a family away at the queue. Restrictions belong to the
 * ATTRACTION; a ship record only says which attractions it currently
 * carries.
 */

export type AttractionEntry<Id extends string> = {
  id: Id;
  /** As the line names it, because that's what's on the sign at the queue. */
  name: string;
  /**
   * The restriction sentence, complete and quotable.
   *
   * OPTIONAL, because "what's aboard" and "what has a height rule" are
   * different questions. Mini-golf and a sports court belong in a hull's
   * inventory but gate nobody, and inventing a restriction to fill the
   * field would be worse than leaving it empty.
   */
  rule?: string;
};

export type AttractionTable<Id extends string> = Record<Id, AttractionEntry<Id>>;

/**
 * The restriction sentence for exactly the attractions a hull currently
 * has — nothing about rides it doesn't.
 *
 * Returns "" when none of them carry a rule, so a ship says nothing here
 * rather than falling back to a generic fleet paragraph that might name
 * a ride it doesn't have.
 */
export function attractionRules<Id extends string>(
  table: AttractionTable<Id>,
  ids: Id[],
): string {
  const rules = ids
    .map((id) => table[id]?.rule)
    .filter(Boolean) as string[];
  if (rules.length === 0) return "";
  const last = rules.pop() as string;
  const joined = rules.length ? `${rules.join("; ")}; and ${last}` : last;
  return `On this ship specifically: ${joined}. Different rides, different numbers — clearing one does not clear the rest, so check the ride the child actually wants.`;
}

/** What's aboard, for a plain "here's what this hull has" sentence. */
export function attractionNames<Id extends string>(
  table: AttractionTable<Id>,
  ids: Id[],
): string {
  return ids.map((id) => table[id]?.name).filter(Boolean).join(", ");
}
