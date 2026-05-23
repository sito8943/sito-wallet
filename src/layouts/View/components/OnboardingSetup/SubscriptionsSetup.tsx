import { faRepeat } from "@fortawesome/free-solid-svg-icons";

// components
import { OnboardingSetupStep } from "./OnboardingSetupStep";

export function SubscriptionsSetup() {
  return (
    <OnboardingSetupStep
      titleKey="_pages:onboarding.setup.subscriptions.title"
      descriptionKey="_pages:onboarding.setup.subscriptions.description"
      icon={faRepeat}
    />
  );
}
