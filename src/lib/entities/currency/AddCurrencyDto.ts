import { CurrencyDto } from "lib";

export interface AddCurrencyDto
  extends Omit<CurrencyDto, "id" | "updatedAt" | "createdAt" | "deleted"> {
  name: string;
  description: string;
  userId: number;
}
