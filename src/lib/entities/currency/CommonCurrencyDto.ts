import { BaseCommonEntityDto } from "lib";

export interface CommonCurrencyDto extends BaseCommonEntityDto {
  name: string;
  symbol: string;
}
