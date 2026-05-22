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
  currencyId: number;
};

import type { ReactNode } from "react";

export type PrefabSuggestionPropsType = {
  onComplete?: () => void;
};

export type PrefabSuggestionsDialogPropsType = {
  open: boolean;
  title: string;
  onClose: () => void;
  onComplete?: () => void;
  children: (handleComplete: () => void) => ReactNode;
};
