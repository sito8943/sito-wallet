import type { BaseEntityDto } from "@sito/dashboard-app";

import type { CommonCurrencyDto } from "../currency";
import type { DebtDirection } from "./DebtDirection";
import type { DebtStatus } from "./DebtStatus";

export interface DebtDto extends BaseEntityDto {
  counterpartyName: string;
  counterpartyContact?: string | null;
  title: string;
  description?: string | null;
  direction: DebtDirection;
  status: DebtStatus;
  originalAmount: number;
  pendingAmount: number;
  currency: CommonCurrencyDto | null;
  issuedAt: string;
  dueAt?: string | null;
  closedAt?: string | null;
}
