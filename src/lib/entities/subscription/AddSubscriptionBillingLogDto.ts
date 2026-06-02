export interface AddSubscriptionBillingLogDto {
  amount?: number | null;
  paidAt: string;
  currencyId?: number | null;
  note?: string | null;
}
