import type { BaseCommonEntityDto } from "@sito/dashboard-app";

import type { DebtDirection } from "./DebtDirection";
import type { DebtStatus } from "./DebtStatus";

export interface CommonDebtDto extends BaseCommonEntityDto {
  counterpartyName: string;
  direction: DebtDirection;
  status: DebtStatus;
  pendingAmount: number;
  dueAt?: string | null;
}
