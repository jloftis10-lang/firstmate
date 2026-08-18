/**
 * CURRENT OPERATIONAL STATUS — deliberately not a ship property.
 *
 * This field exists because of one finding at the Quantum-class review:
 * RipCord by iFLY is out of service on Quantum of the Seas right now.
 * Everything else in a ship record answers "what is this hull like",
 * which is stable for years. That claim answers "what is working this
 * month", which is stable for weeks.
 *
 * Written into `traps.other` as prose those two would be
 * indistinguishable, and the perishable one would quietly rot into
 * permanent ship knowledge — an advisor reading a 2026 record in 2028
 * would tell a client the skydiving tunnel is broken long after it was
 * fixed. That is the same failure as a stale price, and worse, because
 * nothing about the sentence would have looked stale.
 *
 * So status gets its own type, and the type makes three things
 * mandatory: WHAT, WHEN it was checked, and WHERE from. The rendered
 * flag leads with the date and ends by telling the advisor to re-check.
 * A record that cannot supply a date and a source cannot express a
 * status at all, which is the intended constraint.
 *
 * OPERATOR-DIRECTED (Jimmy, 2026-08-19): "facilities and current
 * availability need separate fields."
 */

export type AvailabilityStatus =
  | "out-of-service"
  | "seasonal"
  | "reduced"
  | "not-yet-open";

export type ActivityAvailability = {
  /** The venue or attraction, named as the line names it. */
  activity: string;
  status: AvailabilityStatus;
  /** ISO date this status was checked. Required — see the file comment. */
  checked: string;
  /** Where it was checked. Required for the same reason. */
  source: string;
  /** Anything that changes what the advisor should do about it. */
  note?: string;
};

const PHRASING: Record<AvailabilityStatus, string> = {
  "out-of-service": "is out of service",
  seasonal: "runs seasonally rather than on every sailing",
  reduced: "is running reduced hours or reduced capacity",
  "not-yet-open": "has not opened yet",
};

/**
 * One flag covering everything currently off-normal on this hull.
 *
 * Returns "" when there is nothing to say, so the engine can push it
 * unconditionally without emitting an empty reassurance. "Nothing is
 * broken" is not a claim this record is entitled to make — an empty list
 * means nobody checked, not that everything works.
 */
export function availabilitySentence(items: ActivityAvailability[]): string {
  if (items.length === 0) return "";

  const parts = items.map((i) => {
    const note = i.note ? ` ${i.note}` : "";
    return `${i.activity} ${PHRASING[i.status]}.${note}`;
  });

  const dates = [...new Set(items.map((i) => i.checked))].sort();
  const when = dates.length === 1 ? dates[0] : `${dates[0]} to ${dates[dates.length - 1]}`;

  return `Check what's actually running before you sell it. As of ${when}: ${parts.join(" ")} This is a status, not a fact about the ship — it changes without this record changing, so confirm it on the line's own page for the sailing rather than trusting the date above.`;
}
