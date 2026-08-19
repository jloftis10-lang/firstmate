import type { ReactNode } from "react";
import type { Deck, DeckRow, DeckVerdict } from "@/lib/decks";
import { deckRows } from "@/lib/decks";

/**
 * THE DECK TABLE — the engine made visible.
 *
 * Every other surface tells an advisor the answer. This one shows the
 * working: for each deck, what is above, what is below, and what that
 * makes it. It is the difference between "book decks 8 or 9" and "here
 * is why 8 and 9, and here is why not 10".
 *
 * TOP DOWN, not bottom up. A deck plan is read the way you stand on a
 * ship, so deck 13 goes at the top of the table and deck 2 at the
 * bottom. Sorting ascending would be technically tidier and wrong to
 * look at.
 *
 * WHAT THIS DOES NOT DO: pick the answer. `quiet-candidate` means a deck
 * passes the above-and-below test, not that it is the recommendation.
 * Radiance computes three candidates and the operator answer is two of
 * them; Viking Star computes four and the answer is two. The table
 * narrows the field and the placement note picks from it, and conflating
 * those two is the error the whole rule was named to prevent. The
 * caption says so rather than leaving an advisor to infer it.
 */

const VERDICT: Record<DeckVerdict, { label: string; tone: string }> = {
  "quiet-candidate": { label: "Quiet candidate", tone: "border-go/40 bg-go-bg text-go" },
  "check-above": { label: "Check above", tone: "border-signal/40 bg-signal-bg text-signal" },
  "check-below": { label: "Check below", tone: "border-signal/40 bg-signal-bg text-signal" },
  "check-both": { label: "Check both", tone: "border-signal/40 bg-signal-bg text-signal" },
  "mixed-use": { label: "Mixed use", tone: "border-signal bg-signal-bg text-signal" },
  "not-a-cabin-deck": { label: "No cabins", tone: "border-line text-ink-3" },
  undetermined: { label: "Not checked", tone: "border-dashed border-ink-3/50 text-ink-3" },
};

const NEIGHBOUR: Record<DeckRow["above"], string> = {
  cabins: "cabins",
  public: "public",
  unknown: "—",
};

export function DeckTable({
  decks,
  caption,
}: {
  decks: Deck[];
  /**
   * Overrides the default caption. The default points at "the placement
   * call above", which is true on a ship page and on a class page and
   * false anywhere the table stands on its own — the homepage renders it
   * with no call above it. A caption that describes a neighbouring
   * element has to be able to change when the neighbour does.
   */
  caption?: ReactNode;
}) {
  const rows = deckRows(decks).reverse();

  return (
    <div>
      {/* Wide content scrolls inside its own container; the page never
          scrolls sideways. */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-left">
          <caption className="mb-3 text-left text-[0.86rem] leading-[1.55] text-ink-2">
            {caption ?? (
              <>
                A deck is a{" "}
                <strong className="font-semibold text-ink">quiet candidate</strong>{" "}
                when it has cabins directly above and directly below it and
                nothing public sharing it. That narrows the field — it does not
                pick the cabin. The placement call above does that, and it is
                allowed to be narrower than this table.
              </>
            )}
          </caption>
          <thead>
            <tr className="border-b border-line font-readout text-[0.62rem] tracking-[0.08em] uppercase text-ink-3">
              <th scope="col" className="py-2 pr-3 font-bold">Deck</th>
              <th scope="col" className="py-2 pr-3 font-bold">Cabins</th>
              <th scope="col" className="py-2 pr-3 font-bold">Below</th>
              <th scope="col" className="py-2 pr-3 font-bold">Above</th>
              <th scope="col" className="py-2 font-bold">Verdict</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const v = VERDICT[r.verdict];
              return (
                <tr key={r.deck} className="border-b border-line/60 align-top">
                  <th scope="row" className="py-2.5 pr-3 font-readout text-[0.82rem] font-bold text-ink">
                    {r.deck}
                  </th>
                  <td className="py-2.5 pr-3 text-[0.86rem] text-ink-2">
                    {r.carriesCabins ? "Yes" : "—"}
                  </td>
                  <td className="py-2.5 pr-3 text-[0.86rem] text-ink-2">{NEIGHBOUR[r.below]}</td>
                  <td className="py-2.5 pr-3 text-[0.86rem] text-ink-2">{NEIGHBOUR[r.above]}</td>
                  <td className="py-2.5">
                    <span className={`inline-block rounded-[5px] border px-1.5 py-[2px] font-readout text-[0.6rem] font-bold tracking-[0.06em] uppercase ${v.tone}`}>
                      {v.label}
                    </span>
                    {r.publicSpace.length > 0 && (
                      <span className="mt-1 block text-[0.8rem] leading-[1.45] text-ink-3">
                        {r.publicSpace.join(", ")}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ul className="mt-4 list-none space-y-1.5">
        {rows
          .filter((r) => r.carriesCabins)
          .map((r) => (
            <li key={r.deck} className="text-[0.86rem] leading-[1.5] text-ink-2">
              <span className="font-readout text-[0.72rem] font-bold text-ink">
                DECK {r.deck}
              </span>{" "}
              {r.reason}
            </li>
          ))}
      </ul>
    </div>
  );
}
