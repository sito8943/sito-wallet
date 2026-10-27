import type { SavingsProjectionHorizon } from "./SavingsProjectionHorizon";

export interface FilterSavingsProjectionDto {
  accountId: number;
  horizon: SavingsProjectionHorizon;
}
