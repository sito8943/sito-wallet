import { BaseCommonEntityDto } from "@sito/dashboard-app";

export interface CommonCurrencyDto extends BaseCommonEntityDto {
  name: string;
  symbol: string;
}
