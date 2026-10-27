import type { SavingsProjectionPointDto } from "./SavingsProjectionPointDto";

export type SavingsProjectionDto = {
  accountId: number;
  startDate: string;
  endDate: string;
  startBalance: number;
  startAccrued: number;
  endBalance: number;
  endAccrued: number;
  /** Interest credited in the period (excludes deposits). */
  totalInterest: number;
  interestRate: number;
  aer: number | null;
  /** Effective annual rate (%) produced by the configuration. */
  effectiveAnnualRate: number;
  /** effectiveAnnualRate − aer, in percentage points (null without aer). */
  aerDeviation: number | null;
  aerMatches: boolean;
  /** Echo of the simulated monthly deposit (0 when none). */
  monthlyDeposit: number;
  depositDay: number;
  /** Sum of the simulated deposits. */
  totalDeposits: number;
  points: SavingsProjectionPointDto[];
};
