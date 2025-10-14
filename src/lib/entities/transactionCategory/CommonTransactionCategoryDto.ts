import { BaseCommonEntityDto } from "@sito/dashboard-app";
import { TransactionType } from "lib";

export interface CommonTransactionCategoryDto extends BaseCommonEntityDto {
  name: string;
  initial: boolean;
  type: TransactionType;
}
