import { DeleteDto } from "@sito/dashboard-app";

export interface UpdateCurrencyDto extends DeleteDto {
  name: string;
  symbol: string;
  description: string;
  userId: number;
}
