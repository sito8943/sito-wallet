import { BaseCommonEntityDto, CommonCurrencyDto } from "lib";

export interface CommonAccountDto extends BaseCommonEntityDto {
  name: string;
  currency: CommonCurrencyDto;
}
