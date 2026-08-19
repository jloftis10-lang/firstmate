/**
 * ENGINE SNAPSHOT — the safety net for the platform refactor.
 *
 * The UI work ahead splits `FirstMate.tsx`, moves the Booking Check to
 * its own route and rebuilds the results shell. None of that is supposed
 * to change a single word the engine produces. This proves it.
 *
 * Every covered ship is run through every input combination — 4 parties
 * × 2 seasick × 2 experience × 2 itineraries — and the output hashed.
 * A one-character change in any call, flag, why or client summary moves
 * the hash and fails the check.
 *
 * Three ships are also stored in full text, so a diff tells you WHAT
 * changed rather than only that something did. Hashes alone would say
 * "something moved" and leave you grepping.
 *
 *   npm run snapshot          write scripts/engine-snapshot.json
 *   npm run snapshot -- --check   compare against it, exit 1 on drift
 *
 * The snapshot is committed. It is not a cache and deleting it does not
 * fix anything — it is the record of what the engine said before the
 * refactor started.
 */

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { SHIPS } from "../src/content/ships";
import { SHIP_READS } from "../src/content/reads";
import { clientSummary, getRead } from "../src/lib/engine";
import type {
  ClientProfile,
  CoveredShip,
  Experience,
  Itinerary,
  Party,
  Seasick,
} from "../src/lib/types";

const PARTIES: Party[] = ["couple", "family", "multigen", "solo"];
const SEASICK: Seasick[] = ["no", "yes"];
const EXPERIENCE: Experience[] = ["first", "seasoned"];
const ITINERARY: Itinerary[] = ["port-heavy", "sea-days"];

/** Chosen for spread, not fame: a Carnival hull, a Royal one, an NCL one. */
const CANARIES = ["carnival-spirit", "radiance-of-the-seas", "norwegian-prima"];

const SNAPSHOT_PATH = "scripts/engine-snapshot.json";

type Snapshot = {
  generated: string;
  ships: number;
  profiles: number;
  /** shipId → hash of every profile's output, concatenated in order. */
  hashes: Record<string, string>;
  /** Full text for the canaries, so a failure is readable. */
  canaries: Record<string, string>;
};

function profiles(shipId: string): ClientProfile[] {
  const out: ClientProfile[] = [];
  for (const party of PARTIES)
    for (const seasick of SEASICK)
      for (const experience of EXPERIENCE)
        for (const itinerary of ITINERARY)
          out.push({ shipId, party, seasick, experience, itinerary });
  return out;
}

/** Deterministic, order-stable rendering of everything the engine says. */
function render(ship: CoveredShip, client: ClientProfile): string {
  const read = getRead(ship, client);
  const lines: string[] = [
    `--- ${client.party}/${client.seasick}/${client.experience}/${client.itinerary}`,
  ];
  if (read.ineligible) lines.push(`INELIGIBLE: ${read.ineligible.reason}`);
  for (const [name, cat] of [
    ["cabin", read.cabin],
    ["money", read.money],
    ["traps", read.traps],
  ] as const) {
    if (!cat) {
      lines.push(`${name}: null`);
      continue;
    }
    lines.push(`${name}.verified: ${cat.verified}`);
    lines.push(`${name}.call: ${cat.call}`);
    cat.flags.forEach((f, i) => lines.push(`${name}.flag[${i}]: ${f}`));
    lines.push(`${name}.why: ${cat.why}`);
    (cat.linePolicy ?? []).forEach((p, i) =>
      lines.push(`${name}.linePolicy[${i}]: ${p}`),
    );
  }
  lines.push(`summary: ${clientSummary(ship, client)}`);
  return lines.join("\n");
}

function build(): Snapshot {
  const hashes: Record<string, string> = {};
  const canaries: Record<string, string> = {};
  let profileCount = 0;

  for (const s of SHIPS) {
    const content = SHIP_READS[s.id];
    if (!content) continue;
    const ship = { ...s, content } as CoveredShip;
    const rendered = profiles(s.id).map((c) => render(ship, c));
    profileCount = rendered.length;
    hashes[s.id] = createHash("sha256").update(rendered.join("\n")).digest("hex");
    if (CANARIES.includes(s.id)) canaries[s.id] = rendered.join("\n");
  }

  return {
    generated: new Date().toISOString().slice(0, 10),
    ships: Object.keys(hashes).length,
    profiles: profileCount,
    hashes,
    canaries,
  };
}

function main() {
  const check = process.argv.includes("--check");
  const next = build();

  if (!check) {
    writeFileSync(SNAPSHOT_PATH, JSON.stringify(next, null, 2) + "\n");
    console.log(
      `wrote ${SNAPSHOT_PATH} — ${next.ships} ships × ${next.profiles} profiles`,
    );
    return;
  }

  const prev: Snapshot = JSON.parse(readFileSync(SNAPSHOT_PATH, "utf8"));
  const problems: string[] = [];

  const prevIds = Object.keys(prev.hashes);
  const nextIds = Object.keys(next.hashes);
  for (const id of prevIds)
    if (!nextIds.includes(id)) problems.push(`${id}: ship LOST coverage`);
  for (const id of nextIds)
    if (!prevIds.includes(id)) problems.push(`${id}: ship GAINED coverage`);
  if (prev.profiles !== next.profiles)
    problems.push(`profile count ${prev.profiles} → ${next.profiles}`);

  for (const id of prevIds) {
    if (!nextIds.includes(id)) continue;
    if (prev.hashes[id] === next.hashes[id]) continue;
    problems.push(`${id}: engine output CHANGED`);
    // For a canary, say exactly which line moved.
    const before = (prev.canaries[id] ?? "").split("\n");
    const after = (next.canaries[id] ?? "").split("\n");
    for (let i = 0; i < Math.max(before.length, after.length); i++) {
      if (before[i] === after[i]) continue;
      problems.push(`    - ${before[i] ?? "(absent)"}`);
      problems.push(`    + ${after[i] ?? "(absent)"}`);
    }
  }

  if (problems.length) {
    console.error("ENGINE DRIFT\n" + problems.join("\n"));
    console.error(
      `\nIf a change was intended, re-run \`npm run snapshot\` and commit the diff\nSO THE CHANGE IS VISIBLE IN REVIEW. Do not delete the snapshot.`,
    );
    process.exit(1);
  }
  console.log(
    `engine unchanged — ${next.ships} ships × ${next.profiles} profiles, ${next.ships * next.profiles} reads`,
  );
}

main();
