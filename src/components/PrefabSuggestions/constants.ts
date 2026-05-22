import currenciesData from "../../data/prefabs/currencies.json";
import categoriesData from "../../data/prefabs/transaction-categories.json";
import accountsData from "../../data/prefabs/accounts.json";
import dashboardData from "../../data/prefabs/dashboard-config.json";

import type {
  PrefabAccount,
  PrefabCategory,
  PrefabCurrency,
  PrefabDashboardConfig,
} from "./types";

export const PREFAB_CURRENCIES = currenciesData as PrefabCurrency[];
export const PREFAB_CATEGORIES = categoriesData as PrefabCategory[];
export const PREFAB_ACCOUNTS = accountsData as PrefabAccount[];
export const PREFAB_DASHBOARD = dashboardData as PrefabDashboardConfig;

export const FALLBACK_CURRENCY = "USD";

export const CARD_LABEL_BY_TYPE: Record<number, string> = {
  0: "_pages:prefabs.dashboard.cards.typeResume",
  1: "_pages:prefabs.dashboard.cards.weeklySpent",
  2: "_pages:prefabs.dashboard.cards.currentBalance",
};
