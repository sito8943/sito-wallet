/** Where interest rounding is applied. */
export enum InterestRoundingStage {
  /** Round each day's accrual. */
  Daily = 0,
  /** Accrue at full precision and round the amount when credited. */
  Payout = 1,
}
