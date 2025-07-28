// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

// types
import { MenuItemType } from "./types";

export enum MenuKeys {
  Home = "home",
  Wallets = "wallets",
  Products = "products",
  Movements = "movements",
}

export const menuMap: MenuItemType[] = [
  {
    page: MenuKeys.Home,
    path: "/",
    icon: <FontAwesomeIcon icon={faHome} />,
  },
  {
    page: MenuKeys.Wallets,
    path: "/wallets",
    icon: <FontAwesomeIcon icon={faHome} />,
  },
];
