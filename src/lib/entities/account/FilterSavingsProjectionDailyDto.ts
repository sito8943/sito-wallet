import type { SavingsProjectionDepositDto } from "./SavingsProjectionDepositDto";

export interface FilterSavingsProjectionDailyDto extends SavingsProjectionDepositDto {
  accountId: number;
  /** YYYY-MM */
  month: string;
}
