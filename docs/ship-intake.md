# Ship intake brief

What to extract for one hull, and why each item is here. Paste this to
whatever has access to the line's own deck plans and room pages.

**Every item on this list exists because it was got wrong once.** This is
not a general ship questionnaire — it is the specific set of mistakes
made across 27 class reviews, turned into questions.

The machine-checkable version is `src/lib/intake.ts`. Answers come back
as one JSON object per ship matching `ShipIntake`, and
`validateIntake()` rejects it if a value arrives without a source and a
date.

---

## Three rules that override everything else

**1. One ship per intake. Never a class.**
A single NCL press release covered Epic and Pride of America, and the
kids'-club relocation from it got written onto the wrong ship. Sisters
that genuinely share a layout will show it by having matching intakes.
They must never be assumed to.

**2. `"unknown"` is an answer. A blank is not.**
Say `"unknown"` explicitly for anything the sources do not settle. Gaps
left empty get filled by inference later, and inference produced two
whole classes of error — claiming a ship lacked a feature because a page
did not list it, and reasoning from a lift count to a mobility
recommendation.

**3. Today, not history.**
A refit announcement is not an inventory. Sky Pad and Enchantment's
bungee trampolines were both really announced and both long removed
before they were written up as things to sell. Ask what is on the ship
now; put what changed in `refits`.

---

## What to extract

### Decks — the whole stack, in order

For every deck the plan shows:

- the number **as the line prints it** (Royal skips 13 — record that)
- does it carry cabins
- which public venues sit **on** it, named

This is the single most valuable section. The quiet-default rule needs
cabins above *and* below, and it produced a wrong answer four times
before it was applied properly — including one case (Vision class) where
the correct answer turned out to be the *lowest* middle deck while every
instinct said high.

A deck can be **both** cabins and public space. That is the case the
simple vertical scan misses, and it has come up on four hulls. Do not
collapse it — a deck with cabins and a pool on it needs both flags.

**Name every venue, including the dull ones**, and let the composition
step decide which matter. The first Viking extraction flagged four decks
as mixed-use on the strength of a self-service launderette on each —
correct, and useless as a warning, because nobody is kept awake by a
washing machine two doors down. A launderette and an infinity pool are
both public space and only one of them is a reason to move a cabin. The
extraction records what is there; the record decides what it means.

### Obstructed cabins — from the official plan only

Cabin numbers the **line's own** deck plan marks. Plus, separately:

- **the cause, if and only if the line states it.** Most publish that a
  cabin is obstructed without saying by what. `"unknown"` is the right
  answer far more often than not.
- whether the line's plan legend has **no obstructed marker at all**

Those last two are different states and both matter. "No cabins are
marked" and "this line does not mark obstruction" look identical from
outside and lead to opposite advice. The claim that no list existed was
made seven times and was wrong every time.

**Do not copy cabin numbers between sister ships.** A published summary
was caught copying Norwegian Breakaway's numbers onto Escape — not even
the same sub-class.

### Attractions — what is aboard today

Per attraction: name, **present today yes/no**, the restriction
**verbatim** from the line, and whether it is currently out of service.

Restrictions belong to the attraction, not the class. Navigator of the
Seas has the Blaster at 47 inches; Adventure has Typhoon and Cyclone at
48. Quoting one sister's number for another turns a child away at the
queue. Norwegian Prima has the Speedway; Aqua does not.

Out-of-service is deliberately separate from absent — RipCord exists on
Quantum of the Seas and is not running.

### Refits — dated, and including what was **removed**

Ships change more than once. Norwegian Joy has three configurations: the
original China build, the 2019 westernisation, and a 2024 refit that
undid part of the 2019 one. A record written through any single lens is
wrong about the other two.

**Removals matter most**, because an old review will show a feature that
no longer exists and never mention its absence. Spirit's children's water
park became an adults-only retreat.

### Solo and studio — the exact words

Category names verbatim, and the line's **own wording** on the single
supplement. The phrasing is the fact:

- Royal's Quantum studios avoid a 200% solo rate
- NCL says "no single supplement required" outright
- an older NCL ship's "Solo" is a standard cabin priced for one, which
  is a different product from a purpose-built Studio

Getting this wrong in one direction told a solo client three ships had
nothing for them. All three sell to them.

### Elevators — count **and** bank positions

A count with no layout gives no usable advice, so both or neither.

This is where the worst error would have been. Icon class runs 22 lifts
forward and midship; Oasis runs 24 forward and aft with nothing midship.
So "your calmest cabin is your longest walk to a lift" is true on one and
false on the other. Three separate accessibility warnings were withdrawn
for resting on layout that was inferred rather than read.

If the plan does not show bank positions, the answer is `"unknown"`.

### Cabin dimensions — per category, never a range

A class-wide square-footage range was deleted six times. The number is
almost never the finding. What *is* useful:

- the category code does not tell you the room (Epic: same family, very
  different balconies and bed orientation)
- "Suite" does not imply a balcony (Norwegian Dawn's family suites)
- the marketing adjective carries no information ("Spacious" and "Ultra
  Spacious" are reused across families)

### Suite / top-tier product — what it actually includes here

The Haven on a Prima ship and the Haven on a Jewel-class ship are not
the same product, and one class has none at all while the line's website
still shows generic Haven wording on its page. Extract what **this
hull's stateroom inventory** contains, not what the line's marketing
says.

### Open questions

Anything unsettled, in your own words. A recorded conflict is useful; a
conflict silently resolved by picking one side is not.

One caveat learned the hard way: **a conflict that has been resolved
should be closed, not left standing.** The Speedway height was recorded
as "sources disagree, 48 or 55 — check before promising" long after the
line's own FAQ settled it at 55.

---

## What happens next

1. Extraction comes back as JSON matching `ShipIntake`.
2. `validateIntake()` runs. Anything with a value but no source or date
   is rejected, and every problem is reported at once.
3. The record gets composed from it — deck bands computed by
   `quietCandidates()` and `mixedUseDecks()` rather than judged by eye.
4. It still gets signed off. **Extraction replaces the research half of a
   review, not the judgment half.** Nothing here decides whether deck 10
   is a tradeoff or a veto, or whether a warning is worth an advisor's
   attention. That is the part that needs an operator.
