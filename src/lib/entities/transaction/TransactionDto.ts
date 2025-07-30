import { BaseEntityDto, CommonAccountDto, TransactionType } from "lib";

export interface TransactionDto extends BaseEntityDto {
  name: string;
  description: string;
  type: TransactionType;
  amount: number;
  account: CommonAccountDto | null;
}
