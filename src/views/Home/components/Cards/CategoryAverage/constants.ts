import { CategoryAverageGranularity, TransactionType } from "lib";
import type { CategoryAverageFormType, PresetDef } from "./types";
import { CategoryAveragePreset } from "./types";

export const CATEGORY_AVERAGE_PRESETS: Record<
  CategoryAveragePreset,
  PresetDef
> = {
  [CategoryAveragePreset.EightWeeks]: {
    granularity: CategoryAverageGranularity.Week,
    days: 56,
  },
  [CategoryAveragePreset.Quarter]: {
    granularity: CategoryAverageGranularity.Month,
    days: 90,
  },
  [CategoryAveragePreset.Semester]: {
    granularity: CategoryAverageGranularity.Month,
    days: 180,
  },
  [CategoryAveragePreset.Year]: {
    granularity: CategoryAverageGranularity.Month,
    days: 365,
  },
  [CategoryAveragePreset.Ytd]: {
    granularity: CategoryAverageGranularity.Month,
  },
};

export const DEFAULT_CATEGORY_AVERAGE_PRESET = CategoryAveragePreset.Quarter;

export const MAX_BREAKDOWN_CATEGORIES = 5;

export const defaultConfig: CategoryAverageFormType = {
  account: null,
  type: TransactionType.Out,
  categories: [],
  categoryIds: [],
  preset: DEFAULT_CATEGORY_AVERAGE_PRESET,
  showFiltersAsBadge: false,
};
