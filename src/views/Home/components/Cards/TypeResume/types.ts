import type { FieldValues } from "react-hook-form";
import type { QueryResult } from "@sito/dashboard-app";

// lib
import type {
  CommonAccountDto,
  DashboardDto,
  TransactionDto,
  TransactionType,
  TransactionTypeResumeCategoryDto,
  TransactionTypeResumeTime,
  UpdateDashboardCardConfigDto,
} from "lib";

export type { ConfigFormDialogPropsType } from "../types";

export interface TransactionTypePropsType extends DashboardDto {
  onDelete: () => void;
}

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

export type TypeResumeCategoryTransactionsResultType =
  QueryResult<TransactionDto>;

export type TypeResumeTransactionItemPropsType = {
  transaction: TransactionDto;
  currencyName?: string;
  currencySymbol?: string;
};
