import { BaseEntityDto, CommonUserDto } from "lib";

export interface CurrencyDto extends BaseEntityDto {
  name: string;
  symbol: string;
  description: string;
  user: CommonUserDto | null;
}
