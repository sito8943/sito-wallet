import type { QueryParam } from "@sito/dashboard-app";
import { SortOrder } from "@sito/dashboard-app";

import type { NotificationDto } from "lib";

export const NOTIFICATIONS_PAGE_SIZE = 99;

export const DEFAULT_NOTIFICATIONS_QUERY: QueryParam<NotificationDto> = {
  currentPage: 0,
  pageSize: NOTIFICATIONS_PAGE_SIZE,
  sortingBy: "createdAt",
  sortingOrder: SortOrder.DESC,
};
