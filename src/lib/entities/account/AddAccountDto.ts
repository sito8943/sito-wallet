import { AccountDto, AccountType } from "lib";

export interface AddAccountDto
  extends Omit<
    AccountDto,
    "id" | "updatedAt" | "createdAt" | "deleted" | "currency"
  > {
  name: string;
  description: string;
  type: AccountType;
  currencyId: number;
}
