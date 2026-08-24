import { NextResponse } from "next/server";
import { Resend } from "resend";

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const REQUEST_EMAIL = process.env.REQUESTS_TO_EMAIL ?? "jloftis10@gmail.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const hits = new Map<string, number[]>();

function throttled(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

function field(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Email is not configured on this deployment." },
      { status: 503 },
    );
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (throttled(ip)) {
    return NextResponse.json(
      { error: "That is a few requests in a row. Give it a little while." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
  const submitted = body as Record<string, unknown>;

  // A bot filling the hidden field gets a quiet success and no email.
  if (field(submitted.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const ship = field(submitted.ship, 120);
  const line = field(submitted.line, 100);
  const name = field(submitted.name, 100);
  const email = field(submitted.email, 254);
  const note = field(submitted.note, 800);

  if (!ship || !line) {
    return NextResponse.json(
      { error: "Add both the ship and cruise line." },
      { status: 400 },
    );
  }
  if (email && !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "That email address does not look right." },
      { status: 400 },
    );
  }

  const text = [
    "New CruiseRead ship request",
    "",
    `Ship: ${ship}`,
    `Cruise line: ${line}`,
    name ? `Advisor name: ${name}` : "Advisor name: not provided",
    email ? `Advisor email: ${email}` : "Advisor email: not provided",
    "",
    note || "No additional context provided.",
  ].join("\n");
  const html = `
    <h1 style="font:600 22px Arial,sans-serif;color:#0B1D33;">New CruiseRead ship request</h1>
    <p style="font:15px/1.6 Arial,sans-serif;color:#3A5872;">
      <strong>Ship:</strong> ${escapeHtml(ship)}<br>
      <strong>Cruise line:</strong> ${escapeHtml(line)}<br>
      <strong>Advisor:</strong> ${escapeHtml(name || "Not provided")}<br>
      <strong>Email:</strong> ${escapeHtml(email || "Not provided")}
    </p>
    <p style="padding:14px;border:1px solid #D2DCDF;border-radius:10px;font:15px/1.6 Arial,sans-serif;color:#0F2A3D;white-space:pre-wrap;">${escapeHtml(note || "No additional context provided.")}</p>
  `;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM ?? "CruiseRead <notes@cruiseread.com>",
    to: REQUEST_EMAIL,
    subject: `[CruiseRead] Ship request: ${ship}`,
    text,
    html,
    ...(email ? { replyTo: email } : {}),
  });

  if (error) {
    return NextResponse.json(
      { error: "The request did not go through. Try again in a moment." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
