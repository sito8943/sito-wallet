import { BaseFilterDto } from "lib";

export interface FilterTransactionDto extends BaseFilterDto {
  accountId?: number;
  amount?: number;
  categoryId?: number;
  userId?: number;
  date?: string;
  currencyId?: number;
}
