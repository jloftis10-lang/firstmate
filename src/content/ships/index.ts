import type { Ship } from "@/lib/types";
import { wonderOfTheSeas } from "./wonder-of-the-seas";
import { carnivalCelebration } from "./carnival-celebration";
import { carnivalMardiGras } from "./carnival-mardi-gras";
import { norwegianPrima } from "./norwegian-prima";

/**
 * Seed ships. Authoritative on a handful beats vague on hundreds — do not
 * pad this list with ships nobody has verified.
 *
 * There is deliberately no "another ship" option: without a Ship record
 * there is no data to reason from, and a read with nothing underneath it
 * is exactly the confidently-wrong output this product exists to prevent.
 */
export const SHIPS: Ship[] = [
  wonderOfTheSeas,
  carnivalCelebration,
  carnivalMardiGras,
  norwegianPrima,
];

export function getShip(id: string): Ship | undefined {
  return SHIPS.find((s) => s.id === id);
}
