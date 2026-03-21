import { BaseFilterDto, RangeValue } from "@sito/dashboard-app";

export interface FilterTransactionGroupedByTypeDto extends BaseFilterDto {
  accountId: number;
  userId?: number;
  filters?: string;
  date?: RangeValue<string>;
}
