export type AppFeatures = {
  balanceGreaterThanZero: boolean;
  currenciesEnabled: boolean;
  accountsEnabled: boolean;
  transactionsEnabled: boolean;
};

export type AppFeaturesPayload = Partial<AppFeatures>;

export type AppFeaturesResponse = {
  features?: AppFeaturesPayload;
};

export type FeatureFlagKey = keyof AppFeatures | "transactionCategoriesEnabled";
