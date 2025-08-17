import { useState } from "react";
import { useTranslation } from "react-i18next";

// lib
import { TransactionType } from "lib";

// hooks
import { useAccountsCommon, useTransactionTypeResume } from "hooks";

// components
import { Currency } from "../../../Currencies";

export const TransactionTypeResume = () => {
  const { t } = useTranslation();

  const [selectedType, setSetSelectType] = useState(TransactionType.In);

  const { data: accounts } = useAccountsCommon();

  const { data } = useTransactionTypeResume({ type: selectedType });

  return (
    <article className="flex border-border border-2 p-5 rounded-2xl">
      <h2>
        {t("_pages:home.dashboard.transactionTypeResume.title", {
          transactionType: t(
            `_entities:transactionCategory.type.values.${String(
              TransactionType[selectedType]
            )}`
          ),
        })}
      </h2>
      <div>
        <p>
          {data?.total}{" "}
          <Currency
            name={data?.account?.currency?.name}
            symbol={data?.account?.currency?.symbol}
          />
        </p>
      </div>
    </article>
  );
};
