/** One day of the daily savings projection breakdown. */
export type SavingsProjectionDayDto = {
  /** YYYY-MM-DD */
  date: string;
  openingBalance: number;
  earningBalance: number;
  /** Interest accrued that day (full precision). */
  accrued: number;
  credited: number;
  /** Deposit made that day (0 when none). */
  deposited: number;
  closingBalance: number;
  accruedPending: number;
};
