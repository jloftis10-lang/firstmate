import type {
  ClientProfile,
  Experience,
  Itinerary,
  Party,
  Seasick,
} from "./types";

/**
 * The booking, encoded into a link an advisor can send.
 *
 * Params are spelled out rather than packed into an opaque token. A link
 * a client is about to open should look like something a person made, not
 * a tracking string — and an advisor glancing at it before they hit send
 * can see it says what they meant.
 */

const PARTY: Party[] = ["couple", "family", "multigen", "solo"];
const SEASICK: Seasick[] = ["no", "yes"];
const EXPERIENCE: Experience[] = ["first", "seasoned"];
const ITINERARY: Itinerary[] = ["port-heavy", "sea-days"];

export function shareParams(client: ClientProfile): URLSearchParams {
  return new URLSearchParams({
    ship: client.shipId,
    who: client.party,
    seasick: client.seasick,
    sailed: client.experience,
    itinerary: client.itinerary,
  });
}

export function sharePath(client: ClientProfile): string {
  return `/share?${shareParams(client).toString()}`;
}

/**
 * THE SAME FIVE PARAMS, on the advisor's side of the link.
 *
 * `/check` and `/share` read an identical query and render it for two
 * different people: the operator's read with its flags and reasoning,
 * and the warm summary a client receives. One booking, one set of
 * answers, two audiences — which is why this reuses `shareParams`
 * rather than defining a second encoding that would drift from it.
 *
 * `parseShare` reads both. It is the only parser and it returns null on
 * anything malformed rather than guessing at a default.
 */
export function checkPath(client: ClientProfile): string {
  return `/check?${shareParams(client).toString()}`;
}

/** Returns null on anything malformed rather than guessing at a default. */
export function parseShare(
  params: Record<string, string | string[] | undefined>,
): ClientProfile | null {
  const one = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v;

  const shipId = one(params.ship);
  const party = one(params.who);
  const seasick = one(params.seasick);
  const experience = one(params.sailed);
  const itinerary = one(params.itinerary);

  if (!shipId) return null;
  if (!PARTY.includes(party as Party)) return null;
  if (!SEASICK.includes(seasick as Seasick)) return null;
  if (!EXPERIENCE.includes(experience as Experience)) return null;
  if (!ITINERARY.includes(itinerary as Itinerary)) return null;

  return {
    shipId,
    party: party as Party,
    seasick: seasick as Seasick,
    experience: experience as Experience,
    itinerary: itinerary as Itinerary,
  };
}
