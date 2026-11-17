import type { BaseEntityDto } from "@sito/dashboard-app";

import type { SharedCatalogDto } from "../catalog";
import type { CommonCurrencyDto } from "../currency";

/** Product from the paged `GET /products` list (own rows, deleted included). */
export interface ProductDto extends BaseEntityDto, SharedCatalogDto {
  name: string;
  /** Name the user knows the product by; `name` is the receipt name. */
  alias?: string | null;
  photo?: string | null;
  /** Active transactions that use it. */
  transactionCount?: number;
  /** Unit price on the latest active transaction line of this product. */
  lastUnitPrice?: number | null;
  /** Currency of that transaction's account. */
  lastUnitPriceCurrency?: CommonCurrencyDto | null;
}
