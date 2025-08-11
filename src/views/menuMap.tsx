// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faCoins,
  faCreditCard,
  faHome,
  faCircleInfo,
  faLayerGroup,
  faRightFromBracket,
  faRightToBracket,
  faCookieBite,
  faShieldHalved,
  faScroll,
} from "@fortawesome/free-solid-svg-icons";

// types
import { MenuItemType } from "./types";

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
    icon: <FontAwesomeIcon icon={faClock} />,
  },
  {
    page: MenuKeys.TransactionCategories,
    path: "/transaction-categories",
    icon: <FontAwesomeIcon icon={faLayerGroup} />,
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
