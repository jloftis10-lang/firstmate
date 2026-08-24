import type { ClientProfile, CoveredShip } from "./types";
import { clientSummary } from "./engine";
import { blockStates } from "./types";
import { sharePath } from "./share";

/**
 * The client-facing email, rendered server-side.
 *
 * Same register as the share page: the warm summary and nothing else —
 * no flags, no operator jargon. Inline styles throughout because email
 * clients strip everything else; Georgia stands in for Newsreader since
 * webfonts don't survive most inboxes.
 */

const BASE = "https://cruiseread.com";

export function summaryEmail(ship: CoveredShip, client: ClientProfile) {
  const summary = clientSummary(ship, client);
  const { allVerified } = blockStates(ship.content);
  const link = `${BASE}${sharePath(client)}`;

  const subject = `Your ${ship.name} plan, sorted`;

  const text = [
    `A note from your travel advisor:`,
    ``,
    summary,
    ``,
    ...(allVerified
      ? []
      : [
          `Some of the guidance behind this plan is still being confirmed — your advisor has the detail.`,
          ``,
        ]),
    `View it any time: ${link}`,
    ``,
    `Put together with CruiseRead — a second set of eyes on every cruise booking.`,
  ].join("\n");

  const caveat = allVerified
    ? ""
    : `<p style="margin:16px 0 0;padding:12px 16px;border:1px solid #D2DCDF;border-radius:10px;color:#6E869A;font-size:13px;line-height:1.5;">Some of the guidance behind this plan is still being confirmed — your advisor has the detail.</p>`;

  const html = `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#E9EFF1;font-family:Arial,Helvetica,sans-serif;color:#0F2A3D;">
  <div style="max-width:600px;margin:0 auto;padding:32px 20px 48px;">
    <div style="margin-bottom:28px;">
      <div style="display:inline-block;vertical-align:middle;margin-right:10px;">
        <div style="height:3px;width:26px;border-radius:2px;background:#15516F;margin-bottom:3px;"></div>
        <div style="height:3px;width:26px;border-radius:2px;background:#15516F;margin-bottom:3px;"></div>
        <div style="height:3px;width:16px;border-radius:2px;background:#B26A1C;"></div>
      </div>
      <span style="font-weight:bold;font-size:17px;vertical-align:middle;color:#0B1D33;">CruiseRead</span>
      <span style="color:#6E869A;font-size:12px;vertical-align:middle;letter-spacing:1px;">&nbsp;&middot;&nbsp;BOOKING INTELLIGENCE</span>
    </div>

    <div style="font-family:'Courier New',monospace;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#1B6B5F;margin-bottom:8px;">From your travel advisor</div>
    <h1 style="font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:26px;line-height:1.2;margin:0 0 20px;">Your ${escapeHtml(ship.name)} plan, sorted.</h1>

    <div style="background:#FCFDFD;border:1px solid #D2DCDF;border-radius:14px;padding:22px;">
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:1.65;margin:0;">${escapeHtml(summary)}</p>
    </div>
    ${caveat}

    <p style="margin:24px 0 0;font-size:14px;"><a href="${link}" style="color:#15516F;font-weight:bold;">View this plan online</a></p>

    <p style="margin:36px 0 0;text-align:center;font-size:12px;color:#6E869A;line-height:1.6;">Put together with <a href="${BASE}" style="color:#15516F;font-weight:bold;text-decoration:none;">CruiseRead</a> — a second set of eyes on every cruise booking.</p>
  </div>
</body>
</html>`;

  return { subject, text, html };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
