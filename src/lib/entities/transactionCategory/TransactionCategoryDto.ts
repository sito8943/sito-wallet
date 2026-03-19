import { BaseEntityDto, CommonUserDto } from "@sito/dashboard-app";
import { TransactionType } from "lib";

export interface TransactionCategoryDto extends BaseEntityDto {
  name: string;
  auto: boolean;
  description: string;
  type: TransactionType;
  user: CommonUserDto | null;
}
