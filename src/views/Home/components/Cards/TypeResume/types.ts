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
};

export type TypeResumeRowPropsType = {
  type: TransactionType;
  amount: number;
  isLoading: boolean;
  currencyName?: string;
  currencySymbol?: string;
  compact?: boolean;
};

export type ToTypeResumeBatchRequestItemType = (
  cardId: number,
  data: TypeResumeTypeFormType,
) => TransactionTypeResumeBatchRequestItemDto;
