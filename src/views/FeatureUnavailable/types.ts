export type FeatureUnavailableModule =
  | "accounts"
  | "currencies"
  | "transactions"
  | "transactionCategories";

export type FeatureUnavailableProps = {
  module: FeatureUnavailableModule;
};
