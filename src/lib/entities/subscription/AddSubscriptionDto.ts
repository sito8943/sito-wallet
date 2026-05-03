import type { SubscriptionBillingUnit } from "./SubscriptionBillingUnit";
import type { SubscriptionStatus } from "./SubscriptionStatus";

export interface AddSubscriptionDto {
  name: string;
  amount: number;
  description?: string | null;
  providerId: number;
  accountId?: number | null;
  currencyId?: number | null;
  billingFrequency: number;
  billingUnit: SubscriptionBillingUnit;
  status?: SubscriptionStatus;
  autoCreateTransaction?: boolean;
  categoryIds?: number[];
  notificationDaysBefore?: number | null;
}
