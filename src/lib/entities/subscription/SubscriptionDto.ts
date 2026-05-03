import type { BaseEntityDto } from "@sito/dashboard-app";

import type { CommonAccountDto } from "../account";
import type { CommonCurrencyDto } from "../currency";
import type { CommonSubscriptionProviderDto } from "../subscriptionProvider";
import type { SubscriptionBillingUnit } from "./SubscriptionBillingUnit";
import type { SubscriptionStatus } from "./SubscriptionStatus";

export interface SubscriptionDto extends BaseEntityDto {
  name: string;
  amount: number;
  description?: string | null;
  provider: CommonSubscriptionProviderDto | null;
  account: CommonAccountDto | null;
  currency: CommonCurrencyDto | null;
  billingFrequency: number;
  billingUnit: SubscriptionBillingUnit;
  nextRenewalAt?: string | null;
  status: SubscriptionStatus;
  autoCreateTransaction: boolean;
  notificationDaysBefore?: number | null;
}
