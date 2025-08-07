import {
  BaseEntityDto,
  CommonAccountDto,
  CommonCurrencyDto,
  CommonTransactionCategoryDto,
  TransactionType,
} from "lib";

export interface TransactionDto extends BaseEntityDto {
  description: string;
  type: TransactionType;
  amount: number;
  account: CommonAccountDto | null;
  category: CommonTransactionCategoryDto | null;
  date: string;
  currency: CommonCurrencyDto;
}
