import type { AccountType } from "lib";

export interface AddAccountDto {
  name: string;
  balance: number;
  description: string;
  type: AccountType;
  bankName?: string;
  currencyId: number;
  userId: number;
}
