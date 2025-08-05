import { TransactionType } from "lib";

export interface AddTransactionCategoryDto {
  name: string;
  description: string;
  userId: number;
  type: TransactionType;
}
