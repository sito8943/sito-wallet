import type { AppFeaturesPayload } from "../featureFlags/types";
import type {
  UserEntityConfigDto,
  UserEntityConfigFeaturePayload,
  UserEntityConfigResponse,
} from "./types";
import { UserEntityConfigKey } from "./types";

export const USER_ENTITY_CONFIG_KEYS: UserEntityConfigKey[] = [
  UserEntityConfigKey.Currencies,
  UserEntityConfigKey.Accounts,
  UserEntityConfigKey.Transactions,
  UserEntityConfigKey.Subscriptions,
];

const featureKeyByEntityKey: Record<
  UserEntityConfigKey,
  keyof UserEntityConfigFeaturePayload
> = {
  [UserEntityConfigKey.Currencies]: "currenciesEnabled",
  [UserEntityConfigKey.Accounts]: "accountsEnabled",
  [UserEntityConfigKey.Transactions]: "transactionsEnabled",
  [UserEntityConfigKey.Subscriptions]: "subscriptionsEnabled",
};

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const isUserEntityConfigKey = (
  value: unknown,
): value is UserEntityConfigKey => {
  return (
    typeof value === "string" &&
    USER_ENTITY_CONFIG_KEYS.includes(value as UserEntityConfigKey)
  );
};

const normalizeConfigItem = (value: unknown): UserEntityConfigDto | null => {
  if (!isObject(value)) return null;

  const { entityKey, enabled } = value;
  if (!isUserEntityConfigKey(entityKey) || typeof enabled !== "boolean") {
    return null;
  }

  return { entityKey, enabled };
};

export const getDefaultUserEntityConfigs = (): UserEntityConfigDto[] => {
  return USER_ENTITY_CONFIG_KEYS.map((entityKey) => ({
    entityKey,
    enabled: true,
  }));
};

export const normalizeUserEntityConfigResponse = (
  response: unknown,
): UserEntityConfigDto[] => {
  const items = Array.isArray(response)
    ? response
    : isObject(response) && Array.isArray(response.entities)
      ? response.entities
      : [];

  return items
    .map(normalizeConfigItem)
    .filter((item): item is UserEntityConfigDto => item !== null);
};

export const userEntityConfigsToFeaturePayload = (
  configs: UserEntityConfigDto[],
): AppFeaturesPayload => {
  const payload: AppFeaturesPayload = {};

  for (const config of configs) {
    payload[featureKeyByEntityKey[config.entityKey]] = config.enabled;
  }

  return payload;
};

export const userEntityConfigsResponseToFeaturePayload = (
  response: UserEntityConfigResponse,
): AppFeaturesPayload => {
  return userEntityConfigsToFeaturePayload(
    normalizeUserEntityConfigResponse(response),
  );
};
