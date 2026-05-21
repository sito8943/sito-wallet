export type SignUpSuccessLocationState = {
  email: string;
};

export type AuthErrorViewType =
  | "signIn"
  | "signUp"
  | "recovery"
  | "updatePassword"
  | "signUpSuccess";
