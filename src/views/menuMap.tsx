// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faCoins,
  faCreditCard,
  faHome,
  faInfo,
  faLayerGroup,
  faRightFromBracket,
  faRightToBracket,
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
  { type: "divider" },
  {
    page: MenuKeys.About,
    path: "/about-us",
    icon: <FontAwesomeIcon icon={faInfo} />,
  },
];
