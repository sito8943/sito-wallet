import type { SharedCatalogDto } from "../catalog";
import type { BaseCommonEntityDto } from "@sito/dashboard-app";

export interface CommonPurchaseProviderDto
  extends BaseCommonEntityDto, SharedCatalogDto {
  name: string;
  photo?: string | null;
  /** Active transactions that use it (from `/common`). */
  transactionCount?: number;
}
