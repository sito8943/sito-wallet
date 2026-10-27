import type { InterestCompoundingFrequency } from "./InterestCompoundingFrequency";
import type { InterestDayCount } from "./InterestDayCount";
import type { InterestPayoutFrequency } from "./InterestPayoutFrequency";
import type { InterestRoundingMode } from "./InterestRoundingMode";
import type { InterestRoundingStage } from "./InterestRoundingStage";

/**
 * Interest configuration of a Saving account. Every field is optional and only
 * meaningful when `type === AccountType.Saving`; the backend clears them to
 * null for any other type.
 */
export interface AccountInterestConfigDto {
  /** Nominal annual rate (NIR / gross), in percent. Drives daily accrual. */
  interestRate?: number | null;
  /** AER in percent. Reference only — used to validate the configuration. */
  aer?: number | null;
  interestDayCount?: InterestDayCount | null;
  interestPayoutFrequency?: InterestPayoutFrequency | null;
  /** Days after the period end until the interest is credited. */
  interestPayoutDelayDays?: number | null;
  interestCompoundingFrequency?: InterestCompoundingFrequency | null;
  interestRoundingStage?: InterestRoundingStage | null;
  interestRoundingMode?: InterestRoundingMode | null;
  /** Number of decimals used when rounding. */
  interestRoundingScale?: number | null;
}
