import type { FieldValues } from "react-hook-form";

// lib
import type {
  BalanceHistoryGranularity,
  CommonAccountDto,
  UpdateDashboardCardConfigDto,
} from "lib";
import type { DashboardCardItemPropsType } from "../types";

export enum BalanceHistoryPreset {
  Week = "7D",
  Month = "30D",
  Quarter = "3M",
  Year = "12M",
  Ytd = "YTD",
}

export type {
  ConfigFormDialogPropsType,
  DashboardCardDragHandlePropsType,
} from "../types";

export type BalanceHistoryPropsType = DashboardCardItemPropsType;

export interface BalanceHistoryFormType
  extends
    Omit<UpdateDashboardCardConfigDto, "config" | "userId" | "id">,
    FieldValues {
  account: CommonAccountDto | null;
  preset: BalanceHistoryPreset;
  showFiltersAsBadge: boolean;
}

export type ActiveFiltersPropsType = {
  account: CommonAccountDto | null;
  preset: BalanceHistoryPreset;
};

export type BalanceHistoryRange = {
  from: string;
  to: string;
};

export type PresetDef = {
  granularity: BalanceHistoryGranularity;
  /** days back from today; undefined means computed (YTD) */
  days?: number;
};
