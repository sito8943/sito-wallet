/** How card reward points are rounded per eligible transaction. */
export enum RewardsRounding {
  /** points_tx = floor(amount / unit) * pointsPerUnit */
  FloorPerTransaction = 0,
  /** points_tx = (amount / unit) * pointsPerUnit (2 decimals) */
  Exact = 1,
}
