import type { FieldValues } from "react-hook-form";

// lib
import type {
  CommonAccountDto,
  DashboardDto,
  UpdateDashboardCardConfigDto,
} from "lib";

export type { ConfigFormDialogPropsType } from "../types";

export interface CurrentBalancePropsType extends DashboardDto {
  onDelete: () => void;
}

export interface CurrentBalanceFormType
  extends
    Omit<UpdateDashboardCardConfigDto, "config" | "userId" | "id">,
    FieldValues {
  account: CommonAccountDto | null;
}

export type ActiveFiltersPropsType = {
  account: CommonAccountDto | null;
};
