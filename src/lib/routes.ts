export const AppRoutes = {
  authRoot: "/auth/",
  authNotFound: "/auth/*",
  signIn: "/auth/sign-in",
  signUp: "/auth/sign-up",
  updatePassword: "/auth/update-password",
  recovery: "/auth/recovery",
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
  about: "/about-us",
  cookiesPolicy: "/cookies-policy",
  privacyPolicy: "/privacy-policy",
  termsAndConditions: "/terms-and-conditions",
  notFound: "*",
} as const;

export const RouteQueryParam = {
  accountId: "accountId",
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
