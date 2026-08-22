# Extraction request — Celebrity Cruises

**14 ships, 3 classes.** Read `docs/ship-intake.md` for the field-by-field
reasoning; this document is the specific ask.

| Class | Ships |
|---|---|
| **Edge** (5) | Celebrity Edge, Apex, Beyond, Ascent, Xcel |
| **Solstice** (5) | Celebrity Solstice, Equinox, Eclipse, Silhouette, Reflection |
| **Millennium** (4) | Celebrity Millennium, Infinity, Summit, Constellation |

## Why Celebrity, and why these three classes

Classes are the unit of review, not hulls — the work is one full intake
plus a difference check per sister. On that measure Celebrity is the most
efficient line left: 4.3 ships per class against Princess's 3.4 and MSC's
2.9.

**The Galapagos class is deliberately excluded.** Flora, Xpedition and
Xploration are 16-to-100-passenger expedition ships. That is the same
reasoning that removed the luxury and expedition lines from the catalog
in the first place: the product thesis is big-ship cabin traps — what is
above your cabin, what is in front of your balcony, which deck is
sandwiched — and on a 48-berth expedition yacht almost none of it
applies. Three ships, one class, and the least applicable content in the
fleet. **If you disagree, say so before the extraction runs** rather than
after, because a fourth class changes the ask.

---

## The standing rule: one intake per ship, never per class

A press release covering two ships got read onto the wrong one once
(Pride of America's kids-club move was attributed to Norwegian Epic).
That must not become structural.

**So: one full intake for the first ship in each class, then an explicit
difference check for every other hull in it.**

The difference check is a question, not an assumption. For each sister,
answer: *does this hull differ from the reference ship on any of the
following, and if so how?*

- deck stack — any deck carrying cabins that the reference doesn't, or vice versa
- any public venue on a different deck
- cabin categories present or absent
- anything currently out of service
- any refit the reference hasn't had, or hasn't had yet

`"no differences found"` is a valid and useful answer. `"not checked"` is
also valid. **What is not valid is silence**, because silence gets read as
sameness later.

Ships worth checking hardest, because they are the ones most likely to
differ from their nameplate sister:

- **Celebrity Xcel** — newest Edge-class hull. A fifth-of-a-class ship is
  rarely identical to the first.
- **Celebrity Reflection** — has an extra deck of cabins compared to the
  rest of Solstice class. If that is right, it is a real structural
  difference and it changes the deck arithmetic, not just a note.
- **Millennium class refits** — these hulls have been through a
  significant modernisation programme. If the four are at different
  points in it, that is a chronological overlay like Norwegian Joy's, and
  the record has to say *which configuration is current* rather than
  blending them.

---

## Three things Celebrity does that the catalog has never had to record

Every hull covered so far is Carnival, Royal Caribbean or Norwegian. The
record format has quietly absorbed things those three have in common.
Celebrity breaks three of them, and two of those are the reason this line
is interesting rather than just more of the same.

### 1. The Infinite Veranda — a balcony that is inside the cabin

**This is the headline question and it deserves the most care.**

On Edge-class ships a large part of the "veranda" inventory is an
*Infinite Veranda*: there is no outdoor balcony. A glass wall lowers at
the touch of a button and a bi-fold partition opens the front of the
cabin to the air, so the balcony space is *inside* the room and adds to
its square footage.

That is not an obstruction. Nothing is in the way. It is something the
catalog has no shape for yet: **a category that is sold under a name a
client will understand to mean something else.** The obstruction taxonomy
is about what blocks a view; this is about what the word "veranda" leads
a client to picture.

What to establish, precisely:

- **Which categories on which ships** are Infinite Veranda, and which
  Edge-class categories are conventional outdoor balconies. Some Edge
  hulls carry both. An advisor needs to know which is which by category
  code, and if the codes are unstable, say so rather than listing them.
- **How Celebrity's own booking flow names it.** Does it say "veranda"
  without qualification? This is the whole mis-sale risk and it turns on
  the exact wording a client sees.
- **What it actually costs the client**, from people who have stayed in
  one — reported complaints include the glass creaking or popping as it
  moves, and the cabin heating up through a full-height window. Whether
  those are widespread or anecdotal matters; say which.
- **What it genuinely gains them** — more usable interior space than a
  conventional balcony cabin. This is a tradeoff, not a defect, and the
  record should carry both halves. "Fine for a client who wants the room,
  wrong for a client who wants to sit outside" is the shape of the answer.

Do not resolve it into a verdict. Give both sides and let the engine's
category warning carry the tradeoff, the way the Radiance hump cabins do.

### 2. "Always Included" — the first fare-inclusive line in the catalog

Carnival, Royal and Norwegian all sell the drink package separately, and
every money read is built on that assumption. Celebrity bundles.

The data model already has the shape for this and **no ship has ever used
it** — `fareInclusions` was built for the Viking pilot and the Viking
record was pulled before sign-off. Celebrity would be the first real use,
so getting it right matters beyond this line.

What the field needs:

- **What the fare actually includes** at each tier, itemised as Celebrity
  words it.
- **Alcohol specifically**, in one of three states: `none`, `with-meals`,
  or `unlimited`. This is the one the money read turns on — it decides
  whether the engine asks "is the package worth it" at all, or asks the
  much narrower question of whether an upgrade earns its keep.
- **The paid upgrade**, where one exists — its name and what it adds.
- **Whether the tier structure changed recently.** A repeat client is
  comparing against what they got last time, and a superseded tier name
  is worse than none.

Flag anything you cannot pin down rather than filling it in. `"not
researched"` is a real value in this field and it is *not* the same as
"includes nothing" — the model keeps those apart deliberately.

### 3. Celebrity is not a kids' line, but it is not adults-only either

The traps read opens its family branch with *"Kid access is the trap on
this ship"*, which is written for Carnival and Royal. Celebrity carries
children and has programming, but it is not the same proposition.

Establish what is actually there — age bands, hours, whether it runs on
every sailing — and say plainly if the honest answer is "thin". A family
booking a Celebrity ship expecting Adventure Ocean is exactly the kind of
expectation gap this product exists to close, and it is a real finding if
the programming is minimal rather than absent.

If any hull or sailing carries a **minimum guest age**, that is
`eligibility` and it must be recorded — the engine blocks the booking
outright rather than advising on it.

---

## The rest of the intake

Everything in `docs/ship-intake.md` applies unchanged. The three that
matter most for these hulls, in order:

1. **The deck stack.** Which decks carry cabins, and what public space is
   on each. This is what lets the quiet-cabin arithmetic run at all, and
   only 8 of the 79 charted hulls currently have one. A transcribed stack
   for a Celebrity class would be worth more than any prose about it.
2. **Obstructed balconies — the mechanism, not just the fact.** "Which
   cabins are obstructed" is half an answer. *By what* is the other half,
   and it decides opposite advice: a lifeboat below the rail costs the
   view straight down and leaves the horizon, a steel bulkhead takes the
   horizon entirely. If the line publishes that a cabin is obstructed
   without saying by what, **record that it does not say** rather than
   guessing at the cause.
3. **What is currently out of service.** Dated, per hull, with a source.
   An empty list means nobody checked — never that everything works.

## What will get a claim rejected

- A cabin number carried from one sister to another. Several existing
  records say explicitly that a documented pair on one hull does *not*
  reproduce on its sister. That is a finding; inheriting it erases one.
- A category code list presented as stable when the line is changing
  them. A stale code list is worse than none.
- A number with no source, or a source that is a search snippet
  describing a page nobody opened.
- Anything phrased as a score, a rating or a percentage.
- Silence where a difference check was asked for.
