import type { BaseEntityDto } from "@sito/dashboard-app";

import type { CommonAccountDto } from "../account";
import type { CommonCurrencyDto } from "../currency";
import type { CommonSubscriptionProviderDto } from "../subscriptionProvider";
import type { CommonTransactionCategoryDto } from "../transactionCategory";
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
  category?: CommonTransactionCategoryDto | null;
  categories?: CommonTransactionCategoryDto[] | null;
  notificationDaysBefore?: number | null;
}
