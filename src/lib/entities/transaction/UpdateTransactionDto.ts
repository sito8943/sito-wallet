import { DeleteDto } from "../base";
import { TransactionType } from "./TransactionType";

export interface UpdateTransactionDto extends DeleteDto {
  name: string;
  description: string;
  accountId: number;
  type: TransactionType;
  amount: number;
  date: string;
}
