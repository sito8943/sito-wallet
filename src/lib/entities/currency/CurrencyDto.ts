import { BaseEntityDto, CommonUserDto } from "lib";

export interface CurrencyDto extends BaseEntityDto {
  name: string;
  description: string;
  user: CommonUserDto | null;
}
