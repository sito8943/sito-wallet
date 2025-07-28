import { CurrencyDto } from "./CurrencyDto";

export interface UpdateCurrencyDto
  extends Omit<CurrencyDto, "updatedAt" | "deleted" | "createdAt"> {
  name: string;
  description: string;
}
