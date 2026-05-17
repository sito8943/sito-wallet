import type { BaseFilterDto } from "@sito/dashboard-app";
import type { TransactionType } from "lib";

export interface FilterTransactionCategoryDto extends BaseFilterDto {
  name?: string;
  userId?: number;
  type?: TransactionType;
}
