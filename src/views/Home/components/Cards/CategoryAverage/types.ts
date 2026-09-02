import type { FieldValues } from "react-hook-form";

// lib
import type {
  CategoryAverageGranularity,
  CommonAccountDto,
  CommonTransactionCategoryDto,
  TransactionCategoryAverageCategoryDto,
  TransactionType,
  UpdateDashboardCardConfigDto,
} from "lib";
import type { DashboardCardItemPropsType } from "../types";

export type {
  ConfigFormDialogPropsType,
  DashboardCardDragHandlePropsType,
} from "../types";

export enum CategoryAveragePreset {
  EightWeeks = "8W",
  Quarter = "3M",
  Semester = "6M",
  Year = "12M",
  Ytd = "YTD",
}

export type CategoryAveragePropsType = DashboardCardItemPropsType;

export interface CategoryAverageFormType
  extends
    Omit<UpdateDashboardCardConfigDto, "config" | "userId" | "id">,
    FieldValues {
  account: CommonAccountDto | null;
  type: TransactionType;
  categories: CommonTransactionCategoryDto[];
  categoryIds: number[];
  preset: CategoryAveragePreset;
  showFiltersAsBadge: boolean;
}

export type ActiveFiltersPropsType = {
  account: CommonAccountDto | null;
  type: TransactionType;
  categories: CommonTransactionCategoryDto[];
  preset: CategoryAveragePreset;
};

export type CategoryAverageRange = {
  from: string;
  to: string;
};

export type PresetDef = {
  granularity: CategoryAverageGranularity;
  /** days back from today; undefined means computed (YTD) */
  days?: number;
};

export type CategoryAverageBreakdownPropsType = {
  categories: TransactionCategoryAverageCategoryDto[];
  currencyName: string;
  currencySymbol: string;
  periodLabel: string;
};
