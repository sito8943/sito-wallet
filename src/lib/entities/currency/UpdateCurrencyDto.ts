import { DeleteDto } from "../base";

export interface UpdateCurrencyDto extends DeleteDto {
  name: string;
  description: string;
  userId: number;
}
