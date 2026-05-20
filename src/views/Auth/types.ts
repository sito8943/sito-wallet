import type { AuthDto } from "@sito/dashboard-app";

export type SignInFormType = AuthDto<{
  rememberMe: boolean;
}>;

export type SignUpFormType = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type RecoveryFormType = {
  email: string;
};

export type SignUpSuccessLocationState = {
  email: string;
};

export type AuthErrorViewType =
  | "signIn"
  | "signUp"
  | "recovery"
  | "updatePassword"
  | "signUpSuccess";
