import type { AuthDto } from "@sito/dashboard-app";

export type SignInFormType = AuthDto<{
  rememberMe: boolean;
}>;

export type SignUpFormType = {
  email: string;
  password: string;
  rPassword: string;
};

export type RecoveryFormType = {
  email: string;
};

export type UpdatePasswordFormType = {
  password: string;
  rPassword: string;
};

export type SignUpSuccessLocationState = {
  email: string;
};
