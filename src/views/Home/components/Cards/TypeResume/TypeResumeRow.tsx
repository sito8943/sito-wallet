import { classNames } from "@sito/dashboard-app";

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
  } = props;

  const amountColorClass =
    type === TransactionType.In
      ? "type-resume-amount--income"
      : "type-resume-amount--expense";

  if (compare) {
    return (
      <div className="type-resume-compare-row">
        <p
          className={classNames(
            "type-resume-compare-amount type-resume-compare-amount--previous poppins",
            amountColorClass,
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
        <Type
          type={type}
          filled={false}
          noText
          iconClassName="type-resume-amount"
        />
      </div>
    );
  }

  return (
    <div
      className={classNames(
        "type-resume-row",
        compact && "type-resume-row--opposite",
      )}
    >
      <Type
        type={type}
        filled={false}
        noText
        iconClassName={classNames(
          compact ? "type-resume-opposite-amount" : "type-resume-amount",
        )}
      />
      <p
        className={classNames(
          compact
            ? "type-resume-opposite-amount poppins"
            : "type-resume-amount poppins",
          type === TransactionType.In
            ? compact
              ? "type-resume-opposite-amount--income"
              : "type-resume-amount--income"
            : compact
              ? "type-resume-opposite-amount--expense"
              : "type-resume-amount--expense",
        )}
      >
        {isLoading ? "…" : amount}{" "}
        <Currency name={currencyName} symbol={currencySymbol} />
      </p>
    </div>
  );
};
