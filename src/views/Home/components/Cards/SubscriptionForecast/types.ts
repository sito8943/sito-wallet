import type { FieldValues } from "react-hook-form";

// lib
import type {
  DashboardDto,
  RenewalRangePreset,
  SubscriptionDto,
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
  onRegisterPayment: (subscriptionId: number) => void;
  registeringSubscriptionId?: number | null;
};

export type SelectSubscriptionDialogPropsType = {
  open: boolean;
  handleClose: () => void;
  subscriptions: SubscriptionDto[];
  isLoading?: boolean;
  errorMessage?: string | null;
  onSelect: (subscription: SubscriptionDto) => void;
  onAddSubscription: () => void;
};
