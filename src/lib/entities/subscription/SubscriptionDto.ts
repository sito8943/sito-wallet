import type { BaseEntityDto } from "@sito/dashboard-app";

import type { CommonAccountDto } from "../account";
import type { CommonCurrencyDto } from "../currency";
import type { CommonSubscriptionProviderDto } from "../subscriptionProvider";

export interface SubscriptionDto extends BaseEntityDto {
  name: string;
  description?: string | null;
  provider: CommonSubscriptionProviderDto | null;
  account: CommonAccountDto | null;
  currency: CommonCurrencyDto | null;
  amount: number;
  billingFrequency: number;
  billingUnit: number;
  startsAt: string;
  endsAt?: string | null;
  lastPaidAt?: string | null;
  nextRenewalAt?: string | null;
  status: number;
  autoCreateTransaction: boolean;
  notificationEnabled: boolean;
  notificationDaysBefore?: number | null;
}
