import type { SubscriptionBillingUnit } from "./SubscriptionBillingUnit";
import type { SubscriptionStatus } from "./SubscriptionStatus";

export interface AddSubscriptionDto {
  name: string;
  description?: string | null;
  providerId: number;
  currencyId?: number | null;
  amount: number;
  billingFrequency: number;
  billingUnit: SubscriptionBillingUnit;
  startsAt: string;
  lastPaidAt?: string | null;
  status?: SubscriptionStatus;
  notificationEnabled?: boolean;
  notificationDaysBefore?: number | null;
}
