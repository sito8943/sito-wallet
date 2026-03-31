import type { AuthDto } from "@sito/dashboard-app";

export type SignInFormType = AuthDto<{
  rememberMe: boolean;
}>;

export type RegisterWithName = {
  name: string;
  email: string;
  password: string;
  rPassword: string;
};
