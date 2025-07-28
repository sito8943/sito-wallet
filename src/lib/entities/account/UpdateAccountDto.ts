import { AccountDto } from "./AccountDto";
import { AccountType } from "./AccountType";

export interface UpdateAccountDto
  extends Omit<AccountDto, "updatedAt" | "deleted" | "createdAt" | "currency"> {
  name: string;
  description: string;
  type: AccountType;
  currencyId: number;
}
