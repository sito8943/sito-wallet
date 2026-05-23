import { faWallet } from "@fortawesome/free-solid-svg-icons";

// components
import { OnboardingSetupStep } from "./OnboardingSetupStep";

export function AccountsSetup() {
  return (
    <OnboardingSetupStep
      titleKey="_pages:onboarding.setup.accounts.title"
      descriptionKey="_pages:onboarding.setup.accounts.description"
      icon={faWallet}
    />
  );
}
