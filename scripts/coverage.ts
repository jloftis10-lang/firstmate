/**
 * Content coverage report — where the fleet stands.
 *
 * Run with `npm run coverage`. Shows verified ships, sample ships, and
 * how much of each line is still uncharted, so the content grind has a
 * scoreboard instead of a vibe.
 */
import { LINES, SHIPS } from "../src/content/ships";

const verified = SHIPS.filter((s) => s.content?.verified);
const sample = SHIPS.filter((s) => s.content && !s.content.verified);

console.log("");
console.log(`  ${SHIPS.length} ships · ${LINES.length} lines`);
console.log(
  `  ${verified.length} verified · ${sample.length} sample · ${
    SHIPS.length - verified.length - sample.length
  } uncharted`,
);
console.log("");

if (verified.length > 0) {
  console.log("  VERIFIED");
  for (const s of verified) console.log(`    ✓ ${s.line} · ${s.name}`);
  console.log("");
}

if (sample.length > 0) {
  console.log("  SAMPLE — content written, not yet confirmed");
  for (const s of sample) console.log(`    ~ ${s.line} · ${s.name}`);
  console.log("");
}

console.log("  BY LINE");
const rows = LINES.map((line) => {
  const fleet = SHIPS.filter((s) => s.line === line.name);
  const done = fleet.filter((s) => s.content?.verified).length;
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
