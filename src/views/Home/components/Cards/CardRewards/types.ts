import type { FieldValues } from "react-hook-form";

// lib
import type {
  AccountRewardsDto,
  CommonAccountDto,
  UpdateDashboardCardConfigDto,
} from "lib";
import type { DashboardCardItemPropsType } from "../types";

export type {
  ConfigFormDialogPropsType,
  DashboardCardDragHandlePropsType,
} from "../types";

export type CardRewardsPropsType = DashboardCardItemPropsType;

/**
 * Card config persisted (as JSON) in the dashboard card `config` column:
 * `{ accountId }` per the contract, plus the picked account (name/currency for
 * display, like the savings projection card) and the badge toggle.
 */
export interface CardRewardsFormType
  extends
    Omit<UpdateDashboardCardConfigDto, "config" | "userId" | "id">,
    FieldValues {
  /** Contract key; may be set without `account` (config written elsewhere). */
  accountId: number | null;
  account: CommonAccountDto | null;
  showFiltersAsBadge: boolean;
}

/** JSON shape stored in the dashboard card `config`. */
export type CardRewardsStoredConfig = {
  accountId?: number | null;
  account?: CommonAccountDto | null;
  showFiltersAsBadge?: boolean;
};

export type ActiveFiltersPropsType = {
  account: CommonAccountDto | null;
};

/** What the card body renders. */
export enum CardRewardsViewState {
  NoAccount = "noAccount",
  Loading = "loading",
  NotConfigured = "notConfigured",
  Error = "error",
  Ready = "ready",
}

export type ResolveCardRewardsViewStateArgs = {
  accountId?: number;
  isLoading: boolean;
  error: unknown;
  data?: AccountRewardsDto;
};

export type RewardsSummaryPropsType = {
  data: AccountRewardsDto;
  locale: string;
  currencySymbol: string;
};
