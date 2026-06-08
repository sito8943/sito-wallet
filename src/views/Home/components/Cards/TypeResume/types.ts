import type { FieldValues } from "react-hook-form";

// lib
import type {
  CommonAccountDto,
  CommonTransactionDto,
  TransactionType,
  TransactionTypeResumeCategoryDto,
  TransactionTypeResumeTime,
  UpdateDashboardCardConfigDto,
} from "lib";
import type { DashboardCardItemPropsType } from "../types";

export type {
  ConfigFormDialogPropsType,
  DashboardCardDragHandlePropsType,
} from "../types";

export type TransactionTypePropsType = DashboardCardItemPropsType;

export interface TypeResumeTypeFormType
  extends
    Omit<UpdateDashboardCardConfigDto, "config" | "userId" | "id">,
    FieldValues {
  account?: CommonAccountDto;
  type: TransactionType;
  time: TransactionTypeResumeTime;
}

export type FilterTypeResumeConfigType = {
  accountId?: number;
  type: TransactionType;
  time: TransactionTypeResumeTime;
};

export type ActiveFiltersPropsType = {
  account?: CommonAccountDto;
  clearAccount: () => void;
  type: TransactionType;
  time: TransactionTypeResumeTime;
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
};

export type UseTypeResumeCategoryTransactionsPropsType = {
  accountId?: number;
  categoryId: number;
  type: TransactionType;
  startDate?: string;
  endDate?: string;
  open: boolean;
};

export type TypeResumeCategoryTransactionsResultType = CommonTransactionDto[];

export type TypeResumeTransactionItemPropsType = {
  transaction: CommonTransactionDto;
  currencyName?: string;
  currencySymbol?: string;
};
