import { BaseFilterDto } from "lib";

export interface FilterCurrencyDto extends BaseFilterDto {
  name?: string;
  symbol?: string;
  userId?: number;
}
