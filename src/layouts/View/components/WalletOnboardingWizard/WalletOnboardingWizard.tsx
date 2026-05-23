import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Onboarding } from "@sito/dashboard-app";
import type { OnboardingStepType } from "@sito/dashboard-app";

// lib
import { AppRoutes, USER_ENTITY_CONFIG_KEYS } from "lib";

// types
import type { WalletOnboardingWizardPropsType } from "./types";

// constants
import { ENTITY_STEP_ORDER } from "./constants";

export function WalletOnboardingWizard(props: WalletOnboardingWizardPropsType) {
  const { initialEnabledEntityKeys } = props;
  const { t } = useTranslation();

  const enabledEntityKeys = useMemo(
    () => initialEnabledEntityKeys ?? [...USER_ENTITY_CONFIG_KEYS],
    [initialEnabledEntityKeys],
  );

  const entitySteps = useMemo<OnboardingStepType[]>(
    () =>
      ENTITY_STEP_ORDER.filter(({ entityKey }) =>
        enabledEntityKeys.includes(entityKey),
      ).map(({ titleKey, bodyKey }) => ({
        title: t(titleKey),
        body: t(bodyKey),
      })),
    [enabledEntityKeys, t],
  );

  const steps = useMemo<OnboardingStepType[]>(
    () => [
      {
        title: t("_pages:onboarding.welcome.title"),
        body: t("_pages:onboarding.welcome.body"),
      },
      ...entitySteps,
      {
        title: t("_pages:onboarding.get_started.title"),
        body: t("_pages:onboarding.get_started.body"),
      },
    ],
    [entitySteps, t],
  );

  return (
    <Onboarding
      remountStepOnChange
      steps={steps}
      signInPath={AppRoutes.signIn}
      guestPath={AppRoutes.home}
    />
  );
}
