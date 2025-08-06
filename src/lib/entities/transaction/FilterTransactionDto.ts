import { BaseFilterDto } from "lib";

export interface FilterTransactionDto extends BaseFilterDto {
  accountId?: number;
  amount?: number;
  userId?: number;
  date?: string;
}
