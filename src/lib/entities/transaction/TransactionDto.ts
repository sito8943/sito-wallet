import type { BaseEntityDto } from "@sito/dashboard-app";
import type {
  CommonAccountDto,
  CommonPurchaseProviderDto,
  CommonTransactionCategoryDto,
} from "lib";
import type { TransactionProductDto } from "./TransactionProductDto";

export interface TransactionDto extends BaseEntityDto {
  description: string | null;
  auto: boolean;
  amount: number;
  account: CommonAccountDto | null;
  categories?: CommonTransactionCategoryDto[] | null;
  category?: CommonTransactionCategoryDto | null;
  date: string | null;
  purchaseProvider?: CommonPurchaseProviderDto | null;
  products?: TransactionProductDto[];
  /**
   * Card reward points this transaction earned (2 decimals). null when it
   * earns none: not a card with rewards, not an eligible spend, excluded
   * category or before the rewards start date.
   */
  rewardsPoints?: number | null;
}
