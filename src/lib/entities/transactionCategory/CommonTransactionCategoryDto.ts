import type { SharedCatalogDto } from "../catalog";
import type { BaseCommonEntityDto } from "@sito/dashboard-app";
import type { TransactionType } from "lib";

export interface CommonTransactionCategoryDto
  extends BaseCommonEntityDto, SharedCatalogDto {
  name: string;
  color: string | null;
  auto: boolean;
  type: TransactionType;
}
