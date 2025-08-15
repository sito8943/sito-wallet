import { DeleteDto } from "../base";

export interface UpdateCurrencyDto extends DeleteDto {
  name: string;
  symbol: string;
  description: string;
  userId: number;
}
