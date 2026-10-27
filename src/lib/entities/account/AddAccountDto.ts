import type { AccountType } from "./AccountType";
import type { AccountInterestConfigDto } from "./AccountInterestConfigDto";

export interface AddAccountDto extends AccountInterestConfigDto {
  name: string;
  balance: number;
  description: string;
  type: AccountType;
  bankName?: string;
  currencyId: number;
  userId: number;
}
