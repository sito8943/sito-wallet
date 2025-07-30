import { TransactionType } from "./TransactionType";

export interface AddTransactionDto {
  name: string;
  description: string;
  accountId: number;
  type: TransactionType;
  amount: number;
  date: Date;
}
