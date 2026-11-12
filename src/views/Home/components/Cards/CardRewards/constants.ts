import { DEFAULT_REWARDS_MONTHS } from "lib";
import type { CardRewardsFormType } from "./types";

export const defaultConfig: CardRewardsFormType = {
  accountId: null,
  account: null,
  showFiltersAsBadge: false,
};

/** Months of history charted by the card. */
export const CARD_REWARDS_MONTHS = DEFAULT_REWARDS_MONTHS;

/** HTTP status the backend returns for non-Card / unconfigured accounts. */
export const NOT_CONFIGURED_STATUS = 400;

/** Decimals shown for currency amounts. */
export const AMOUNT_DECIMALS = 2;
