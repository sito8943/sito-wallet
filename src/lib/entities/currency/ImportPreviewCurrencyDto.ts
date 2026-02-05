import { ImportPreviewDto } from "../ImportPreviewDto";
import { CurrencyDto } from "./CurrencyDto";

export interface ImportPreviewCurrencyDto
  extends Omit<CurrencyDto, "user">,
    ImportPreviewDto {}
