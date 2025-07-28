// types
import { ViewPageType } from "./types.js";

export enum PageId {
  Home = "home",
  Accounts = "accounts",
  NotFound = "not-found",
}

export const sitemap: ViewPageType[] = [
  {
    key: PageId.Home,
    path: "/",
  },
  {
    key: PageId.Accounts,
    path: "/accounts",
  },
  {
    key: PageId.NotFound,
    path: "/*",
  },
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
