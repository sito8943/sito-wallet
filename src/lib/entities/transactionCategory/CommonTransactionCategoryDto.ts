import type { BaseCommonEntityDto } from "@sito/dashboard-app";
import type { TransactionType } from "lib";

export interface CommonTransactionCategoryDto extends BaseCommonEntityDto {
  name: string;
  color: string | null;
  auto: boolean;
  type: TransactionType;
}
