export interface SubscriptionRenewalDto {
  subscriptionId: number;
  subscriptionName: string;
  providerName: string;
  amount: number;
  currency?: string | null;
  nextRenewalAt: string;
}
