import { fromLocal, toLocal } from "@sito/dashboard-app";

import { AccountType } from "lib";

import { DEFAULT_STATE, PREFAB_STORAGE_KEY } from "./constants";
import type { PrefabOnboardingState } from "./types";

export const mapAccountType = (type: string): AccountType => {
  if (type === "credit" || type === "bank") return AccountType.Card;
  return AccountType.Physical;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const loadPrefabState = (): PrefabOnboardingState => {
  const raw = fromLocal(PREFAB_STORAGE_KEY, "object");
  if (!isRecord(raw)) return { ...DEFAULT_STATE };

  return {
    selectedCurrencyCodes: Array.isArray(raw.selectedCurrencyCodes)
      ? (raw.selectedCurrencyCodes as string[])
      : [],
    selectedCategoryKeys: Array.isArray(raw.selectedCategoryKeys)
      ? (raw.selectedCategoryKeys as string[])
      : [],
    selectedAccountKeys: Array.isArray(raw.selectedAccountKeys)
      ? (raw.selectedAccountKeys as string[])
      : [],
    accountConfig: isRecord(raw.accountConfig)
      ? (raw.accountConfig as Record<
          string,
          { balance: number; currencyCode: string }
        >)
      : {},
    selectedProviderKeys: Array.isArray(raw.selectedProviderKeys)
      ? (raw.selectedProviderKeys as string[])
      : [],
  };
};

export const persistPrefabState = (state: PrefabOnboardingState): void => {
  toLocal(PREFAB_STORAGE_KEY, state);
};

export const clearPrefabState = (): void => {
  toLocal(PREFAB_STORAGE_KEY, null);
};

export const toggleInArray = <T>(arr: T[], value: T): T[] =>
  arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
