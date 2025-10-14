// @sito/dashboard-app
import { BaseEntityDto, CommonUserDto } from "@sito/dashboard-app";

// lib
import { CommonCurrencyDto } from "lib";
import { AccountType } from "./AccountType";

export interface AccountDto extends BaseEntityDto {
  name: string;
  description: string;
  currency: CommonCurrencyDto | null;
  type: AccountType;
  user: CommonUserDto | null;
  balance: number;
}
