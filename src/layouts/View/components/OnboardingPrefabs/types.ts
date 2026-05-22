import type { ReactNode } from "react";

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

export type PrefabDashboardCard = {
  type: number;
  position: number;
  size: string;
};

export type PrefabDashboardConfig = {
  cards: PrefabDashboardCard[];
};

export type AccountConfigEntry = {
  balance: number;
  currencyCode: string;
};

export type PrefabOnboardingState = {
  selectedCurrencyCodes: string[];
  selectedCategoryKeys: string[];
  selectedAccountKeys: string[];
  accountConfig: Record<string, AccountConfigEntry>;
  selectedProviderKeys: string[];
};

export type PrefabStepKey =
  | "currencies"
  | "transactions"
  | "accounts"
  | "subscriptions"
  | "dashboard";

export interface OnboardingPrefabStepPropsType {
  stepKey: PrefabStepKey;
  content?: ReactNode;
}
