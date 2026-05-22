import { createContext, useContext } from "react";

import type { PrefabSubscriptionProviderDto } from "lib";

import type { AccountConfigEntry, PrefabOnboardingState } from "./types";

export type PrefabOnboardingContextValue = {
  state: PrefabOnboardingState;
  country: string;
  defaultCurrencyCode: string;
  providers: PrefabSubscriptionProviderDto[];
  providersLoading: boolean;
  providersError: string | null;
  toggleCurrency: (code: string) => void;
  toggleCategory: (key: string) => void;
  toggleAccount: (key: string) => void;
  setAccountConfig: (key: string, entry: AccountConfigEntry) => void;
  toggleProvider: (key: string) => void;
  loadProviders: () => Promise<void>;
  commitCurrencies: () => Promise<boolean>;
  commitCategories: () => Promise<boolean>;
  commitAccounts: () => Promise<boolean>;
  commitProviders: () => Promise<boolean>;
  commitDashboard: () => Promise<boolean>;
  reset: () => void;
};

export const PrefabOnboardingContext =
  createContext<PrefabOnboardingContextValue | null>(null);

export function usePrefabOnboarding(): PrefabOnboardingContextValue {
  const ctx = useContext(PrefabOnboardingContext);
  if (!ctx) {
    throw new Error(
      "usePrefabOnboarding must be used within PrefabOnboardingProvider",
    );
  }
  return ctx;
}
