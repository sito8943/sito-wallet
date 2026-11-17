import type { BaseEntityDto } from "@sito/dashboard-app";

import type { SharedCatalogDto } from "../catalog";

/**
 * Seller from the paged `GET /purchase-providers` list (own rows, deleted
 * included).
 */
export interface PurchaseProviderDto extends BaseEntityDto, SharedCatalogDto {
  name: string;
  photo?: string | null;
  /** Active transactions that use it. */
  transactionCount?: number;
}
