import type { BaseCommonEntityDto } from "@sito/dashboard-app";
import type { CommonCurrencyDto } from "lib";

export interface CommonAccountDto extends BaseCommonEntityDto {
  name: string;
  currency: CommonCurrencyDto;
}
