import { BaseFilterDto, TransactionType } from "lib";

export interface FilterTransactionDto extends BaseFilterDto {
  accountId?: number;
  amount?: number;
  category?: number[];
  userId?: number;
  date?: string;
  currencyId?: number;
  type?: TransactionType;
}
