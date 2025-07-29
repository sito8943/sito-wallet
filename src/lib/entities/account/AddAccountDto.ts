import { AccountType } from "lib";

export interface AddAccountDto {
  name: string;
  description: string;
  type: AccountType;
  currencyId: number;
  userId: number;
}
