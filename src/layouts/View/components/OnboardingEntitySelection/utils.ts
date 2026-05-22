import type { OnboardingSetupStepKey } from "../OnboardingSetup";

import type { UserEntityConfigDto, UserEntityConfigKey } from "lib";
import {
  USER_ENTITY_CONFIG_KEYS,
  UserEntityConfigKey as EntityKey,
} from "lib";

export const toggleSelectedEntityKey = (
  selectedEntityKeys: UserEntityConfigKey[],
  entityKey: UserEntityConfigKey,
): UserEntityConfigKey[] => {
  if (selectedEntityKeys.includes(entityKey)) {
    return selectedEntityKeys.filter((selected) => selected !== entityKey);
  }

  return [...selectedEntityKeys, entityKey];
};

export const resolveRequiredEntityKeys = (
  selectedEntityKeys: UserEntityConfigKey[],
): UserEntityConfigKey[] => {
  const resolved = new Set(selectedEntityKeys);

  if (resolved.has(EntityKey.Subscriptions)) {
    resolved.add(EntityKey.Transactions);
    resolved.add(EntityKey.Accounts);
    resolved.add(EntityKey.Currencies);
  }

  if (resolved.has(EntityKey.Transactions)) {
    resolved.add(EntityKey.Accounts);
    resolved.add(EntityKey.Currencies);
  }

  if (resolved.has(EntityKey.Accounts)) {
    resolved.add(EntityKey.Currencies);
  }

  return USER_ENTITY_CONFIG_KEYS.filter((entityKey) => resolved.has(entityKey));
};

export const entityKeysToConfigs = (
  enabledEntityKeys: UserEntityConfigKey[],
): UserEntityConfigDto[] => {
  return USER_ENTITY_CONFIG_KEYS.map((entityKey) => ({
    entityKey,
    enabled: enabledEntityKeys.includes(entityKey),
  }));
};

export const configsToEnabledEntityKeys = (
  configs: UserEntityConfigDto[],
): UserEntityConfigKey[] => {
  return USER_ENTITY_CONFIG_KEYS.filter((entityKey) =>
    configs.some(
      (config) => config.entityKey === entityKey && config.enabled === true,
    ),
  );
};

export const entityKeysToOnboardingSetupStepKeys = (
  enabledEntityKeys: UserEntityConfigKey[],
): OnboardingSetupStepKey[] => {
  const steps: OnboardingSetupStepKey[] = [];

  if (enabledEntityKeys.includes(EntityKey.Currencies)) {
    steps.push("currencies");
  }

  if (enabledEntityKeys.includes(EntityKey.Accounts)) {
    steps.push("accounts");
  }

  if (enabledEntityKeys.includes(EntityKey.Transactions)) {
    steps.push("transactions");
  }

  if (enabledEntityKeys.includes(EntityKey.Subscriptions)) {
    steps.push("subscriptions");
  }

  return steps;
};
