import { AccountType } from "lib";

export interface AddAccountDto {
  name: string;
  balance: number;
  description: string;
  type: AccountType;
  currencyId: number;
  userId: number;
}
