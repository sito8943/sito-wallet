import { BaseEntityDto } from "lib";
import { CommonCurrencyDto } from "./CommonCurrencyDto";

export interface CurrencyDto extends CommonCurrencyDto, BaseEntityDto {
  name: string;
  description: string;
}
