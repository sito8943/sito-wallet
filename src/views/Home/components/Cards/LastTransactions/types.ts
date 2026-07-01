import type { FieldValues } from "react-hook-form";

// lib
import type {
  CommonAccountDto,
  CommonTransactionCategoryDto,
  UpdateDashboardCardConfigDto,
} from "lib";
import type { DashboardCardItemPropsType } from "../types";

export type {
  ConfigFormDialogPropsType,
  DashboardCardDragHandlePropsType,
} from "../types";

export type LastTransactionsPropsType = DashboardCardItemPropsType;

export interface LastTransactionsFormType
  extends
    Omit<UpdateDashboardCardConfigDto, "config" | "userId" | "id">,
    FieldValues {
  account: CommonAccountDto | null;
  categories: CommonTransactionCategoryDto[];
  categoryIds: number[];
  limit: number;
  showFiltersAsBadge: boolean;
}

export type ActiveFiltersPropsType = {
  account: CommonAccountDto | null;
  categories: CommonTransactionCategoryDto[];
  limit: number;
};
