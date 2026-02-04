import { ImportDto } from "@sito/dashboard-app";
import { CurrencyDto } from "./CurrencyDto";

export interface CurrencyImportDto extends ImportDto {
  items: CurrencyDto[];
}
