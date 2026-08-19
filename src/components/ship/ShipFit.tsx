import { Emphasis } from "@/components/Emphasis";
import { DIMENSION_LABEL, groupFit, unexplainedItems } from "@/lib/fit";
import type { ShipFit as ShipFitData, ReadCategoryKey } from "@/lib/fit";

/**
 * WHAT CHANGES WITH WHO IS SAILING.
 *
 * Every sentence rendered here came out of the real engine — see
 * `src/lib/fit.ts` for why this is enumerated rather than described. The
 * component's only job is to lay the partition out by the answer that
 * turns each item on, because that is the shape of the question an
 * advisor arrives with.
 *
 * The caption states the profile count rather than implying coverage.
 * "Run across all 32 combinations" is a checkable claim; "we considered
 * different traveller types" is marketing.
 */

const CATEGORY_LABEL: Record<ReadCategoryKey, string> = {
  cabin: "Cabin",
  money: "Money",
  traps: "Traps",
};

function Item({
  category,
  kind,
  text,
}: {
  category: ReadCategoryKey;
  kind: "call" | "flag";
  text: string;
}) {
  return (
    <li
      className={`rounded-[10px] px-[13px] py-[11px] text-[0.92rem] leading-[1.5] ${
        kind === "call"
          ? "border-l-[3px] border-go bg-canvas text-ink"
          : "border border-line/70 bg-canvas text-ink-2"
      }`}
    >
      <span className="mr-2 font-readout text-[0.58rem] font-bold tracking-[0.07em] uppercase text-ink-3">
        {CATEGORY_LABEL[category]}
        {kind === "call" ? " · the call" : ""}
      </span>
      <Emphasis text={text} />
    </li>
  );
}

export function ShipFitSection({ fit }: { fit: ShipFitData }) {
  const groups = groupFit(fit);
  const loose = unexplainedItems(fit);

  return (
    <div>
      <p className="mb-4 max-w-[62ch] text-[0.86rem] leading-[1.55] text-ink-3">
        Derived by running this ship through the read engine on all{" "}
        {fit.profileCount} combinations of the four client questions and
        keeping what differed. Everything below is engine output, grouped by
        the answer that turns it on — nothing on this page decides for itself
        who a warning is for. Much of it also appears in the sections above,
        where it is filed by subject; what this section adds is which answer
        brings it up.
      </p>

      <div className="space-y-5">
        {groups.map((g) => (
          <div key={g.key}>
            <h3 className="mb-2 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
              <span className="font-readout text-[0.6rem] font-bold tracking-[0.09em] uppercase text-ink-3">
                {DIMENSION_LABEL[g.dimension]}
              </span>
              <span className="font-call text-[1.05rem] leading-[1.3] text-ink">
                If it&apos;s {g.label}
              </span>
              <span className="font-readout text-[0.62rem] tracking-[0.05em] text-ink-3">
                {g.items.length} change{g.items.length === 1 ? "" : "s"}
              </span>
            </h3>
            <ul className="list-none space-y-2">
              {g.items.map((it, i) => (
                <Item key={i} {...it} />
              ))}
            </ul>
          </div>
        ))}

        {loose.length > 0 && (
          <div>
            <h3 className="mb-2 font-call text-[1.05rem] leading-[1.3] text-ink">
              Depends on more than one answer
            </h3>
            <p className="mb-2 max-w-[62ch] text-[0.86rem] leading-[1.55] text-ink-3">
              These appear on some bookings and no single question explains
              which. Run the check with the real client to see whether they
              apply.
            </p>
            <ul className="list-none space-y-2">
              {loose.map((it, i) => (
                <Item key={i} {...it} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
