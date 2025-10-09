import { t } from "i18next";

// types
import { NamedViewPageType, ViewPageType } from "./types";

export enum PageId {
  Home = "home",
  Transactions = "transactions",
  TransactionCategories = "transactionCategories",
  Accounts = "accounts",
  Currencies = "currencies",
  NotFound = "not-found",
  About = "about",
  CookiesPolicy = "cookies-policy",
  TermsAndConditions = "terms-and-conditions",
  PrivacyPolicy = "privacy-policy",
}

export const sitemap: ViewPageType[] = [
  {
    key: PageId.Home,
    path: "/",
  },
  {
    key: PageId.Transactions,
    path: "/transactions",
  },
  {
    key: PageId.TransactionCategories,
    path: "/transaction-categories",
  },
  {
    key: PageId.Accounts,
    path: "/accounts",
  },
  {
    key: PageId.Currencies,
    path: "/currencies",
  },
  {
    key: PageId.NotFound,
    path: "/*",
  },
  {
    key: PageId.About,
    path: "/about-us",
  },
  { key: PageId.CookiesPolicy, path: "/cookies-policy" },
  { key: PageId.TermsAndConditions, path: "/termns-and-conditions" },
  { key: PageId.PrivacyPolicy, path: "/privacy-policy" },
];

/**
 *
 * @param targetPageId target page
 * @param basePage parent page
 * @param currentPath current path
 * @returns path
 */
export const findPathInChildren = (
  targetPageId: PageId,
  basePage: ViewPageType,
  currentPath = ""
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
        page.path === "/" ? "" : page.path
      );
      if (path) {
        break;
      }
    }
  }
  return path;
};

const pathMap: Record<PageId, string> = sitemap.reduce((acc, { key, path }) => {
  acc[key] = path;
  return acc;
}, {} as Record<PageId, string>);

export const getPathByKey = (key: PageId): string | undefined => pathMap[key];

/**
 *
 * @param routes routes to flat
 * @param basePath base path
 * @returns flatten sitemap
 */
export const flattenSitemap = (
  routes: ViewPageType[],
  basePath = ""
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
