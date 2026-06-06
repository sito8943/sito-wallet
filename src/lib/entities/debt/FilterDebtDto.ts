import type { BaseFilterDto, RangeValue } from "@sito/dashboard-app";

import type { DebtDirection } from "./DebtDirection";
import type { DebtStatus } from "./DebtStatus";

export interface FilterDebtDto extends BaseFilterDto {
  currencyId?: number;
  direction?: DebtDirection;
  status?: DebtStatus;
  counterpartyName?: string;
  dueAt?: RangeValue<string>;
  issuedAt?: RangeValue<string>;
}
