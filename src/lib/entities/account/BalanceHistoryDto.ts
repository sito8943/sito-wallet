import type { BalanceHistoryGranularity } from "./BalanceHistoryGranularity";
import type { BalanceHistoryPointDto } from "./BalanceHistoryPointDto";

export type BalanceHistoryAccountDto = {
  id: number;
  name: string;
};

export type BalanceHistoryDto = {
  account: BalanceHistoryAccountDto;
  from: string;
  to: string;
  granularity: BalanceHistoryGranularity;
  openingBalance: number;
  closingBalance: number;
  points: BalanceHistoryPointDto[];
};
