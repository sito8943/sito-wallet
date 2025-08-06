import { BaseCommonEntityDto, TransactionType } from "lib";

export interface CommonTransactionCategoryDto extends BaseCommonEntityDto {
  name: string;
  type: TransactionType;
}
