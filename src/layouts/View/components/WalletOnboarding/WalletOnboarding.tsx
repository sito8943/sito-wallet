import { useCallback, useEffect, useMemo, useState } from "react";

import { TabsLayout, useAuth, useConfig } from "@sito/dashboard-app";

import { AppRoutes } from "lib";

import { WalletOnboardingStep } from "./WalletOnboardingStep";
import type { WalletOnboardingPropsType } from "./types";

import "./styles.css";

export function WalletOnboarding(props: WalletOnboardingPropsType) {
  const { steps, remountStepOnChange = false } = props;

  const { setGuestMode } = useAuth();
  const { navigate } = useConfig();
  const [currentStep, setCurrentStep] = useState(1);
  const [loadingStepKey, setLoadingStepKey] = useState<string | null>(null);

  useEffect(() => {
    setCurrentStep((previous) => Math.min(previous, steps.length));
  }, [steps.length]);

  const handleSkip = useCallback(() => {
    navigate(AppRoutes.signIn);
  }, [navigate]);

  const handleSignIn = useCallback(() => {
    navigate(AppRoutes.signIn);
  }, [navigate]);

  const handleStartAsGuest = useCallback(() => {
    setGuestMode(true);
    navigate(AppRoutes.home);
  }, [navigate, setGuestMode]);

  const handleNext = useCallback(
    async (stepIndex: number) => {
      const step = steps[stepIndex];
      if (!step) return;

      setLoadingStepKey(step.key);

      try {
        const canContinue = step.beforeNext ? await step.beforeNext() : true;

        if (!canContinue) return;

        setCurrentStep((previous) => Math.min(previous + 1, steps.length));
      } catch {
        return;
      } finally {
        setLoadingStepKey(null);
      }
    },
    [steps],
  );

  const tabs = useMemo(
    () =>
      steps.map((step, index) => {
        const id = index + 1;

        return {
          id,
          label: "",
          content: (
            <WalletOnboardingStep
              {...step}
              key={remountStepOnChange ? `${step.key}-${id}` : step.key}
              final={index === steps.length - 1}
              loading={loadingStepKey === step.key}
              onClickNext={() => {
                void handleNext(index);
              }}
              onSkip={handleSkip}
              onStartAsGuest={handleStartAsGuest}
              onSignIn={handleSignIn}
            />
          ),
        };
      }),
    [
      handleNext,
      handleSignIn,
      handleSkip,
      handleStartAsGuest,
      loadingStepKey,
      remountStepOnChange,
      steps,
    ],
  );

  return (
    <div className="onboarding-main wallet-onboarding-main">
      <TabsLayout
        currentTab={currentStep}
        onTabChange={(id) => setCurrentStep(Number(id))}
        tabs={tabs}
        useLinks={false}
        className="onboarding-tab-main"
        tabsContainerClassName="onboarding-tab-container"
      />
    </div>
  );
}
