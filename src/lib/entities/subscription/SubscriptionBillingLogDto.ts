import type { BaseEntityDto } from "@sito/dashboard-app";

import type { CommonCurrencyDto } from "../currency";

export interface SubscriptionBillingLogDto extends BaseEntityDto {
  amount: number;
  paidAt: string;
  currency: CommonCurrencyDto | null;
  note?: string | null;
}
