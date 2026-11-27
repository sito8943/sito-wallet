export interface UpdateSubscriptionBillingLogDto {
  id: number;
  subscriptionId: number;
  amount?: number | null;
  paidAt: string;
  currencyId?: number | null;
  note: string | null;
}
