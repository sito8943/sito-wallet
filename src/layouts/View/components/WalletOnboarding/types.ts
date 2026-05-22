import type { ReactNode } from "react";

export type WalletOnboardingStepType = {
  key: string;
  title: ReactNode;
  body: ReactNode;
  content?: ReactNode;
  beforeNext?: () => Promise<boolean> | boolean;
};

export interface WalletOnboardingPropsType {
  steps: WalletOnboardingStepType[];
  remountStepOnChange?: boolean;
}

export interface WalletOnboardingStepPropsType
  extends WalletOnboardingStepType {
  final?: boolean;
  loading?: boolean;
  onClickNext: () => void;
  onSkip: () => void;
  onStartAsGuest: () => void;
  onSignIn: () => void;
}
