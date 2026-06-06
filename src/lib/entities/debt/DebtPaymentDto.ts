import type { BaseEntityDto } from "@sito/dashboard-app";

export interface DebtPaymentDto extends BaseEntityDto {
  debtId: number;
  amount: number;
  paidAt: string;
  note?: string | null;
  transactionId?: number | null;
}
