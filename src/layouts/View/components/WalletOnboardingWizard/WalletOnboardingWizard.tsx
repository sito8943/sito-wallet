import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAuth, useNotification } from "@sito/dashboard-app";

import { useFeatureFlags, useManager } from "providers";
import {
  type UserEntityConfigKey,
  USER_ENTITY_CONFIG_KEYS,
  userEntityConfigsToFeaturePayload,
} from "lib";

import {
  OnboardingEntitySelection,
  entityKeysToConfigs,
  resolveRequiredEntityKeys,
  toggleSelectedEntityKey,
} from "../OnboardingEntitySelection";
import { WalletOnboarding } from "../WalletOnboarding";
import type { WalletOnboardingStepType } from "../WalletOnboarding";

type WalletOnboardingWizardPropsType = {
  initialEnabledEntityKeys?: UserEntityConfigKey[];
};

export function WalletOnboardingWizard(props: WalletOnboardingWizardPropsType) {
  const { initialEnabledEntityKeys } = props;
  const { t } = useTranslation();
  const { account } = useAuth();
  const { showErrorNotification } = useNotification();
  const manager = useManager();
  const { applyFeaturePayload } = useFeatureFlags();

  const [selectedEntityKeys, setSelectedEntityKeys] = useState<
    UserEntityConfigKey[]
  >(() => initialEnabledEntityKeys ?? [...USER_ENTITY_CONFIG_KEYS]);

  const handleToggleEntity = useCallback((entityKey: UserEntityConfigKey) => {
    setSelectedEntityKeys((previous) =>
      toggleSelectedEntityKey(previous, entityKey),
    );
  }, []);

  const handleEntitiesNext = useCallback(async () => {
    if (selectedEntityKeys.length === 0) {
      showErrorNotification({
        message: t("_pages:onboarding.entities.errors.empty"),
      });
      return false;
    }

    const resolvedEntityKeys = resolveRequiredEntityKeys(selectedEntityKeys);
    const configs = entityKeysToConfigs(resolvedEntityKeys);

    if (account?.id) {
      try {
        await manager.UserEntityConfigs.putBatch({ entities: configs });
      } catch {
        showErrorNotification({ message: t("_accessibility:errors.500") });
        return false;
      }
    }

    applyFeaturePayload(userEntityConfigsToFeaturePayload(configs));
    return true;
  }, [
    account?.id,
    applyFeaturePayload,
    manager.UserEntityConfigs,
    selectedEntityKeys,
    showErrorNotification,
    t,
  ]);

  const steps = useMemo<WalletOnboardingStepType[]>(
    () => [
      {
        key: "welcome",
        title: t("_pages:onboarding.welcome.title"),
        body: t("_pages:onboarding.welcome.body"),
      },
      {
        key: "entities",
        title: t("_pages:onboarding.entities.title"),
        body: t("_pages:onboarding.entities.body"),
        content: (
          <OnboardingEntitySelection
            selectedEntityKeys={selectedEntityKeys}
            onToggleEntity={handleToggleEntity}
          />
        ),
        beforeNext: handleEntitiesNext,
      },
      {
        key: "get_started",
        title: t("_pages:onboarding.get_started.title"),
        body: t("_pages:onboarding.get_started.body"),
      },
    ],
    [handleEntitiesNext, handleToggleEntity, selectedEntityKeys, t],
  );

  return <WalletOnboarding remountStepOnChange steps={steps} />;
}
