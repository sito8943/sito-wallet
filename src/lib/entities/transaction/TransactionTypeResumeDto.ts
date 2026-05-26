import type { CommonAccountDto, TransactionType } from "lib";
import type { TransactionTypeResumeCategoryDto } from "./TransactionTypeResumeCategoryDto";

export type TransactionTypeResumeDto = {
  transactionType: TransactionType;
  account: CommonAccountDto | null;
  startDate: string;
  endDate: string;
  total: number;
  categorizedTotal: number;
  duplicatedAmount: number;
  categories: TransactionTypeResumeCategoryDto[];
};
