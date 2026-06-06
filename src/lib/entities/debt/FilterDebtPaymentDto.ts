import type { BaseFilterDto, RangeValue } from "@sito/dashboard-app";

export interface FilterDebtPaymentDto extends BaseFilterDto {
  paidAt?: RangeValue<string>;
}
