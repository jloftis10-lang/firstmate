import type { ShipContent, Source } from "@/lib/types";
import {
  CARNIVAL_EMBARKATION,
  CARNIVAL_KIDS_RULES,
  CARNIVAL_MINOR_PLACEMENT,
  CARNIVAL_MONEY,
  CARNIVAL_ROPES_COURSE_RULES,
  CARNIVAL_SLIDE_RULES,
  CARNIVAL_SOURCES,
} from "./carnival-common";
import {
  BOTTOM_DECK_NOTE,
  CONNECTING_RULE,
  MOTION_RULE,
  PORTHOLE_STEER,
  QUIET_DEFAULT_RULE,
  VIBRATION_RULE,
} from "./operator-rules";

/**
 * Sunshine class: Sunshine, Sunrise, Radiance — three Destiny-class hulls
 * rebuilt and renamed years apart, not sisters out of the same yard.
 *
 * SIGNED OFF by Jimmy, 2026-08-18, against Carnival's own deck plans and
 * facility pages. His pass caught one outright factual error and
 * tightened three more:
 *
 *   - **I said Sunshine has no SportSquare, ropes course or mini-golf.
 *     That was simply wrong.** Carnival's own 2012 announcement for the
 *     Destiny-to-Sunshine rebuild says the 2013 work added SportSquare
 *     with a ropes course, mini-golf, basketball and a jogging track
 *     alongside WaterWorks — and Carnival's current facility pages list
 *     all three ships. There is no per-ship exception here at all. The
 *     whole "Sunshine missed out" story is deleted.
 *   - The quiet default is deck 7 midship ALONE, not 6 to 8. Deck 6
 *     fails below it (the public Promenade sits on 5) and deck 8 fails
 *     above it (Lido on 9).
 *   - Sunshine's obstruction data does exist — Carnival publishes both
 *     walkway-view and obstructed-view picture-window categories. My
 *     record claimed there was none.
 *   - Radiance has two official obstructions I missed entirely: ocean
 *     views 2428 and 2429.
 *
 * The three ships are NOT identical up top and the record no longer
 * pretends otherwise. Sunshine's deck 10 is Spa and WaterWorks; on
 * Sunrise and Radiance deck 10 is Panorama with the main spa up on 11.
 * The behaviour is the same — mixed-use, activity-adjacent — even though
 * the label isn't.
 *
 * Deliberately still absent, and Jimmy agreed with both: the elevator
 * count, because the figures in circulation don't distinguish passenger
 * lifts from the atrium glass subset; and porthole square footage, where
 * the same category surfaces as both 170 and 220 sq ft. That is exactly
 * where the architecture should refuse to manufacture certainty.
 */

const SUNSHINE_CLASS_SOURCES: Source[] = [
  {
    label:
      "Carnival Sunshine — SportSquare, ropes course and mini-golf added in the 2013 rebuild (checked by Jimmy)",
    url: "https://www.carnival.com/cruise-ships/carnival-sunshine",
    checked: "2026-08-18",
  },
  {
    label:
      "Carnival Radiance deck plan — Cloud 9 Spa balconies 1001/1002 and ocean views 2428/2429 obstructed (checked by Jimmy)",
    url: "https://www.carnival.com/cruise-ships/carnival-radiance",
    checked: "2026-08-18",
  },
  {
    label: "Radiance obstructed staterooms and the 4J walkway-view category",
    url: "https://help.goccl.com/app/answers/detail/a_id/5523",
    checked: "2026-08-18",
  },
  {
    label: "SportSquare and ropes-course ship lists — all three hulls carry both",
    url: "https://help.carnival.com/app/answers/detail/a_id/1158",
    checked: "2026-08-18",
  },
  {
    label: "Sunrise's 2019 transformation added SportSquare with a suspended ropes course",
    url: "https://www.carnival.com/cruise-ships/carnival-sunrise",
    checked: "2026-08-18",
  },
];

/**
 * Deck 7 midship, and only deck 7 — the one deck on this class that
 * passes the cabins-above-and-below test.
 *
 * Deck 6 sits immediately above the heavily public Promenade on deck 5.
 * Deck 8 sits immediately below Lido deck 9. Both are perfectly bookable,
 * they just each need one check rather than being waved through.
 *
 * OPERATOR-CONFIRMED (Jimmy, 2026-08-18). Read off Carnival's own deck
 * geometry, not a Carnival recommendation.
 */
const SUNSHINE_CLASS_QUIET_DEFAULT = `Midship on deck 7. ${QUIET_DEFAULT_RULE} On this class deck 7 is the only one that passes cleanly: deck 6 sits directly above the public Promenade on 5, and deck 8 sits directly below Lido deck 9. Book 6 and you check what's below; book 8 and you check what's above; book 7 and you're between cabins both ways.`;

/**
 * Decks 9 and 10 both mix accommodation with activity on all three
 * ships. The labels differ — Sunshine's 10 is Spa and WaterWorks, the
 * other two call theirs Panorama with the spa up on 11 — but the
 * booking behaviour is identical, so the rule is shared and the naming
 * is handled per ship.
 */
const MIXED_UPPER_DECKS =
  "Decks 9 and 10 are both mixed-use on this class and neither is a normal quiet cabin deck. Deck 9 is Lido — forward cabins share it with the pool, the buffet and the public space. Deck 10 carries cabins alongside high-activity areas too. Neither is a no, but both need a same-deck and vertical check on the specific cabin rather than a blanket yes.";

/**
 * The forward walkway-view rooms are a category rule, not a cabin list.
 * Carnival sells them as picture-window rooms whose view is partly taken
 * by the outdoor observation deck and walkway. GoCCL identifies 7201 as
 * a 4J obstructed-view cabin and the class plan shows the arrangement,
 * but the full forward ranges are NOT hard-coded — Jimmy explicitly held
 * those back pending the exact obstruction page.
 */
const FORWARD_4J_WALKWAY_VIEW =
  "Watch the forward picture-window rooms in the 4J band on decks 6 and 7 — they're the walkway-view category, where the outdoor observation deck and walkway take part of the view and people on the walkway can see back in. 7201 is a confirmed example. I'm deliberately not listing the full forward range as verified until the exact obstruction page is in hand, so read the category code on the specific cabin.";

/** Carnival's own published obstructions, per hull. */
const OBSTRUCTED: Record<"sunshine" | "sunrise" | "radiance", string> = {
  sunshine:
    "Carnival publishes obstruction data for this ship — both an Interior with Picture Window (Walkway View) category and an Interior with Picture Window (Obstructed View) category, with deck 6 rooms such as 6101 documented as obstructed-window walkway rooms. The exact cabin-level list hasn't been imported here yet, so check the plan for the specific cabin rather than assuming it's clean.",
  sunrise:
    "Carnival publishes obstruction data for this ship, but the cabin-level list hasn't been imported here yet. Radiance's official entries are a useful guide to where to look — the forward Cloud 9 Spa balconies and the lower-deck ocean views — but I'm not claiming the same numbers apply here.",
  radiance:
    "Carnival's current deck plan lists Cloud 9 Spa Balcony cabins 1001 and 1002 as obstructed, with the obstruction described as a steel railing, and separately lists ocean views 2428 and 2429 as obstructed.",
};

function sunshineClassContent(
  ship: "sunshine" | "sunrise" | "radiance",
): ShipContent {
  const deck10 =
    ship === "sunshine"
      ? "On this ship deck 10 is the Spa and WaterWorks deck."
      : "On this ship deck 10 is called Panorama and the main spa sits up on 11 — a different label from Sunshine's, but the same mixed-use behaviour.";

  return {
    reviewDue: "2027-02-01",
    sources: [...CARNIVAL_SOURCES, ...SUNSHINE_CLASS_SOURCES],

    cabin: {
      // Signed off by Jimmy, 2026-08-18, against Carnival's own deck
      // plans. Corrections listed at the top of the file.
      verified: true,
      placementNote: `${SUNSHINE_CLASS_QUIET_DEFAULT} ${MIXED_UPPER_DECKS} ${deck10}`,
      motionAvoid: MOTION_RULE,
      vibrationNote: VIBRATION_RULE,
      categoryWarnings: [
        PORTHOLE_STEER,
        BOTTOM_DECK_NOTE,
        FORWARD_4J_WALKWAY_VIEW,
        "These three are rebuilt Destiny-class hulls, not sisters that came out of the yard together, and they were rebuilt years apart. The upper decks don't even carry the same names — check the actual ship's plan rather than reasoning from a sister.",
        "A client asking for a high deck to get away from the crowd is asking for the wrong thing here. On this hull, high means the pool deck and the waterpark. Deck 7 midship gets them what they actually want.",
      ],
      hazardsAboveBelow: [
        {
          source: "lido",
          where:
            "deck 9 — the pool deck carries forward cabins itself, so it's a same-deck problem there as well as an overhead one for deck 8",
        },
        {
          source: "buffet",
          where: "also on deck 9, alongside those forward cabins",
        },
        {
          source: "kids",
          where:
            "the WaterWorks complex on the deck above the Lido, mixed in with the cabins on that deck",
        },
        {
          source: "sports",
          where:
            "SportSquare, the ropes course and mini-golf up top on all three ships",
        },
      ],
      obstructedViewNotes: OBSTRUCTED[ship],
      connectingNote: CONNECTING_RULE,
      minorPlacementRule: CARNIVAL_MINOR_PLACEMENT,
      accessibilityNote:
        "These upper decks mix accommodation and recreation far more than the Excel ships do — cabins sit on and around decks 9 and 10 rather than all sitting well below the outdoor attractions. For a slower traveller that cuts the vertical trip if they're booked high, but it buys that with same-deck traffic and overhead activity, so proximity here is a tradeoff rather than a straight win. That comparison is our inference from the deck geometry rather than a Carnival statement. Confirm scooter clearance against Carnival's accessible deck plan as usual.",
    },

    money: CARNIVAL_MONEY,

    traps: {
      // Signed off by Jimmy, 2026-08-18, after reversing my claim that
      // Sunshine lacks a sports complex. It has one and always has.
      verified: true,
      kidAgeHeightRules: `${CARNIVAL_SLIDE_RULES} The Twister slide runs a 42-inch minimum. ${CARNIVAL_ROPES_COURSE_RULES} ${CARNIVAL_KIDS_RULES}`,
      ...(ship === "radiance"
        ? {
            obstructedBalconyDecks:
              "Cloud 9 Spa balconies 1001 and 1002, blocked by a steel railing, plus ocean views 2428 and 2429",
          }
        : {}),
      embarkationNote: CARNIVAL_EMBARKATION,
      other: [
        "All three ships have SportSquare with a ropes course and mini-golf, plus WaterWorks. Sunshine got its set in the 2013 rebuild, Radiance in 2018 and Sunrise in 2019 — different years, same facilities today. Don't let an older review tell you one of them went without.",
        "Neither BOLT nor SkyRide is on this class — those are the Excel and Vista ships. Don't let a client arrive expecting the rollercoaster or the sky ride.",
        "All three were rebuilt from older hulls at different times and their upper decks carry different names, so photos and deck plans of one sister can be wrong about another. Check the ship they're actually booked on.",
      ],
    },
  };
}

export const carnivalSunshine = sunshineClassContent("sunshine");
export const carnivalSunrise = sunshineClassContent("sunrise");
export const carnivalRadiance = sunshineClassContent("radiance");
