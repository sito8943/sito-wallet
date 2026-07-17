import { SortOrder } from "@sito/dashboard-app";

import { DebtDirection, DebtStatus } from "lib";

export const DEFAULT_DEBT_DIRECTION: DebtDirection = DebtDirection.Receivable;
export const DEFAULT_DEBT_FILTER_SORTING_BY = "id";
export const DEFAULT_DEBT_FILTER_SORTING_ORDER = SortOrder.DESC;

export const DEBT_STATUS_BADGE_CLASSNAME: Record<DebtStatus, string> = {
  [DebtStatus.Open]: "bg-bg-info text-info",
  [DebtStatus.PartiallyPaid]: "bg-bg-warning text-warning",
  [DebtStatus.Paid]: "success",
  [DebtStatus.Cancelled]: "error",
};
