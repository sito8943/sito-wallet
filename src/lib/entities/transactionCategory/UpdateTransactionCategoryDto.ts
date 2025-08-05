import { TransactionType, DeleteDto } from "lib";

export interface UpdateTransactionCategoryDto extends DeleteDto {
  name: string;
  description: string;
  userId: number;
  type: TransactionType;
}
