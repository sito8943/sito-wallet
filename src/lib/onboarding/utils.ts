import {
  ONBOARDING_DRAFT_INITIAL_LOCAL_ID,
  ONBOARDING_DRAFT_VERSION,
} from "./constants";
import type { OnboardingDraft } from "./types";

export const createEmptyDraft = (now: number = Date.now()): OnboardingDraft => ({
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

export const nextLocalId = (draft: OnboardingDraft): number => draft.nextLocalId;

export const advanceLocalId = (draft: OnboardingDraft): OnboardingDraft => ({
  ...draft,
  nextLocalId: draft.nextLocalId - 1,
});
