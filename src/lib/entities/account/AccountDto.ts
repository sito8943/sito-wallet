// @sito/dashboard-app
import type { BaseEntityDto, CommonUserDto } from "@sito/dashboard-app";

// lib
import type { CommonCurrencyDto } from "lib";
import type { AccountType } from "./AccountType";

export interface AccountDto extends BaseEntityDto {
  name: string;
  description: string;
  currency: CommonCurrencyDto | null;
  type: AccountType;
  bankName?: string;
  user: CommonUserDto | null;
  balance: number;
}
