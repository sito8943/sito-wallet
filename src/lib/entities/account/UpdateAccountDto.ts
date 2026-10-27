import type { DeleteDto } from "@sito/dashboard-app";
import type { AccountType } from "./AccountType";
import type { AccountInterestConfigDto } from "./AccountInterestConfigDto";

export interface UpdateAccountDto extends DeleteDto, AccountInterestConfigDto {
  name: string;
  description: string;
  type: AccountType;
  bankName?: string;
  currencyId: number;
  userId: number;
}
