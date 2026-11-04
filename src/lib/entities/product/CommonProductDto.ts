import type { SharedCatalogDto } from "../catalog";
import type { BaseCommonEntityDto } from "@sito/dashboard-app";

export interface CommonProductDto
  extends BaseCommonEntityDto, SharedCatalogDto {
  name: string;
  /** Name the user knows the product by; `name` is the receipt name. */
  alias?: string | null;
  /** Active transactions that use it (from `/common`). */
  transactionCount?: number;
}
