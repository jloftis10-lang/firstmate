import { chromium } from "playwright";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
let fail = 0;
const ok = (c, m) => { if (!c) { console.log("FAIL:", m); fail++; } };

for (const [w, h, tag] of [[1280, 1000, "desktop"], [390, 844, "mobile"]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  const text = async () => (await page.evaluate(() => {
    const c = document.body.cloneNode(true);
    c.querySelectorAll("script,template").forEach((n) => n.remove());
    return c.textContent;
  })).toLowerCase();

  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  const body = await text();
  ok(/first mate cruise/.test(body), `${tag}: brand name in header`);
  ok(/cruiseread\.com/.test(body) || w < 640, `${tag}: domain lockup (desktop only)`);
  ok(/run a booking check/.test(body), `${tag}: primary CTA`);
  ok(/where we don't know, we say so/.test(body), `${tag}: footer posture line`);
  ok(/79 of 195 ships carry a read/.test(body), `${tag}: derived footer counts`);
  ok((await page.locator("svg").count()) >= 1, `${tag}: lighthouse mark renders`);
  // No horizontal scroll, at either width.
  const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  ok(over <= 0, `${tag}: no horizontal scroll (overflow ${over}px)`);
  // Exactly one wordmark — header only, not duplicated in the page.
  const marks = (body.match(/first mate cruise/g) || []).length;
  ok(marks === 1, `${tag}: one wordmark, got ${marks}`);

  // Booking Check still runs end to end.
  await page.locator("select").first().selectOption({ label: "Radiance of the Seas" });
  await page.getByRole("button", { name: /run the check/i }).click();
  await page.waitForTimeout(1600);
  const read = await text();
  ok(/midship on decks 8 or 9/.test(read), `${tag}: engine output intact`);
  ok(/client-ready summary/.test(read), `${tag}: share feature present`);
  ok(await page.getByRole("button", { name: /copy a link to send/i }).count() === 1, `${tag}: share link button`);

  await page.screenshot({ path: `/tmp/claude-0/-home-user-cbddogguide-2026/6284de28-00bb-55d2-8938-6e2c75d8da76/scratchpad/60-shell-${tag}.png`, fullPage: false });
  console.log(`checked ${tag}`);
  await page.close();
}

// The CLIENT page must NOT get the advisor chrome.
const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
await page.goto("http://localhost:3000/share?ship=radiance-of-the-seas&who=couple&seasick=no&sailed=first&itinerary=sea-days", { waitUntil: "networkidle" });
const share = (await page.evaluate(() => document.body.textContent)).toLowerCase();
ok(/from your travel advisor/.test(share), "share: renders");
ok(!/run a booking check/.test(share), "share: NO advisor CTA");
ok(!/ships carry a read/.test(share), "share: NO coverage footer");
ok(/first mate/.test(share), "share: keeps its own branding");
await page.screenshot({ path: "/tmp/claude-0/-home-user-cbddogguide-2026/6284de28-00bb-55d2-8938-6e2c75d8da76/scratchpad/61-share.png", fullPage: false });
console.log("checked share (client-facing)");

await browser.close();
console.log(fail === 0 ? "PHASE 1 SHELL VERIFIED" : `${fail} FAILURES`);
process.exit(fail ? 1 : 0);
