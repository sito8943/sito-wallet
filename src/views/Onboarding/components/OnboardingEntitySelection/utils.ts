import type { OnboardingSetupStepKey } from "../WalletOnboardingWizard";

import type { UserEntityConfigKey } from "lib";
import { UserEntityConfigKey as EntityKey } from "lib";
export {
  configsToEnabledEntityKeys,
  entityKeysToConfigs,
  resolveRequiredEntityKeys,
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
