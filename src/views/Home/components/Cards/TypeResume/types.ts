import { FieldValues } from "react-hook-form";

// @sito/dashboard-app
import {
  DialogPropsType,
  FormPropsType,
  RangeValue,
} from "@sito/dashboard-app";

// lib
import {
  CommonAccountDto,
  CommonTransactionCategoryDto,
  DashboardDto,
  TransactionType,
  UpdateDashboardCardConfigDto,
} from "lib";

export interface TransactionTypePropsType extends DashboardDto {
  onDelete: () => void;
}

export interface ConfigFormDialogPropsType<
  TFormType extends FieldValues,
  ValidationError extends Error
> extends FormPropsType<TFormType, ValidationError>,
    Omit<DialogPropsType, "title"> {}

export interface TypeResumeTypeFormType
  extends Omit<UpdateDashboardCardConfigDto, "config" | "userId" | "id">,
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
