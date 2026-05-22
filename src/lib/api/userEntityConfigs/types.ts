import type { AppFeaturesPayload } from "../featureFlags/types";

export enum UserEntityConfigKey {
  Currencies = "CURRENCIES",
  Accounts = "ACCOUNTS",
  Transactions = "TRANSACTIONS",
  Subscriptions = "SUBSCRIPTIONS",
}

export type UserEntityConfigDto = {
  entityKey: UserEntityConfigKey;
  enabled: boolean;
};

export type UserEntityConfigExplicitBatchDto = {
  entities: UserEntityConfigDto[];
};

export type UserEntityConfigToggleBatchDto = {
  enable?: UserEntityConfigKey[];
  disable?: UserEntityConfigKey[];
};

export type UserEntityConfigBatchDto =
  | UserEntityConfigExplicitBatchDto
  | UserEntityConfigToggleBatchDto;

export type UserEntityConfigResponse =
  | UserEntityConfigDto[]
  | {
      entities?: UserEntityConfigDto[];
    };

export type UserEntityConfigFeaturePayload = Pick<
  AppFeaturesPayload,
  | "currenciesEnabled"
  | "accountsEnabled"
  | "transactionsEnabled"
  | "subscriptionsEnabled"
>;
