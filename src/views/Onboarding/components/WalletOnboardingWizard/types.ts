import type { UserEntityConfigKey } from "lib";

export type OnboardingSetupStepKey =
  | "currencies"
  | "accounts"
  | "transactions"
  | "subscriptions";

export type WalletOnboardingWizardPropsType = {
  initialEnabledEntityKeys?: UserEntityConfigKey[];
  showDebtsStep?: boolean;
  /**
   * Called when the user leaves the wizard through any terminal action
   * (skip / sign-in / start-as-guest). The page uses it to mark onboarding as
   * seen and navigate to sign-in.
   */
  onExit: () => void;
};
