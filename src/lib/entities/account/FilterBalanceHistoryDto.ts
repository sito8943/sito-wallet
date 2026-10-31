import type { BalanceHistoryGranularity } from "./BalanceHistoryGranularity";

export interface FilterBalanceHistoryDto {
  /** One id hits /accounts/{id}/balance-history; several are merged as one. */
  accountIds: number[];
  from: string;
  to: string;
  granularity?: BalanceHistoryGranularity;
  userId?: number;
}
