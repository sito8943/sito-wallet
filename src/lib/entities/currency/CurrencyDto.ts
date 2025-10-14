import { BaseEntityDto, CommonUserDto } from "@sito/dashboard-app";

export interface CurrencyDto extends BaseEntityDto {
  name: string;
  symbol: string;
  description: string;
  user: CommonUserDto | null;
}
