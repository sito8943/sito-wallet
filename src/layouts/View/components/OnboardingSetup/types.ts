import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export type OnboardingSetupStepKey =
  | "currencies"
  | "accounts"
  | "transactions"
  | "subscriptions";

export interface OnboardingSetupPropsType {
  stepKey: OnboardingSetupStepKey;
}

export interface OnboardingSetupStepPropsType {
  titleKey: string;
  descriptionKey: string;
  icon: IconDefinition;
}
