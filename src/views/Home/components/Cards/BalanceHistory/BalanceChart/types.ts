import type { BalanceHistoryGranularity, BalanceHistoryPointDto } from "lib";

export type BalanceChartPropsType = {
  points: BalanceHistoryPointDto[];
  granularity: BalanceHistoryGranularity;
  locale?: string;
  currencySymbol?: string;
  balanceLabel: string;
  netLabel: string;
};
