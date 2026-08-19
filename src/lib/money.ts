import type { ShipContent } from "./types";

/**
 * WHAT A DRINK PACKAGE ACTUALLY COSTS AT CHECKOUT.
 *
 * One line's posted price includes its service charge and another's does
 * not, so the two numbers a booking screen shows are not the same kind
 * of number. Normalising them is arithmetic over two signed facts — the
 * price and the rate — and it belongs in one place rather than in every
 * surface that prints a price.
 *
 * Returns null when the service charge has not been recorded. That is a
 * real state and not a zero: an unrecorded rate must never be treated as
 * "included", which would silently produce the same wrong comparison
 * this exists to fix.
 */
export type PackageCost = {
  /** What the line posts. */
  base: number;
  rate: number;
  includedInPrice: boolean;
  /** What the client pays per person per day. */
  allIn: number;
};

export function packageCost(money: ShipContent["money"]): PackageCost | null {
  const base = money?.drinkPackagePrice;
  const charge = money?.serviceCharge;
  if (base === undefined || !charge) return null;
  return {
    base,
    rate: charge.rate,
    includedInPrice: charge.includedInPrice,
    allIn: charge.includedInPrice ? base : base * (1 + charge.rate),
  };
}

/** "$83.94", "$75". Cents only where there are cents. */
export function usd(amount: number): string {
  return Number.isInteger(amount) ? `$${amount}` : `$${amount.toFixed(2)}`;
}

/** "20%", "18%". */
export function percent(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}

/**
 * The one-line description of a package price, with the service charge
 * resolved. Used on ship pages, line pages and the compare table so all
 * three say the same thing about the same number.
 */
export function packageLine(cost: PackageCost): string {
  return cost.includedInPrice
    ? `${usd(cost.base)} per person, per day — the ${percent(cost.rate)} service charge is already in that number.`
    : `${usd(cost.base)} per person, per day, plus ${percent(cost.rate)} added at checkout — about ${usd(cost.allIn)} all-in.`;
}
