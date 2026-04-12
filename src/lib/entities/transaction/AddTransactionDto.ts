import { TransactionType } from "./TransactionType";

export interface AddTransactionDto {
  description?: string | null;
  accountId: number;
  amount: number;
  date?: string | null;
  categoryIds?: number[];
  categoryId?: number;
  type?: TransactionType;
}
