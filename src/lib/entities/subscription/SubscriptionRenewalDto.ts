export interface SubscriptionRenewalDto {
  subscriptionId: number;
  subscriptionName: string;
  providerName: string | null;
  /** Photo of the subscription provider (optional until the API sends it). */
  providerPhoto?: string | null;
  amount: number;
  currency: string | null;
  billingFrequency: number | null;
  billingUnit: number | null;
  nextRenewalAt: string;
}
