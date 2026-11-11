import type { TransactionProductDto } from "lib";

import type { TransactionProductPriceLineType } from "./types";

/** Lines of `productId` with their total (quantity × unit price). */
export const getProductPriceLines = (
  products: TransactionProductDto[] | undefined,
  productId: number,
): TransactionProductPriceLineType[] =>
  (products ?? [])
    .filter((line) => line.product?.id === productId)
    .map((line) => {
      const quantity = Number(line.quantity) || 0;
      const unitPrice = Number(line.unitPrice) || 0;

      return {
        id: line.id,
        quantity,
        unitPrice,
        total: Math.round(quantity * unitPrice * 100) / 100,
      };
    });

export const formatQuantity = (value: number, language: string) =>
  new Intl.NumberFormat(language, { maximumFractionDigits: 3 }).format(value);
