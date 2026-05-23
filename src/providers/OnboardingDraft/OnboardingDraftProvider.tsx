import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useAuth } from "@sito/dashboard-app";

import {
  clearDraft as clearStorage,
  createEmptyDraft,
  isAnonymousVisitorSession,
  readDraft,
  writeDraft,
  type DraftAccount,
  type DraftCurrency,
  type DraftSubscriptionProvider,
  type DraftTransactionCategory,
  type OnboardingDraft,
  type UserEntityConfigKey,
} from "lib";

import { OnboardingDraftContext } from "./OnboardingDraftContext";
import type {
  AddAccountInput,
  AddCurrencyInput,
  AddSubscriptionProviderInput,
  AddTransactionCategoryInput,
  OnboardingDraftProviderPropsType,
} from "./types";
import {
  appendAccounts,
  appendCurrencies,
  appendSubscriptionProviders,
  appendTransactionCategories,
} from "./utils";

const loadInitialDraft = (): OnboardingDraft =>
  readDraft() ?? createEmptyDraft();

export const OnboardingDraftProvider = ({
  children,
}: OnboardingDraftProviderPropsType) => {
  const { account, isInGuestMode } = useAuth();
  const isAnonymous = isAnonymousVisitorSession(account, isInGuestMode());

  const [draft, setDraft] = useState<OnboardingDraft>(() => loadInitialDraft());
  const draftRef = useRef(draft);

  useEffect(() => {
    draftRef.current = draft;
    writeDraft(draft);
  }, [draft]);

  const refreshFromStorage = useCallback(() => {
    setDraft(loadInitialDraft());
  }, []);

  const clear = useCallback(() => {
    clearStorage();
    setDraft(createEmptyDraft());
  }, []);

  const addCurrencies = useCallback(
    (inputs: AddCurrencyInput[]): DraftCurrency[] => {
      const { draft: nextDraft, added } = appendCurrencies(
        draftRef.current,
        inputs,
      );
      setDraft(nextDraft);
      return added;
    },
    [],
  );

  const addAccounts = useCallback(
    (inputs: AddAccountInput[]): DraftAccount[] => {
      const { draft: nextDraft, added } = appendAccounts(
        draftRef.current,
        inputs,
      );
      setDraft(nextDraft);
      return added;
    },
    [],
  );

  const addTransactionCategories = useCallback(
    (inputs: AddTransactionCategoryInput[]): DraftTransactionCategory[] => {
      const { draft: nextDraft, added } = appendTransactionCategories(
        draftRef.current,
        inputs,
      );
      setDraft(nextDraft);
      return added;
    },
    [],
  );

  const addSubscriptionProviders = useCallback(
    (inputs: AddSubscriptionProviderInput[]): DraftSubscriptionProvider[] => {
      const { draft: nextDraft, added } = appendSubscriptionProviders(
        draftRef.current,
        inputs,
      );
      setDraft(nextDraft);
      return added;
    },
    [],
  );

  const setSelectedEntityKeys = useCallback((keys: UserEntityConfigKey[]) => {
    setDraft((current) => ({ ...current, selectedEntityKeys: keys }));
  }, []);

  const value = useMemo(
    () => ({
      draft,
      isAnonymous,
      addCurrencies,
      addAccounts,
      addTransactionCategories,
      addSubscriptionProviders,
      setSelectedEntityKeys,
      clear,
      refreshFromStorage,
    }),
    [
      addAccounts,
      addCurrencies,
      addSubscriptionProviders,
      addTransactionCategories,
      clear,
      draft,
      isAnonymous,
      refreshFromStorage,
      setSelectedEntityKeys,
    ],
  );

  return (
    <OnboardingDraftContext.Provider value={value}>
      {children}
    </OnboardingDraftContext.Provider>
  );
};
