import { BaseFilterDto } from "lib";

export interface FilterTransactionDto extends BaseFilterDto {
  name?: string;
  accountId?: number;
  amount?: number;
  userId?: number;
  date?: Date;
}
