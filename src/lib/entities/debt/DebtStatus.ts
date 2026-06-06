export enum DebtStatus {
  Open = 0,
  PartiallyPaid = 1,
  Paid = 2,
  Cancelled = 3,
}

export const DEBT_STATUSES: DebtStatus[] = [
  DebtStatus.Open,
  DebtStatus.PartiallyPaid,
  DebtStatus.Paid,
  DebtStatus.Cancelled,
];

/**
 * Maps the numeric enum to the backend/i18n string name.
 */
export const DEBT_STATUS_NAME: Record<DebtStatus, string> = {
  [DebtStatus.Open]: "OPEN",
  [DebtStatus.PartiallyPaid]: "PARTIALLY_PAID",
  [DebtStatus.Paid]: "PAID",
  [DebtStatus.Cancelled]: "CANCELLED",
};
