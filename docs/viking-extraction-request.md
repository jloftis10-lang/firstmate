# Extraction request — Viking Ocean class

**12 ships, one class.** Star, Sea, Sky, Sun, Orion, Jupiter, Venus,
Mars, Neptune, Saturn, Vela, Vesta.

This is the pilot for the intake pipeline. Read `docs/ship-intake.md`
for the field-by-field reasoning; this document is the specific ask.

---

## How to handle twelve sisters without assuming they're sisters

The standing rule is one intake per ship, never per class — a press
release covering two ships got read onto the wrong one, and that must
not become structural. But twelve full extractions for genuinely
identical hulls is wasted effort.

**So: one full intake for Viking Star, then an explicit difference check
for each of the other eleven.**

The difference check is a question, not an assumption. For each of the
other eleven ships, answer: *does this hull differ from Star on any of
the following, and if so how?*

- deck stack — any deck carrying cabins that Star's doesn't, or vice versa
- any public venue on a different deck
- cabin categories present or absent
- anything currently out of service
- any refit Star hasn't had, or hasn't had yet

`"no differences found"` is a valid and useful answer. `"not checked"`
is also valid. **What is not valid is silence**, because silence gets
read as sameness later.

The newest two — **Vela (2025) and Vesta (2026)** — are the ones most
likely to differ, and worth checking hardest. Viking has been building
this class for a decade; a tenth-of-a-class hull is rarely identical to
the first.

---

## Read this first — Viking breaks assumptions the catalog is built on

Every ship covered so far is Carnival, Royal Caribbean or Norwegian. The
record format has quietly absorbed things those three lines have in
common, and Viking has none of them. Two are already confirmed to break
the engine, not just the content:

**Adults only.** If the minimum guest age is 18, the read's family
branch currently opens with *"Kid access is the trap on this ship"* —
which is not a warning, it's incoherent. Children cannot be booked.

**Fare-inclusive.** The money read's opening call is whether a drink
package is worth buying, which presumes there is one to buy. If beer and
wine at lunch and dinner, Wi-Fi and a shore excursion per port are in
the fare, the question is wrong before the flags get a chance to correct
it.

Both need engine changes, not content workarounds. **The extraction is
what tells me which changes** — hence the two fields below being as
important as the deck stack.

### Already verified — do not re-extract these

Signed off 2026-08-19 against Viking's own pages, and now encoded:

- **minimum guest age 18** — no guests under 18
- **no casino**
- **a private veranda in every ocean stateroom**, and **no inside
  staterooms at all**
- **Wi-Fi included**
- **one included shore excursion per port**
- **beer, wine and soft drinks included with lunch and dinner**

The all-veranda fact is confirmed, which means the cabin question is now
the one it should have been: **not "does it have a balcony" but "is that
veranda compromised"** — by location, structure, privacy, weather
exposure or venue adjacency. That is what the deck stack and the
obstruction question need to answer.

What still needs extracting on the money side is the **upgrade**: Silver
Spirits, what it costs, and what it adds over the included beer and wine.
The engine now asks only that narrower question, so it is the only part
of the package economics that matters here.

### Still to answer

- whether the age minimum **varies by itinerary or region**
- **gratuities** — included or not, and at what rate if not
- **specialty dining and the thermal suite** — included, or charged
- anything else in the fare not on the verified list above

## Two more where Viking is likely to differ

Both confirmed above. What follows from them:

**All-veranda removes two conversations and sharpens a third.** No
balcony-scarcity question, no interior-versus-balcony trade — and the
obstruction question becomes which verandas are compromised and how.
Given the taxonomy already distinguishes a lost horizon from a blocked
downward view from lost privacy from lost sky, that is a question with a
real answer rather than a yes/no.

**No casino** removes a noise source that appears on nearly every other
hull, which changes what the low-deck adjacency check is looking for.

---

## The full intake for Viking Star

Everything in `docs/ship-intake.md`. The parts that matter most on this
hull:

**The deck stack, complete and in order.** Which decks carry cabins,
which public venues sit on each. This is what the quiet-default rule
runs on, and on a ship with the Explorers' Lounge forward and an
infinity pool aft I have no idea what the answer is. Include mixed-use
decks explicitly — a deck with cabins *and* public space is the case the
simple scan misses.

**Obstructed verandas from Viking's own deck plan**, with cause only if
Viking states it. And the separate question of whether Viking's plan
legend marks obstruction at all — I have claimed "no list exists" seven
times and been wrong seven times, so that needs a real answer rather
than my inference.

**Cabin dimensions per category**, not a range.

**Elevator count and bank positions**, or `"unknown"`. Both or neither —
a count without a layout has produced three withdrawn accessibility
warnings.

**Refits, dated, including anything removed.** Viking Sun was reportedly
transferred out of the fleet at some point; if any of these twelve have
changed name, owner or configuration, that is exactly the kind of thing
an old review preserves and a current page doesn't mention.

---

## What comes back

One JSON object per ship matching `ShipIntake` in `src/lib/intake.ts` —
a full one for Star, difference-checks for the rest.
`validateIntake()` will reject any value that arrives without a source
URL and an ISO date, and it reports every problem at once so one round
trip fixes the lot.

Then I compose the record, the deck bands get computed rather than
guessed, and it comes to you for sign-off. **Extraction replaces the
research half of a review, not the judgment half** — nothing here
decides whether a deck is a tradeoff or a veto.
