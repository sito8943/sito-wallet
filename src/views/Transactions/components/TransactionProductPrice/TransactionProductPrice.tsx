import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { formatTransactionAmount } from "../../utils";

import type { TransactionProductPricePropsType } from "./types";
import { formatQuantity, getProductPriceLines } from "./utils";

import "./styles.css";

/** Unit price and line total of one product inside a transaction. */
export function TransactionProductPrice(
  props: TransactionProductPricePropsType,
) {
  const { products, productId, currency } = props;
  const { t, i18n } = useTranslation();

  const lines = useMemo(
    () => getProductPriceLines(products, productId),
    [products, productId],
  );

  if (!lines.length) return null;

  const symbol = currency?.symbol ?? "";

  return (
    <ul className="transaction-product-price">
      {lines.map((line) => (
        <li key={line.id}>
          {t("_pages:transactions.catalogHistory.productPrice", {
            unitPrice:
              `${formatTransactionAmount(line.unitPrice, i18n.language)} ${symbol}`.trim(),
            quantity: formatQuantity(line.quantity, i18n.language),
            total:
              `${formatTransactionAmount(line.total, i18n.language)} ${symbol}`.trim(),
          })}
        </li>
      ))}
    </ul>
  );
}
