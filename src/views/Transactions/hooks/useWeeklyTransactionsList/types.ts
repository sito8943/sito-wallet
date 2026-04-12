import { QueryResult } from "@sito/dashboard-app";
import { UseQueryResult } from "@tanstack/react-query";

import { TransactionDto, TransactionType } from "lib";

import {
  WeeklyTransactionsDateRangeType,
  WeeklyTransactionsScopeType,
} from "../../utils";

export type UseWeeklyTransactionsListPropsType = {
  accountId?: number | null;
  type: TransactionType;
  weekScope: WeeklyTransactionsScopeType;
  open: boolean;
};

export type UseWeeklyTransactionsListResultType =
  UseQueryResult<QueryResult<TransactionDto>> & {
    dateRange: WeeklyTransactionsDateRangeType;
  };
