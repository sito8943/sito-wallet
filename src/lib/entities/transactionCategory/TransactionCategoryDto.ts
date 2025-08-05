import { BaseEntityDto, CommonUserDto, TransactionType } from "lib";

export interface TransactionCategoryDto extends BaseEntityDto {
  name: string;
  description: string;
  type: TransactionType;
  user: CommonUserDto | null;
}
