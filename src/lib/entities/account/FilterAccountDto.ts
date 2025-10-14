import { BaseFilterDto } from "@sito/dashboard-app";

export interface FilterAccountDto extends BaseFilterDto {
  name?: string;
  currencyId?: number;
  userId?: number;
}
