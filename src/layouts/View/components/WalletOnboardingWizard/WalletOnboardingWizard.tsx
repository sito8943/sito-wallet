import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAuth, useNotification } from "@sito/dashboard-app";

// providers
import { useFeatureFlags, useManager, useOnboardingDraft } from "providers";

import {
  OnboardingEntitySelection,
  entityKeysToConfigs,
  resolveRequiredEntityKeys,
  toggleSelectedEntityKey,
} from "../OnboardingEntitySelection";
import { OnboardingSetup } from "../OnboardingSetup";
import { WalletOnboarding } from "../WalletOnboarding";
import type { WalletOnboardingStepType } from "../WalletOnboarding";

// lib
import {
  USER_ENTITY_CONFIG_KEYS,
  userEntityConfigsToFeaturePayload,
  type UserEntityConfigKey,
} from "lib";

// types
import type { WalletOnboardingWizardPropsType } from "./types";

// constants
import { ENTITY_STEP_ORDER } from "./constants";

export function WalletOnboardingWizard(props: WalletOnboardingWizardPropsType) {
  const { initialEnabledEntityKeys } = props;
  const { t } = useTranslation();
  const { account } = useAuth();
  const { showErrorNotification } = useNotification();
  const manager = useManager();
  const { applyFeaturePayload } = useFeatureFlags();
  const { isAnonymous, setSelectedEntityKeys: setDraftSelectedEntityKeys } =
    useOnboardingDraft();

  const [selectedEntityKeys, setSelectedEntityKeys] = useState<
    UserEntityConfigKey[]
  >(() => initialEnabledEntityKeys ?? [...USER_ENTITY_CONFIG_KEYS]);
  const [confirmedEntityKeys, setConfirmedEntityKeys] = useState<
    UserEntityConfigKey[]
  >(() => initialEnabledEntityKeys ?? [...USER_ENTITY_CONFIG_KEYS]);

  const handleToggleEntity = useCallback(
    (entityKey: UserEntityConfigKey) => {
      setSelectedEntityKeys((previous) =>
        toggleSelectedEntityKey(previous, entityKey),
      );
    },
    [setSelectedEntityKeys],
  );

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
    } else if (isAnonymous) {
      setDraftSelectedEntityKeys(resolvedEntityKeys);
    }

    setConfirmedEntityKeys(resolvedEntityKeys);
    applyFeaturePayload(userEntityConfigsToFeaturePayload(configs));
    return true;
  }, [
    account?.id,
    applyFeaturePayload,
    isAnonymous,
    manager.UserEntityConfigs,
    selectedEntityKeys,
    setDraftSelectedEntityKeys,
    showErrorNotification,
    t,
  ]);

  const entitySteps = useMemo<WalletOnboardingStepType[]>(
    () =>
      ENTITY_STEP_ORDER.filter(({ entityKey }) =>
        confirmedEntityKeys.includes(entityKey),
      ).map(({ stepKey, titleKey, bodyKey }) => ({
        key: `entity_${stepKey}`,
        title: t(titleKey),
        body: t(bodyKey),
        content: <OnboardingSetup stepKey={stepKey} />,
      })),
    [confirmedEntityKeys, t],
  );

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
      ...entitySteps,
      {
        key: "get_started",
        title: t("_pages:onboarding.get_started.title"),
        body: t("_pages:onboarding.get_started.body"),
      },
    ],
    [
      entitySteps,
      handleEntitiesNext,
      handleToggleEntity,
      selectedEntityKeys,
      t,
    ],
  );

  return <WalletOnboarding remountStepOnChange steps={steps} />;
}
