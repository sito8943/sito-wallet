import type { UpdateDashboardCardConfigDto } from "lib";
import type { CurrentBalanceFormType } from "./types";

export const defaultConfig: CurrentBalanceFormType = {
  account: null,
  showFiltersAsBadge: false,
};

export const formToDto = (
  data: CurrentBalanceFormType,
): UpdateDashboardCardConfigDto => {
  const stringified = JSON.stringify({
    account: data.account,
    showFiltersAsBadge: !!data.showFiltersAsBadge,
  });
  return {
    userId: data.userId,
    id: data.id,
    config: stringified,
  };
};

export const parseFormConfig = (
  cfg?: string | null,
): CurrentBalanceFormType => {
  try {
    return {
      ...defaultConfig,
      ...(cfg ? (JSON.parse(cfg) as Partial<CurrentBalanceFormType>) : {}),
    };
  } catch (err) {
    console.error(err);
    return defaultConfig;
  }
};

export const getActiveFiltersCount = (
  formConfig: CurrentBalanceFormType,
): number => (formConfig.account ? 1 : 0);
