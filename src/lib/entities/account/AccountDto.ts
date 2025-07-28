import { BaseEntityDto } from "lib";
import { CommonAccountDto } from "./CommonAccountDto";

export interface AccountDto extends CommonAccountDto, BaseEntityDto {
  name: string;
  description: string;
}
