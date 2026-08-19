I need you to extract verified facts about Viking Ocean cruise ships from
Viking's own official sources. I'm building a cabin-advice tool for travel
advisors, and wrong facts cost real bookings, so accuracy matters far more
than completeness.

## The ships

Viking Star, Sea, Sky, Sun, Orion, Jupiter, Venus, Mars, Neptune, Saturn,
Vela, Vesta.

## Rules — these override everything else

1. **"unknown" is a correct answer.** If Viking's own material doesn't
   establish something, write "unknown". Do not fill gaps with inference,
   with a secondary site, or with what's probably true. A gap I can see is
   useful; a guess I can't identify is dangerous.

2. **Today, not history.** A refit announcement is not an inventory. I've
   been burned twice by features that were genuinely announced and quietly
   removed years later. For anything onboard, answer "is this on the ship
   now", not "was this ever installed".

3. **Every value needs a source URL and the date you checked it.** A fact
   without a source doesn't get used.

4. **Prefer Viking's own pages and PDFs.** Secondary sites are acceptable
   only when marked as such, and never for cabin numbers.

## Official sources I've located (please verify these are current)

- Viking Ocean deck plans PDF (2024):
  https://aem-prod-publish.viking.com/content/dam/vikingcruises/en/magnolia-images/ocean/ships/deck_plan/2024-OC-deckplans-webPDF-R1.pdf
- Viking Ocean deck plans PDF (2022):
  https://cms-assets.viking.com/ocean/ships/deck_plan/2022-VOC-Deckplans.pdf
- Per-ship pages: https://www.vikingcruises.com/oceans/ships/viking-star.html
  (and the same pattern for each ship name)

If Viking has published a newer deck plan than these, use that instead and
tell me the URL.

## Already confirmed — do not re-research

Minimum guest age 18; no casino; a private veranda in every ocean
stateroom and no inside staterooms at all; Wi-Fi included; one included
shore excursion per port; beer, wine and soft drinks included with lunch
and dinner.

---

# Part 1 — Viking Star, in full

### Decks — the most important section

For **every** deck on the plan, in order:

- the deck number as Viking prints it
- does it carry staterooms: yes/no
- every public venue on that deck, named

I need the complete stack, including decks with no staterooms. The tool
works out which decks are quiet by checking whether a deck has cabins
directly above **and** directly below it, so a missing deck breaks the
calculation.

**Flag any deck that has staterooms AND public venues on the same deck.**
That's the case that matters most and it's easy to miss — a cabin can be
fine vertically and still sit next to a pool bar.

*A secondary source claims staterooms are on decks 3–8 with 9 passenger
decks total. Treat that as unverified and correct it from the official
plan.*

### Verandas

Every stateroom has one. So the question is not whether a cabin has a
veranda but **whether any veranda is compromised**, and how:

- blocked or partially blocked by ship structure
- overlooked from a public deck or walkway above
- sitting under an overhang, so it's permanently shaded
- adjacent to a venue, so it's noisy or overlooked at close range
- unusually exposed to wind or weather because of its position

Give me specific cabin numbers **only if Viking's own deck plan marks
them**. If Viking doesn't mark obstructed cabins at all, say so explicitly
— that's a genuinely useful answer and I've assumed it wrongly before.

### Stateroom categories

Each category code, its name, and its square footage — separately for the
room and the veranda if Viking lists them separately. I don't want a range
across the ship; I want the actual figure per category.

### Elevators

How many, and **where the banks are** (forward / midship / aft). I need
both or neither — a count with no layout tells an advisor nothing, and
I've had to withdraw three accessibility warnings that were built on
guessed layouts.

### Money

- Silver Spirits upgrade: current price and exactly what it adds over the
  included beer and wine
- gratuities: included in the fare or not, and the rate if not
- specialty dining: included or charged
- thermal suite / spa: included or charged
- anything else in the fare not on the confirmed list above

### Refits and changes

For each ship: any refit, with the date, what changed, and specifically
**what was removed**. Removals matter most — an old review shows a feature
that no longer exists and never mentions its absence.

---

# Part 2 — the other eleven ships

Don't repeat the full extraction. For **each** of Sea, Sky, Sun, Orion,
Jupiter, Venus, Mars, Neptune, Saturn, Vela, Vesta, answer one question:

**Does this ship differ from Viking Star, and how?**

Check: deck stack, venue locations, stateroom categories, anything
currently out of service, any refit Star hasn't had.

Answer with exactly one of:

- **"no differences found"** — you checked and found none (give the source)
- **"not checked"** — you didn't check this ship
- **"differs"** — list them (give the source)

**"No differences found" and "not checked" are different answers and I need
to be able to tell them apart.** If eleven ships come back silent, I'll read
that as eleven confirmations, and that's exactly how a mistake spreads
across a whole class.

**Vela (2025) and Vesta (2026) are the most likely to differ** — Viking has
been building this class for a decade and the later hulls have their own
pages. Please check those two hardest.

---

# Part 3 — one catalog question

Which Viking **ocean** ships are in service right now? My list has twelve.
I've seen references to Viking Mira, Libra and Astrea. Tell me which are
in service today, which are announced but not yet sailing, and whether any
of my twelve have left the fleet, been renamed or transferred.

---

# Format

Return JSON, one object per ship. Every value gets a source and a date:

```json
{
  "ship": "Viking Star",
  "extractedOn": "2026-08-19",
  "decks": [
    { "deck": 3, "carriesStaterooms": true, "publicVenues": [],
      "source": "https://...", "checked": "2026-08-19" }
  ],
  "obstructedCabins": [
    { "cabin": "...", "cause": "unknown", "effect": "unknown",
      "source": "https://...", "checked": "2026-08-19" }
  ],
  "vikingMarksObstruction": {
    "value": true, "source": "https://...", "checked": "2026-08-19"
  },
  "stateroomCategories": {
    "value": { "DV1": "270 sq ft room, 76 sq ft veranda" },
    "source": "https://...", "checked": "2026-08-19"
  },
  "elevatorCount":  { "value": "unknown" },
  "elevatorBanks":  { "value": "unknown" },
  "fareInclusions": {
    "value": ["Wi-Fi", "one shore excursion per port"],
    "alcohol": "with-meals",
    "upgrade": { "name": "Silver Spirits", "price": "unknown", "adds": "unknown" },
    "source": "https://...", "checked": "2026-08-19"
  },
  "refits": [
    { "when": "2024-03", "whatChanged": "...", "removed": ["..."],
      "source": "https://...", "checked": "2026-08-19" }
  ],
  "openQuestions": ["anything you couldn't settle"]
}
```

And for the other eleven:

```json
{
  "ship": "Viking Vela",
  "against": "Viking Star",
  "state": "differs",
  "differences": ["..."],
  "source": "https://...",
  "checked": "2026-08-19"
}
```

If something is genuinely unsettled — two Viking pages disagreeing, say —
put it in `openQuestions` rather than picking a side. A recorded conflict
is useful. A conflict silently resolved is not.
