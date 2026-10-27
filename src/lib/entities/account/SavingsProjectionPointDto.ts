/** One calendar month of a savings projection. */
export type SavingsProjectionPointDto = {
  /** YYYY-MM */
  month: string;
  openingBalance: number;
  /** Interest accrued during the month. */
  accrued: number;
  /** Interest credited during the month. */
  credited: number;
  /** Balance at the end of the month (or at the projection end date). */
  closingBalance: number;
  /** Accrued interest not yet credited at the end of the month. */
  accruedPending: number;
};
