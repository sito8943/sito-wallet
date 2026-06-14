// Known bank brands shown on Card-type accounts. Values are brand literals
// (not translated). Mirrors SitoWallet native's ACCOUNT_BANK_NAME.
export const ACCOUNT_BANK_NAME = {
  IMAGIN: "Imagin",
  CAIXA: "Caixa",
  REVOLUT: "Revolut",
  BANDEC: "Bandec",
  BPA: "BPA",
  BANCO_METROPOLITANO: "Banco Metropolitano",
} as const;

export type AccountBankName =
  (typeof ACCOUNT_BANK_NAME)[keyof typeof ACCOUNT_BANK_NAME];

// Selector options ({ id, label }) derived from the brand list.
export const ACCOUNT_BANK_OPTIONS = Object.values(ACCOUNT_BANK_NAME).map(
  (bankName, index) => ({
    id: index + 1,
    label: bankName,
  }),
);
