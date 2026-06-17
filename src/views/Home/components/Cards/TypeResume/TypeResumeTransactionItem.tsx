import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useCalendarTimeAge } from "hooks";

import { Currency } from "../../../../Currencies";

import type { TypeResumeTransactionItemPropsType } from "./types";

export const TypeResumeTransactionItem = (
  props: TypeResumeTransactionItemPropsType,
) => {
  const { transaction, currencyName, currencySymbol } = props;
  const { t } = useTranslation();
  const { timeAge } = useCalendarTimeAge();

  const parsedDescription = useMemo(() => {
    if (!transaction.description?.length) {
      return t("_entities:base.description.empty");
    }

    return transaction.description;
  }, [t, transaction.description]);

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
