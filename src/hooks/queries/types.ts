import type { UseQueryResult } from "@tanstack/react-query";

// @sito/dashboard-app
import type {
  BaseEntityDto,
  BaseFilterDto,
  QueryParam,
  QueryResult,
} from "@sito/dashboard-app";

// lib
import type {
  BalanceHistoryGranularity,
  FilterTransactionCategoryAverageDto,
  FilterTransactionGroupedByTypeDto,
  FilterTransactionTypeResumeDto,
  GetSubscriptionRenewalsQuery,
  GetAccountByIdQueryDto,
  SavingsProjectionHorizon,
} from "lib";

export type UseFetchPropsType<TRow, TFilterDto = BaseFilterDto> = {
  filters?: TFilterDto;
  query?: QueryParam<TRow>;
};

export type UseFetchByIdPropsType = {
  id: number;
};

export interface UseAccountByIdPropsType extends GetAccountByIdQueryDto {
  id?: number;
}

export type UseAccountsCommonPropsType = {
  enabled?: boolean;
};

export type UseMyProfileProps = {
  ensure?: boolean;
  defaultName?: string;
};

export interface ApiQueryResult<
  TResponseDto extends BaseEntityDto,
> extends Omit<UseQueryResult<QueryResult<TResponseDto>>, "setTotal"> {
  setTotal: (total: number) => void;
}

export type UseTransactionTypeResumePropsType =
  FilterTransactionTypeResumeDto & {
    enabled?: boolean;
  };
export type UseTransactionCategoryAveragePropsType =
  Partial<FilterTransactionCategoryAverageDto> & {
    enabled?: boolean;
  };

export type UseTransactionsGroupedByTypePropsType =
  FilterTransactionGroupedByTypeDto;

export type UseSubscriptionsRenewalsProps = {
  from?: string;
  to?: string;
};

export type UseSubscriptionsRenewalsForecastProps =
  GetSubscriptionRenewalsQuery;

export type UseSubscriptionProvidersCommonProps = {
  onlyEnabled?: boolean;
};

export type UseBalanceHistoryPropsType = {
  accountIds?: number[];
  from?: string;
  to?: string;
  granularity?: BalanceHistoryGranularity;
};

/** Optional monthly deposit; only sent when the amount is > 0. */
export type UseSavingsDepositPropsType = {
  monthlyDeposit?: number | null;
  depositDay?: number;
};

export type UseSavingsProjectionPropsType = UseSavingsDepositPropsType & {
  accountId?: number;
  horizon?: SavingsProjectionHorizon;
};

export type UseSavingsProjectionDailyPropsType = UseSavingsDepositPropsType & {
  accountId?: number;
  /** YYYY-MM; the query stays idle while undefined. */
  month?: string;
};
