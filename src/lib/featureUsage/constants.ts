/**
 * Catalogue sent to sito-feature-usage: every feature of Sito Wallet, so the
 * ones nobody uses show up. Dotted slugs; only these names are ever sent.
 * Pages are `page.<route key in snake_case>` (see `toPageFeature`).
 */
export const WALLET_FEATURES = [
  "page.sign_in",
  "page.sign_up",
  "page.sign_up_success",
  "page.reset_password",
  "page.update_password",
  "page.recovery",
  "page.confirm_email_success",
  "page.confirm_email_error",
  "page.sign_out",
  "page.onboarding",
  "page.home",
  "page.notifications",
  "page.transactions",
  "page.products",
  "page.purchase_providers",
  "page.transaction_categories",
  "page.subscriptions",
  "page.subscription_new",
  "page.subscription_edit",
  "page.subscription_providers",
  "page.debts",
  "page.debt_new",
  "page.debt_edit",
  "page.accounts",
  "page.currencies",
  "page.profile",
  "page.ai_agents",
  "page.users",
  "page.about",
  "page.cookies_policy",
  "page.privacy_policy",
  "page.terms_and_conditions",
] as const;

/** `AppRoutes` keys that are not screens: layout roots and catch-alls. */
export const NON_FEATURE_ROUTE_KEYS: readonly string[] = [
  "authRoot",
  "authNotFound",
  "notFound",
];
