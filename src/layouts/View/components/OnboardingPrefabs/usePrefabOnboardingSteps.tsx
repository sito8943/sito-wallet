import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { UserEntityConfigKey } from "lib";

import { usePrefabOnboarding } from "./prefabOnboardingContext";
import { PrefabAccountsStep } from "./PrefabAccountsStep";
import { PrefabCategoriesStep } from "./PrefabCategoriesStep";
import { PrefabCurrenciesStep } from "./PrefabCurrenciesStep";
import { PrefabDashboardStep } from "./PrefabDashboardStep";
import { PrefabSubscriptionProvidersStep } from "./PrefabSubscriptionProvidersStep";
import { clearPrefabState } from "./utils";

import type { WalletOnboardingStepType } from "../WalletOnboarding";

export function usePrefabOnboardingSteps(params: {
  enabledEntityKeys: UserEntityConfigKey[];
}): WalletOnboardingStepType[] {
  const { enabledEntityKeys } = params;
  const { t } = useTranslation();
  const {
    commitAccounts,
    commitCategories,
    commitCurrencies,
    commitDashboard,
    commitProviders,
  } = usePrefabOnboarding();

  return useMemo<WalletOnboardingStepType[]>(() => {
    const steps: WalletOnboardingStepType[] = [];

    if (enabledEntityKeys.includes("currencies" as UserEntityConfigKey)) {
      steps.push({
        key: "prefab_currencies",
        title: t("_pages:onboarding.prefabs.currencies.title"),
        body: t("_pages:onboarding.prefabs.currencies.body"),
        content: <PrefabCurrenciesStep />,
        beforeNext: commitCurrencies,
      });
    }

    if (enabledEntityKeys.includes("transactions" as UserEntityConfigKey)) {
      steps.push({
        key: "prefab_categories",
        title: t("_pages:onboarding.prefabs.categories.title"),
        body: t("_pages:onboarding.prefabs.categories.body"),
        content: <PrefabCategoriesStep />,
        beforeNext: commitCategories,
      });
    }

    if (enabledEntityKeys.includes("accounts" as UserEntityConfigKey)) {
      steps.push({
        key: "prefab_accounts",
        title: t("_pages:onboarding.prefabs.accounts.title"),
        body: t("_pages:onboarding.prefabs.accounts.body"),
        content: <PrefabAccountsStep />,
        beforeNext: commitAccounts,
      });
    }

    if (enabledEntityKeys.includes("subscriptions" as UserEntityConfigKey)) {
      steps.push({
        key: "prefab_subscriptions",
        title: t("_pages:onboarding.prefabs.subscriptions.title"),
        body: t("_pages:onboarding.prefabs.subscriptions.body"),
        content: <PrefabSubscriptionProvidersStep />,
        beforeNext: commitProviders,
      });
    }

    steps.push({
      key: "prefab_dashboard",
      title: t("_pages:onboarding.prefabs.dashboard.title"),
      body: t("_pages:onboarding.prefabs.dashboard.body"),
      content: <PrefabDashboardStep />,
      beforeNext: async () => {
        const ok = await commitDashboard();
        if (ok) clearPrefabState();
        return ok;
      },
    });

    return steps;
  }, [
    commitAccounts,
    commitCategories,
    commitCurrencies,
    commitDashboard,
    commitProviders,
    enabledEntityKeys,
    t,
  ]);
}
