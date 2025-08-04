import { BaseEntityDto, CommonCurrencyDto, CommonUserDto } from "lib";
import { AccountType } from "./AccountType";

export interface AccountDto extends BaseEntityDto {
  name: string;
  description: string;
  currency: CommonCurrencyDto | null;
  type: AccountType;
  user: CommonUserDto | null;
  balance: number;
}
