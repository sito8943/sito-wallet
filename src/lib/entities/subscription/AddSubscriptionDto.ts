import type { SubscriptionBillingUnit } from "./SubscriptionBillingUnit";
import type { SubscriptionStatus } from "./SubscriptionStatus";

export interface AddSubscriptionDto {
  name: string;
  description?: string | null;
  providerId: number;
  accountId?: number | null;
  currencyId?: number | null;
  amount: number;
  billingFrequency: number;
  billingUnit: SubscriptionBillingUnit;
  startsAt: string;
  endsAt?: string | null;
  lastPaidAt?: string | null;
  status?: SubscriptionStatus;
  autoCreateTransaction?: boolean;
  notificationEnabled?: boolean;
  notificationDaysBefore?: number | null;
}
