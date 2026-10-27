/**
 * Optional monthly deposit simulated by the savings projection endpoints.
 * Both are omitted when there is no deposit (amount absent or 0).
 */
export interface SavingsProjectionDepositDto {
  monthlyDeposit?: number;
  /** 1–31; shorter months deposit on their last day. */
  depositDay?: number;
}
