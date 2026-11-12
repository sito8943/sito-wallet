/**
 * Body of `PATCH accounts/{id}/rewards/adjust`: exactly one of
 * - `delta`: added to the adjustment (negative = redemption)
 * - `balance`: sets the shown balance (adjustment = balance - earned)
 */
export type AdjustRewardsDto =
  { delta: number; balance?: never } | { balance: number; delta?: never };
