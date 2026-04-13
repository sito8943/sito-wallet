import type { BaseEntityDto } from "@sito/dashboard-app";

import type { CommonCurrencyDto } from "../currency";
import type { CommonSubscriptionProviderDto } from "../subscriptionProvider";

export interface SubscriptionDto extends BaseEntityDto {
  name: string;
  description?: string | null;
  provider: CommonSubscriptionProviderDto | null;
  currency: CommonCurrencyDto | null;
  amount: number;
  billingFrequency: number;
  billingUnit: number;
  startsAt: string;
  lastPaidAt?: string | null;
  nextRenewalAt?: string | null;
  status: number;
  notificationEnabled: boolean;
  notificationDaysBefore?: number | null;
}
