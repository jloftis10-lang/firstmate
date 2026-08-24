# Handoff — open work

For an agent picking this repo up cold. Everything here is verified
against the tree at the time of writing; nothing is from memory.

**Read `CLAUDE.md` first** (the product brief and standing constraints),
then the "Non-negotiables" section below, then pick a task.

## Current order — 2026-08-24

1. **Founding Pro preview — shipped in Phase 15.** Browser-local saved checks,
   advisor-branded print/PDF output and in-app research-change alerts are the
   validation layer. Do not add billing, auth or cloud sync until advisors use
   this workflow and the account requirement is real.
2. **Celebrity hull-level completion — next.** Jimmy signed the shared policy,
   Infinite Veranda wording, Xcel Bazaar distinction and Celebrity Solstice
   teen-facility exception on 2026-08-24. Decisions 3–5 in
   `docs/celebrity-operator-review.md` remain: ship-specific quiet defaults,
   obstruction mechanisms, elevator positions, operating status, refit
   differences and cabin exceptions. No missing fact may be inferred.
3. **Persistent Pro infrastructure — later.** Accounts, cross-device history
   and background email alerts follow validation of the browser preview, not
   before it.

---

## Non-negotiables

These are not style preferences. Each one exists because breaking it
already produced a wrong answer in this project's history, and the whole
product is a claim about not being confidently wrong.

### 1. Never invent a cruise fact

No deck number, cabin number, height rule, price, venue or policy may be
written unless it comes from a source, and the source goes in the record.
**A search-result snippet is not a source you have read.** Several
corrections in this project came from claims built on partial
information that looked solid.

If you cannot establish something, the model has a value for that.
`"not-researched"` and `"none"` are different values and must stay
different — "nobody checked" is not "there is nothing there".

### 2. Never delete or hand-edit the engine snapshot to make a check pass

`npm run verify` replays all 93 covered ships against all 32 client
profiles — 2,976 reads — against a committed hash in
`scripts/engine-snapshot.json`.

- Snapshot fails and you did **not** intend to change engine output →
  you have a bug. Fix the bug.
- Snapshot fails and you **did** intend it → run `npm run snapshot`,
  commit the diff, and say so in the commit message. The diff is the
  review artifact.

### 3. No scores, ratings, percentages or confidence numbers

Anywhere. Not in the engine, not in a component, not in copy. The output
is a plainly-stated call plus the reasoning and the sources.

### 4. Class and comparison content is DERIVED, never authored

`src/lib/classes.ts` computes what a class shares and where its hulls
diverge by diffing the ship records. There is no `ClassContent` type and
there must not be one — a hand-written class rule is a second source of
truth that agrees with the records until somebody edits one of them.

Same for `src/lib/compare.ts` and `src/lib/guides.ts`: a guide lists the
ships the records say a rule applies to, and takes its count from the
length of that list.

### 5. Never carry a cabin-level fact between sister ships

Not even inside a class. Several records state explicitly that a
documented obstructed pair on one hull does **not** reproduce on its
sister. That is a finding; inheriting it erases one.

### 6. An absent thing must say so

A missing block, section or list renders as an explicit uncharted state,
never by disappearing. A page with one fewer section reads as a ship with
one fewer problem.

### 7. `/share` carries one client's booking

It must stay `noindex`, carry no canonical, and show no advisor chrome.
Its five query params are a frozen public contract: **add, never rename.**

### 8. Do not re-inline ship content into `/check`

`/check` shipped 906 KB of HTML because it handed every ship record to
the browser. It is 73 KB now: the page gets identity only
(`src/lib/check-catalog.ts`) and one record is fetched on demand
(`src/lib/ship-content.ts`). Keep it that way — it was growing 12 KB per
covered ship, so it got worse as the product succeeded.

---

## Verifying anything

```bash
npm run verify                        # tsc + the engine snapshot. The gate.
npx eslint src --max-warnings=0       # zero warnings is the standard here
npm run build                         # must prerender without error
npm run serve                         # rebuild + serve, kills stale servers
scripts/smoke.sh                      # 33 checks against localhost:3000
scripts/smoke.sh https://cruiseread.com
```

`npm run coverage` prints the coverage matrix by line and class.

Browser checks in this project used Playwright driven by throwaway
scripts. **Playwright is not a declared dependency** — it resolves from
the tree but is not in `package.json`, so do not commit a script that
imports it. `scripts/smoke.sh` is curl-and-grep for that reason.

---

## Tasks

Ordered by value. Each says who can finish it, because that is the thing
most likely to go wrong: **content tasks need the operator's sign-off and
cannot be completed by an agent alone.**

### A. Code only — an agent can finish these

#### A1. Remove `reviewDue`, or wire it up

`ShipContent.reviewDue` is dead. All 79 covered ships carry the identical
value `"2027-02-01"` and **zero components read it** (`grep -rn reviewDue
src/ --include=*.tsx` returns nothing).

Either delete the field and its 79 assignments, or surface it somewhere
it means something — a freshness marker on the ship page would be
honest, but only if the dates become real per-ship values, and inventing
those is a content task, not this one.

Recommendation: **delete it.** A field that says the same thing about
every ship says nothing.

*Acceptance:* field gone from `src/lib/types.ts` and every record; `npm
run verify` green with **no snapshot change** (nothing reads it, so
output must not move).

#### A2. `/guides` has no index page — COMPLETED IN PHASE 12

`/guides/quiet-cabins`, `/guides/obstructed-balconies` and
`/guides/cruise-guarantee-cabins` all exist and are linked from the
footer. `/guides` itself 404s. Anyone who trims the URL hits a dead end.

Build `src/app/(app)/guides/page.tsx` listing the three, in the shape of
`src/app/(app)/classes/page.tsx`. Derive nothing you can't derive; three
cards with real one-line descriptions is enough.

*Acceptance:* `/guides` 200s, links all three, appears in
`src/app/sitemap.ts`, and `scripts/smoke.sh` still passes with the
sitemap count updated from 121 to 122.

#### A3. Widen deck-stack coverage — transcription, not research

Only **8 of 93** covered hulls have a `decks` array (Radiance and Vision
classes), and it is what makes the quiet-cabin arithmetic run rather than
be asserted.

The existing eight were **transcribed from prose already signed in the
class files**, not researched afresh, and validated by a checksum:
`quietBandHolds()` in `src/lib/decks.ts` fails the build if a
transcription contradicts the signed placement answer. That is the only
safe way to add more.

Read a class file's signed `placementNote` and category notes. If they
state which decks carry cabins and what public space sits where, that is
transcribable. **If they do not, stop** — deriving a deck stack from a
deck plan you found online is research and needs sign-off.

*Acceptance:* the subset checksum holds for every class you touch;
snapshot unchanged (decks are not read by the engine).

### B. Content — research plus operator sign-off. Do not self-approve.

#### B1. Norwegian's drink-package service charge

Carnival records `serviceCharge: { rate: 0.2, includedInPrice: true }`
and Royal `{ rate: 0.18, includedInPrice: false }`. **Norwegian records
nothing**, so `/compare` refuses to normalise any Norwegian pair to a
checkout price and says so rather than assuming zero.

Establish whether NCL's `drinkPackagePrice: 109` includes its service
charge. Note Free at Sea carries a *separate* mandatory charge described
in `NCL_MONEY.drinkPackageNote`, which makes this the least safe of the
three to assume.

*File:* `src/content/reads/ncl-common.ts`. *Then:* `npm run snapshot`
only if output moves, and get it signed.

#### B2. Royal's package price range as a field

`royal-common.ts` says in a comment that the Deluxe package runs "roughly
$55 to $120 per person per day depending on ship and sailing; $75 is the
tracked fleet median". **That is signed and it never reaches a page** —
the same shape of gap Carnival's `drinkPackageNote` was before it was
fixed.

It matters on `/compare`, which currently normalises Royal's median
against Carnival's real price and carries a prose caveat instead of the
range. A `priceRange` field would let the page state it.

#### B3. Celebrity coverage — RESEARCH PASS SHIPPED IN PHASE 16

The 14 mainstream ocean ships now have source-backed records.
The research corrected “Always Included” to the current optional All
Included fare choice and leaves `fareInclusions` unknown at ship level so a
Cruise-Only booking cannot be misread. Edge-series records carry the Infinite
Veranda tradeoff; Xcel's Bazaar and Solstice's teen-facility exception remain
hull-specific.

Jimmy signed the line-policy warnings, Infinite Veranda tradeoff, Xcel Bazaar
distinction and Celebrity Solstice teen-facility exception on 2026-08-24.
Jimmy signed Decision 3 on 2026-08-24: Edge/Apex use midship decks 8–10 and
Beyond/Ascent/Xcel use midship decks 8–11. He confirmed Xcel deck 6 is
mixed-use and deck 12 is cabins only. All five placement bands are live; four
complete deck stacks are live, while Xcel's full deck table waits on the rest
of its public-space transcription. Cruise Critic identifies Xcel deck 6's
mixed-use space as The Bazaar's upper level. Jimmy completed and signed the current-plan
   visual review on 2026-08-24. Xcel's obstruction, noise and elevator
   research is now prepared in `docs/celebrity-operator-review.md` and awaits
   Decisions 4.1–4.3. Its operating status and refit history remain unknown.
   **Next:** get those three Xcel cabin-risk decisions signed, then continue
   hull by hull without inheriting Xcel's findings across the class.

#### B4. Migrate Oasis, Icon and Quantum off `ROYAL_ATTRACTION_RULES`

That constant is marked **superseded but not retired** in
`royal-common.ts`. `royal-attractions.ts` holds the better model —
per-attraction constants a hull maps onto, so a record can say which
rides a ship actually carries rather than naming ones it may not.

Radiance and Vision already migrated. Three classes remain. The comment
says explicitly: *"Each class migrates at its next review, not before"* —
because rewriting signed text to adopt a better structure would silently
change what an operator approved.

**So this is gated on an operator review of those classes, not on
finding time.** Do not do it unprompted.

#### B5. Availability is checked on one hull

`ActivityAvailability` — what is currently out of service — is populated
on **1 of 93** covered ships. An empty list means nobody checked, which every
page states plainly, so this is honest. It is also the most perishable
claim in any record and the one most likely to embarrass an advisor who
quoted it.

Worth a standing process more than a one-off task.

### C. Blocked on the operator

- **Deploy.** Vercel, zero-config; steps in `README.md`. Verified to
  build from a clean clone with every env var unset. Needs an account
  and DNS.
- **Widen the environment's egress policy.** The sandbox blocks
  `cruiseread.com`, `princess.com`, `celebritycruises.com` and
  `wikipedia.org` — `WebSearch` works, `WebFetch` does not. That is why
  B3 is a paste-back pipeline rather than direct research, and why
  production cannot be verified from inside. Widening it unblocks both.

---

## Things that look like bugs and are not

- **`eligibility` and `fareInclusions` are set by zero ships.** Live,
  typed and tested; built for the Viking pilot, and the Viking record
  was pulled before sign-off. Deliberate, and documented in
  `src/lib/types.ts`. Do not delete them.
- **`serviceYear` is on 8 of 93 covered ships.** Sparse on purpose. The signed
  class headers contain "Jewel (2004)" for Royal and "Jewel (2005)" for
  Norwegian, and "Star (2001)" against "Star (2025)". An automated sweep
  would cross them. Filled in per class, deliberately.
- **21 hulls are "obstructed, mechanism unknown."** The line publishes
  that a cabin is obstructed without saying by what. Recorded as
  unestablished rather than guessed. `/guides/obstructed-balconies`
  gives that number as much room as the ones it knows.
- **`/compare` and `/share` are server-rendered while everything else is
  static.** ~3,000 compare permutations is not a prerender, and share
  takes arbitrary params.
