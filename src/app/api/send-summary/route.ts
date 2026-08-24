import { NextResponse } from "next/server";
import { Resend } from "resend";
import { parseShare } from "@/lib/share";
import { summaryEmail } from "@/lib/email";
import { getShip } from "@/content/ships";
import { isCovered } from "@/lib/types";

/**
 * Emails the client-ready summary.
 *
 * Milestone rules forbid auth, so this endpoint is designed to be safe
 * while open: it accepts only the booking parameters plus a recipient,
 * and reconstructs the summary server-side from the deterministic
 * engine. Nothing free-form can be injected into the email body, so the
 * worst abuse available is sending someone a cruise note — not a spam
 * relay. A light per-IP throttle narrows even that.
 *
 * The throttle is in-memory and therefore best-effort on serverless:
 * each warm instance keeps its own counts. Good enough for this stage;
 * revisit alongside accounts in milestone 4.
 */

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function throttled(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Email simply isn't configured for this deployment. The UI treats
    // this as "feature off", not as an error worth alarming anyone with.
    return NextResponse.json(
      { error: "Email isn't set up on this deployment yet." },
      { status: 503 },
    );
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (throttled(ip)) {
    return NextResponse.json(
      { error: "That's a few sends in a row — give it a little while." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
  const b = body as Record<string, unknown>;

  const to = typeof b.to === "string" ? b.to.trim() : "";
  if (!EMAIL_RE.test(to) || to.length > 254) {
    return NextResponse.json(
      { error: "That email address doesn't look right." },
      { status: 400 },
    );
  }

  // Optional: the advisor's own address, so the client's reply goes to
  // them rather than into a void.
  const replyTo = typeof b.replyTo === "string" ? b.replyTo.trim() : "";
  if (replyTo && (!EMAIL_RE.test(replyTo) || replyTo.length > 254)) {
    return NextResponse.json(
      { error: "The reply-to address doesn't look right." },
      { status: 400 },
    );
  }

  // The booking itself, validated exactly like a share link.
  const client = parseShare({
    ship: typeof b.ship === "string" ? b.ship : undefined,
    who: typeof b.who === "string" ? b.who : undefined,
    seasick: typeof b.seasick === "string" ? b.seasick : undefined,
    sailed: typeof b.sailed === "string" ? b.sailed : undefined,
    itinerary: typeof b.itinerary === "string" ? b.itinerary : undefined,
  });
  const ship = client ? getShip(client.shipId) : undefined;
  if (!client || !ship || !isCovered(ship)) {
    return NextResponse.json(
      { error: "That booking doesn't resolve to a covered ship." },
      { status: 400 },
    );
  }

  const { subject, text, html } = summaryEmail(ship, client);
  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM ?? "CruiseRead <notes@cruiseread.com>";

  const { error } = await resend.emails.send({
    from,
    to,
    subject,
    text,
    html,
    ...(replyTo ? { replyTo } : {}),
  });

  if (error) {
    return NextResponse.json(
      { error: "The email didn't go through. Try again in a moment." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
