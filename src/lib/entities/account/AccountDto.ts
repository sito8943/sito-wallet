import { BaseEntityDto } from "lib";
import { CommonAccountDto } from "./CommonAccountDto";
import { AccountType } from "./AccountType";

export interface AccountDto extends CommonAccountDto, BaseEntityDto {
  name: string;
  description: string;
  currency: string;
  type: AccountType;
  owner: string;
}
