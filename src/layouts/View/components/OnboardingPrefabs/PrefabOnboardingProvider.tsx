import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useNotification } from "@sito/dashboard-app";
import { useTranslation } from "react-i18next";

import { useManager } from "providers";
import { detectCountry, detectCurrency } from "lib";
import type { AddTransactionCategoryDto, PrefabSubscriptionProviderDto } from "lib";
import { TransactionType } from "lib";

import {
  PREFAB_ACCOUNTS,
  PREFAB_CATEGORIES,
  PREFAB_CURRENCIES,
  PREFAB_DASHBOARD,
  TRANSLATION_NAMESPACE,
} from "./constants";

import "./styles.css";
import type {
  AccountConfigEntry,
  PrefabOnboardingState,
} from "./types";
import {
  loadPrefabState,
  mapAccountType,
  persistPrefabState,
  toggleInArray,
} from "./utils";
import {
  PrefabOnboardingContext,
  type PrefabOnboardingContextValue,
} from "./prefabOnboardingContext";

export function PrefabOnboardingProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const manager = useManager();
  const { showErrorNotification } = useNotification();

  const country = useMemo(() => detectCountry(), []);
  const defaultCurrencyCode = useMemo(() => detectCurrency(country), [country]);

  const [state, setState] = useState<PrefabOnboardingState>(() => {
    const loaded = loadPrefabState();

    if (loaded.selectedCurrencyCodes.length === 0) {
      loaded.selectedCurrencyCodes = [defaultCurrencyCode];
    }

    if (loaded.selectedCategoryKeys.length === 0) {
      loaded.selectedCategoryKeys = PREFAB_CATEGORIES.map((c) => c.key);
    }

    return loaded;
  });

  const [providers, setProviders] = useState<PrefabSubscriptionProviderDto[]>([]);
  const [providersLoading, setProvidersLoading] = useState(false);
  const [providersError, setProvidersError] = useState<string | null>(null);
  const providersLoadedRef = useRef(false);

  useEffect(() => {
    persistPrefabState(state);
  }, [state]);

  const toggleCurrency = useCallback((code: string) => {
    setState((prev) => ({
      ...prev,
      selectedCurrencyCodes: toggleInArray(prev.selectedCurrencyCodes, code),
    }));
  }, []);

  const toggleCategory = useCallback((key: string) => {
    setState((prev) => ({
      ...prev,
      selectedCategoryKeys: toggleInArray(prev.selectedCategoryKeys, key),
    }));
  }, []);

  const toggleAccount = useCallback(
    (key: string) => {
      setState((prev) => {
        const isSelected = prev.selectedAccountKeys.includes(key);
        const nextKeys = toggleInArray(prev.selectedAccountKeys, key);
        const nextConfig: typeof prev.accountConfig = isSelected
          ? Object.fromEntries(
              Object.entries(prev.accountConfig).filter(([k]) => k !== key),
            )
          : {
              ...prev.accountConfig,
              [key]: prev.accountConfig[key] ?? {
                balance: 0,
                currencyCode:
                  prev.selectedCurrencyCodes[0] ?? defaultCurrencyCode,
              },
            };

        return {
          ...prev,
          selectedAccountKeys: nextKeys,
          accountConfig: nextConfig,
        };
      });
    },
    [defaultCurrencyCode],
  );

  const setAccountConfig = useCallback(
    (key: string, entry: AccountConfigEntry) => {
      setState((prev) => ({
        ...prev,
        accountConfig: { ...prev.accountConfig, [key]: entry },
      }));
    },
    [],
  );

  const toggleProvider = useCallback((key: string) => {
    setState((prev) => ({
      ...prev,
      selectedProviderKeys: toggleInArray(prev.selectedProviderKeys, key),
    }));
  }, []);

  const loadProviders = useCallback(async () => {
    if (providersLoadedRef.current) return;
    providersLoadedRef.current = true;
    setProvidersLoading(true);
    setProvidersError(null);

    try {
      if (!("SubscriptionProviders" in manager)) {
        setProvidersError(t("_pages:onboarding.prefabs.subscriptions.loadError"));
        return;
      }
      const data = await manager.SubscriptionProviders.getPrefabs({ country });
      setProviders(data);
    } catch {
      setProvidersError(t("_pages:onboarding.prefabs.subscriptions.loadError"));
    } finally {
      setProvidersLoading(false);
    }
  }, [country, manager, t]);

  const notifyError = useCallback(() => {
    showErrorNotification({ message: t("_accessibility:errors.500") });
  }, [showErrorNotification, t]);

  const commitCurrencies = useCallback(async (): Promise<boolean> => {
    if (state.selectedCurrencyCodes.length === 0) return true;

    const payload = state.selectedCurrencyCodes.map((code) => {
      const prefab = PREFAB_CURRENCIES.find((c) => c.code === code);
      return {
        name: prefab?.name ?? code,
        symbol: prefab?.symbol ?? code,
        description: "",
        userId: 0,
      };
    });

    try {
      await manager.Currencies.insertMany(payload);
      return true;
    } catch {
      notifyError();
      return false;
    }
  }, [manager.Currencies, notifyError, state.selectedCurrencyCodes]);

  const commitCategories = useCallback(async (): Promise<boolean> => {
    if (state.selectedCategoryKeys.length === 0) return true;

    const payload: AddTransactionCategoryDto[] = state.selectedCategoryKeys
      .map((key) => {
        const prefab = PREFAB_CATEGORIES.find((c) => c.key === key);
        if (!prefab) return null;
        return {
          name: t(
            `${TRANSLATION_NAMESPACE}:onboarding.prefabs.categories.items.${key}.name`,
          ),
          description: "",
          color: prefab.color,
          userId: 0,
          type:
            prefab.type === "income" ? TransactionType.In : TransactionType.Out,
        };
      })
      .filter((v): v is AddTransactionCategoryDto => v !== null);

    try {
      await manager.TransactionCategories.insertMany(payload);
      return true;
    } catch {
      notifyError();
      return false;
    }
  }, [
    manager.TransactionCategories,
    notifyError,
    state.selectedCategoryKeys,
    t,
  ]);

  const commitAccounts = useCallback(async (): Promise<boolean> => {
    if (state.selectedAccountKeys.length === 0) return true;

    const currenciesIndex: Record<string, number> = {};
    try {
      const result = await manager.Currencies.get();
      const items = Array.isArray(result)
        ? result
        : (result as { items?: { id: number; symbol: string; name: string }[] }).items ?? [];
      for (const item of items) {
        for (const prefab of PREFAB_CURRENCIES) {
          if (
            prefab.name === item.name ||
            prefab.symbol === item.symbol ||
            prefab.code === item.name
          ) {
            currenciesIndex[prefab.code] = item.id;
            break;
          }
        }
      }
    } catch {
      notifyError();
      return false;
    }

    const payload = state.selectedAccountKeys
      .map((key) => {
        const prefab = PREFAB_ACCOUNTS.find((a) => a.key === key);
        const cfg = state.accountConfig[key];
        if (!prefab || !cfg) return null;
        const currencyId = currenciesIndex[cfg.currencyCode];
        if (!currencyId) return null;
        return {
          name: t(
            `${TRANSLATION_NAMESPACE}:onboarding.prefabs.accounts.items.${key}.name`,
          ),
          description: "",
          balance: cfg.balance,
          type: mapAccountType(prefab.type),
          currencyId,
          userId: 0,
        };
      })
      .filter((v): v is NonNullable<typeof v> => v !== null);

    if (payload.length === 0) return true;

    try {
      await manager.Accounts.insertMany(payload);
      return true;
    } catch {
      notifyError();
      return false;
    }
  }, [
    manager.Accounts,
    manager.Currencies,
    notifyError,
    state.accountConfig,
    state.selectedAccountKeys,
    t,
  ]);

  const commitProviders = useCallback(async (): Promise<boolean> => {
    if (state.selectedProviderKeys.length === 0) return true;

    const payload = state.selectedProviderKeys
      .map((key) => {
        const prefab = providers.find((p) => p.key === key);
        if (!prefab) return null;
        return {
          name: prefab.name,
          description: prefab.description ?? null,
          website: prefab.website ?? null,
          photo: prefab.image ?? null,
        };
      })
      .filter((v): v is NonNullable<typeof v> => v !== null);

    if (payload.length === 0) return true;

    if (!("SubscriptionProviders" in manager)) {
      notifyError();
      return false;
    }

    try {
      await manager.SubscriptionProviders.insertMany(payload);
      return true;
    } catch {
      notifyError();
      return false;
    }
  }, [
    manager,
    notifyError,
    providers,
    state.selectedProviderKeys,
  ]);

  const commitDashboard = useCallback(async (): Promise<boolean> => {
    const payload = PREFAB_DASHBOARD.cards.map((card) => ({
      type: card.type,
      config: JSON.stringify({ size: card.size }),
      position: card.position,
      userId: 0,
    }));

    try {
      await manager.Dashboard.insertMany(payload);
      return true;
    } catch {
      notifyError();
      return false;
    }
  }, [manager.Dashboard, notifyError]);

  const reset = useCallback(() => {
    setState({
      selectedCurrencyCodes: [defaultCurrencyCode],
      selectedCategoryKeys: PREFAB_CATEGORIES.map((c) => c.key),
      selectedAccountKeys: [],
      accountConfig: {},
      selectedProviderKeys: [],
    });
    providersLoadedRef.current = false;
    setProviders([]);
  }, [defaultCurrencyCode]);

  const value = useMemo<PrefabOnboardingContextValue>(
    () => ({
      state,
      country,
      defaultCurrencyCode,
      providers,
      providersLoading,
      providersError,
      toggleCurrency,
      toggleCategory,
      toggleAccount,
      setAccountConfig,
      toggleProvider,
      loadProviders,
      commitCurrencies,
      commitCategories,
      commitAccounts,
      commitProviders,
      commitDashboard,
      reset,
    }),
    [
      commitAccounts,
      commitCategories,
      commitCurrencies,
      commitDashboard,
      commitProviders,
      country,
      defaultCurrencyCode,
      loadProviders,
      providers,
      providersError,
      providersLoading,
      reset,
      setAccountConfig,
      state,
      toggleAccount,
      toggleCategory,
      toggleCurrency,
      toggleProvider,
    ],
  );

  return (
    <PrefabOnboardingContext.Provider value={value}>
      {children}
    </PrefabOnboardingContext.Provider>
  );
}

