import type { BalanceHistoryGranularity } from "./BalanceHistoryGranularity";

export interface FilterBalanceHistoryDto {
  accountId: number;
  from: string;
  to: string;
  granularity?: BalanceHistoryGranularity;
  userId?: number;
}
