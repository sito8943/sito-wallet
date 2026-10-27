import type { FieldValues } from "react-hook-form";

// lib
import type {
  CommonAccountDto,
  SavingsProjectionDto,
  SavingsProjectionHorizon,
  UpdateDashboardCardConfigDto,
} from "lib";
import type { DashboardCardItemPropsType } from "../types";

export type {
  ConfigFormDialogPropsType,
  DashboardCardDragHandlePropsType,
} from "../types";

export type SavingsProjectionPropsType = DashboardCardItemPropsType;

/** Card config persisted (as JSON) in the dashboard card `config` column. */
export interface SavingsProjectionFormType
  extends
    Omit<UpdateDashboardCardConfigDto, "config" | "userId" | "id">,
    FieldValues {
  account: CommonAccountDto | null;
  horizon: SavingsProjectionHorizon;
  /** Simulated monthly deposit; null = no deposits. */
  monthlyDeposit: number | null;
  /** 1–31; shorter months deposit on their last day. */
  depositDay: number;
  showFiltersAsBadge: boolean;
}

export type ActiveFiltersPropsType = {
  account: CommonAccountDto | null;
  horizon: SavingsProjectionHorizon;
  monthlyDeposit: number | null;
  depositDay: number;
};

/** What the card body renders. */
export enum SavingsProjectionViewState {
  NoAccount = "noAccount",
  Loading = "loading",
  NotConfigured = "notConfigured",
  Error = "error",
  Empty = "empty",
  Ready = "ready",
}

export type ResolveViewStateArgs = {
  accountId?: number;
  isLoading: boolean;
  error: unknown;
  data?: SavingsProjectionDto;
};

export type ProjectionSummaryPropsType = {
  data: SavingsProjectionDto;
  locale: string;
  currencySymbol: string;
};
