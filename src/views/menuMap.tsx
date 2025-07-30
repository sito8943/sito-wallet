// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

// types
import { MenuItemType } from "./types";

export enum MenuKeys {
  Home = "home",
  Transactions = "transactions",
  Accounts = "accounts",
  Currencies = "currencies",
  Products = "products",
  Movements = "movements",
  SignOut = "signOut",
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
    icon: <FontAwesomeIcon icon={faHome} />,
  },
  {
    page: MenuKeys.Accounts,
    path: "/accounts",
    icon: <FontAwesomeIcon icon={faHome} />,
  },
  {
    page: MenuKeys.Currencies,
    path: "/currencies",
    icon: <FontAwesomeIcon icon={faHome} />,
  },
  {
    page: MenuKeys.SignOut,
    path: "/sign-out",
    icon: <FontAwesomeIcon icon={faHome} />,
  },
];
