import type { BalanceHistoryGranularity } from "./BalanceHistoryGranularity";
import type { BalanceHistoryPointDto } from "./BalanceHistoryPointDto";

export type BalanceHistoryAccountDto = {
  id: number;
  name: string;
};

export type BalanceHistoryDto = {
  account: BalanceHistoryAccountDto;
  /** Every account merged into this history (one item for single-account). */
  accounts?: BalanceHistoryAccountDto[];
  from: string;
  to: string;
  granularity: BalanceHistoryGranularity;
  openingBalance: number;
  closingBalance: number;
  points: BalanceHistoryPointDto[];
};
