import type { SavingsProjectionDepositDto } from "./SavingsProjectionDepositDto";
import type { SavingsProjectionHorizon } from "./SavingsProjectionHorizon";

export interface FilterSavingsProjectionDto extends SavingsProjectionDepositDto {
  accountId: number;
  horizon: SavingsProjectionHorizon;
}
