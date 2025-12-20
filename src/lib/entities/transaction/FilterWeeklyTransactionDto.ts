import { FilterTransactionDto } from "lib";

export interface FilterWeeklyTransactionDto
  extends Omit<FilterTransactionDto, "accountId"> {
  account?: number[];
}
