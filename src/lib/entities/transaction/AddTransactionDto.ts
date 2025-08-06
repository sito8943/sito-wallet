import { TransactionType } from "./TransactionType";

export interface AddTransactionDto {
  description: string;
  accountId: number;
  type: TransactionType;
  amount: number;
  date: string;
}
