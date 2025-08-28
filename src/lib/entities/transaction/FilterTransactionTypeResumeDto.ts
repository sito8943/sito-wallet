import { FilterTransactionDto } from "lib";

export interface FilterTransactionTypeResumeDto
  extends Omit<FilterTransactionDto, "accountId"> {
  account?: number[];
}
