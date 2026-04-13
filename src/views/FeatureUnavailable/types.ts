export type FeatureUnavailableModule =
  | "accounts"
  | "currencies"
  | "transactions"
  | "transactionCategories"
  | "subscriptions";

export type FeatureUnavailableProps = {
  module: FeatureUnavailableModule;
};
