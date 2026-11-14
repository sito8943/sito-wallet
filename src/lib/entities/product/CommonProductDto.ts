import type { SharedCatalogDto } from "../catalog";
import type { CommonCurrencyDto } from "../currency";
import type { BaseCommonEntityDto } from "@sito/dashboard-app";

export interface CommonProductDto
  extends BaseCommonEntityDto, SharedCatalogDto {
  name: string;
  /** Name the user knows the product by; `name` is the receipt name. */
  alias?: string | null;
  photo?: string | null;
  /** Active transactions that use it (from `/common`). */
  transactionCount?: number;
  /** Unit price on the latest active transaction line of this product. */
  lastUnitPrice?: number | null;
  /** Currency of that transaction's account. */
  lastUnitPriceCurrency?: CommonCurrencyDto | null;
}
