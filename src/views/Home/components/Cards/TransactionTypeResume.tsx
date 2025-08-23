import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard
import { AutocompleteInput } from "@sito/dashboard";

// lib
import { CommonAccountDto, TransactionType } from "lib";

// hooks
import { useAccountsCommon, useTransactionTypeResume } from "hooks";

// components
import { Currency } from "../../../Currencies";

export const TransactionTypeResume = () => {
  const { t } = useTranslation();

  const [selectedType, setSetSelectType] = useState(TransactionType.In);

  const [selectedAccount, setSelectedAccount] =
    useState<CommonAccountDto | null>(null);
  const { data: accounts } = useAccountsCommon();

  const { data } = useTransactionTypeResume({
    type: selectedType,
    accountId: selectedAccount?.id,
  });

  useEffect(() => {
    if (accounts?.length) {
      setSelectedAccount(accounts[0]);
    }
  }, [accounts]);

  return (
    <article className="flex flex-col border-border border-2 p-5 rounded-2xl">
      <div className="flex items-center justify-between gap-2">
        <h2>
          {t("_pages:home.dashboard.transactionTypeResume.title", {
            transactionType: t(
              `_entities:transactionCategory.type.values.${String(
                TransactionType[selectedType]
              )}`
            ),
          })}
        </h2>
        <AutocompleteInput
          value={selectedAccount}
          multiple={false}
          onChange={(value) => setSelectedAccount(value as CommonAccountDto)}
          options={accounts ?? []}
        />
      </div>
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
