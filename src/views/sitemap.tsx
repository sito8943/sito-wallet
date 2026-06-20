import { t } from "i18next";

// @sito/dashboard-app
import type {
  FeatureEnabledFn,
  NamedViewPageType,
  SessionAccountDto,
  ViewPageType,
} from "@sito/dashboard-app";
import {
  createPathMap,
  filterSitemap,
  findPathInSitemap,
  flattenSitemap as flattenSitemapBase,
} from "@sito/dashboard-app";

// lib
import type { FeatureFlagKey } from "lib";
import { AppRoutes, isAdminSession } from "lib";

export enum PageId {
  Home = "home",
  Profile = "profile",
  Notifications = "notifications",
  Users = "users",
  Transactions = "transactions",
  TransactionCategories = "transactionCategories",
  Subscriptions = "subscriptions",
  SubscriptionNew = "subscriptionNew",
  SubscriptionProviders = "subscriptionProviders",
  Debts = "debts",
  DebtNew = "debtNew",
  Accounts = "accounts",
  Currencies = "currencies",
  About = "about",
  CookiesPolicy = "cookies-policy",
  TermsAndConditions = "terms-and-conditions",
  PrivacyPolicy = "privacy-policy",
}

export const sitemap: ViewPageType<PageId>[] = [
  {
    key: PageId.Home,
    path: AppRoutes.home,
  },
  {
    key: PageId.Profile,
    path: AppRoutes.profile,
  },
  {
    key: PageId.Notifications,
    path: AppRoutes.notifications,
    access: (account) => Boolean(account?.id),
  },
  {
    key: PageId.Users,
    path: AppRoutes.users,
    access: (account) => isAdminSession(account),
  },
  {
    key: PageId.Transactions,
    path: AppRoutes.transactions,
  },
  {
    key: PageId.TransactionCategories,
    path: AppRoutes.transactionCategories,
  },
  {
    key: PageId.Subscriptions,
    path: AppRoutes.subscriptions,
  },
  {
    key: PageId.SubscriptionNew,
    path: AppRoutes.subscriptionNew,
  },
  {
    key: PageId.SubscriptionProviders,
    path: AppRoutes.subscriptionProviders,
  },
  {
    key: PageId.Debts,
    path: AppRoutes.debts,
  },
  {
    key: PageId.DebtNew,
    path: AppRoutes.debtNew,
  },
  {
    key: PageId.Accounts,
    path: AppRoutes.accounts,
  },
  {
    key: PageId.Currencies,
    path: AppRoutes.currencies,
  },
  {
    key: PageId.About,
    path: AppRoutes.about,
  },
  { key: PageId.CookiesPolicy, path: AppRoutes.cookiesPolicy },
  { key: PageId.TermsAndConditions, path: AppRoutes.termsAndConditions },
  { key: PageId.PrivacyPolicy, path: AppRoutes.privacyPolicy },
];

const pageFeatureDependencies: Partial<Record<PageId, FeatureFlagKey>> = {
  [PageId.Transactions]: "transactionsEnabled",
  [PageId.TransactionCategories]: "transactionCategoriesEnabled",
  [PageId.Subscriptions]: "subscriptionsEnabled",
  [PageId.SubscriptionNew]: "subscriptionsEnabled",
  [PageId.SubscriptionProviders]: "subscriptionsEnabled",
  [PageId.Debts]: "debtsEnabled",
  [PageId.DebtNew]: "debtsEnabled",
  [PageId.Accounts]: "accountsEnabled",
  [PageId.Currencies]: "currenciesEnabled",
};

export const getFeatureFilteredSitemap = (
  isFeatureEnabled: FeatureEnabledFn<FeatureFlagKey>,
  account?: SessionAccountDto,
): ViewPageType<PageId>[] => {
  return filterSitemap(
    sitemap,
    isFeatureEnabled,
    pageFeatureDependencies,
    account,
  );
};

/**
 *
 * @param targetPageId target page
 * @param basePage parent page
 * @param currentPath current path
 * @returns path
 */
export const findPathInChildren = (
  targetPageId: PageId,
  basePage: ViewPageType<PageId>,
  currentPath = "",
) => {
  return (
    findPathInSitemap(basePage.children ?? [], targetPageId, currentPath) ?? ""
  );
};

/**
 *
 * @param targetPageId target page
 * @returns complete bath
 */
export const findPath = (targetPageId: PageId) => {
  return findPathInSitemap(sitemap, targetPageId) ?? "";
};

const pathMap = createPathMap(sitemap);

export const getPathByKey = (key: PageId): string | undefined => pathMap[key];

/**
 *
 * @param routes routes to flat
 * @param basePath base path
 * @returns flatten sitemap
 */
export const flattenSitemap = (
  routes: ViewPageType<PageId>[],
  basePath = "",
): NamedViewPageType[] => {
  return flattenSitemapBase(
    routes,
    (route) => t(`_pages:pages.${route.key}`),
    basePath,
  );
};
