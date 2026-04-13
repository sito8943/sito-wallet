import { fromLocal, removeFromLocal, toLocal } from "@sito/dashboard-app";

import type {
  AppFeatures,
  AppFeaturesPayload,
  FeatureFlagKey,
} from "../api/featureFlags/types";

const APP_FEATURE_KEYS: Array<keyof AppFeatures> = [
  "balanceGreaterThanZero",
  "currenciesEnabled",
  "accountsEnabled",
  "transactionsEnabled",
  "subscriptionsEnabled",
];

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const isBoolean = (value: unknown): value is boolean => {
  return typeof value === "boolean";
};

export const sanitizeFeaturePayload = (
  payload: unknown,
): AppFeaturesPayload => {
  if (!isObject(payload)) return {};

  const sanitized: AppFeaturesPayload = {};

  for (const key of APP_FEATURE_KEYS) {
    const value = payload[key];
    if (isBoolean(value)) {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

export const mergeAppFeatures = (params: {
  defaults: AppFeatures;
  persisted?: AppFeaturesPayload | null;
  payload?: AppFeaturesPayload | null;
}): AppFeatures => {
  const { defaults, persisted, payload } = params;

  const merged = {
    ...defaults,
    ...sanitizeFeaturePayload(persisted),
    ...sanitizeFeaturePayload(payload),
  } satisfies AppFeatures;

  return merged;
};

export const isFeatureEnabledByDependencies = (
  features: AppFeatures,
  key: FeatureFlagKey,
): boolean => {
  if (key === "transactionCategoriesEnabled") {
    return features.transactionsEnabled;
  }

  return features[key];
};

export const readPersistedFeatureFlags = (
  storageKey: string,
): AppFeaturesPayload | null => {
  const persisted = fromLocal(storageKey, "object");
  if (!persisted) return null;

  return sanitizeFeaturePayload(persisted);
};

export const persistFeatureFlags = (
  storageKey: string,
  features: AppFeatures,
): void => {
  toLocal(storageKey, features);
};

export const clearPersistedFeatureFlags = (storageKey: string): void => {
  removeFromLocal(storageKey);
};

export const isFeatureDisabledBusinessError = (error: unknown): boolean => {
  if (!isObject(error)) return false;

  const message =
    typeof error.message === "string"
      ? error.message
      : typeof error.error === "string"
        ? error.error
        : null;

  if (!message) return false;

  return message.includes(".featureDisabled");
};
