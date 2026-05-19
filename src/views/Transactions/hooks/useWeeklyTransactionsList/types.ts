import type { QueryResult } from "@sito/dashboard-app";
import type { UseQueryResult } from "@tanstack/react-query";

import type { TransactionDto, TransactionType } from "lib";

import type {
  WeeklyTransactionsDateRangeType,
  WeeklyTransactionsScopeType,
} from "../../utils";

export type UseWeeklyTransactionsListPropsType = {
  accountId?: number | null;
  type: TransactionType;
  weekScope: WeeklyTransactionsScopeType;
  open: boolean;
};

export type UseWeeklyTransactionsListResultType = UseQueryResult<
  QueryResult<TransactionDto>
> & {
  dateRange: WeeklyTransactionsDateRangeType;
};
