# CruiseRead

A second set of eyes on a cruise booking, for travel advisors. Tell it the
ship and who's sailing; it flags what bites that booking — where to put the
cabin, what the money actually does, and the surprises that show up at the
gangway rather than on the booking page.

**cruiseread.com**

- **`CLAUDE.md`** is the product brief and the standing constraints. Read it
  before changing anything about how a read is produced.
- **`AUDIT.md`** is the running record: what each phase shipped, what it
  found, and what is still open.
- **`docs/TODO.md`** is the handoff — open work, and the invariants to
  read before touching any of it. Start there if you are picking this up
  cold.

## What it is, technically

Next 16, React 19, Tailwind v4, TypeScript. Statically generated — 123 pages
plus 79 ship records as JSON. Two routes are server-rendered on demand
(`/share`, `/compare`); everything else is prerendered.

The Confidence Read is a **deterministic rules engine over structured
records**. No language model is involved at any point, and there are no
scores, ratings or percentages anywhere in the product. See `/methodology` on
the running site, or `src/lib/engine.ts`.

## Commands

```bash
npm run dev        # dev server
npm run build      # production build
npm run serve      # rebuild and serve, killing any stale server first
npm run verify     # tsc + the engine snapshot check — run before committing
npm run snapshot   # regenerate the snapshot after an INTENDED engine change
npm run coverage   # coverage report by line and class
```

`npm run verify` is the gate that matters. It typechecks and then replays all
79 covered ships against all 32 client profiles — 2,528 reads — against a
committed hash. An unintended change to the reasoning fails it. An intended
one has to be regenerated and committed, so it shows up in review as a diff
rather than passing unnoticed. **Do not delete the snapshot to make it pass.**

## Deploying

Vercel, zero-config. Import the repo, accept the detected Next.js settings,
deploy. A clean clone with no environment variables set builds and runs
correctly — verified — so nothing below is required to go live.

### After deploying

```bash
scripts/smoke.sh https://cruiseread.com
```

curl and grep only — no Node, no install — so it runs from a laptop. That
matters: the build environment's egress policy blocks the production
domain, so the checks that only mean something against a real deployment
cannot be run from here.

It covers the production-only class of problem: every route and the two
that must 404, the sitemap's URLs resolving, robots pointing at the right
host, `og:image` on a `generateMetadata` page as well as a static one
(111 of 121 pages silently lost it once), the share page being noindex
with no canonical, and `/check` still being small rather than inlining
the ship corpus. Run it with no argument against `localhost:3000`; three
checks that need the real origin report as skipped.

**Domain.** `cruiseread.com` appears in five files. Changing the domain means
changing all five and rebuilding — there is no single constant, and that is
worth knowing before you go looking for one:

| File | What it drives |
|---|---|
| `src/app/layout.tsx` | `metadataBase` (canonicals, absolute OG URLs) and `og:url` |
| `src/app/sitemap.ts` | every `<loc>` |
| `src/app/robots.ts` | the `Sitemap:` line |
| `src/lib/email.ts` | links inside the emailed client summary |
| `src/app/api/send-summary/route.ts` | the default sender, overridable with `RESEND_FROM` |

### Environment variables — all optional

| Variable | Absent | Set |
|---|---|---|
| `RESEND_API_KEY` | The "email it to them" affordance is not offered at all | Advisors can email the client summary |
| `RESEND_FROM` | `CruiseRead <notes@cruiseread.com>` | Overrides the sender |
| `NEXT_PUBLIC_ANALYTICS_ENDPOINT` | Nothing is sent anywhere, no third-party script loads | Events POST to that URL |

The email affordance is hidden rather than broken when the key is missing —
an advisor is never offered something that would fail after they have typed
an address.

On analytics: `src/lib/analytics.ts` ships the call sites and constrains the
payload at the type level to a ship id and whether that hull is charted. It
never reports the party, the seasickness answer, the itinerary or the URL —
the check's own URL carries a real client's booking. Choosing a provider is a
privacy decision, which is why nothing is wired up by default.

## What is deliberately absent

Recorded here because each one costs coverage or convenience on purpose, and
a future contributor should know they were choices:

- **No scores.** No rating, percentage or confidence number anywhere.
- **No page for a ship nobody has worked up.** 116 of the 195 catalog hulls
  have no read; they are listed so an advisor can find them and get a
  straight answer, and they 404 rather than rendering an empty page.
- **Uncharted is never a clean bill of health.** Empty blocks and sections
  say so in words rather than disappearing.
- **Absence is not evidence.** "Nobody checked" and "there is nothing there"
  are different values in the data model.
- **No cabin facts inferred between sister ships**, even inside a class.
