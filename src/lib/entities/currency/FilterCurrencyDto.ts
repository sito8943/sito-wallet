import { BaseFilterDto } from "lib";

export interface FilterCurrencyDto extends BaseFilterDto {
  name?: string;
  userId: number[];
}
