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
