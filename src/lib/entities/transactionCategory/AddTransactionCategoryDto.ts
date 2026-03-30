import { TransactionType } from "lib";

export interface AddTransactionCategoryDto {
  name: string;
  description: string;
  color: string;
  userId: number;
  type: TransactionType;
}
