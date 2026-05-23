import type {
  DraftAccount,
  DraftCurrency,
  DraftSubscriptionProvider,
  DraftTransactionCategory,
  OnboardingDraft,
} from "lib";

type WithLocalId<T> = T & { localId: number };

const assignLocalIds = <T>(
  inputs: T[],
  startId: number,
): { items: WithLocalId<T>[]; nextId: number } => {
  let cursor = startId;
  const items = inputs.map((input) => {
    const item = { ...input, localId: cursor };
    cursor -= 1;
    return item;
  });
  return { items, nextId: cursor };
};

export const appendCurrencies = (
  draft: OnboardingDraft,
  inputs: Omit<DraftCurrency, "localId">[],
): { draft: OnboardingDraft; added: DraftCurrency[] } => {
  const { items, nextId } = assignLocalIds(inputs, draft.nextLocalId);
  return {
    added: items,
    draft: {
      ...draft,
      currencies: [...draft.currencies, ...items],
      nextLocalId: nextId,
    },
  };
};

export const appendAccounts = (
  draft: OnboardingDraft,
  inputs: Omit<DraftAccount, "localId">[],
): { draft: OnboardingDraft; added: DraftAccount[] } => {
  const { items, nextId } = assignLocalIds(inputs, draft.nextLocalId);
  return {
    added: items,
    draft: {
      ...draft,
      accounts: [...draft.accounts, ...items],
      nextLocalId: nextId,
    },
  };
};

export const appendTransactionCategories = (
  draft: OnboardingDraft,
  inputs: Omit<DraftTransactionCategory, "localId">[],
): { draft: OnboardingDraft; added: DraftTransactionCategory[] } => {
  const { items, nextId } = assignLocalIds(inputs, draft.nextLocalId);
  return {
    added: items,
    draft: {
      ...draft,
      transactionCategories: [...draft.transactionCategories, ...items],
      nextLocalId: nextId,
    },
  };
};

export const appendSubscriptionProviders = (
  draft: OnboardingDraft,
  inputs: Omit<DraftSubscriptionProvider, "localId">[],
): { draft: OnboardingDraft; added: DraftSubscriptionProvider[] } => {
  const { items, nextId } = assignLocalIds(inputs, draft.nextLocalId);
  return {
    added: items,
    draft: {
      ...draft,
      subscriptionProviders: [...draft.subscriptionProviders, ...items],
      nextLocalId: nextId,
    },
  };
};
