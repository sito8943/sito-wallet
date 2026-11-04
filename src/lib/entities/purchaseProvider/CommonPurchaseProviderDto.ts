import type { BaseCommonEntityDto } from "@sito/dashboard-app";

export interface CommonPurchaseProviderDto extends BaseCommonEntityDto {
  name: string;
  photo?: string | null;
  /** Active transactions that use it (from `/common`). */
  transactionCount?: number;
}
