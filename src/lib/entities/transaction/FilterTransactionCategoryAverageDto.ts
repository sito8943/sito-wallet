import type { TransactionType } from "./TransactionType";
import type { CategoryAverageGranularity } from "./CategoryAverageGranularity";

export interface FilterTransactionCategoryAverageDto {
  accountId?: number;
  type?: TransactionType;
  categoryIds?: number[];
  from: string;
  to: string;
  granularity: CategoryAverageGranularity;
}
