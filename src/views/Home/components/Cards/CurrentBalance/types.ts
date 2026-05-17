import type { FieldValues } from "react-hook-form";

// @sito/dashboard-app
import type { DialogPropsType, FormPropsType } from "@sito/dashboard-app";

// lib
import type {
  CommonAccountDto,
  DashboardDto,
  UpdateDashboardCardConfigDto,
} from "lib";

export interface CurrentBalancePropsType extends DashboardDto {
  onDelete: () => void;
}

export interface ConfigFormDialogPropsType<TFormType extends FieldValues>
  extends FormPropsType<TFormType>, Omit<DialogPropsType, "title"> {}

export interface CurrentBalanceFormType
  extends
    Omit<UpdateDashboardCardConfigDto, "config" | "userId" | "id">,
    FieldValues {
  account: CommonAccountDto | null;
}

export type ActiveFiltersPropsType = {
  account: CommonAccountDto | null;
};
