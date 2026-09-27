import { classNames } from "@sito/dashboard-app";
import { useTranslation } from "react-i18next";

import { TransactionType } from "lib";

import { Currency } from "../../../../Currencies";
import { Type } from "views/TransactionCategories/components/Type";

import type { TypeResumeRowPropsType } from "./types";

export const TypeResumeRow = (props: TypeResumeRowPropsType) => {
  const {
    type,
    amount,
    isLoading,
    currencyName,
    currencySymbol,
    compact = false,
    compare = false,
    previousAmount = 0,
    difference = false,
  } = props;
  const { t } = useTranslation();

  const amountColorClass = (
    difference ? amount >= 0 : type === TransactionType.In
  )
    ? "type-resume-amount--income"
    : "type-resume-amount--expense";
  const previousAmountColorClass = difference
    ? previousAmount >= 0
      ? "type-resume-amount--income"
      : "type-resume-amount--expense"
    : amountColorClass;
  const indicator = difference ? (
    <span title={t("_pages:home.dashboard.transactionTypeResume.difference")}>
      <span className="sr-only">
        {t("_pages:home.dashboard.transactionTypeResume.difference")}
      </span>
    </span>
  ) : (
    <Type
      type={type}
      filled={false}
      noText
      iconClassName={
        compact ? "type-resume-opposite-amount" : "type-resume-amount"
      }
    />
  );

  if (compare) {
    return (
      <div className="type-resume-compare-row">
        {difference && (
          <div className="type-resume-difference-line" aria-hidden="true" />
        )}
        <p
          className={classNames(
            "type-resume-compare-amount type-resume-compare-amount--previous poppins",
            previousAmountColorClass,
          )}
        >
          {isLoading ? "…" : previousAmount}{" "}
          <Currency name={currencyName} symbol={currencySymbol} />
        </p>
        <p
          className={classNames(
            "type-resume-compare-amount poppins",
            amountColorClass,
          )}
        >
          {isLoading ? "…" : amount}{" "}
          <Currency name={currencyName} symbol={currencySymbol} />
        </p>
        {indicator}
      </div>
    );
  }

  return (
    <div
      className={classNames(
        "type-resume-row",
        compact && "type-resume-row--opposite",
        difference && "type-resume-row--difference",
      )}
    >
      {indicator}
      <p
        className={classNames(
          compact
            ? "type-resume-opposite-amount poppins"
            : "type-resume-amount poppins",
          amountColorClass,
        )}
      >
        {isLoading ? "…" : amount}{" "}
        <Currency name={currencyName} symbol={currencySymbol} />
      </p>
    </div>
  );
};
