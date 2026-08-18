/**
 * Content coverage report — where the fleet stands.
 *
 * Run with `npm run coverage`. Shows verified ships, sample ships, and
 * how much of each line is still uncharted, so the content grind has a
 * scoreboard instead of a vibe.
 */
import { blockStates } from "../src/lib/types";
import { LINES, SHIPS } from "../src/content/ships";

const verified = SHIPS.filter((s) => s.content && blockStates(s.content).allVerified);
const partial = SHIPS.filter(
  (s) => s.content && blockStates(s.content).anyVerified && !blockStates(s.content).allVerified,
);
const researched = SHIPS.filter(
  (s) =>
    s.content && !blockStates(s.content).anyVerified && s.content.sources?.length,
);
const invented = SHIPS.filter(
  (s) =>
    s.content && !blockStates(s.content).anyVerified && !s.content.sources?.length,
);

console.log("");
console.log(`  ${SHIPS.length} ships · ${LINES.length} lines`);
console.log(
  `  ${verified.length} verified · ${partial.length} part-verified · ${
    researched.length
  } researched · ${invented.length} placeholder · ${
    SHIPS.length - verified.length - partial.length - researched.length - invented.length
  } uncharted`,
);
console.log("");

if (verified.length > 0) {
  console.log("  VERIFIED — signed off by an operator");
  for (const s of verified) console.log(`    ✓ ${s.line} · ${s.name}`);
  console.log("");
}

if (partial.length > 0) {
  console.log("  PART-VERIFIED — some blocks signed off, some not");
  for (const s of partial) {
    const b = blockStates(s.content!);
    console.log(`    ~ ${s.line} · ${s.name}  (${b.verified}/${b.present} blocks)`);
  }
  console.log("");
}

if (researched.length > 0) {
  console.log("  RESEARCHED — sourced, awaiting sign-off");
  for (const s of researched) {
    console.log(
      `    ? ${s.line} · ${s.name}  (${s.content!.sources!.length} sources)`,
    );
  }
  console.log("");
}

if (invented.length > 0) {
  console.log("  PLACEHOLDER — no sources, written to demo the format");
  for (const s of invented) console.log(`    ! ${s.line} · ${s.name}`);
  console.log("");
}

console.log("  BY LINE");
const rows = LINES.map((line) => {
  const fleet = SHIPS.filter((s) => s.line === line.name);
  const done = fleet.filter((s) => s.content && blockStates(s.content).allVerified).length;
  return { name: line.name, done, total: fleet.length };
}).sort((a, b) => b.done - a.done || b.total - a.total);

const width = Math.max(...rows.map((r) => r.name.length));
for (const r of rows) {
  const bar = r.total > 0 ? "█".repeat(Math.round((r.done / r.total) * 20)) : "";
  console.log(
    `    ${r.name.padEnd(width)}  ${String(r.done).padStart(3)}/${String(
      r.total,
    ).padEnd(3)} ${bar}`,
  );
}
console.log("");
