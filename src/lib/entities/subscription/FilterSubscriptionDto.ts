import type { BaseFilterDto } from "@sito/dashboard-app";

import type { SubscriptionBillingUnit } from "./SubscriptionBillingUnit";
import type { SubscriptionStatus } from "./SubscriptionStatus";

export interface FilterSubscriptionDto extends BaseFilterDto {
  name?: string;
  providerId?: number;
  currencyId?: number;
  billingUnit?: SubscriptionBillingUnit | number;
  status?: SubscriptionStatus | number;
}
