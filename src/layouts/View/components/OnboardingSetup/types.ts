export type OnboardingSetupStepKey =
  | "currencies"
  | "accounts"
  | "transactions"
  | "subscriptions";

export interface OnboardingSetupPropsType {
  stepKey: OnboardingSetupStepKey;
}
