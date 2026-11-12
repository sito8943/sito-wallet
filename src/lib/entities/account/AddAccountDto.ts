import type { AccountType } from "./AccountType";
import type { AccountInterestConfigDto } from "./AccountInterestConfigDto";
import type { AccountRewardsConfigDto } from "./AccountRewardsConfigDto";

export interface AddAccountDto
  extends AccountInterestConfigDto, AccountRewardsConfigDto {
  name: string;
  balance: number;
  description: string;
  type: AccountType;
  bankName?: string;
  currencyId: number;
  userId: number;
  /**
   * Transaction categories (or groups) whose spends earn no points.
   * Create: null/absent = none. Update: null/absent = keep, [] = clear.
   */
  rewardsExcludedCategoryIds?: number[] | null;
}
