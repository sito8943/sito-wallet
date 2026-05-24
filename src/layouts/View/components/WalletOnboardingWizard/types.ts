import type { UserEntityConfigKey } from "lib";

export type OnboardingSetupStepKey =
  | "currencies"
  | "accounts"
  | "transactions"
  | "subscriptions";

export type WalletOnboardingWizardPropsType = {
  initialEnabledEntityKeys?: UserEntityConfigKey[];
};
