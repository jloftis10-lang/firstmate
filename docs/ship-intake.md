# Ship intake — turning operator knowledge into a record

One pass through this produces one `ShipContent` record in
`src/content/reads/<ship-id>.ts`. Answer in whatever form is natural —
full sentences, fragments, "same as Celebration except…" — the shaping
into fields is the easy part.

**The one rule: if you don't know, say "don't know."** Leaving a field
empty is free — the engine drops the flag and the read is shorter. A
guess is not free: it becomes a confident call an advisor repeats to a
client. Half a record you'd stand behind beats a full one you wouldn't.

A record only gets `verified: true` when *every* field in it is something
you'd say out loud to an advisor on the phone.

---

## 1. Cabin & deck

1. **Seasick client — where exactly do you put them?** Which decks, and
   how far from the ends? (→ `midshipRange`)
2. **Where do you tell them never to book?** What's above and below that
   ruins a cabin on this ship, and roughly where is it — pool deck,
   buffet, atrium, comedy club, laundry? (→ `motionAvoid`,
   `hazardsAboveBelow`)
3. **Obstructed balconies — which decks, and what's blocking them?**
   (→ `obstructedViewNotes`, `obstructedBalconyDecks`)
4. **Connecting cabins — what's the gotcha on this ship specifically?**
   Availability, which categories have them, anything that catches
   families out. (→ `connectingNote`)
5. **Elevators — which bank actually works, and what's the trade-off?**
   (→ `elevatorNote`)
6. **Mobility — what does someone slower on their feet need to know
   about this layout?** Distances, stairs, anything that wears on them by
   day three. (→ `accessibilityNote`)

## 2. Money surprises

7. **Drink package — what's it running per person per day, and how many
   drinks to break even?** (→ `drinkPackagePrice`, `breakEvenDrinksPerDay`)
8. **Specialty dining — what's the book-ahead reality?** Which venue goes
   first, how far out, which nights. (→ `specialtyDiningNote`)
9. **Gratuities — daily rate per person, auto-added or not?**
   (→ `gratuityPerDayUSD`)

## 3. Expectation traps

10. **Kids — what are the actual height and age cutoffs that catch
    people?** Rides, slides, club age bands. (→ `kidAgeHeightRules`)
11. **Embarkation day — what do first-timers get wrong about the
    timing?** (→ `embarkationNote`)
12. **Anything else that detonates on boarding day?** The thing you'd
    warn an advisor about that isn't in any of the above. (→ `traps.other`)

---

## Open questions on the shared risk table

`src/lib/noise.ts` holds the ranked above/below table. Six of its twelve
rows already state their timing inside the "what they experience" text —
buffet is "early breakfast setup", nightclub is "late at night", quiet
restaurant is "at opening and closing". Four do not:

- **Gym** — when does it actually bite? Early morning, all day?
- **Sports court / running track** — same question.
- **Theater / show venue** — daytime rehearsals as well as evening shows?
- **Bar / lounge** — from when in the evening?

Timing only earns its place in the read if there is a client dimension to
match it against, and there isn't one today: the five inputs don't ask
whether someone is a light sleeper or a night owl, and a sixth input needs
a validated reason. Worth recording, not worth adding an input for yet.

## Notes on shape

- **Deck ranges** read back as "book them midship, ___" — so
  "decks 7 to 9", not "7-9".
- **`motionAvoid`** reads back as "avoid ___ entirely" — so
  "the top decks and anything forward of the atrium".
- **`hazardsAboveBelow`** is a list, joined into "on this ship that means
  ___" — each entry a phrase, not a sentence.
- **Prices and rates** are numbers; the engine formats the currency and
  degrades gracefully if one is missing.
- **`reviewDue`** is when the content should next be checked. Prices and
  gratuity rates go stale fastest.

## After the record lands

Run `npm run coverage` to see where the fleet stands.
