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
  } = props;

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
