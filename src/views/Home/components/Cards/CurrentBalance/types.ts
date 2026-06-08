import type { FieldValues } from "react-hook-form";

// lib
import type {
  CommonAccountDto,
  UpdateDashboardCardConfigDto,
} from "lib";
import type { DashboardCardItemPropsType } from "../types";

export type {
  ConfigFormDialogPropsType,
  DashboardCardDragHandlePropsType,
} from "../types";

export type CurrentBalancePropsType = DashboardCardItemPropsType;

export interface CurrentBalanceFormType
  extends
    Omit<UpdateDashboardCardConfigDto, "config" | "userId" | "id">,
    FieldValues {
  account: CommonAccountDto | null;
}

export type ActiveFiltersPropsType = {
  account: CommonAccountDto | null;
};
