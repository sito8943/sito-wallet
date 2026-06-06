import type { DebtDirection } from "./DebtDirection";

export interface AddDebtDto {
  counterpartyName: string;
  counterpartyContact?: string | null;
  title: string;
  description?: string | null;
  direction: DebtDirection;
  originalAmount: number;
  currencyId: number;
  issuedAt: string;
  dueAt?: string | null;
}
