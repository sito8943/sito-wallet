import { TransactionType } from "lib";
import { DeleteDto } from "@sito/dashboard-app";

export interface UpdateTransactionCategoryDto extends DeleteDto {
  name: string;
  description: string;
  color: string;
  userId: number;
  type: TransactionType;
}
