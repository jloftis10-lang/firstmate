/**
 * Focused regression checks for the deck-stack arithmetic.
 *
 * These cases are deliberately tiny. The engine snapshot does not consume
 * deck data, so it cannot catch either failure: a skipped deck number being
 * mistaken for a missing physical neighbour, or a mixed-use neighbour being
 * treated as a pure cabin deck.
 */
import assert from "node:assert/strict";
import { CELEBRITY_EDGE_PLACEMENT_RESEARCH } from "../src/content/research/celebrity-edge-placement";
import { deckRows, quietCandidates, type Deck } from "../src/lib/decks";

const skippedNumbering: Deck[] = [
  { deck: 11, carriesCabins: true, publicSpace: [] },
  { deck: 12, carriesCabins: true, publicSpace: [] },
  { deck: 14, carriesCabins: false, publicSpace: ["Pool"] },
];

const deck12 = deckRows(skippedNumbering).find((row) => row.deck === 12);
assert.equal(deck12?.above, "public");
assert.equal(deck12?.verdict, "check-above");

const mixedNeighbour: Deck[] = [
  { deck: 6, carriesCabins: true, publicSpace: ["Eden"] },
  { deck: 7, carriesCabins: true, publicSpace: [] },
  { deck: 8, carriesCabins: true, publicSpace: [] },
  { deck: 9, carriesCabins: true, publicSpace: [] },
];

const deck7 = deckRows(mixedNeighbour).find((row) => row.deck === 7);
assert.equal(deck7?.below, "public");
assert.equal(deck7?.verdict, "check-below");
assert.deepEqual(quietCandidates(mixedNeighbour), [8]);

const edgeResearch = new Map(
  CELEBRITY_EDGE_PLACEMENT_RESEARCH.map((ship) => [ship.ship, ship]),
);
assert.deepEqual(edgeResearch.get("Celebrity Edge")?.arithmeticCandidates, [8, 9, 10]);
assert.deepEqual(edgeResearch.get("Celebrity Apex")?.arithmeticCandidates, [8, 9, 10]);
assert.deepEqual(edgeResearch.get("Celebrity Beyond")?.arithmeticCandidates, [8, 9, 10, 11]);
assert.deepEqual(edgeResearch.get("Celebrity Ascent")?.arithmeticCandidates, [8, 9, 10, 11]);
assert.deepEqual(edgeResearch.get("Celebrity Xcel")?.arithmeticCandidates, [8, 9, 10, 11]);
assert.equal(edgeResearch.get("Celebrity Edge")?.operatorStatus, "signed-2026-08-24");
assert.equal(edgeResearch.get("Celebrity Edge")?.currentPlanReviewed, "2026-08-24");
assert.equal(
  edgeResearch.get("Celebrity Xcel")?.operatorStatus,
  "signed-2026-08-24",
);

console.log("deck arithmetic holds — skipped numbering and mixed neighbours");
