import type { FieldValues } from "react-hook-form";

// @sito/dashboard-app
import type { RangeValue } from "@sito/dashboard-app";

// lib
import type {
  CommonAccountDto,
  CommonTransactionCategoryDto,
  DashboardDto,
  TransactionType,
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
  accounts: CommonAccountDto[];
  date?: { start: string; end: string };
  categories: CommonTransactionCategoryDto[];
  type: TransactionType;
}

export type FilterTypeResumeConfigType = {
  accounts?: number[];
  categories?: number[];
  type: TransactionType;
  date?: RangeValue<string>;
};

export type ActiveFiltersPropsType = {
  accounts?: CommonAccountDto[];
  clearAccounts: () => void;
  categories?: CommonTransactionCategoryDto[];
  clearCategories: () => void;
  startDate?: string;
  endDate?: string;
  clearDate: () => void;
  type: TransactionType;
};
