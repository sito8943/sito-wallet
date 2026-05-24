import type { RenewalRangePreset } from "./RenewalRangePreset";

export interface GetSubscriptionRenewalsQuery {
  subscriptionId?: number;
  range?: RenewalRangePreset;
  timezone?: string;
  month?: string;
  from?: string;
  to?: string;
}
