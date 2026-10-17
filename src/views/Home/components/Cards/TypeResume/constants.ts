import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faChartLine,
  faCheckCircle,
  faCircleExclamation,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";
import type { IconButtonPropsType, QueryParam } from "@sito/dashboard-app";
import { SortOrder } from "@sito/dashboard-app";

import { TransactionType, TransactionTypeResumeTime } from "lib";
import type { CommonTransactionDto } from "lib";

import type {
  TypeResumePredictionStatusType,
  TypeResumeTypeFormType,
} from "./types";

export const DEFAULT_TYPE_RESUME_CONFIG: TypeResumeTypeFormType = {
  type: TransactionType.In,
  time: TransactionTypeResumeTime.CurrentMonth,
  excludedCategories: [],
  excludedCategoryIds: [],
  oppositeExcludedCategories: [],
  oppositeExcludedCategoryIds: [],
  showFiltersAsBadge: false,
  showOppositeType: false,
  showDifference: false,
  compare: false,
};

export const TYPE_RESUME_TRANSACTIONS_LIST_QUERY: QueryParam<CommonTransactionDto> =
  {
    currentPage: 0,
    pageSize: 100,
    sortingBy: "amount",
    sortingOrder: SortOrder.DESC,
  };

export const TIME_KEY_BY_VALUE = {
  [TransactionTypeResumeTime.CurrentDay]: "CurrentDay",
  [TransactionTypeResumeTime.CurrentWeek]: "CurrentWeek",
  [TransactionTypeResumeTime.CurrentMonth]: "CurrentMonth",
  [TransactionTypeResumeTime.CurrentYear]: "CurrentYear",
  [TransactionTypeResumeTime.PreviousDay]: "PreviousDay",
  [TransactionTypeResumeTime.PreviousWeek]: "PreviousWeek",
  [TransactionTypeResumeTime.PreviousMonth]: "PreviousMonth",
  [TransactionTypeResumeTime.PreviousYear]: "PreviousYear",
} as const;

export const PREVIOUS_TIMES: readonly TransactionTypeResumeTime[] = [
  TransactionTypeResumeTime.PreviousDay,
  TransactionTypeResumeTime.PreviousWeek,
  TransactionTypeResumeTime.PreviousMonth,
  TransactionTypeResumeTime.PreviousYear,
];

export const PREDICTABLE_TIMES: readonly TransactionTypeResumeTime[] = [
  TransactionTypeResumeTime.CurrentWeek,
  TransactionTypeResumeTime.CurrentMonth,
  TransactionTypeResumeTime.CurrentYear,
];

// Remaining margin (vs previous period) below which the forecast warns
export const PREDICTION_WARNING_MARGIN = 0.2;
export const PREDICTION_DANGER_MARGIN = 0.1;

export const DAY_IN_MS = 24 * 60 * 60 * 1000;

export const PREDICTION_STATUS_ICON: Record<
  TypeResumePredictionStatusType,
  IconDefinition
> = {
  success: faCheckCircle,
  warning: faWarning,
  danger: faWarning,
  exceeded: faCircleExclamation,
  unknown: faChartLine,
};

export const PREDICTION_STATUS_COLOR: Record<
  TypeResumePredictionStatusType,
  NonNullable<IconButtonPropsType["color"]>
> = {
  success: "success",
  warning: "warning",
  danger: "error",
  exceeded: "error",
  unknown: "default",
};
