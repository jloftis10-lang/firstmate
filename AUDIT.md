# AUDIT.md — Phase 0

Repo state as of 2026-08-19, commit `753294d`. **No code changed.**

Read section 3 and section 9 first. One finding governs the whole plan:
**the platform spec's centrepiece — the deck-by-deck section — has no
data behind it.** Everything else follows from that.

---

## 1. Route inventory

Three routes. That is the whole site.

| Route | File | Rendering | Purpose |
|---|---|---|---|
| `/` | `src/app/page.tsx` | Server shell → `<FirstMate>` client component | Everything. Picker, five questions, results, share. |
| `/share` | `src/app/share/page.tsx` | Server, reads `searchParams` | Client-facing summary behind an advisor's link |
| `/api/send-summary` | `src/app/api/send-summary/route.ts` | Route handler | Emails the summary via Resend |

There is **no `/check` route**. The Booking Check is not a page — it is a
state machine inside one component. Moving it to `/check` means either a
redirect from `/` or accepting that `/` and `/check` differ.

**No `public/` directory at all.** No `sitemap.xml`, no `robots.txt`, no
favicon, no OG image. Section 10 of the brief assumes these exist; they
do not.

## 2. Component inventory

Eight components, ~980 lines total.

| Component | Lines | Props | Reusable? |
|---|---|---|---|
| `FirstMate` | 352 | `ships`, `emailEnabled` | **No — must be split.** Holds all state, the form, the results shell, and an inline `ReadView`. This is the refactor's centre of gravity. |
| `ReadCard` | 167 | `number`, `category`, `read: ReadCategory \| null`, `lineName?` | **Yes, closest thing to a DecisionCard.** Already has disclosure + the line-policy panel + the uncharted state. |
| `ClientSummary` | 188 | `text`, `verified`, `sharePath`, `client`, `emailEnabled` | Keep as-is. Do not restyle. |
| `NoReadYet` | 126 | `ship`, `covered`, `all`, `onAgain` | Yes — coverage-by-line logic is directly reusable for a directory. |
| `ShipPicker` | 72 | `ships`, `value`, `onChange` | Partially. Native `<select>` grouped by line; a directory needs search + filters, not this. |
| `Emphasis` | 23 | `text` | Yes. Renders `**bold**` as text, never HTML. |
| `Wordmark` / `Insignia` | 26 | none | Yes |
| `Sounding` | 28 | none | Yes (the sonar loading state) |

**Nothing exists for:** provenance badges, coverage chips, deck rows,
risk flags, breadcrumbs, nav, footer, tabs, filters, search.

## 3. Data model map — READ THIS

Types in `src/lib/types.ts`. Content in `src/content/`.

### What is structured

```
ShipIdentity   id, line, name, shipClass?          ← id slugified from name
CruiseLine     id, name, category, ships[]
ShipContent    reviewDue?, sources[], availability?, eligibility?,
               fareInclusions?, cabin?, money?, traps?
  cabin        verified, placementNote?, motionAvoid, vibrationNote?,
               categoryWarnings[], hazardsAboveBelow[], obstructedViewNotes?,
               obstructionKinds[], connectingNote?, minorPlacementRule?,
               elevatorNote?, accessibilityNote?, midshipRange?
  money        verified, drinkPackagePrice?, breakEvenDrinksPerDay?,
               drinkPackageNote?, specialtyDiningNote, gratuityPerDayUSD?
  traps        verified, kidAgeHeightRules?, obstructedBalconyDecks?,
               embarkationNote?, other[], linePolicy[]
```

Genuinely typed and queryable: `ObstructionKind` (9 kinds) + `ViewEffect`
(4) in `obstruction.ts`; `NoiseSource` in `noise.ts`;
`ActivityAvailability` in `availability.ts`; attraction tables in
`royal-attractions.ts` / `ncl-attractions.ts`.

### What is NOT structured — the governing finding

**Every cabin fact is prose.** `placementNote` is a paragraph.
`obstructedViewNotes` is a paragraph. `elevatorNote` is a paragraph.

Consequences, stated plainly:

- **There is no deck data.** No ship carries a deck list. `DeckEntry`
  exists only in `src/lib/intake.ts`, which is the *extraction* schema
  built two days ago and used by zero ships. **The spec's deck-by-deck
  row (`Deck 13 · Above: cabins · Below: cabins · Verdict: …`) cannot be
  rendered for any ship in the catalog.**
- **There are no structured cabin numbers.** Obstructed cabins live
  inside sentences. A per-cabin obstruction table cannot be generated.
- **There is no class record.** `shipClass` is a display string.
  Class rules live as TypeScript factory functions and module-scope
  constants. Nothing maps `"Oasis"` → a queryable object, so
  `/classes/oasis` has no source.
- **There is no line record.** Line policy is exported string constants
  (`CARNIVAL_MONEY`, `ROYAL_FLEET_TRAPS`, `NCL_HAVEN_WARNING`). Nothing
  maps `"Royal Caribbean"` → those constants, so `/cruise-lines/royal`
  has no source.
- **No `serviceYear`, no slug field, no `sisterShips`.** The spec's ship
  header and sister-ship links need all three.

### Engine consumption

`getRead(ship, client)` reads `ShipContent` and returns three
`ReadCategory` objects (`call`, `flags[]`, `why`, `verified`,
`linePolicy?`), or `ineligible`. The engine **does not consume**
`sources`, `reviewDue`, or `availability` metadata directly beyond the
availability flag.

## 4. Engine map

`src/lib/engine.ts`, 430 lines, pure and deterministic. No LLM, no
randomness, no I/O.

```
getRead(ship, client) →
  1. ineligibleReason()   ← minimumGuestAge gate, returns early, nulls all three
  2. cabinRead()          ← motion/vibration split, noise sort, obstruction kinds
  3. moneyRead()          ← fareInclusions resolved BEFORE package economics
  4. trapsRead()          ← availability flag first, then party call, then flags
clientSummary(ship, client) → string   ← ALSO gated on eligibility + inclusions
```

**Provenance today is one boolean per block: `verified`.** There is no
VERIFIED / RESEARCHED / UNCHARTED enum. The three states are *implied*:

| Spec state | Today |
|---|---|
| VERIFIED | `verified: true` |
| RESEARCHED | `verified: false` **with** content |
| UNCHARTED | block `undefined` → `ReadCategory` is `null` |

`ReadCard` already renders all three distinctly. **The distinction the
spec demands mostly exists; it is under-typed, not missing.**

`NOT_CHECKED` vs `NO_PROBLEM_FOUND` vs `UNKNOWN` is typed **only in
`intake.ts`** (`SisterCheck`, `FareInclusions`), which no ship uses. In
`ShipContent` those states are expressed in prose ("that is RESEARCHED",
"nobody has established that either way"). **This is a real gap and the
spec is right to flag it.**

## 5. Coverage matrix

79 covered ships of 195. All 79 fully signed. **Every covered ship has
all three blocks** — so per-ship domain coverage is uniform at block
level, and the useful matrix is per *field*.

```
placement    ██████████████████████████████ 79/79
deckStack    ······························  0/79   ← spec centrepiece
motion       ██████████████████████████████ 79/79
vibration    ██████████████████████████████ 79/79
catWarnings  ██████████████████████████████ 79/79  (2–7 each)
hazards      ██████████████████████████████ 79/79  (2–5 each)
obstrNotes   ██████████████████████████████ 79/79  (prose)
obstrKinds   ██████████████████████········ 58/79  ← typed, queryable
elevator     ████████████████·············· 43/79
obstrDecks   ██████████████████████········ 59/79  (prose)
drinkNote    ███████████████████··········· 50/79
linePolicy   █████████████████············· 44/79
sources      ██████████████████████████████ 79/79  (5–18 each)
availability ······························  1/79
eligibility  ······························  0/79
fareIncl     ······························  0/79
```

By line: Carnival 29, Royal Caribbean 30, Norwegian 20. **29 classes**
across the covered set.

**Best-covered ships** (most populated fields): Radiance of the Seas and
Brilliance of the Seas (34), then Freedom / Liberty / Independence /
Serenade / Jewel (33). **These are the Phase-3 candidates**, not the
famous ships — Icon and Oasis are mid-pack.

**What this licenses:** ship pages with cabin / money / traps / sources
sections live for all 79. **What it forbids:** deck-by-deck for any ship,
per-cabin obstruction tables for any ship, class pages and line pages
until records exist.

## 6. Styling audit

`src/app/globals.css`, Tailwind v4 `@theme`. Tokens, verbatim:

| Token | Value | Role |
|---|---|---|
| `ink` / `ink-2` / `ink-3` | `#0f2a3d` / `#3a5872` / `#6e869a` | Navy text ramp |
| `paper` / `surface` / `line` | `#e9eff1` / `#fcfdfd` / `#d2dcdf` | Cool chart-paper ground |
| `deep` | `#15516f` | Navigation blue |
| `signal` / `signal-bg` | `#b26a1c` / `#fbf1e3` | **Brass — heads-up flags** |
| `go` / `go-bg` | `#1b6b5f` / `#e5f0ed` | **Sea teal — the call** |

**Fonts — the brief is incomplete here.** Three, not two:
`Archivo` (`--font-sans`, brand/UI/labels), `Newsreader` (`--font-call`,
the operator's verdicts — the signature move), `Space Mono`
(`--font-readout`, instrument labels, sparingly).

Navy/teal/brass ✔. Focus-visible ✔. `prefers-reduced-motion` ✔.

**The mobile bottleneck:** there is no shell. `FirstMate` renders
`<div className="mx-auto max-w-[640px] px-5 …">` inline. **640px,
hardcoded, one place.** Every screen inherits it. There is no layout
component to widen.

> **Correction, 2026-08-19.** This originally read 520px. It is 640px —
> I mis-transcribed it. The finding is unchanged (one hardcoded width, no
> shell) and the number was wrong.

## 7. Share / client-summary

Must survive. How it works:

1. `clientSummary(ship, client)` builds warm-register prose from the same
   `ShipContent`, gated per block — and **also** on eligibility and fare
   inclusions (both added this week; the eligibility gate was missed here
   initially and shipped a client note for an impossible booking).
2. `shareParams()` / `sharePath()` encode the five inputs as **readable**
   query params (`?ship=…&who=couple&seasick=no&…`), deliberately not an
   opaque token.
3. `/share` re-parses with `parseShare()`, returning `null` on anything
   malformed rather than guessing, and re-derives the summary server-side.
4. `ClientSummary` offers copy-text, copy-link, and email (email only
   when `RESEND_API_KEY` is set on that deployment).

**Risk:** the share URL contract is public. Changing param names breaks
links advisors have already sent.

## 8. Instrumentation

**There is no analytics of any kind.** No Microsoft Clarity, no gtag, no
Plausible — grep confirms zero matches across `src/` and config. The
brief says "keep existing analytics (Microsoft Clarity)"; there is
nothing to keep. **Instrumentation is net-new work, not preservation.**

Also: the production domain in `layout.tsx` `metadataBase` is
**`cruiseread.com`**, not `firstmatecruise.com`. One of the two is wrong
and it affects canonicals, OG tags and every share link.

## 9. Risks — and the phase reorder they force

**R1 · The deck-by-deck section has no data.** Spec section 3.2 calls it
"critical — make the engine visible", and it is the single best idea in
the brief. It also cannot be built. `DeckEntry` exists in `intake.ts`;
zero ships populate it. Building it from `placementNote` prose would mean
parsing English into deck rows — inventing structure from sentences,
which is precisely the "no fake precision" rule.
**Mitigation: add a `decks?: DeckEntry[]` field to `ShipContent`,
populate it for the two or three ships where the stack is genuinely
known, and render the section only for those.** Viking Star's stack is
already recorded in `docs/viking-findings.md`. This is a data phase and
it must come before the ship page, not after.

**R2 · Class and line pages have no records.** Same shape, less severe —
the facts exist as constants and factory functions, they are just not
addressable. **Mitigation: a `ClassRecord` / `LineRecord` type keyed by
the existing `shipClass` string and line id, referencing the existing
constants rather than copying them.** Non-negotiable: reference, never
duplicate, or the "one source of truth" rule breaks on day one.

**R3 · Refactoring `FirstMate` breaks the engine contract.** 352 lines
holding all state, the form, the results shell and `ReadView`. The spec
wants it split across a shell, a `/check` route and new panels.
**Mitigation: snapshot `getRead()` and `clientSummary()` output for a
fixed set of profiles across all 79 ships BEFORE touching the component,
and diff after every phase.** This is cheap and it is the only thing that
proves "identical engine output pre- and post-redesign".

**R4 · Provenance regression.** `verified` is a boolean; the spec wants a
three-state badge everywhere. The temptation is to derive RESEARCHED from
`verified === false`, which is right today only because every covered
ship happens to be fully signed. The moment a part-signed ship returns,
a derived badge could read UNCHARTED where it should read RESEARCHED.
**Mitigation: type the state explicitly rather than deriving it, and
assert the mapping in tests.**

**R5 · Share-link breakage.** Advisors may already hold `/share?…` URLs.
**Mitigation: treat the five param names as a frozen public contract;
add, never rename; keep `/` working or 308 it to `/check`.**

---

## Proposed phase order — reordered, and why

The brief's order builds pages before the data those pages need. Two
changes:

| # | Phase | Change from brief |
|---|---|---|
| **0** | **Engine snapshot harness** | **NEW, first.** Freeze `getRead`/`clientSummary` output for 79 ships × profiles. Nothing else is safe without it. (R3) |
| **1** | Global shell — nav, width, breadcrumbs, footer, tokens | unchanged |
| **2** | Provenance + coverage components | unchanged. Type the three states explicitly (R4). |
| **3** | **Data model extension — `decks`, `ClassRecord`, `LineRecord`, `serviceYear`** | **MOVED UP from "as needed".** Populate decks for 2–3 ships only. (R1, R2) |
| **4** | Ship detail page | for the best-covered ships: **Radiance, Brilliance, Freedom** |
| **5** | Ships directory | unchanged |
| **6** | Class + line pages | now has records to read |
| **7** | Booking Check redesign | unchanged |
| **8** | Homepage | unchanged |
| **9** | Compare | unchanged |
| **10** | Methodology + guides | unchanged |
| **11** | Instrumentation + SEO + `public/` + Lighthouse | **expanded** — analytics is net-new, and `public/` does not exist |

### Decisions — resolved 2026-08-19

1. **Domain and brand: both.** The logo sheet settles it — the brand is
   **First Mate Cruise** and the domain is **cruiseread.com**, locked up
   together. They were never competing: *First Mate* names the role the
   product plays, *read* is the noun for what it produces, and the mark
   carries both. No rebrand, no domain change; the brief's
   `firstmatecruise.com` is the error.
2. **`/` vs `/check`: RESOLVED in Phase 7 — the check moved to
   `/check`.** Phase 1 kept it at `/` and introduced route groups
   instead — `(app)` for the advisor chrome, `(client)` for the share
   page, which must never show an advisor a CTA meant for them. The root
   now 307s to `/check`, preserving the query, so an advisor's bookmark
   and any `/?ship=` link still land where they meant to. Deliberately
   temporary rather than a 308: Phase 8 takes `/` for the homepage.
3. **Deck data: extend the model.** Done and proved on Radiance class —
   see `src/lib/decks.ts` and the checksum. The stacks are transcribed
   from signed prose, not researched afresh, and `quietBandHolds()`
   fails the build if a transcription contradicts the signed answer.

Phase 0 produced this file with no code changes. Phases 1 onward are in
their own commits.

---

## Content findings raised by a page, not by a review

The ship page is the first surface that shows one hull's whole record at
once, and putting the engine's conditional output beside the record it
came from surfaced a duplication nobody had seen in five class reviews.

**The connecting-cabin flag says the same thing twice on a family
booking.** `engine.ts` wraps the family branch in "never infer it from
the category or from two cabin numbers sitting next to each other. Only
an explicit connecting pair counts", then appends
`cabin.connectingNote`, which on the Royal records reads "Never read
connecting status off the category or off two cabin numbers being next
to each other — only an explicit connecting pair counts." Same rule,
same sentence, twice in one flag.

This ships today in the Booking Check as well; the ship page only made
it visible. **Not fixed here** — the fix is either in `engine.ts` or in
27 signed records, both of which change operator-approved output, and
neither belongs in a UI phase. Raised for Jimmy to call.

## Phase 4 — what shipped

`/ships/[slug]`, static, for the 79 covered hulls only; `dynamicParams`
is off, so the other 116 return 404 rather than an indexable empty page.
Eight sections, none of which is ever dropped — a hull with no deck
stack still renders section 02 saying so, because seven sections instead
of eight reads as a ship whose decks were checked.

Two things are worth flagging beyond the route:

- **`src/lib/fit.ts`.** A reference page has no client, so it cannot
  print a read. It enumerates all 32 profiles through the real engine
  and partitions the output into what is always said and what a
  particular answer turns on. The alternative was a second copy of the
  gating rules in the page, which is the drift the class records were
  built to refuse. Nothing in that file knows what a family is.
- **`/?ship=<id>`.** A new parameter on `/` only. The five `/share`
  params remain a frozen contract and are untouched.

## Phase 5 — what shipped

`/ships`, static, with the whole catalog in the payload and the filter
running in the browser — so the prerendered HTML carries all 79 covered
ships and all 79 links, and search narrows what is already there rather
than fetching.

**The page's real finding is the shape of coverage.** Three lines are
charted completely (30/30, 29/29, 20/20) and eleven are charted not at
all. There is no partially covered line in the catalog. So the covered
lines list every hull as a card with its coverage chips, and the eleven
uncharted lines collapse to one row each with a count — 116 rows saying
what eleven line names already say is the ship dump the no-read screen
removed for the same reason. They expand on demand, because "is my ship
even in there" is a real question, and a search reaches them directly:
typing "Sky Princess" returns the hull marked not charted rather than
"no results", which would read as a catalog gap.

It is derived throughout. The day a line is half worked up it reports
"12 of 17" and renders its covered hulls with nothing here edited.

`/ships` is now `available` in `src/lib/nav.ts` — the first nav item the
site has had. That forced the header's small-screen question a phase
early: inline at 390px wraps both the wordmark and the CTA, so the nav
wraps to its own full-width row below `sm` and scrolls sideways if it
outgrows the screen. Phase 6 makes this four or five items and needs
that treatment regardless; a wider breakpoint would only have deferred
it.

## Phase 6 — what shipped

`/classes` + 29 class pages, `/cruise-lines` + 3 line pages. Both nav
items are live, and the ship page's Line and Class breadcrumbs are links
rather than labels for the first time.

**Class names are not unique across the catalog** — Carnival has a Spirit
class and so does Norwegian. Slugs carry the line id and
`routedClassRecords` throws on a duplicate rather than letting one page
silently overwrite another at build time.

**A one-ship class is not a uniform class.** Nine of the 29 charted
classes report zero exceptions and five of those hold a single hull,
where uniformity is a tautology. The directory shows three distinct
badges — "nothing to compare", "hulls identical", "N exceptions" — and
collapsing the first two would have roughly tripled a real signal. The
honest number is 3 of 23 multi-ship classes.

### Two rendering findings the class page forced

**The by-field layout did not work as built.** Four Radiance obstruction
notes share four opening sentences and one closing one and differ in a
single clause, so reading them side by side meant diffing prose by eye —
the work the page exists to have already done. `sentenceFraming` lifts
the shared leading and trailing sentences out, shows them once, and
gives each hull only its middle: ~850 characters per hull down to ~150,
and the Oasis notes from ~1,030 to ~130. It applies to 15 fields across
9 classes and declines on 4 rather than approximating. Each middle is a
`slice` of the record between two offsets, so it is exact rather than
sentences rejoined — the first version normalised a trailing space
inside a Vision-class note before that was fixed.

**`listDiff`'s binary hid partial inheritance.** An array entry was
either on every hull or one ship's own, so the solo-studios note on
three of four Breakaway Plus hulls rendered as three unrelated notes
that happened to agree. Nine entries across eight classes are in that
position. `groupedExtras` now groups by exact text and reports the
hulls, and section 02 renders three tiers: every hull answers
differently, carried by some and not others, one hull only.

`exceptionCount` changed with it — distinct divergences rather than
per-ship rows, so a five-hull class no longer looks worse than a
two-hull one for carrying the same single exception. Radiance reads 3
rather than 5.

### For Jimmy — a content observation, not a change

Two category notes are really *one note with a per-hull ending*: the
Radiance hump-cabin note (3 hulls identical, Serenade a variant) and the
Breakaway Plus solo-studios note (3 identical, Escape a variant). The
page renders both correctly — shared tier, then the variant — but the
opening sentences appear twice as a result. If those records were
restructured so the shared part is a class constant and only the ending
is per-ship, both would collapse to one entry. That is a content call,
not a rendering one.

## Phase 7 — what shipped

The check moved to `/check` and became addressable.

**The URL is now the state.** A run used to live in a `useState` no URL
described, which made it un-bookmarkable, un-sendable and invisible to
the back button — an advisor who ran a check, clicked through to the
ship page and pressed back landed on an empty form and answered five
questions again. `/check` now reads the same five params `/share` has
always used, so one query renders two pages for two audiences: the
operator's read with its flags, and the warm note a client opens.

Three consequences worth stating:

- **Back and forward work.** `history.pushState` does not fire
  `popstate`, so pushes go through `pushUrl` in `src/lib/url-state.ts`,
  which notifies subscribers the same way a back button does. Back also
  restores what the advisor had typed, and "Run another booking" seeds
  the form from the run it is leaving — someone who arrived on a link
  and wants to change one answer does not start from defaults.
- **A stale link lands on the form, never a crash.** The old code
  asserted the ship id was findable, which held only while it could
  only come from the picker. It now comes from a URL, so an unknown
  ship, a bad party value or a partial query all fall through to the
  form.
- **`/check` is still static.** `useSearchParams` would have forced the
  subtree under Suspense and dropped the form out of the prerender — the
  form is the product, and a crawler or a JavaScript-off reader gets it
  in the HTML.

Also: the read links out to the ship page, the coverage line links the
directory, the no-read screen links the charted lines and the directory,
and the client summary gained "See it as they will" — an advisor about
to send a note to a paying client can open the page first rather than
trusting a sentence describing it.

## Phase 8 — what shipped

`/` is a page again. The Phase 7 redirect is gone rather than inverted —
both routes are real now and neither stands in for the other, and since
the redirect was always a 307 nothing cached it as permanent.

**Nothing on the homepage is a mock-up.** The three calls in the demo
section are produced by the real engine from the Radiance record at
build time, and the deck table is the same `DeckTable` the ship page
renders from the same transcribed stack. Both name the ship and link to
the live version, so a reader who suspects a marketing screenshot can
click through and check — a verification asserts the linked check
reproduces the three calls verbatim, so the page cannot claim a read the
product does not give.

Radiance is the demonstration hull because it is the best-covered ship
in the catalog: signed end to end, fourteen sources, and one of only two
classes with a transcribed deck stack — which is what lets one page show
both the answer and the arithmetic behind it. If it ever leaves the
catalog the build throws rather than rendering a homepage with a hole.

Every number is reduced from the catalog at build time. No stock
photography, no testimonials, no logos, no percentages, no ratings —
asserted by the verification, not just by intent.

### A bug the homepage's canonical tag exposed

`/share` was inheriting `canonical: "/"` from the root layout. Every
other route overrides it and that one never did, so **every share link
was telling crawlers it was really the homepage** — and worse, share
URLs were indexable at all. A share URL carries one named client's
booking: the ship, who is travelling, whether they get seasick. It is a
link an advisor sends to one person, not a page.

Fixed by `robots: { index: false, follow: false }` and dropping the
inherited canonical, which is the right pair — there is no canonical URL
for a page that should not be indexed. `public/robots.txt` is still a
Phase 11 item; this is the meta-tag fix and it does not wait for it.

### One component fix

`DeckTable`'s caption pointed at "the placement call above", which is
true on a ship page and a class page and false on the homepage, where
the table stands on its own. The caption is a prop now, defaulting to
the original text.

## Phase 9 — what shipped

`/compare?a=&b=`, and the last nav item is live.

**Almost none of it is new code, and that is the finding.**
`buildClassRecord` never knew it was looking at a class — it takes
covered ships and a field accessor and reports where they agree and
where they diverge. A class is one interesting pair of that shape; two
ships an advisor is choosing between is another. So `ExceptionField`,
`sentenceFraming` and `UniqueExtras` all work here unchanged.

The framing matters more here than it did on the class pages. Comparing
sisters — Radiance against Brilliance — gives 14 of 15 fields matching
and one difference, and that difference is two 850-character notes
sharing four opening sentences and one closing one. Framed, it renders
as two single-line differences under a frame shown once.

What compare adds that a class page cannot: **money**. Every hull on a
line carries the same money block by reference, so a class can only
agree with itself and the class page rightly never looks. Across lines
it is often the largest difference between two ships.

Dynamic, deliberately: 79 covered hulls make ~3,000 pairs, which is not
a prerender, and computing a comparison in the browser would ship the
whole knowledge base to a page that renders a table. `canonical` points
at the bare `/compare` for every pair so the permutations do not
fragment the index.

No client profile. The check answers "what about this booking"; compare
answers "how do these two hulls differ", which is a question about ships
— and the per-client reasoning already has a home on each ship page.

### Two rendering fixes the pair case forced

- `ExceptionField` said "All 2 hulls open with" and "its sisters carry a
  note here", both written for a class and both wrong beside a Carnival
  hull and a Royal one. Both now switch on the count.
- The two deck tables overflowed the page at 390px. A grid item defaults
  to `min-width: auto`, so the table's 520px minimum pushed the page
  sideways instead of scrolling inside its own container. The ship page
  never hit it because its table is not in a grid.

---

## For Jimmy — a money gap the compare page makes dangerous

**Carnival's money block has no `drinkPackageNote`. Royal's and
Norwegian's do.** Put Carnival Vista beside Radiance of the Seas and the
page now shows, side by side:

- Carnival — drink package: **around $84 per person, per day**
- Royal — drink package: **around $75 per person, per day**

An advisor reads that as Carnival being $9 a day more expensive. It is
not. `ROYAL_MONEY.drinkPackageNote` says the 18% gratuity is added at
checkout, so Royal's $75 is really about $88.50. And the signed comment
above `CARNIVAL_MONEY` says Cheers! is "$83.94 per person per day
pre-cruise and $89.94 onboard, both including the 20% service charge" —
so Carnival's $84 is all-in, and buying onboard costs $6 a day more.

Both of those facts are already signed. Neither is on the page, because
Carnival's equivalent of the note lives only in a code comment. The
comparison is therefore backwards by roughly $13 a day, and it is
backwards on the one screen built to compare them.

**FIXED 2026-08-19 on Jimmy's sign-off**, and built as a derivation
rather than as the note originally specified. Two departures from the
brief, both stated to him before implementing:

1. **The note named Royal but would have lived in Carnival's record**,
   which renders on 29 Carnival ship pages where nobody is comparing
   anything, and hardcodes a competitor's rate in a file that would rot
   the day Royal moved it. So the FACT is recorded per line —
   `money.serviceCharge: { rate, includedInPrice }` — and the comparison
   is derived wherever two lines meet. Same output, one source, and it
   covers Carnival-against-Norwegian too rather than only the pair that
   prompted it.
2. **"~$4.56/day less" is false precision.** The rates are solid; the
   prices are not. Royal's $75 is the tracked fleet median of a $55–$120
   range — its own record says so, and it is the same reason break-even
   figures were refused. At $55 Royal is $64.90 all-in and cheaper than
   Carnival; at $120 it is $141.60. The page therefore states the gap as
   arithmetic on the recorded prices and says in the panel that the
   rates carry across every sailing and the gap does not.

What shipped: `serviceCharge` on Carnival (20%, included) and Royal
(18%, at checkout); Norwegian deliberately absent, and the compare page
declines to normalise a Norwegian pair rather than treating unrecorded
as zero. `CARNIVAL_MONEY` gained the missing `drinkPackageNote` and its
price moved from the rounded 84 to the exact 83.94. `src/lib/money.ts`
resolves price and service charge together for every surface, so a bare
"around $75" cannot be printed anywhere — including in the compare
table's own price row, which was still contradicting the panel above it
until that row was made to use the same resolver.

The engine snapshot moved for the first time: 29 Carnival hulls, because
the new `drinkPackageNote` is a flag the money read emits. Regenerated
and committed so the change is visible in review.

**Still open for Jimmy:** Norwegian's service charge is unrecorded, and
Royal's $55–$120 range is signed in a comment but not in a field — the
same shape of gap as Carnival's was.

## Phase 10 — what shipped

`/methodology` and three guides. **Every nav item and every footer link
is now live**, and each resolves.

### A guide here is a cross-cut, not an essay

The general rules were already signed operator content driving every
read — the noise ranking, the obstruction taxonomy, the sandwich test.
What no page answered was the cross-cut: *which hulls have a lifeboat
roof under the balcony*, *which have a galley near the cabins*. That is
one `filter` away and it is the whole value of a guide.

So nothing in `src/lib/guides.ts` is written. A guide states a rule that
was already signed, lists the ships the records say it applies to, and
takes its count from the length of that list — a page cannot say "20
hulls" above nineteen links because it never writes the number down.
Verified programmatically: every count on both data guides equals the
number of ship links beneath it.

New numbers the cross-cut surfaced, all derived:

- The pool deck is a hazard on **all 79** charted hulls; 77 of those name
  the decks. The two counts are rendered separately because "names a
  hazard" and "tells you where it is" are different states.
- **58** hulls have an obstruction mechanism established; **21** are
  published as obstructed with no mechanism stated. The second number is
  given as much room as the first — a guide listing only what it knows
  reads as though the taxonomy were complete.
- Four of the eleven taxonomy entries are one line's geometry and appear
  nowhere else.

### The guarantee guide had a scope problem to solve first

A guarantee is a general booking mechanic and the temptation was to
write the general version. The only signed content in this catalog is
Norwegian's — **10 hulls, one line, nothing for Carnival and nothing for
Royal**. Presenting one line's terms as how guarantees work is exactly
the over-reach the product refuses, because the terms differ by line and
the differences are the whole question.

So the page states its scope in the header, names the two charted lines
it cannot speak for, and links their line pages. The warnings are found
by matching the word against the records rather than from an authored
list, so the page cannot claim a hull it does not have.

### `/methodology`

Where the homepage's four refusals get their argument. It states rules
and links out; the guides carry the tables and the ship lists, so there
is one copy of each. The provenance definitions are rendered from
`PROVENANCE_COPY` — the same constant the badges use — rather than
restated, because the day a restatement disagreed with a badge the badge
would be the honest one and this page the reassuring one.

## Phase 11 — what shipped

The last phase: SEO, `public/`, accessibility, instrumentation.

### Four live defects, found by checking rather than by looking

1. **`/sitemap.xml` 404'd while `robots.txt` promised it.** `public/robots
   .txt` had been pointing at a file that did not exist since it was
   written. `src/app/sitemap.ts` now generates 121 URLs from the same
   data every page reads — 79 ships, 29 classes, 3 lines, 10 static.
   `lastModified` is the most recent date a source behind that page was
   checked, not the build clock: stamping 121 pages with the deploy time
   tells a crawler everything changed whenever one thing did.
2. **`/share`'s title was double-suffixed.** The root template appends
   " — First Mate Cruise" to every title and that page's already ended
   in the brand, so the tab a paying client opened read "Your cruise plan
   — First Mate — First Mate Cruise". Now `title: { absolute }`.
3. **Nothing had an `og:image`.** Every route declared `openGraph`
   metadata and no image existed, so every pasted link rendered as a
   blank card. Then, after adding one, a verification caught the sharper
   half: **111 of the 121 pages still had none.** A page that declares
   its own `openGraph` block replaces the inherited one, image included —
   which is every page using `generateMetadata`: all 79 ship pages, all
   29 class pages, all 3 line pages. The 10 static pages were fine, which
   is exactly why it was invisible until something checked a ship page.
4. **The production domain was in two places.** `metadataBase` and
   `public/robots.txt`. Now one `robots.ts` route; the static file is
   deleted, because a file in `public/` shadows the route rather than
   losing to it.

### Accessibility

An audit across all 15 page types found one real defect — a heading jump
from `h1` to `h3` on the read view, which a screen-reader user
navigating by heading experiences as a missing section. Fixed.

Added a skip link, because the wordmark was the first focusable element
on every page: a keyboard user tabbed the brand, five nav items and the
CTA before reaching content, on each of 121 pages. It moves focus rather
than only scrolling — `#main` is a real box with `tabIndex={-1}`, since
a `display: contents` wrapper has no layout box to scroll to and a skip
link that scrolls without moving focus is the common broken version.

### Instrumentation — a seam, not a tracker

Three pages promise that "the order these get worked up in is driven by
what advisors actually ask for" and nothing could observe it. That is a
claim with no mechanism, which is the kind this codebase least wants
standing.

But choosing a provider is not a code decision. Session-recording tools
capture an advisor's screen while they work a real client's booking, and
the check's own URL carries that client's profile. So `src/lib/analytics
.ts` ships the call sites and the payload constraint and **sends nothing**
— no third-party script, no beacon, until `NEXT_PUBLIC_ANALYTICS_ENDPOINT`
is set. Asserted: running a check fires no request and loads no
third-party script.

The payload is constrained at the type level to a ship id and whether
that hull is charted. Never the party, the seasickness answer, the
itinerary or the URL — the demand question does not need facts about a
real traveller.

**Jimmy's call:** whether to point it at anything, and at what.

---

## For Jimmy — `/check` ships 98% dead weight, and it scales the wrong way

Measured, not estimated:

| | raw | gzipped |
|---|---|---|
| `/` | 73 KB | 12 KB |
| `/ships` | 165 KB | 14 KB |
| **`/check`** | **906 KB** | **88 KB** |

796 KB of that is one inline RSC payload: the entire ship-content corpus
serialised into the HTML of every `/check` load. The page hands `SHIPS`
to a client component because the engine runs in the browser — which is
what makes the check static, instant and offline-capable after load, and
that architecture is worth keeping.

The problem is the ratio and the trajectory:

- **98%** of the payload is ship content; the picker needs the other 2%
  (21 KB of identity for all 195 hulls).
- **12.4 KB raw per covered hull**, so it grows linearly with the thing
  the product exists to grow. At full catalog coverage it is **~2.4 MB
  raw / ~230 KB gzipped** on the page an advisor opens mid-call.
- Only ONE hull's content is ever used per check.

**The fix, and why it is not in this commit.** Split the payload: the
server passes identity only, and a hull's content is loaded on demand —
either a dynamic `import()` of the reads module or per-ship static JSON
generated at build. Initial HTML drops to roughly 80 KB raw, the content
is fetched once and cached, and the check's existing 1250 ms Sounding
animation covers the fetch entirely. It needs a loading state for
arriving directly on a full check URL, and an honest failure state.

That is a change to the data architecture of the product's most
important flow, and it deserves its own commit and its own verification
rather than the tail of a phase about metadata. Same call as the Carnival
money note: measured, specified, and left for you to schedule.
