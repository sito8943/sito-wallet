import { faTags } from "@fortawesome/free-solid-svg-icons";

// components
import { OnboardingSetupStep } from "./OnboardingSetupStep";

export function TransactionsSetup() {
  return (
    <OnboardingSetupStep
      titleKey="_pages:onboarding.setup.transactions.title"
      descriptionKey="_pages:onboarding.setup.transactions.description"
      icon={faTags}
    />
  );
}
