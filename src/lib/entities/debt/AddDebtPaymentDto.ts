export interface AddDebtPaymentDto {
  amount: number;
  paidAt: string;
  note?: string | null;
  autoCreateTransaction?: boolean;
  accountId?: number | null;
  categoryId?: number | null;
}
