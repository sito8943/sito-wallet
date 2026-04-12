import { BaseEntityDto } from "@sito/dashboard-app";
import { CommonAccountDto, CommonTransactionCategoryDto } from "lib";

export interface TransactionDto extends BaseEntityDto {
  description: string | null;
  auto: boolean;
  amount: number;
  account: CommonAccountDto | null;
  categories?: CommonTransactionCategoryDto[] | null;
  category?: CommonTransactionCategoryDto | null;
  date: string | null;
}
