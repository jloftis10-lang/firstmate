import { SHIPS } from "@/content/ships";
import { isCovered } from "@/lib/types";

/**
 * ONE COVERED HULL'S RECORD, AS STATIC JSON.
 *
 * `force-static` plus `generateStaticParams` means these are written out
 * at build time like any other page — 79 files on the CDN, no server, no
 * runtime cost. The check fetches exactly the one it needs.
 *
 * ONLY COVERED HULLS, and `dynamicParams` off, so the other 116 return
 * 404 rather than an empty record. The same rule the ship pages keep:
 * something that responds reads as something that exists.
 */

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return SHIPS.filter(isCovered).map((ship) => ({ id: ship.id }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const ship = SHIPS.find((s) => s.id === id);
  if (!ship || !isCovered(ship)) {
    return new Response("Not found", { status: 404 });
  }
  return Response.json(ship.content);
}
