import type { FieldValues } from "react-hook-form";

// lib
import type {
  CommonAccountDto,
  CommonTransactionCategoryDto,
  CommonTransactionDto,
  TransactionType,
  TransactionTypeResumeCategoryDto,
  TransactionTypeResumeTime,
  TransactionTypeResumeDto,
  TransactionTypeResumeBatchRequestItemDto,
  UpdateDashboardCardConfigDto,
} from "lib";
import type { DashboardCardItemPropsType } from "../types";

export type {
  ConfigFormDialogPropsType,
  DashboardCardDragHandlePropsType,
} from "../types";

export type TypeResumeBatchCardResultType = {
  primary?: TransactionTypeResumeDto;
  opposite?: TransactionTypeResumeDto;
  isLoading: boolean;
};

export interface TransactionTypePropsType extends DashboardCardItemPropsType {
  batchResult?: TypeResumeBatchCardResultType;
  onTypeResumeConfigSaved?: (
    cardId: number,
    baseConfig: string | null | undefined,
    savedConfig: string,
  ) => void;
}

export interface TypeResumeTypeFormType
  extends
    Omit<UpdateDashboardCardConfigDto, "config" | "userId" | "id">,
    FieldValues {
  account?: CommonAccountDto;
  type: TransactionType;
  time: TransactionTypeResumeTime;
  excludedCategories: CommonTransactionCategoryDto[];
  excludedCategoryIds: number[];
  oppositeExcludedCategories: CommonTransactionCategoryDto[];
  oppositeExcludedCategoryIds: number[];
  showFiltersAsBadge: boolean;
  showOppositeType: boolean;
  showDifference: boolean;
  compare: boolean;
  /** Balance (income - expenses) to keep at the end of the period */
  minBalance?: number | string | null;
}

export type FilterTypeResumeConfigType = {
  accountId?: number;
  type: TransactionType;
  time: TransactionTypeResumeTime;
  excludedCategoryIds?: number[];
};

export type ActiveFiltersPropsType = {
  account?: CommonAccountDto;
  clearAccount: () => void;
  type: TransactionType;
  time: TransactionTypeResumeTime;
  excludedCategories?: CommonTransactionCategoryDto[];
  oppositeExcludedCategories?: CommonTransactionCategoryDto[];
  showOppositeType: boolean;
  clearExcludedCategories: () => void;
  clearOppositeExcludedCategories: () => void;
};

export type TypeResumePeriodType = {
  categories: TransactionTypeResumeCategoryDto[];
  total?: number;
  startDate?: string;
  endDate?: string;
};

export type TypeResumeCategoriesDialogPropsType = {
  open: boolean;
  closeDialog: () => void;
  categories: TransactionTypeResumeCategoryDto[];
  total?: number;
  accountId?: number;
  currencyName?: string;
  currencySymbol?: string;
  startDate?: string;
  endDate?: string;
  transactionType: TransactionType;
  excludedCategoryIds?: number[];
  time?: TransactionTypeResumeTime;
  previous?: TypeResumePeriodType;
};

export type TypeResumeCategoriesListPropsType = {
  categories: TransactionTypeResumeCategoryDto[];
  total?: number;
  accountId?: number;
  currencyName?: string;
  currencySymbol?: string;
  startDate?: string;
  endDate?: string;
  transactionType: TransactionType;
  excludedCategoryIds?: number[];
  expandedCategoryId: number | null;
  onToggle: (categoryId: number) => void;
  onTransactionClick: (id: number) => void;
};

export type TypeResumeCategoryItemPropsType = {
  category: TransactionTypeResumeCategoryDto;
  open: boolean;
  onToggle: () => void;
  total?: number;
  accountId?: number;
  currencyName?: string;
  currencySymbol?: string;
  startDate?: string;
  endDate?: string;
  transactionType: TransactionType;
  excludedCategoryIds?: number[];
  onTransactionClick: (id: number) => void;
};

export type UseTypeResumeCategoryTransactionsPropsType = {
  accountId?: number;
  categoryId: number;
  type: TransactionType;
  startDate?: string;
  endDate?: string;
  open: boolean;
  excludedCategoryIds?: number[];
};

export type TypeResumeCategoryTransactionsResultType = CommonTransactionDto[];

export type TypeResumeTransactionItemPropsType = {
  transaction: CommonTransactionDto;
  currencyName?: string;
  currencySymbol?: string;
  onClick: (id: number) => void;
};

export type TypeResumeRowPropsType = {
  type: TransactionType;
  amount: number;
  isLoading: boolean;
  currencyName?: string;
  currencySymbol?: string;
  compact?: boolean;
  compare?: boolean;
  previousAmount?: number;
  difference?: boolean;
};

export type ToTypeResumeBatchRequestItemType = (
  cardId: number,
  data: TypeResumeTypeFormType,
) => TransactionTypeResumeBatchRequestItemDto;

export type TypeResumePredictionStatusType =
  "success" | "warning" | "danger" | "exceeded" | "unknown";

export type TypeResumePeriodProgressType = {
  elapsedDays: number;
  totalDays: number;
  ratio: number;
};

export type TypeResumePredictionValuesType = {
  current: number;
  previous: number;
  predicted: number;
};

export type TypeResumePredictionType = {
  progress: TypeResumePeriodProgressType;
  status: TypeResumePredictionStatusType;
  margin: number | null;
  expense: TypeResumePredictionValuesType;
  income?: TypeResumePredictionValuesType;
  balance?: TypeResumePredictionValuesType;
  /** Set when the status is measured against a minimum balance */
  minBalance?: number;
};

export type TypeResumePredictionTotalsType = {
  current: number;
  previous: number;
  /** What the previous period accumulated after the current elapsed day */
  previousRemaining: number;
};

export type GetTypeResumePredictionParamsType = {
  type: TransactionType;
  progress: TypeResumePeriodProgressType;
  primary: TypeResumePredictionTotalsType;
  opposite?: TypeResumePredictionTotalsType;
  minBalance?: number;
};

export type GetPredictionStatusParamsType = {
  expense: TypeResumePredictionValuesType;
  income?: TypeResumePredictionValuesType;
  balance?: TypeResumePredictionValuesType;
  minBalance?: number;
};

export type TypeResumePredictionDialogPropsType = {
  open: boolean;
  closeDialog: () => void;
  prediction: TypeResumePredictionType;
  currencyName?: string;
  currencySymbol?: string;
};

export type TypeResumePredictionRowPropsType = {
  label: string;
  values: TypeResumePredictionValuesType;
  currencyName?: string;
  currencySymbol?: string;
  /** Summary row: stronger divider and signed colors */
  total?: boolean;
};
