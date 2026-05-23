import type { PrefabSubscriptionProviderDto } from "lib";

export type PrefabCurrency = {
  code: string;
  name: string;
  symbol: string;
  type: "fiat" | "crypto";
};

export type PrefabCategory = {
  key: string;
  name: string;
  type: "income" | "expense";
  icon: string;
  color: string;
};

export type PrefabCurrenciesGridPropsType = {
  value: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
};

export type PrefabCategoriesGridPropsType = {
  value: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
};

export type PrefabSubscriptionProvidersGridPropsType = {
  value: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
  providers: PrefabSubscriptionProviderDto[];
  defaultCurrencyCode: string;
};
