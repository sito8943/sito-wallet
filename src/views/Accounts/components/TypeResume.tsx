import { useTranslation } from "react-i18next";

// lib
import { TransactionType } from "lib";

// hooks
import { useTransactionsGroupedByType } from "hooks";

// component
import { Type } from "views/TransactionCategories";
import { Currency } from "views/Currencies/components/Currency";

// types
import type { TypeResumePropsType } from "./types";

// styles
import "./styles.css";

const TypeResume = (props: TypeResumePropsType) => {
  const { accountId, currency } = props;
  const { t } = useTranslation();
  const { data, isLoading } = useTransactionsGroupedByType({
    accountId,
  });

  const incomeTotal = data?.incomeTotal ?? 0;
  const expenseTotal = data?.expenseTotal ?? 0;

  return (
    <div className="type-group-wrapper">
      <div className="type-group-grid">
        <div className="type-group">
          <h4 className="type-group-title">
            {t("_entities:transactionCategory:type.values.In")}
          </h4>
          <div className="type-group-value-row">
            <p className="type-group-value--income">
              {isLoading ? "..." : incomeTotal}{" "}
              <Currency name={currency?.name} symbol={currency?.symbol} />
            </p>
            <Type type={TransactionType.In} noText filled={false} />
          </div>
        </div>
        <div className="type-group">
          <h4 className="type-group-title">
            {t("_entities:transactionCategory:type.values.Out")}
          </h4>
          <div className="type-group-value-row">
            <p className="type-group-value--expense">
              {isLoading ? "..." : expenseTotal}{" "}
              <Currency name={currency?.name} symbol={currency?.symbol} />
            </p>
            <Type type={TransactionType.Out} noText filled={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypeResume;
