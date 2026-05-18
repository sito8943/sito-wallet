import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TabsLayout, useAuth } from "@sito/dashboard-app";

import { AppRoutes } from "lib";

import { WalletOnboardingStep } from "./WalletOnboardingStep";

import type { WalletOnboardingPropsType } from "./types";

export function WalletOnboarding(props: WalletOnboardingPropsType) {
  const {
    steps,
    signInPath = AppRoutes.signIn,
    guestPath = AppRoutes.home,
    onSkip,
    onSignIn,
    onStartAsGuest,
  } = props;
  const navigate = useNavigate();
  const { setGuestMode } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);

  const handleSkip = useCallback(() => {
    if (onSkip) {
      onSkip();
      return;
    }

    navigate(signInPath);
  }, [navigate, onSkip, signInPath]);

  const handleSignIn = useCallback(() => {
    if (onSignIn) {
      onSignIn();
      return;
    }

    navigate(signInPath);
  }, [navigate, onSignIn, signInPath]);

  const handleStartAsGuest = useCallback(() => {
    if (onStartAsGuest) {
      onStartAsGuest();
      return;
    }

    setGuestMode(true);
    navigate(guestPath);
  }, [guestPath, navigate, onStartAsGuest, setGuestMode]);

  const onboardingTabs = useMemo(
    () =>
      steps.map((step, index) => {
        const stepId = index + 1;

        return {
          id: stepId,
          label: "",
          content: (
            <WalletOnboardingStep
              key={stepId}
              {...step}
              final={stepId === steps.length}
              onClickNext={() => setCurrentStep((prev) => prev + 1)}
              onSkip={handleSkip}
              onStartAsGuest={handleStartAsGuest}
              onSignIn={handleSignIn}
            />
          ),
        };
      }),
    [handleSignIn, handleSkip, handleStartAsGuest, steps],
  );

  return (
    <div className="onboarding-main">
      <TabsLayout
        currentTab={currentStep}
        onTabChange={(id) => setCurrentStep(Number(id))}
        tabs={onboardingTabs}
        useLinks={false}
      />
    </div>
  );
}
