import { BaseFilterDto, RangeValue, TransactionType } from "lib";

export interface FilterTransactionDto extends BaseFilterDto {
  accountId?: number;
  amount?: number;
  category?: number[];
  userId?: number;
  date?: RangeValue<string>;
  currencyId?: number;
  type?: TransactionType;
}
