import type { DeleteDto } from "@sito/dashboard-app";
import type { AccountType } from "./AccountType";

export interface UpdateAccountDto extends DeleteDto {
  name: string;
  description: string;
  type: AccountType;
  currencyId: number;
  userId: number;
}
