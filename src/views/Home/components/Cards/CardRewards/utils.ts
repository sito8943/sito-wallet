import type { AccountRewardsDto, UpdateDashboardCardConfigDto } from "lib";
import { parseNullableNumber } from "lib";

// types
import type { AdjustRewardsAccountType } from "../../../../Accounts/types";
import {
  CardRewardsViewState,
  type CardRewardsFormType,
  type CardRewardsStoredConfig,
  type ResolveCardRewardsViewStateArgs,
} from "./types";

// constants
import {
  AMOUNT_DECIMALS,
  NOT_CONFIGURED_STATUS,
  defaultConfig,
} from "./constants";

export const formToDto = (
  data: CardRewardsFormType,
): UpdateDashboardCardConfigDto => {
  const stored: CardRewardsStoredConfig = {
    accountId: data.account?.id ?? data.accountId ?? null,
    account: data.account,
    showFiltersAsBadge: !!data.showFiltersAsBadge,
  };
  return {
    userId: data.userId,
    id: data.id,
    config: JSON.stringify(stored),
  };
};

/**
 * Account id referenced by the stored config. `accountId` is the contract key;
 * the stored account (name/currency for display) is the fallback.
 */
export const resolveConfigAccountId = (
  stored: CardRewardsStoredConfig,
): number | null =>
  parseNullableNumber(stored.accountId) ?? stored.account?.id ?? null;

export const parseFormConfig = (cfg?: string | null): CardRewardsFormType => {
  try {
    const parsed = (cfg ? JSON.parse(cfg) : {}) as CardRewardsStoredConfig;
    return {
      ...defaultConfig,
      accountId: resolveConfigAccountId(parsed),
      account: parsed.account ?? null,
      showFiltersAsBadge: !!parsed.showFiltersAsBadge,
    };
  } catch (err) {
    console.error(err);
    return defaultConfig;
  }
};

export const getActiveFiltersCount = (
  formConfig: CardRewardsFormType,
): number => (formConfig.account || formConfig.accountId ? 1 : 0);

/** 400 = account is not a Card or has no rewards configured. */
export const isNotConfiguredError = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  "status" in error &&
  error.status === NOT_CONFIGURED_STATUS;

export const resolveViewState = ({
  accountId,
  isLoading,
  error,
  data,
}: ResolveCardRewardsViewStateArgs): CardRewardsViewState => {
  if (!accountId) return CardRewardsViewState.NoAccount;
  if (isLoading) return CardRewardsViewState.Loading;
  if (error)
    return isNotConfiguredError(error)
      ? CardRewardsViewState.NotConfigured
      : CardRewardsViewState.Error;
  if (!data) return CardRewardsViewState.Loading;
  return CardRewardsViewState.Ready;
};

/** The chart is pointless when no month had eligible spend or points. */
export const hasRewardsActivity = (data: AccountRewardsDto): boolean =>
  data.history.some((month) => month.spent > 0 || month.earned > 0);

export const formatAmount = (value: number, locale: string): string =>
  new Intl.NumberFormat(locale, {
    minimumFractionDigits: AMOUNT_DECIMALS,
    maximumFractionDigits: AMOUNT_DECIMALS,
  }).format(value);

/** Amount with its currency, e.g. "12.50 €" (no trailing space without one). */
export const formatCurrencyAmount = (
  value: number,
  locale: string,
  currencySymbol: string,
): string => `${formatAmount(value, locale)} ${currencySymbol}`.trim();

/** Account for the adjust-points dialog, built from the card's own data. */
export const toAdjustRewardsAccount = (
  accountId: number | undefined,
  data: AccountRewardsDto | undefined,
): AdjustRewardsAccountType | null =>
  accountId && data
    ? {
        id: accountId,
        rewards: {
          name: data.name,
          balance: data.balance,
          earned: data.earned,
        },
      }
    : null;
