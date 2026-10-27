import type { AccountInterestConfigDto } from "lib";

/** Form fields edited in the interest dialog (for error lookup). */
export const INTEREST_FIELD_NAMES: (keyof AccountInterestConfigDto)[] = [
  "interestRate",
  "aer",
  "interestDayCount",
  "interestPayoutFrequency",
  "interestPayoutDelayDays",
  "interestCompoundingFrequency",
  "interestRoundingStage",
  "interestRoundingMode",
  "interestRoundingScale",
];
