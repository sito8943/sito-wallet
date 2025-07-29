import { BaseFilterDto } from "lib";

export interface FilterAccountDto extends BaseFilterDto {
  name?: string;
  currencyId: number[];
  userId: number[];
}
