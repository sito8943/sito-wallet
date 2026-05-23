import {
  ONBOARDING_DRAFT_INITIAL_LOCAL_ID,
  ONBOARDING_DRAFT_VERSION,
} from "./constants";
import { USER_ENTITY_CONFIG_KEYS } from "../api/userEntityConfigs/utils";
import { AccountType } from "../entities/account/AccountType";
import { TransactionType } from "../entities/transaction/TransactionType";
import type { OnboardingDraft } from "./types";

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const isString = (value: unknown): value is string =>
  typeof value === "string";

const isOptionalString = (value: unknown): value is string | undefined =>
  value === undefined || isString(value);

const isOptionalNullableString = (
  value: unknown,
): value is string | null | undefined =>
  value === undefined || value === null || isString(value);

const isAccountType = (value: unknown): value is AccountType =>
  value === AccountType.Physical || value === AccountType.Card;

const isTransactionType = (value: unknown): value is TransactionType =>
  value === TransactionType.Out || value === TransactionType.In;

const isValidDraftCurrency = (value: unknown): boolean => {
  if (!isObject(value)) return false;

  return (
    isFiniteNumber(value.localId) &&
    isString(value.name) &&
    isString(value.symbol) &&
    isString(value.description) &&
    isOptionalString(value.prefabCode)
  );
};

const isValidDraftAccount = (value: unknown): boolean => {
  if (!isObject(value)) return false;

  return (
    isFiniteNumber(value.localId) &&
    isString(value.name) &&
    isFiniteNumber(value.balance) &&
    isString(value.description) &&
    isAccountType(value.type) &&
    isFiniteNumber(value.currencyLocalId)
  );
};

const isValidDraftTransactionCategory = (value: unknown): boolean => {
  if (!isObject(value)) return false;

  return (
    isFiniteNumber(value.localId) &&
    isString(value.name) &&
    isString(value.description) &&
    isString(value.color) &&
    isTransactionType(value.type) &&
    isOptionalString(value.prefabKey)
  );
};

const isValidDraftSubscriptionProvider = (value: unknown): boolean => {
  if (!isObject(value)) return false;

  return (
    isFiniteNumber(value.localId) &&
    isString(value.name) &&
    isOptionalNullableString(value.description) &&
    isOptionalNullableString(value.website) &&
    isOptionalNullableString(value.photo) &&
    isOptionalString(value.prefabKey)
  );
};

const isValidUserEntityConfigKey = (value: unknown): boolean =>
  typeof value === "string" &&
  USER_ENTITY_CONFIG_KEYS.some((entityKey) => entityKey === value);

export const createEmptyDraft = (
  now: number = Date.now(),
): OnboardingDraft => ({
  version: ONBOARDING_DRAFT_VERSION,
  createdAt: now,
  updatedAt: now,
  nextLocalId: ONBOARDING_DRAFT_INITIAL_LOCAL_ID,
  currencies: [],
  accounts: [],
  transactionCategories: [],
  subscriptionProviders: [],
  selectedEntityKeys: [],
});

export const isDraftEmpty = (draft: OnboardingDraft): boolean =>
  draft.currencies.length === 0 &&
  draft.accounts.length === 0 &&
  draft.transactionCategories.length === 0 &&
  draft.subscriptionProviders.length === 0 &&
  draft.selectedEntityKeys.length === 0;

export const isValidDraft = (value: unknown): value is OnboardingDraft => {
  if (!isObject(value)) return false;

  return (
    isFiniteNumber(value.version) &&
    isFiniteNumber(value.createdAt) &&
    isFiniteNumber(value.updatedAt) &&
    isFiniteNumber(value.nextLocalId) &&
    Array.isArray(value.currencies) &&
    value.currencies.every(isValidDraftCurrency) &&
    Array.isArray(value.accounts) &&
    value.accounts.every(isValidDraftAccount) &&
    Array.isArray(value.transactionCategories) &&
    value.transactionCategories.every(isValidDraftTransactionCategory) &&
    Array.isArray(value.subscriptionProviders) &&
    value.subscriptionProviders.every(isValidDraftSubscriptionProvider) &&
    Array.isArray(value.selectedEntityKeys) &&
    value.selectedEntityKeys.every(isValidUserEntityConfigKey)
  );
};

export const countDraftItems = (draft: OnboardingDraft): number =>
  draft.currencies.length +
  draft.accounts.length +
  draft.transactionCategories.length +
  draft.subscriptionProviders.length;

export const nextLocalId = (draft: OnboardingDraft): number =>
  draft.nextLocalId;

export const advanceLocalId = (draft: OnboardingDraft): OnboardingDraft => ({
  ...draft,
  nextLocalId: draft.nextLocalId - 1,
});
