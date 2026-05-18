import type { FieldValues } from "react-hook-form";

// lib
import type {
  CommonAccountDto,
  DashboardDto,
  TransactionType,
  UpdateDashboardCardConfigDto,
} from "lib";

export type { ConfigFormDialogPropsType } from "../types";

export interface WeeklySpentPropsType extends DashboardDto {
  onDelete: () => void;
}

export interface WeeklySpentFormType
  extends
    Omit<UpdateDashboardCardConfigDto, "config" | "userId" | "id">,
    FieldValues {
  accounts: CommonAccountDto[];
  type: TransactionType;
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
