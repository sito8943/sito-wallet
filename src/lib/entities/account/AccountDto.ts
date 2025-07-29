import { BaseEntityDto, CommonCurrencyDto } from "lib";
import { CommonAccountDto } from "./CommonAccountDto";
import { AccountType } from "./AccountType";

export interface AccountDto extends CommonAccountDto, BaseEntityDto {
  name: string;
  description: string;
  currency: CommonCurrencyDto | null;
  type: AccountType;
  userId: number;
}
