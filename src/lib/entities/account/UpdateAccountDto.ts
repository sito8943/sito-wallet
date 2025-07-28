import { AccountDto } from "./AccountDto";
import { AccountType } from "./AccountType";

export interface UpdateAccountDto
  extends Omit<AccountDto, "updatedAt" | "deleted" | "createdAt"> {
  name: string;
  description: string;
  type: AccountType;
}
