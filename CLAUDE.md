# First Mate — Build Brief (CLAUDE.md)

Read this fully before writing any code. It is the source of truth for what First Mate is, how it must feel, and — just as important — what it must not become. If a request would violate the Scope Guardrails below, push back before building.

## What you're building

First Mate is a decision-confidence tool for cruise travel advisors — the independent and host-agency advisors who sell cruises but mostly did not come up through a cruise line. An advisor describes a booking (the ship + who's sailing) and gets back an operator's read on what will bite this specific booking — before the client finds out at the gangway.

The product is a "second set of eyes on every cruise booking before your client pays." Think Booking Audit, run as a habit on every reservation.

It is not a CRM, a booking engine, an itinerary builder, or an AI chatbot. Those exist and are not the wedge (the incumbent platform in this space, e.g. Tern, already owns advisor workflow — do not compete with it).

## The one principle everything hangs on: confidence, not data

The advisor's real problem is fear of recommending the wrong thing, not lack of information. Their current tools — spreadsheets, Cruise Critic, Facebook groups, Googling, calling another agent — are all anxiety-management.

So the design test for every decision is:

> Does this make the advisor feel more certain, or just more informed?

- More informed = the enemy. It adds options to weigh and deepens the paralysis.
- More certain = the product. A confident call they can repeat to their client.

This is why First Mate is an operator at your shoulder, not an encyclopedia. Narrow and certain beats broad and hedged, every time.

Hard consequence of this principle: **there are no numeric fit scores.** No "Cabin 8216 — 92/100." A score is more data to weigh and it implies a false precision that raises liability. The output is a plainly-stated call plus the reasoning behind it. (An earlier concept doc proposed weighted Fit Scores — do not build them. They contradict the core insight and were explicitly rejected.)

## Product spec: the core flow

One flow: describe the booking → get the Confidence Read. Port it faithfully from the working prototype (`firstmate-prototype.html`, added to the repo).

### Inputs — five fields, hold the line at five

1. **Ship** (select)
2. **Who's traveling** — couple / family + kids / multigen or mobility / solo
3. **Gets seasick?** — no / yes (drives the cabin call)
4. **Cruise experience** — first cruise / seasoned
5. **Itinerary** — port-heavy / lots of sea days

Every extra input is friction. Friction kills a confidence tool. Do not add fields without a validated reason.

### Output — the Confidence Read: exactly three categories

Each category returns the same three-part shape:

- **The call** — the recommendation, stated plainly, no hedging. (Serif, prominent.)
- **The flags** — "Heads up:" warnings specific to this ship and this client.
- **The why** — the operator's reasoning, collapsed by default. This is the moat.

The three v1 categories (drawn from real advisor discovery — do not add a fourth):

1. **Cabin & deck** — where to book, what to avoid (motion → midship/low; hazards above/below like pool deck / buffet / nightclub; obstructed views; connecting vs. merely adjacent cabins; elevator proximity for mobility).
2. **Money surprises** — drink-package worth-it call for this itinerary; specialty dining book-ahead warning; gratuity expectation-setting.
3. **Expectation traps** — kid age/height restrictions; obstructed balconies; embarkation-day timing; anything that detonates on boarding day.

The read must respond to the inputs — flip "seasick" to yes and the cabin call changes; switch to "family + kids" and the kid-restriction trap appears. That responsiveness is the magic. See the prototype's `buildCards()` for the exact rule logic to port.

### The client-ready summary — the killer feature

One tap turns the Read into plain, warm, client-facing language the advisor can copy and send. The advisor's actual job is to sound like the expert — so don't just inform them, script their expertise. This is the highest-value feature; treat it as first-class, not an afterthought.

## Architecture & stack

Use the existing stack: **Next.js + TypeScript + Tailwind + Supabase + Resend + Vercel.** The repo is currently empty — scaffold fresh (App Router).

### The engine is deterministic — NOT an LLM call

The Confidence Read is generated from structured ship data + typed rules, the same pattern as the vafaro engine (structured input → flagged, reasoned output). Do not generate the calls with an LLM. Reasons:

- **Trust/liability:** a confidence product that is confidently wrong becomes the exact thing the advisor feared. Deterministic rules over verified data are auditable; an LLM hallucinating a deck number is a lawsuit-shaped risk.
- **The encoded operator judgment is the IP and the moat.** Keep it in code/data.
- (Optional, later) an LLM may polish the *wording* of the client-ready summary, but the underlying calls and flags must be deterministic. Templated is fine for now.

### Ship data model

Each ship is a structured record. Start with typed TS/JSON content files (version-controlled, easy to edit) — migrate to Supabase only when ship count grows.

```ts
type Ship = {
  id: string;
  line: string;            // "Royal Caribbean"
  name: string;            // "Wonder of the Seas"
  shipClass?: string;
  verified: boolean;       // false until Jimmy confirms the content — see below
  reviewDue?: string;      // freshness date

  cabin: {
    midshipRange: string;            // "decks 6–8"
    motionAvoid: string;             // forward third, top decks, etc.
    hazardsAboveBelow: string[];     // pool deck, buffet, nightclub locations
    obstructedViewNotes?: string;
    connectingNote?: string;
    elevatorNote?: string;
    accessibilityNote?: string;
  };
  money: {
    drinkPackagePrice?: number;
    breakEvenDrinksPerDay?: number;
    specialtyDiningNote: string;
    gratuityPerDayUSD?: number;
  };
  traps: {
    kidAgeHeightRules?: string;
    obstructedBalconyDecks?: string;
    embarkationNote?: string;
    other?: string[];
  };
};
```

The engine signature: `getRead(ship: Ship, client: ClientProfile) => Read` where `ClientProfile` is the five inputs and `Read` is `{ cabin, money, traps }`, each `{ call, flags[], why }`.

## Build order (milestones)

1. **Scaffold + port the core screen.** Next.js/TS/Tailwind. Reproduce the prototype's single flow (input → Confidence Read + client-ready summary) with the exact design system below. Typed deterministic engine. 3–6 seed ships in content files. No database, no auth yet. Deploy to Vercel. This is the whole first milestone.
2. **Ship data layer.** Solidify the `Ship` schema, expand seed ships, add the `verified` gate. Migrate to Supabase if/when it's warranted.
3. **Summary polish + share/export.** Copy, branded web link, optional email via Resend.
4. **(Gated on real advisor validation)** accounts + saved checks (Supabase auth), more ships, and — only if advisor interviews validate it — a repricing/promotion analyzer as a separate wedge. Do not build ahead of this gate.

## Design system — match the prototype exactly

Direction: **calm ship's-bridge instrument, not cartoon nautical.** It should feel like relief, not homework. Spend boldness in one place (the operator's "call" typography + the "sounding" moment); keep everything else quiet.

Color tokens (from the prototype):

```
--ink:#0F2A3D  --ink-2:#3A5872  --ink-3:#6E869A
--paper:#E9EFF1 (cool chart-paper bg — NOT cream)  --surface:#FCFDFD
--line:#D2DCDF  --deep:#15516F (navigation blue)
--signal:#B26A1C (brass — HEADS UP flags)  --signal-bg:#FBF1E3
--go:#1B6B5F (sea teal — the call/confidence)  --go-bg:#E5F0ED
```

Type:

- `Archivo` — brand, UI, labels (sturdy, instrument-like)
- `Newsreader` (serif) — the operator's call verdicts (gives them a spoken, human, authoritative voice; this is the signature typographic move)
- `Space Mono` — small "instrument readout" labels only (booking summary line, flag tags, eyebrows). Use sparingly.

Motifs: the "first mate" rank-stripe insignia by the wordmark (two full + one short brass stripe). A brief "sounding the depths" sonar-ping transition when the check runs (respect `prefers-reduced-motion`). Restrained amber/teal signal colors; the plain-language call is always the hero, never a dashboard of metrics.

Quality floor: responsive to mobile (advisors are on phones mid-call), visible keyboard focus, reduced-motion respected. Input-to-read should feel under ~30s.

## Voice & copy rules

Operator, not textbook. Confident, plain, imperative. The tone is the product.

- Good: "Put them midship, decks 6–8. Skip the drink package on this sailing."
- Bad: "Studies suggest cabin location may affect passenger comfort..."

Sentence case. Active voice. No hedging weasel-words in the call (the honesty and nuance live in the why and the flags). Name things the way an advisor and their client would, never by how the system is built. The client-ready summary shifts to a warmer, client-facing register — it's what the advisor sends, not operator jargon.

## Scope guardrails — READ THIS

The single biggest risk to this product is scope creep dressed up as thoroughness. Do not, without an explicit new decision from Jimmy:

- ❌ Add numeric fit scores / confidence percentages / cabin leaderboards.
- ❌ Add a fourth output category, or expand beyond cabin / money / traps.
- ❌ Build the other proposed "modules" (package intelligence, upgrade intelligence, promotion/repricing analyzer, full multi-section audit, decision graph). These are roadmap or unvalidated hypotheses, not v1.
- ❌ Add an AI chatbot or LLM-generated calls (deterministic engine only).
- ❌ Add more than the five inputs.
- ❌ Build auth, accounts, history, billing, or agency/team features in milestone 1.
- ❌ Support "every cruise line" — go deep on a handful of ships, not shallow on hundreds. Authoritative on 6 beats vague on 300.

If a feature seems useful but isn't in this brief, it belongs in a "roadmap" note, not in the build.

## Content & accuracy discipline

This is a confidence product, so an inaccurate confident call is worse than no call. The seed ship content in the prototype is **placeholder in the right voice** — plausible operator language, not verified fact (e.g. specific deck numbers, the ~$18 gratuity figure). It must be replaced with Jimmy's verified, ship-specific knowledge before any real advisor relies on it.

Enforce this in code: every `Ship` has `verified: boolean`. Until `verified: true`, the UI must visibly mark that ship's read as sample/unverified. Never let an unverified confident claim reach a real advisor unlabeled.

## Existing assets (read these first)

- `firstmate-prototype.html` — the working single-file prototype. Source of truth for the core flow, the read logic (`buildCards`, `clientSummary`), and the exact visual design. Port from it; don't reinvent it.
- `cruise-confidence-check-framework-v0.md` — the product framework / rationale.

(Ask Jimmy to add both files to the repo if they aren't present.)

## Your first task

Scaffold the Next.js + TypeScript + Tailwind app (App Router) and reproduce the prototype's core screen as a real, deployable page: the five-input form → the Confidence Read (three categories, each with call / flags / collapsible why) → the client-ready summary with copy. Match the design system exactly. Implement the read as a typed deterministic engine over 3–6 seed ship content files with the `Ship` schema above and the `verified` flag. No database, no auth. Then deploy to Vercel.

Confirm the plan against the Scope Guardrails before you start, and flag anything in this brief that's ambiguous rather than guessing.

## Definition of done (milestone 1)

- Deployed Next.js app, mobile-responsive, accessible (focus states, reduced motion).
- Five inputs → responsive three-category Confidence Read matching the prototype.
- Deterministic engine; no LLM calls; no numeric scores.
- 3–6 seed ships in typed content files, each with a `verified` flag and sample content clearly marked as unverified.
- Working client-ready summary with copy-to-clipboard.
- Visual identity matches the prototype (tokens, type, insignia, sounding moment).
- No auth, no DB, no extra modules, no scope beyond this brief.
