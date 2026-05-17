import { t } from "i18next";

// @sito/dashboard-app
import type {
  FeatureEnabledFn,
  NamedViewPageType,
  SessionAccountDto,
  ViewPageType,
} from "@sito/dashboard-app";

// lib
import type { FeatureFlagKey} from "lib";
import { AppRoutes, isAdminSession } from "lib";

export enum PageId {
  Home = "home",
  Profile = "profile",
  Users = "users",
  Transactions = "transactions",
  TransactionCategories = "transactionCategories",
  Subscriptions = "subscriptions",
  SubscriptionProviders = "subscriptionProviders",
  Accounts = "accounts",
  Currencies = "currencies",
  NotFound = "not-found",
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
    key: PageId.SubscriptionProviders,
    path: AppRoutes.subscriptionProviders,
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
    key: PageId.NotFound,
    path: AppRoutes.notFound,
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
  [PageId.SubscriptionProviders]: "subscriptionsEnabled",
  [PageId.Accounts]: "accountsEnabled",
  [PageId.Currencies]: "currenciesEnabled",
};

const isPageFeatureEnabled = (
  page: ViewPageType<PageId>,
  isFeatureEnabled: FeatureEnabledFn<FeatureFlagKey>,
): boolean => {
  const dependency = pageFeatureDependencies[page.key];
  if (!dependency) return true;

  return isFeatureEnabled(dependency);
};

const isPageAccessible = (
  page: ViewPageType<PageId>,
  account?: SessionAccountDto,
): boolean => {
  if (!page.access) return true;
  return page.access(account);
};

const filterSitemapByFeatures = (
  routes: ViewPageType<PageId>[],
  isFeatureEnabled: FeatureEnabledFn<FeatureFlagKey>,
  account?: SessionAccountDto,
): ViewPageType<PageId>[] => {
  return routes
    .filter(
      (route) =>
        isPageFeatureEnabled(route, isFeatureEnabled) &&
        isPageAccessible(route, account),
    )
    .map((route) => ({
      ...route,
      children: route.children
        ? filterSitemapByFeatures(route.children, isFeatureEnabled, account)
        : undefined,
    }));
};

export const getFeatureFilteredSitemap = (
  isFeatureEnabled: FeatureEnabledFn<FeatureFlagKey>,
  account?: SessionAccountDto,
): ViewPageType<PageId>[] => {
  return filterSitemapByFeatures(sitemap, isFeatureEnabled, account);
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
  let path = "";
  const baseChildren = basePage.children ?? [];
  for (let i = 0; i < baseChildren.length; ++i) {
    const page = baseChildren[i];
    if (page.key === targetPageId) return (path = `${currentPath}${page.path}`);

    if (page.children) {
      path = findPathInChildren(targetPageId, page, currentPath + page.path);
      if (path) return currentPath + page.path;
    }
  }
  return path;
};

/**
 *
 * @param targetPageId target page
 * @returns complete bath
 */
export const findPath = (targetPageId: PageId) => {
  let path = "";
  for (let i = 0; i < sitemap.length; i++) {
    const page = sitemap[i];
    if (page.key === targetPageId) return page.path;
    if (page.children) {
      path = findPathInChildren(
        targetPageId,
        page,
        page.path === "/" ? "" : page.path,
      );
      if (path) {
        break;
      }
    }
  }
  return path;
};

const pathMap: Record<PageId, string> = sitemap.reduce(
  (acc, { key, path }) => {
    acc[key] = path;
    return acc;
  },
  {} as Record<PageId, string>,
);

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
  const result = [];

  for (const route of routes) {
    const fullPath = `${basePath.replace(/\/$/, "")}${route.path}`;

    const name = t(`_pages:pages.${route.key}`);

    result.push({ key: route.key, path: fullPath, name, role: route.role });

    if (route.children)
      result.push(...flattenSitemap(route.children, fullPath));
  }

  return result;
};
