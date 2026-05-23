import currenciesData from "../../data/prefabs/currencies.json";
import categoriesData from "../../data/prefabs/transaction-categories.json";

import type { PrefabCategory, PrefabCurrency } from "./types";

export const PREFAB_CURRENCIES = currenciesData as PrefabCurrency[];
export const PREFAB_CATEGORIES = categoriesData as PrefabCategory[];

export const FALLBACK_CURRENCY = "USD";
