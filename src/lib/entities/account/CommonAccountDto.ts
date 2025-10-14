import { BaseCommonEntityDto } from "@sito/dashboard-app";
import { CommonCurrencyDto } from "lib";

export interface CommonAccountDto extends BaseCommonEntityDto {
  name: string;
  currency: CommonCurrencyDto;
}
