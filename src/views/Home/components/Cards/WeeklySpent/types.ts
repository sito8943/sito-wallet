import { FieldValues } from "react-hook-form";

// @sito/dashboard-app
import { DialogPropsType, FormPropsType } from "@sito/dashboard-app";

// lib
import {
  CommonAccountDto,
  DashboardDto,
  TransactionType,
  UpdateDashboardCardConfigDto,
} from "lib";

export interface WeeklySpentPropsType extends DashboardDto {
  onDelete: () => void;
}

export interface ConfigFormDialogPropsType<
  TFormType extends FieldValues,
  ValidationError extends Error
> extends FormPropsType<TFormType, ValidationError>,
    Omit<DialogPropsType, "title"> {}

export interface WeeklySpentFormType
  extends Omit<UpdateDashboardCardConfigDto, "config" | "userId" | "id">,
    FieldValues {
  accounts: CommonAccountDto[];
  type: TransactionType
}

export type FilterWeeklyConfigType = {
  accounts?: number[];
  type: TransactionType;
};

export type ActiveFiltersPropsType = {
  accounts?: CommonAccountDto[];
  clearAccounts: () => void;
  startDate?: string;
  endDate?: string;
  type: TransactionType;
};
