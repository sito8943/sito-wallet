export const AppRoutes = {
  authRoot: "/auth/",
  authNotFound: "/auth/*",
  signIn: "/auth/sign-in",
  signUp: "/auth/sign-up",
  signUpSuccess: "/auth/sign-up-success",
  resetPassword: "/auth/reset-password",
  updatePassword: "/auth/update-password",
  recovery: "/auth/recovery",
  confirmEmailSuccess: "/auth/confirm-email-success",
  confirmEmailError: "/auth/confirm-email-error",
  signOut: "/sign-out",
  home: "/",
  transactions: "/transactions",
  transactionCategories: "/transaction-categories",
  subscriptions: "/subscriptions",
  subscriptionNew: "/subscriptions/new",
  subscriptionEdit: "/subscriptions/:subscriptionId/edit",
  subscriptionProviders: "/subscription-providers",
  accounts: "/accounts",
  currencies: "/currencies",
  profile: "/profile",
  users: "/users",
  about: "/about-us",
  cookiesPolicy: "/cookies-policy",
  privacyPolicy: "/privacy-policy",
  termsAndConditions: "/terms-and-conditions",
  notFound: "*",
} as const;

export const RouteQueryParam = {
  accountId: "accountId",
} as const;

export const AuthRouteQueryParam = {
  error: "error",
  errorDescription: "error_description",
  accessToken: "access_token",
  accessTokenLegacy: "accessToken",
  token: "token",
  tokenHash: "token_hash",
  type: "type",
} as const;

export const AuthRouteQueryParamType = {
  email: "email",
  recovery: "recovery",
} as const;

export const getTransactionsRouteWithAccountId = (
  accountId: number | string,
): string => {
  const search = new URLSearchParams();
  search.set(RouteQueryParam.accountId, String(accountId));
  return `${AppRoutes.transactions}?${search.toString()}`;
};

export const getSubscriptionEditRoute = (
  subscriptionId: number | string,
): string => {
  return AppRoutes.subscriptionEdit.replace(
    ":subscriptionId",
    String(subscriptionId),
  );
};
