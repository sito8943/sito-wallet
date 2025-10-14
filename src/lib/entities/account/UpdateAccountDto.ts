import { DeleteDto } from "@sito/dashboard-app";
import { AccountType } from "./AccountType";

export interface UpdateAccountDto extends DeleteDto {
  name: string;
  description: string;
  type: AccountType;
  currencyId: number;
  userId: number;
}
