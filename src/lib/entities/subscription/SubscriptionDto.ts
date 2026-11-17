import type { BaseEntityDto } from "@sito/dashboard-app";

import type { CommonAccountDto } from "../account";
import type { CommonCurrencyDto } from "../currency";
import type { CommonPurchaseProviderDto } from "../purchaseProvider";
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
  /** Who gets paid (seller), unlike `provider` (the service, e.g. Netflix). */
  purchaseProvider?: CommonPurchaseProviderDto | null;
  currency: CommonCurrencyDto | null;
  billingFrequency: number;
  billingUnit: SubscriptionBillingUnit;
  startsAt?: string | null;
  endsAt?: string | null;
  lastPaidAt?: string | null;
  nextRenewalAt?: string | null;
  status: SubscriptionStatus;
  autoCreateTransaction: boolean;
  notificationEnabled?: boolean;
  category?: CommonTransactionCategoryDto | null;
  categories?: CommonTransactionCategoryDto[] | null;
  notificationDaysBefore?: number | null;
}
