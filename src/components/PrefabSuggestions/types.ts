import type { CommonCurrencyDto, PrefabSubscriptionProviderDto } from "lib";

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

export type PrefabAccount = {
  key: string;
  name: string;
  type: "cash" | "bank" | "savings" | "credit" | "wallet";
  icon: string;
  color: string;
};

export type AccountConfigEntry = {
  balance: number;
  currencyId: number;
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

export type PrefabAccountsFieldValue = Record<string, AccountConfigEntry>;

export type PrefabAccountsFieldPropsType = {
  value: PrefabAccountsFieldValue;
  onChange: (next: PrefabAccountsFieldValue) => void;
  disabled?: boolean;
  currencies: CommonCurrencyDto[];
  defaultCurrencyId: number;
};
