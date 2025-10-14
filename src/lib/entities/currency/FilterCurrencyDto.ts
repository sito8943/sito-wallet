import { BaseFilterDto } from "@sito/dashboard-app";

export interface FilterCurrencyDto extends BaseFilterDto {
  name?: string;
  symbol?: string;
  userId?: number;
}
