import type { SavingsProjectionPointDto } from "./SavingsProjectionPointDto";

export type SavingsProjectionDto = {
  accountId: number;
  startDate: string;
  endDate: string;
  startBalance: number;
  startAccrued: number;
  endBalance: number;
  endAccrued: number;
  totalInterest: number;
  interestRate: number;
  aer: number | null;
  /** Effective annual rate (%) produced by the configuration. */
  effectiveAnnualRate: number;
  /** effectiveAnnualRate − aer, in percentage points (null without aer). */
  aerDeviation: number | null;
  aerMatches: boolean;
  points: SavingsProjectionPointDto[];
};
