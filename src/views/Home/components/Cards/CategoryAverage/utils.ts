import type {
  CategoryAverageGranularity,
  UpdateDashboardCardConfigDto,
} from "lib";
import { TransactionType } from "lib";

import type { CategoryAverageFormType, CategoryAverageRange } from "./types";
import { CategoryAveragePreset } from "./types";
import {
  CATEGORY_AVERAGE_PRESETS,
  DEFAULT_CATEGORY_AVERAGE_PRESET,
  defaultConfig,
} from "./constants";

export const formToDto = (
  data: CategoryAverageFormType,
): UpdateDashboardCardConfigDto => {
  const categories = data.categories ?? [];
  const stringified = JSON.stringify({
    account: data.account,
    type: data.type ?? TransactionType.Out,
    categories,
    categoryIds: categories.map((category) => category.id),
    preset: resolvePreset(data.preset),
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
): CategoryAverageFormType => {
  try {
    const parsed = (cfg ? JSON.parse(cfg) : {}) as CategoryAverageFormType;
    const merged = { ...defaultConfig, ...parsed };
    const categories = merged.categories ?? [];
    return {
      ...merged,
      categories,
      categoryIds: categories.map((category) => category.id),
      preset: resolvePreset(merged.preset),
    };
  } catch (err) {
    console.error(err);
    return defaultConfig;
  }
};

export const getActiveFiltersCount = (
  formConfig: CategoryAverageFormType,
): number =>
  2 + (formConfig.account ? 1 : 0) + (formConfig.categories?.length ? 1 : 0);

const toYMD = (date: Date) =>
  [
    date.getFullYear(),
    `${date.getMonth() + 1}`.padStart(2, "0"),
    `${date.getDate()}`.padStart(2, "0"),
  ].join("-");

export const resolvePreset = (
  preset: CategoryAveragePreset | undefined,
): CategoryAveragePreset => preset ?? DEFAULT_CATEGORY_AVERAGE_PRESET;

export const presetToRange = (
  preset: CategoryAveragePreset,
): CategoryAverageRange => {
  const today = new Date();
  const to = new Date(today);
  to.setHours(0, 0, 0, 0);

  if (preset === CategoryAveragePreset.Ytd) {
    const from = new Date(today.getFullYear(), 0, 1);
    return { from: toYMD(from), to: toYMD(to) };
  }

  const from = new Date(to);
  from.setDate(from.getDate() - (CATEGORY_AVERAGE_PRESETS[preset].days ?? 90));
  return { from: toYMD(from), to: toYMD(to) };
};

export const presetGranularity = (
  preset: CategoryAveragePreset,
): CategoryAverageGranularity => CATEGORY_AVERAGE_PRESETS[preset].granularity;
