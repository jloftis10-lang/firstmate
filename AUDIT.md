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
`<div className="mx-auto w-full max-w-[520px] px-5 …">` inline. **520px,
hardcoded, one place.** Every screen inherits it. Desktop is literally a
520px column. There is no layout component to widen.

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

### Three decisions I need from you before Phase 1

1. **Domain.** Code says `cruiseread.com`; the brief says
   `firstmatecruise.com`. Which is live?
2. **`/` vs `/check`.** Move the Booking Check to `/check` and make `/`
   the new homepage (with a redirect), or keep the check at `/`?
3. **Deck data.** The deck-by-deck section is the best idea in the brief
   and needs data that doesn't exist. Options: (a) I extend the model and
   we populate 2–3 ships by hand from plans you can open, (b) ship pages
   launch without the section until extraction fills it, (c) something
   else. **This is the one that most changes what the platform feels
   like.**

I have made no code changes. Awaiting approval.
