import {
  faHome,
  faFileInvoice,
  faCreditCard,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

// types
import type { BottomNavItemType } from "./types";
import { PageId } from "./sitemap";

export const bottomMap: BottomNavItemType[] = [
  {
    id: "home",
    page: PageId.Home,
    to: "/",
    icon: faHome,
    position: "left",
  },
  {
    id: "transactions",
    page: PageId.Transactions,
    to: "/transactions",
    icon: faFileInvoice,
    position: "left",
  },
  {
    id: "accounts",
    page: PageId.Accounts,
    to: "/accounts",
    icon: faCreditCard,
    position: "right",
  },
  {
    id: "profile",
    page: PageId.Profile,
    to: "/profile",
    icon: faUser,
    position: "right",
  },
];
