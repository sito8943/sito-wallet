import { useTranslation } from "react-i18next";

import { TransactionType } from "lib";
import { useTransactionsGroupedByType } from "hooks";
import { Type } from "views/TransactionCategories";
import { Currency } from "views/Currencies/components/Currency";
import { TypeResumePropsType } from "./types";

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
      <hr className="border-border rounded-full border-1 mb-2" />
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-base rounded-2xl p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm text-text-muted">
              {t("_entities:transactionCategory:type.values.In")}
            </h4>
            <Type type={TransactionType.In} noText filled={false} />
          </div>
          <p className="text-lg font-semibold text-bg-success">
            {isLoading ? "..." : incomeTotal}{" "}
            <Currency name={currency?.name} symbol={currency?.symbol} />
          </p>
        </div>
        <div className="bg-base rounded-2xl p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm text-text-muted">
              {t("_entities:transactionCategory:type.values.Out")}
            </h4>
            <Type type={TransactionType.Out} noText filled={false} />
          </div>
          <p className="text-lg font-semibold text-bg-error">
            {isLoading ? "..." : expenseTotal}{" "}
            <Currency name={currency?.name} symbol={currency?.symbol} />
          </p>
        </div>
      </div>
    </div>
  );
};

export default TypeResume;
