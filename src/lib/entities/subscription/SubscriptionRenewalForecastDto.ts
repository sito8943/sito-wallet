import type { SubscriptionRenewalDto } from "./SubscriptionRenewalDto";
import type { SubscriptionRenewalTotalDto } from "./SubscriptionRenewalTotalDto";

export interface SubscriptionRenewalForecastDto {
  from: string;
  to: string;
  count: number;
  totals: SubscriptionRenewalTotalDto[];
  renewals: SubscriptionRenewalDto[];
}
