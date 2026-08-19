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

So please answer these two with particular care:

- `minimumGuestAge` — the actual published minimum, and whether it
  varies by itinerary or region
- `fareInclusions` — everything the fare covers, itemised. Drinks (and
  *which* drinks, at *which* meals), Wi-Fi, shore excursions, gratuities,
  specialty dining, the thermal suite. An empty list would mean nothing
  is included; that is a different answer from "unknown"

## Two more where Viking is likely to differ

**Every stateroom is understood to have a veranda.** If that's right, it
changes several questions rather than answering them: there is no
balcony-scarcity conversation, no interior-versus-balcony trade, and the
obstructed-view question becomes *which verandas are compromised* rather
than *which cabins have one*. **Confirm it rather than assuming it** —
"all-veranda" is exactly the kind of marketing claim that turns out to
have exceptions, and the Sky "zero balconies" error was made in the
opposite direction from the same kind of sentence.

**No casino is reported.** If true it belongs in the record as a
positioning fact, and it also removes a noise source that appears on
most other hulls.

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
