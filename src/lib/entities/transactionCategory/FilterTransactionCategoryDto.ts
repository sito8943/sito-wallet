import { BaseFilterDto, TransactionType } from "lib";

export interface FilterTransactionCategoryDto extends BaseFilterDto {
  name?: string;
  userId?: number;
  type?: TransactionType;
}
