export interface SubscriptionRenewalDto {
  subscriptionId: number;
  subscriptionName: string;
  providerName: string | null;
  amount: number;
  currency: string | null;
  billingFrequency: number | null;
  billingUnit: number | null;
  nextRenewalAt: string;
}
