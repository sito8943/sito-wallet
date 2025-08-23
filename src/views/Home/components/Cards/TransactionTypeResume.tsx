import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard
import { AutocompleteInput, SelectInput, Option } from "@sito/dashboard";

// lib
import {
  CommonAccountDto,
  CommonTransactionCategoryDto,
  enumToKeyValueArray,
  Tables,
  TransactionType,
} from "lib";

// hooks
import {
  useAccountsCommon,
  useTransactionCategoriesCommon,
  useTransactionTypeResume,
} from "hooks";

// components
import { Currency } from "../../../Currencies";

export const TransactionTypeResume = () => {
  const { t } = useTranslation();

  const [selectedType, setSetSelectType] = useState(TransactionType.In);

  const [selectedAccount, setSelectedAccount] =
    useState<CommonAccountDto | null>(null);

  const parsedTypes = useMemo(
    () =>
      enumToKeyValueArray(TransactionType)?.map((item) => ({
        id: item.value,
        value: t(`_entities:transactionCategory:type.values.${item.key}`),
      })) as Option[],
    [t]
  );

  const { data: accounts } = useAccountsCommon();

  const [category, setCategory] = useState<CommonTransactionCategoryDto | null>(
    null
  );

  console.log(category);

  const { data: categories } = useTransactionCategoriesCommon();

  const { data } = useTransactionTypeResume({
    type: selectedType,
    accountId: selectedAccount?.id,
    category: category ? [category?.id] : undefined,
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
          label={t("_entities:transaction.account.label")}
          autoComplete={`${Tables.Transactions}-${t(
            "_entities:transaction.account.label"
          )}`}
          onChange={(value) => setSelectedAccount(value as CommonAccountDto)}
          options={accounts ?? []}
        />
        <AutocompleteInput
          value={category}
          multiple={false}
          options={categories ?? []}
          label={t("_entities:transaction.category.label")}
          autoComplete={`${Tables.Transactions}-${t(
            "_entities:transaction.category.label"
          )}`}
          onChange={(value) =>
            setCategory(value as CommonTransactionCategoryDto)
          }
        />
        <SelectInput
          value={selectedType}
          label={t("_entities:transactionCategory.type.label")}
          onChange={(e) =>
            setSetSelectType(Number((e.target as HTMLSelectElement).value))
          }
          options={parsedTypes}
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
