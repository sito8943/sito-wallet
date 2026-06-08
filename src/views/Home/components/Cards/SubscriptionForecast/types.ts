import type { FieldValues } from "react-hook-form";

// lib
import type {
  RenewalRangePreset,
  SubscriptionDto,
  SubscriptionRenewalDto,
  UpdateDashboardCardConfigDto,
} from "lib";
import type { DashboardCardItemPropsType } from "../types";

export type {
  ConfigFormDialogPropsType,
  DashboardCardDragHandlePropsType,
} from "../types";

export type SubscriptionForecastPropsType = DashboardCardItemPropsType;

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
