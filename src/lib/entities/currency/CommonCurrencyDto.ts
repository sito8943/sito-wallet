import type { SharedCatalogDto } from "../catalog";
import type { BaseCommonEntityDto } from "@sito/dashboard-app";

export interface CommonCurrencyDto
  extends BaseCommonEntityDto, SharedCatalogDto {
  name: string;
  symbol: string;
}
