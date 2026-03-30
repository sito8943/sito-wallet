import { BaseCommonEntityDto } from "@sito/dashboard-app";
import { TransactionType } from "lib";

export interface CommonTransactionCategoryDto extends BaseCommonEntityDto {
  name: string;
  color: string | null;
  auto: boolean;
  type: TransactionType;
}
