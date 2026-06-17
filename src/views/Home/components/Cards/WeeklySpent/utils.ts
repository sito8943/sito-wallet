import type { UpdateDashboardCardConfigDto } from "lib";
import { TransactionType } from "lib";
import type { WeeklySpentFormType } from "./types";

export const defaultConfig: WeeklySpentFormType = {
  type: TransactionType.In,
  accounts: [],
  showFiltersAsBadge: false,
};

export const formToDto = (
  data: WeeklySpentFormType,
): UpdateDashboardCardConfigDto => {
  const parsedAccount = data.accounts?.map((account) => account.id) ?? [];
  const stringified = JSON.stringify({
    ...data,
    account: parsedAccount,
    showFiltersAsBadge: !!data.showFiltersAsBadge,
  });
  return {
    userId: data.userId,
    id: data.id,
    config: stringified,
  };
};

export const parseFormConfig = (cfg?: string | null): WeeklySpentFormType => {
  try {
    return {
      ...defaultConfig,
      ...(cfg ? (JSON.parse(cfg) as Partial<WeeklySpentFormType>) : {}),
    };
  } catch (err) {
    console.error(err);
    return defaultConfig;
  }
};

export const getActiveFiltersCount = (
  formConfig: WeeklySpentFormType,
): number => 2 + (formConfig.accounts?.length ? 1 : 0);

export const getCurrentWeekRange = (): {
  start: string;
  end: string;
} => {
  const today = new Date();
  const day = today.getDay();
  const start = new Date(today);
  start.setDate(today.getDate() - day);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  const toYMD = (d: Date) => d.toISOString().slice(0, 10);
  return { start: toYMD(start), end: toYMD(end) };
};
