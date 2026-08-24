import { NextResponse } from "next/server";
import { Resend } from "resend";

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const REQUEST_EMAIL = process.env.REQUESTS_TO_EMAIL ?? "jloftis10@gmail.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PLANS = new Set(["Founding Pro", "Agency"]);
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
  const submitted =
    body && typeof body === "object" && !Array.isArray(body)
      ? (body as Record<string, unknown>)
      : {};

  if (field(submitted.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const plan = field(submitted.plan, 40);
  const name = field(submitted.name, 100);
  const email = field(submitted.email, 254);
  const company = field(submitted.company, 120);
  const advisorCount = field(submitted.advisorCount, 3);
  const note = field(submitted.note, 1000);

  if (!PLANS.has(plan) || !name || !email) {
    return NextResponse.json(
      { error: "Choose a plan and add your name and email." },
      { status: 400 },
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "That email address does not look right." },
      { status: 400 },
    );
  }
  if (advisorCount && (!/^\d{1,3}$/.test(advisorCount) || Number(advisorCount) < 1)) {
    return NextResponse.json(
      { error: "Advisor count must be between 1 and 999." },
      { status: 400 },
    );
  }

  const text = [
    "New CruiseRead pricing interest",
    "",
    `Plan: ${plan}`,
    `Name: ${name}`,
    `Email: ${email}`,
    company ? `Agency or company: ${company}` : "Agency or company: not provided",
    advisorCount ? `Advisor seats: ${advisorCount}` : "Advisor seats: not provided",
    "",
    note || "No additional context provided.",
  ].join("\n");
  const html = `
    <h1 style="font:600 22px Arial,sans-serif;color:#0B1D33;">New CruiseRead pricing interest</h1>
    <p style="font:15px/1.6 Arial,sans-serif;color:#3A5872;">
      <strong>Plan:</strong> ${escapeHtml(plan)}<br>
      <strong>Name:</strong> ${escapeHtml(name)}<br>
      <strong>Email:</strong> ${escapeHtml(email)}<br>
      <strong>Agency or company:</strong> ${escapeHtml(company || "Not provided")}<br>
      <strong>Advisor seats:</strong> ${escapeHtml(advisorCount || "Not provided")}
    </p>
    <p style="padding:14px;border:1px solid #D2DCDF;border-radius:10px;font:15px/1.6 Arial,sans-serif;color:#0F2A3D;white-space:pre-wrap;">${escapeHtml(note || "No additional context provided.")}</p>
  `;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM ?? "CruiseRead <notes@cruiseread.com>",
    to: REQUEST_EMAIL,
    subject: `[CruiseRead] Pricing interest: ${plan}`,
    text,
    html,
    replyTo: email,
  });

  if (error) {
    return NextResponse.json(
      { error: "The request did not go through. Try again in a moment." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
