import { chromium } from "playwright";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
let fail = 0;
const ok = (c, m) => { if (!c) { console.log("FAIL:", m); fail++; } };
const page = await browser.newPage({ viewport: { width: 1280, height: 1100 } });
const text = async () => (await page.evaluate(() => {
  const c = document.body.cloneNode(true);
  c.querySelectorAll("script,template").forEach((n) => n.remove());
  return c.textContent;
})).toLowerCase();

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.locator("select").first().selectOption({ label: "Radiance of the Seas" });
await page.getByRole("button", { name: /run the check/i }).click();
await page.waitForTimeout(1600);
const body = await text();

// Provenance badge, live on all three cards.
const badges = await page.locator("text=/^Verified$/i").count();
ok(badges === 3, `three VERIFIED badges, got ${badges}`);
ok(!/not signed off/.test(body), "old ad-hoc marker replaced");
ok(/sources · checked 2026-08-19/.test(body), "sourcing line renders with date");
ok(await page.getByRole("link", { name: /view source/i }).count() >= 3, "source links present");

// The source link actually points at a real source URL.
const href = await page.getByRole("link", { name: /view source/i }).first().getAttribute("href");
ok(/^https?:\/\//.test(href), `source link is a URL, got ${href}`);

// RiskFlag still renders the flags.
ok(/heads up/.test(body), "risk flags render");

// Contrast check on the badge + flag chips, computed from rendered pixels.
const contrast = await page.evaluate(() => {
  const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const L = (rgb) => { const [r, g, b] = rgb.match(/\d+/g).map(Number); return 0.2126*lin(r) + 0.7152*lin(g) + 0.0722*lin(b); };
  const ratio = (a, b) => { const la = L(a), lb = L(b); const hi = Math.max(la, lb), lo = Math.min(la, lb); return (hi + 0.05) / (lo + 0.05); };
  const out = [];
  for (const el of document.querySelectorAll("span,li")) {
    const t = (el.textContent || "").trim();
    if (!/^(Verified|HEADS UP)$/i.test(t)) continue;
    const cs = getComputedStyle(el);
    let bg = cs.backgroundColor, node = el;
    while (bg === "rgba(0, 0, 0, 0)" && node.parentElement) { node = node.parentElement; bg = getComputedStyle(node).backgroundColor; }
    out.push({ t, r: +ratio(cs.color, bg).toFixed(2) });
  }
  return out;
});
for (const c of contrast) {
  console.log(`  contrast "${c.t}": ${c.r}:1`);
  ok(c.r >= 4.5, `"${c.t}" meets AA (${c.r}:1)`);
}

// aria-expanded on every disclosure.
const btns = await page.locator("button[aria-expanded]").count();
ok(btns >= 1, `disclosures expose aria-expanded, found ${btns}`);

await page.screenshot({ path: "/tmp/claude-0/-home-user-cbddogguide-2026/6284de28-00bb-55d2-8938-6e2c75d8da76/scratchpad/70-provenance.png", clip: { x: 300, y: 60, width: 680, height: 620 } });
await browser.close();
console.log(fail === 0 ? "PHASE 2 COMPONENTS VERIFIED" : `${fail} FAILURES`);
process.exit(fail ? 1 : 0);
