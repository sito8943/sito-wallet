import { AccountDto } from "./AccountDto";

export interface UpdateAccountDto
  extends Omit<AccountDto, "updatedAt" | "deleted" | "createdAt"> {
  name: string;
  description: string;
}
