import type { CommonCurrencyDto, TransactionProductDto } from "lib";

export type TransactionProductPricePropsType = {
  /** Lines of the transaction. */
  products?: TransactionProductDto[];
  /** Product whose price is shown. */
  productId: number;
  currency?: CommonCurrencyDto | null;
};

export type TransactionProductPriceLineType = {
  id: number;
  quantity: number;
  unitPrice: number;
  total: number;
};
