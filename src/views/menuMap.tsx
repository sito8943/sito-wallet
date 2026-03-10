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
} from "@fortawesome/free-solid-svg-icons";

// types
import type { MenuItemType, IsFeatureEnabled } from "./types";
import type { FeatureFlagKey } from "lib";

export enum MenuKeys {
  Home = "home",
  Transactions = "transactions",
  TransactionCategories = "transactionCategories",
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
    path: "/",
    icon: <FontAwesomeIcon icon={faHome} />,
  },
  {
    page: MenuKeys.Transactions,
    path: "/transactions",
    icon: <FontAwesomeIcon icon={faFileInvoice} />,
  },
  {
    page: MenuKeys.TransactionCategories,
    path: "/transaction-categories",
    icon: <FontAwesomeIcon icon={faTags} />,
  },
  {
    page: MenuKeys.Accounts,
    path: "/accounts",
    icon: <FontAwesomeIcon icon={faCreditCard} />,
  },
  {
    page: MenuKeys.Currencies,
    path: "/currencies",
    icon: <FontAwesomeIcon icon={faCoins} />,
  },
  { type: "divider" },
  {
    page: MenuKeys.About,
    path: "/about-us",
    icon: <FontAwesomeIcon icon={faCircleInfo} />,
  },
  {
    page: MenuKeys.TermsAndConditions,
    path: "/terms-and-conditions",
    icon: <FontAwesomeIcon icon={faScroll} />,
  },
  {
    page: MenuKeys.CookiesPolicy,
    path: "/cookies-policy",
    icon: <FontAwesomeIcon icon={faCookieBite} />,
  },
  {
    page: MenuKeys.PrivacyPolicy,
    path: "/privacy-policy",
    icon: <FontAwesomeIcon icon={faShieldHalved} />,
  },
  { type: "divider" },
  {
    page: MenuKeys.Profile,
    path: "/profile",
    auth: true,
    icon: <FontAwesomeIcon icon={faUser} />,
  },
  {
    page: MenuKeys.SignOut,
    path: "/sign-out",
    auth: true,
    icon: <FontAwesomeIcon icon={faRightFromBracket} />,
  },
  {
    page: MenuKeys.SignIn,
    path: "/auth/sign-in",
    auth: false,
    icon: <FontAwesomeIcon icon={faRightToBracket} />,
  },
];

const menuFeatureDependencies: Partial<Record<MenuKeys, FeatureFlagKey>> = {
  [MenuKeys.Transactions]: "transactionsEnabled",
  [MenuKeys.TransactionCategories]: "transactionCategoriesEnabled",
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
