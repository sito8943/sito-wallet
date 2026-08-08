export interface UpdateDebtPaymentDto {
  id: number;
  debtId: number;
  amount: number;
  paidAt: string;
  note: string | null;
}
