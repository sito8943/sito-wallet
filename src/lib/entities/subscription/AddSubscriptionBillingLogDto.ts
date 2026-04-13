export interface AddSubscriptionBillingLogDto {
  amount: number;
  paidAt: string;
  currencyId?: number | null;
  note?: string | null;
}
