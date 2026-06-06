export enum DebtDirection {
  Receivable = 0,
  Payable = 1,
}

export const DEBT_DIRECTIONS: DebtDirection[] = [
  DebtDirection.Receivable,
  DebtDirection.Payable,
];

/**
 * Maps the numeric enum to the backend/i18n string name.
 */
export const DEBT_DIRECTION_NAME: Record<DebtDirection, string> = {
  [DebtDirection.Receivable]: "RECEIVABLE",
  [DebtDirection.Payable]: "PAYABLE",
};
