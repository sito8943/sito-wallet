export type FeatureUnavailableModule =
  | "accounts"
  | "currencies"
  | "transactions"
  | "transactionCategories"
  | "subscriptions"
  | "debts"
  | "goals";

export type FeatureUnavailableProps = {
  module: FeatureUnavailableModule;
};
