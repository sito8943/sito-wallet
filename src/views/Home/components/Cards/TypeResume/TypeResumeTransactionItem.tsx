import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useTimeAge } from "@sito/dashboard-app";

import { Currency } from "../../../../Currencies";

import type { TypeResumeTransactionItemPropsType } from "./types";

export const TypeResumeTransactionItem = (
  props: TypeResumeTransactionItemPropsType,
) => {
  const { transaction, currencyName, currencySymbol } = props;
  const { t } = useTranslation();
  const { timeAge } = useTimeAge();

  const parsedDescription = useMemo(() => {
    if (!transaction.description?.length) {
      return t("_entities:base.description.empty");
    }

    if (transaction.auto) {
      return t("_entities:transactionCategory.description.init");
    }

    return transaction.description;
  }, [t, transaction.auto, transaction.description]);

  const dateLabel = useMemo(() => {
    if (!transaction.date) return "";

    const parsedDate = new Date(transaction.date);
    if (Number.isNaN(parsedDate.getTime())) return transaction.date;

    return timeAge(parsedDate);
  }, [timeAge, transaction.date]);

  return (
    <li className="type-resume-transaction-item base-border">
      <div className="type-resume-transaction-copy">
        <p className="type-resume-transaction-description">
          {parsedDescription}
        </p>
        {dateLabel ? (
          <p className="type-resume-transaction-date lowercase">{dateLabel}</p>
        ) : null}
      </div>
      <p className="type-resume-transaction-amount poppins">
        {transaction.amount}{" "}
        <Currency name={currencyName} symbol={currencySymbol} />
      </p>
    </li>
  );
};
