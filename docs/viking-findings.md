# Viking pilot — what the first extraction actually produced

Returned 2026-08-18. Raw response kept at `docs/intake/viking-2026-08-18.json`.

**Verdict: the pilot succeeded, and it succeeded by failing the way it was
designed to fail.** It broke its own premise before a single record was
written, which is worth more than the twelve records would have been.

---

## The premise was wrong, and the sister-check caught it

Viking was chosen as the pilot because it looked like **twelve sisters and
one deck plan** — the best ships-per-review-unit ratio in the catalog.

It is nine and three.

| | Star and eight sisters | Vela, Vesta, Mira |
|---|---|---|
| Guests | 930 | **998** |
| Length | 745 ft | **784 ft** |
| Beam | 94 ft | **101 ft** |
| Owner's Suite | 1,297 sq ft | **1,448 sq ft** |
| Deluxe Veranda | 270 sq ft | **288 sq ft** |

Viking describes Vela as the first of a new generation of larger ocean
ships, 54,300 GT, about 13% larger than the earlier hulls.

**Had this been one intake with eleven silent sisters, twelve records
would have encoded a false sameness** — the same shape of error as a
published summary copying Breakaway's cabin numbers onto Escape. The
difference is that this time the check was mandatory and the answer was
forced.

Vela and Vesta were the two flagged in the brief as most likely to differ.
They were.

## Two more catalog corrections

**Viking Sun does not exist as Viking Sun.** She is Viking Yi Dun,
PRC-registered, operated by China Merchants Viking Cruises on China
itineraries — Viking's own press release says so. Removed from the
catalog rather than renamed in it: she is not a ship a North American
advisor books.

**Viking Mira was missing.** Delivered 26 May 2026, in service, 998
guests — a third hull of the newer class.

Libra (November 2026) and Astrea (2027) are announced and not sailing,
and were correctly kept out.

---

## What is usable

The money side came back well sourced from Viking's own pages:

- **Silver Spirits — $27 per guest per day**, 15% service charge included
  in that price, minimum age 21, **both guests in a stateroom must buy it
  for the whole cruise**. Covers wines by the glass, house champagne,
  cocktails, aperitifs and anything priced up to $18 all day, plus a
  premium pairing at The Chef's Table and discounts on bottles and
  tastings.
- **Gratuities are NOT in the fare** — around $20 per person per night,
  with the caveat that some promotions and World Cruise fares include
  them, and booking terms override the general rule.
- Also included: **specialty dining, Nordic Spa and fitness access,
  24-hour room service, self-service launderettes.**

The all-or-nothing rule on Silver Spirits is the same shape as Royal's
and Norwegian's package rules, which makes it the kind of thing an
advisor mis-quotes by analogy. It belongs in the record.

## What is not usable

Almost everything on the cabin side, and the extraction said so itself
rather than dressing it up:

- **The deck stack is secondary** (cruisemapper), explicitly flagged as
  needing visual confirmation against Viking's own graphic. Viking's
  interactive plan is not machine-readable and the official PDF returned
  an access error at their end too.
- **Obstructed cabins: unknown.** And critically, the extraction refused
  to convert "I could not inspect the graphic" into "Viking does not mark
  obstructions" — the exact seven-times-wrong claim, correctly declined.
- **Elevator count and banks: unknown.** Both, so neither gets used.
- **Refit history: unknown.**
- **Stateroom subcategories:** only the grouped codes OS/ES/PS/PV/DV/V
  were exposed. No DV1/DV2-style subcodes were invented, though a
  secondary source had earlier offered them.

## A schema weakness the extraction exposed

The deck stack marked decks 3, 4, 5 and 6 as mixed-use — **on the strength
of a self-service launderette on each.**

True, and useless. `publicSpace` is a flat list of names, so a launderette
counts exactly as much as an infinity pool. Nobody is kept awake by a
washing machine two doors down.

`mixedUseDecks()` still reports the fact rather than filtering, because
filtering there would hide it. The brief now says: name every venue
including the dull ones, and let the composition step decide which matter.
That judgment already exists in `src/lib/noise.ts`, which ranks sources by
what a client actually experiences.

**If the secondary stack is right about deck 7, it is the real finding
here** — Main Pool, Pool Grill, Pool Bar, World Café, Aquavit Terrace,
Infinity Pool and the Explorers' Lounge lower level, all on a deck that
also carries staterooms. That would be the most extreme
`PUBLIC_SPACE_SANDWICH` case in the catalog, worse than Norwegian Sun's
deck 11. It needs the official plan before it can be said.

---

## What the pipeline proved

The three rules earned their place immediately:

1. **`"unknown"` as a required answer** — used honestly and often, instead
   of gaps being filled.
2. **Source and date on every value** — made it possible to see at a
   glance that the money block is Viking's own and the deck stack is not.
3. **"No differences found" separated from "not checked"** — nine ships
   came back *not checked* rather than falsely clean, and the two that
   differ were caught.

The thing it did not solve is the thing it was never going to: **Viking's
deck plans are a graphic.** No text extraction reaches them. Composing the
cabin block needs someone to look at the plan.

---

## The official deck stack — preserved, because it was expensive

Read visually off Viking's 2022 deck-plan PDF by Jimmy, after the
extraction hit the same 403 I did on the 2024 URL. This is the artifact
that took a full round-trip to obtain, so it is recorded here rather than
living only in a deleted file.

| Deck | Staterooms | Public venues on that deck |
|---|---|---|
| A | no | Medical Center |
| 1 | no | Nordic Spa, Fitness, salon, shops, The Living Room, bar, Guest Services, The Chef's Table, The Kitchen Table, Manfredi's, private dining |
| 2 | no | Torshavn, shops, Promenade, The Theater, The Restaurant, two cinemas, bar, atrium |
| 3 | **yes** | atrium, launderette |
| 4 | **yes** | launderette |
| 5 | **yes** | launderette |
| 6 | **yes** | launderette (bridge, not a guest venue) |
| 7 | **yes** | Explorers' Lounge, Mamsen's, Wintergarden, Pool Grill, Pool Bar, Main Pool, Lanai, World Café, Aquavit Terrace, Infinity Pool, hot tub |
| 8 | **yes** | Explorers' Lounge upper level, open-to-below and retractable-roof areas |
| 9 | no | Sports Deck, hot tub, outdoor recreation |

### The derivation, and where judgment overrode arithmetic

`quietCandidates()` returns **[4, 5, 6, 7]** on this stack — verified
against the function, not asserted.

The operator answer is **decks 4 and 5 midship**. The two exclusions are
the point:

- **Deck 6 passes arithmetically, fails in practice** — deck 7 sits
  directly over it.
- **Deck 7 passes arithmetically, fails hardest** — it carries the pools,
  the buffet and two bars *on its own deck*.

Deck 3 fails below on the theatre and restaurant; deck 8 fails above on
the sports deck.

**Deck 7 is the most mixed-use deck found anywhere in this catalog**,
worse than Norwegian Sun's deck 11 which previously held that. It is the
clearest case `PUBLIC_SPACE_SANDWICH` exists to describe.

### Also established

- Two passenger lift cores visible through the accommodation decks. **No
  car count and no forward/midship/aft label** — reading bank positions
  off a drawing is how three accessibility warnings got withdrawn.
- Categories are the grouped codes **OS, ES, PS, PV, DV, V**. Viking
  publishes total area *including* the veranda rather than splitting
  them, so a 270 sq ft Deluxe Veranda is not 270 sq ft of room.
- Silver Spirits: **$27 per guest per day**, 15% service charge included
  in that price, age 21, covers anything to $18 a glass all day, and
  **both guests in the stateroom must buy it for the whole cruise** —
  the same all-or-nothing shape as Royal's and Norwegian's.
- **Gratuities are NOT in the fare**, around $20 per person per night,
  with promotions and World Cruise fares overriding.

## Status: record pulled 2026-08-19

A Viking Star record was composed from all of the above and then removed
at Jimmy's call. The reason is not that any of it is wrong — it is that
one SAMPLE-marked ship in an otherwise fully-signed catalog of 79 muddies
the first impression, and the next step is showing the product to an
advisor rather than growing it.

Everything needed to rebuild it in one pass is on this page. What would
still be missing is what was missing before: obstructed verandas,
elevator counts, refit history, and a deck check on the eight sisters,
who came back *not checked* rather than *no differences found*.
