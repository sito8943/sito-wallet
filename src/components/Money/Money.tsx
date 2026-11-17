import { useTranslation } from "react-i18next";

import { formatAmount } from "lib";

import { Currency } from "../Currency";

import { MONEY_LOADING_PLACEHOLDER } from "./constants";
import type { MoneyPropsType } from "./types";

/**
 * Amount in the app language followed by the currency symbol (name as
 * tooltip): "1.234,50 €". Renders inline so callers keep their own wrapper,
 * sign prefix and colors.
 */
export const Money = (props: MoneyPropsType) => {
  const { amount, currency, options, loading = false } = props;
  const { i18n } = useTranslation();

  return (
    <>
      {loading
        ? MONEY_LOADING_PLACEHOLDER
        : formatAmount(amount, i18n.language, options)}{" "}
      <Currency name={currency?.name} symbol={currency?.symbol} />
    </>
  );
};
