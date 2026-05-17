import type { ImportPreviewDto } from "../ImportPreviewDto";
import type { CurrencyDto } from "./CurrencyDto";

export interface ImportPreviewCurrencyDto
  extends Omit<CurrencyDto, "user">, ImportPreviewDto {}
