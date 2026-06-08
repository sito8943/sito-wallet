import type { FieldValues } from "react-hook-form";

// lib
import type {
  CommonAccountDto,
  TransactionType,
  UpdateDashboardCardConfigDto,
} from "lib";
import type { DashboardCardItemPropsType } from "../types";

export type {
  ConfigFormDialogPropsType,
  DashboardCardDragHandlePropsType,
} from "../types";

export type WeeklySpentPropsType = DashboardCardItemPropsType;

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
