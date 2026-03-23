import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faFileInvoice,
  faCreditCard,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

// types
import type { BottomNavItemType } from "./types";

export const bottomMap: BottomNavItemType[] = [
  {
    page: "home",
    path: "/",
    icon: <FontAwesomeIcon icon={faHome} />,
    position: "left",
  },
  {
    page: "transactions",
    path: "/transactions",
    icon: <FontAwesomeIcon icon={faFileInvoice} />,
    position: "left",
  },
  {
    page: "accounts",
    path: "/accounts",
    icon: <FontAwesomeIcon icon={faCreditCard} />,
    position: "right",
  },
  {
    page: "profile",
    path: "/profile",
    icon: <FontAwesomeIcon icon={faUser} />,
    position: "right",
  },
];
