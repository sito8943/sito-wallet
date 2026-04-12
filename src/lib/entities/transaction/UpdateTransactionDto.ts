import { DeleteDto } from "@sito/dashboard-app";
import { TransactionType } from "./TransactionType";

export interface UpdateTransactionDto extends DeleteDto {
  description?: string | null;
  accountId: number;
  categoryIds?: number[];
  categoryId?: number;
  type?: TransactionType;
  amount: number;
  date?: string | null;
}
