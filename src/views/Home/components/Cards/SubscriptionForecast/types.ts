import type { FieldValues } from "react-hook-form";

// lib
import type {
  DashboardDto,
  RenewalRangePreset,
  SubscriptionRenewalDto,
  UpdateDashboardCardConfigDto,
} from "lib";

export type { ConfigFormDialogPropsType } from "../types";

export interface SubscriptionForecastPropsType extends DashboardDto {
  onDelete: () => void;
}

export interface SubscriptionForecastFormType
  extends
    Omit<UpdateDashboardCardConfigDto, "config" | "userId" | "id">,
    FieldValues {
  range: RenewalRangePreset;
}

export type ActiveFiltersPropsType = {
  range: RenewalRangePreset;
  from?: string;
  to?: string;
};

export type RenewalsDialogPropsType = {
  open: boolean;
  closeDialog: () => void;
  renewals: SubscriptionRenewalDto[];
};
