import type { OnboardingDraft } from "lib";

export const countDraftItems = (draft: OnboardingDraft): number =>
  draft.currencies.length +
  draft.accounts.length +
  draft.transactionCategories.length +
  draft.subscriptionProviders.length;
