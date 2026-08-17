# The Confidence Check — Product Framework (v0)
*Working name TBD. A cruise-booking confidence tool for travel advisors.*

---

## What it is, in one sentence
A tool that answers one question for a travel advisor — **"What am I about to get wrong on this booking?"** — and answers it the way a cruise-line operator would, before the client ever finds out the hard way.

---

## The one principle everything hangs on
You are selling **confidence, not data.**

The advisor's real problem isn't missing information — it's the fear of recommending the wrong thing. The spreadsheet, the hours on Cruise Critic, the Facebook group: those aren't research, they're anxiety-management. So the design test for *every* decision is:

> Does this make the advisor feel more **certain**, or just more **informed**?

Anything that adds options to weigh is the enemy. Anything that hands them a confident call they can repeat to their client is the product. This is why it's **an operator at your shoulder, not an encyclopedia.** Narrow and certain beats broad and hedged, every single time.

---

## The spine: one core interaction
The whole product is one flow. *Describe the booking → get the operator's call.*

**Input** — fast, feels like describing a client to a colleague. Five or six fields, forever:
- **The ship** (the anchor — and the highest-fear trigger is the ship they've never sailed)
- **Who's traveling** (solo / couple / family with kids + ages / multigen or mobility needs)
- **Motion sensitivity** (drives the cabin call)
- **Cruise experience** (first-timer vs. seasoned — first-timers need more guardrails)
- **Itinerary shape** (port-heavy vs. lots of sea days — changes package math and cabin choice)

Every extra field is friction, and friction kills a confidence tool. Hold the line at ~5.

**Output — The Confidence Read.** The operator's call across the three v1 categories. Each returns the same three-part shape:
- **The call** — the recommendation, stated plainly, without hedging.
- **The flags** — blind-spot warnings specific to *this* ship and *this* client ("Heads up:").
- **The because** — the operator's reasoning, collapsed by default. This is where the moat lives.

**The killer feature:** a one-tap **"client-ready summary"** that turns the Read into the language the advisor sends their client. Their actual job is to *sound* like the expert — so don't just inform them, script their expertise for them.

---

## The v1 output in detail (three categories only)
Drawn straight from your call tally — the three that came up most and stung hardest:

**1. Cabin & deck.** Where to book, what to avoid. Above/below hazards (the 5-a.m. pool-deck chairs), motion (midship + low for the seasick client), obstructed views, and the connecting-vs.-adjacent reality that blew up the family booking.

**2. Money surprises.** The drink-package worth-it call *for this specific itinerary* (a barely-used package is lost trust). Specialty dining and the book-before-boarding warning. Gratuities — included or not — so the advisor sets expectations instead of eating a complaint.

**3. Expectation traps.** Kid / age / height restrictions (the Royal Caribbean family), and anything else that detonates on boarding day.

Everything else on the thirteen-decision list — Wi-Fi, excursions, insurance, pre/post hotels, itinerary and sailing selection — is the **roadmap, not v1.** You earn the right to expand by nailing these three so completely the advisor exhales.

---

## Information architecture (deliberately small)
A confidence product should feel calm. Four surfaces, no dashboard sprawl:

- **Landing** — the fear-killer promise. Speaks directly to "stop dreading the wrong recommendation." One CTA into the Check.
- **The Check** — the core tool. Input → Confidence Read. This *is* the product.
- **The Read** — the output; saveable per client, with the one-tap client-ready summary.
- **Account / history** — saved checks by client.
- *(Later)* **Ship library** — a browsable reference layer and your SEO surface. Not v1.

---

## Look & feel
- **One thing per screen.** White space. It should feel like relief, not homework.
- **Lead with the call** in large, confident type. Reasoning tucked underneath, one tap away.
- **Voice: operator, not textbook.** *"Put them midship, low deck. Skip the drink package on this sailing."* — never *"Studies suggest cabin location may affect comfort..."* The tone **is** the product.
- **Restrained signal.** Amber/green flags used sparingly; the plain-language call is the hero, not a metrics dashboard.
- **Fast and mobile-first.** Input-to-Read should feel like under 30 seconds. Advisors are on their phones, mid-call.

---

## Where the moat lives
Not in the facts — you already accepted those are researchable. In two places the interface must show off:

- **The "because."** Operator judgment — the *this one, because* that a spreadsheet and a Facebook thread can't give. This is what makes an advisor trust the call instead of double-checking it.
- **Trust that compounds.** Build a light share/referral mechanic in from day one. In a tight advisor community, "the tool other advisors told me to use" is the durable moat for a researchable product.

---

## Scope discipline (the trap to avoid)
The wedge is broad (a whole blind-spot check); the v1 must be narrow. Two hard rules:

1. **Three categories only** at launch.
2. **Depth over breadth on ships.** Better to be *authoritative* on 15 ships you know cold — start with your Carnival knowledge, expand by research — than shallow on 300. A confidence product that is ever confidently **wrong** becomes the exact thing the advisor feared. Launch only where you can stand behind every call.

---

## The build (your stack — and a callback)
Next.js / TypeScript / Tailwind on the front, Supabase for ship data, saved checks, and auth. The Read is generated from **structured ship records + deterministic rules** — which means the engine you already built in vafaro (structured input → scored, flagged, reasoned output → report) is directly reusable. Your instinct to repurpose vafaro was half-right: not the brand — the **engine.**

Each ship is a record: deck hazards, cabin guidance, package/itinerary notes, restriction flags. Fill it with *judgment*, not just facts.

---

## This framework is also your pitch
The concept is the next thing you put in front of the same advisors: *"Here's the thing — would this replace your spreadsheet, and what would you pay for it?"* Building the concept isn't a departure from discovery. It's the sharper discovery instrument.

---

### Open threads
- **Name + domain** — still unresolved; the confidence/second-opinion lane is the direction, not "cruise facts."
- **Price** — test in the same advisor conversations; the five existing workarounds tell you the wallet is already open.
- **Dominant category weighting** — your tally leaned toward the money-surprise cluster and cabin; confirm before locking the v1 build order.
