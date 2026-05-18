import type { ReactNode } from "react";

export interface WalletOnboardingStepType {
  title: ReactNode;
  body: ReactNode;
  content?: ReactNode;
  image?: string;
  alt?: string;
}

export interface WalletOnboardingStepPropsType
  extends WalletOnboardingStepType {
  final?: boolean;
  onClickNext: () => void;
  onSkip: () => void;
  onStartAsGuest: () => void;
  onSignIn: () => void;
}

export interface WalletOnboardingPropsType {
  steps: WalletOnboardingStepType[];
  signInPath?: string;
  guestPath?: string;
  onSkip?: () => void;
  onSignIn?: () => void;
  onStartAsGuest?: () => void;
}
