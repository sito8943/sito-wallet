import { BaseEntityDto } from "@sito/dashboard-app";
import { CommonAccountDto, CommonTransactionCategoryDto } from "lib";

export interface TransactionDto extends BaseEntityDto {
  description: string;
  initial: boolean;
  amount: number;
  account: CommonAccountDto | null;
  category: CommonTransactionCategoryDto | null;
  date: string;
}
