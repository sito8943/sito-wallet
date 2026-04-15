import {
  faHome,
  faFileInvoice,
  faCreditCard,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

// types
import type { BottomNavItemType } from "./types";
import { PageId } from "./sitemap";
import { AppRoutes } from "lib";

export const bottomMap: BottomNavItemType[] = [
  {
    id: "home",
    page: PageId.Home,
    to: AppRoutes.home,
    icon: faHome,
    position: "left",
  },
  {
    id: "transactions",
    page: PageId.Transactions,
    to: AppRoutes.transactions,
    icon: faFileInvoice,
    position: "left",
  },
  {
    id: "accounts",
    page: PageId.Accounts,
    to: AppRoutes.accounts,
    icon: faCreditCard,
    position: "right",
  },
  {
    id: "profile",
    page: PageId.Profile,
    to: AppRoutes.profile,
    icon: faUser,
    position: "right",
  },
];
