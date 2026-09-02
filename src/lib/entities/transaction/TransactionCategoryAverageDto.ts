import type { CommonAccountDto, TransactionType } from "lib";
import type { CategoryAverageGranularity } from "./CategoryAverageGranularity";
import type { TransactionCategoryAverageCategoryDto } from "./TransactionCategoryAverageCategoryDto";
import type { TransactionCategoryAveragePointDto } from "./TransactionCategoryAveragePointDto";

export type TransactionCategoryAverageDto = {
  transactionType?: TransactionType;
  account?: CommonAccountDto | null;
  from: string;
  to: string;
  granularity: CategoryAverageGranularity;
  total: number;
  transactionCount: number;
  periodCount: number;
  averagePerPeriod: number;
  averagePerTransaction: number;
  categories: TransactionCategoryAverageCategoryDto[];
  points: TransactionCategoryAveragePointDto[];
};
