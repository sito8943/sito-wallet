import { faCoins } from "@fortawesome/free-solid-svg-icons";

// components
import { OnboardingSetupStep } from "./OnboardingSetupStep";

export function CurrenciesSetup() {
  return (
    <OnboardingSetupStep
      titleKey="_pages:onboarding.setup.currencies.title"
      descriptionKey="_pages:onboarding.setup.currencies.description"
      icon={faCoins}
    />
  );
}
