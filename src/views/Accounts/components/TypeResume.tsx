import { useTranslation } from "react-i18next";

// lib
import { TransactionType } from "lib";

// hooks
import { useTransactionsGroupedByType } from "hooks";

// component
import { Type } from "views/TransactionCategories";
import { Currency } from "views/Currencies/components/Currency";

// types
import { TypeResumePropsType } from "./types";

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
    <div className="w-full mt-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="type-group">
          <h4 className="text-sm text-text-muted">
            {t("_entities:transactionCategory:type.values.In")}
          </h4>
          <div className="flex items-center gap-2">
            <p className="text-lg font-semibold text-bg-success">
              {isLoading ? "..." : incomeTotal}{" "}
              <Currency name={currency?.name} symbol={currency?.symbol} />
            </p>
            <Type type={TransactionType.In} noText filled={false} />
          </div>
        </div>
        <div className="type-group">
          <h4 className="text-sm text-text-muted">
            {t("_entities:transactionCategory:type.values.Out")}
          </h4>
          <div className="flex items-center gap-2">
            <p className="text-lg font-semibold text-bg-error">
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
