// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoins,
  faCreditCard,
  faHome,
  faCircleInfo,
  faRightFromBracket,
  faRightToBracket,
  faCookieBite,
  faShieldHalved,
  faScroll,
  faTags,
  faFileInvoice,
  faUser,
  faRepeat,
} from "@fortawesome/free-solid-svg-icons";

// types
import type { MenuItemType, IsFeatureEnabled } from "./types";
import { AppRoutes } from "../lib/routes";
import type { FeatureFlagKey } from "../lib/api/featureFlags/types";

export enum MenuKeys {
  Home = "home",
  Transactions = "transactions",
  TransactionCategories = "transactionCategories",
  Subscriptions = "subscriptions",
  Accounts = "accounts",
  Currencies = "currencies",
  Products = "products",
  Movements = "movements",
  SignOut = "signOut",
  SignIn = "auth.signIn",
  Profile = "profile",
  About = "about",
  CookiesPolicy = "cookiesPolicy",
  TermsAndConditions = "termsAndConditions",
  PrivacyPolicy = "privacyPolicy",
}

export const menuMap: MenuItemType[] = [
  {
    page: MenuKeys.Home,
    path: AppRoutes.home,
    icon: <FontAwesomeIcon icon={faHome} />,
  },
  {
    page: MenuKeys.Transactions,
    path: AppRoutes.transactions,
    icon: <FontAwesomeIcon icon={faFileInvoice} />,
  },
  {
    page: MenuKeys.TransactionCategories,
    path: AppRoutes.transactionCategories,
    icon: <FontAwesomeIcon icon={faTags} />,
  },
  {
    page: MenuKeys.Subscriptions,
    path: AppRoutes.subscriptions,
    icon: <FontAwesomeIcon icon={faRepeat} />,
  },
  {
    page: MenuKeys.Accounts,
    path: AppRoutes.accounts,
    icon: <FontAwesomeIcon icon={faCreditCard} />,
  },
  {
    page: MenuKeys.Currencies,
    path: AppRoutes.currencies,
    icon: <FontAwesomeIcon icon={faCoins} />,
  },
  { type: "divider" },
  {
    page: MenuKeys.About,
    path: AppRoutes.about,
    icon: <FontAwesomeIcon icon={faCircleInfo} />,
  },
  {
    page: MenuKeys.TermsAndConditions,
    path: AppRoutes.termsAndConditions,
    icon: <FontAwesomeIcon icon={faScroll} />,
  },
  {
    page: MenuKeys.CookiesPolicy,
    path: AppRoutes.cookiesPolicy,
    icon: <FontAwesomeIcon icon={faCookieBite} />,
  },
  {
    page: MenuKeys.PrivacyPolicy,
    path: AppRoutes.privacyPolicy,
    icon: <FontAwesomeIcon icon={faShieldHalved} />,
  },
  { type: "divider" },
  {
    page: MenuKeys.Profile,
    path: AppRoutes.profile,
    auth: true,
    icon: <FontAwesomeIcon icon={faUser} />,
  },
  {
    page: MenuKeys.SignOut,
    path: AppRoutes.signOut,
    auth: true,
    icon: <FontAwesomeIcon icon={faRightFromBracket} />,
  },
  {
    page: MenuKeys.SignIn,
    path: AppRoutes.signIn,
    auth: false,
    icon: <FontAwesomeIcon icon={faRightToBracket} />,
  },
];

const menuFeatureDependencies: Partial<Record<MenuKeys, FeatureFlagKey>> = {
  [MenuKeys.Transactions]: "transactionsEnabled",
  [MenuKeys.TransactionCategories]: "transactionCategoriesEnabled",
  [MenuKeys.Subscriptions]: "subscriptionsEnabled",
  [MenuKeys.Accounts]: "accountsEnabled",
  [MenuKeys.Currencies]: "currenciesEnabled",
};

export const getFeatureFilteredMenuMap = (
  isFeatureEnabled: IsFeatureEnabled,
): MenuItemType[] => {
  const filtered = menuMap.filter((item) => {
    if (!item.page) return true;

    const dependency = menuFeatureDependencies[item.page];
    if (!dependency) return true;

    return isFeatureEnabled(dependency);
  });

  return filtered.filter((item, index, items) => {
    if (item.type !== "divider") return true;

    const previous = items[index - 1];
    const next = items[index + 1];

    if (!previous || !next) return false;

    return previous.type !== "divider" && next.type !== "divider";
  });
};
