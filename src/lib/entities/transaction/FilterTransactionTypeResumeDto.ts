import type { TransactionType } from "lib";
import type { TransactionTypeResumeTime } from "./TransactionTypeResumeTime";

export interface FilterTransactionTypeResumeDto {
  accountId?: number;
  type?: TransactionType;
  time?: TransactionTypeResumeTime;
}
