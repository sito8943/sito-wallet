import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard
import {
  AutocompleteInput,
  SelectInput,
  Option,
  Chip,
  TextInput,
  RangeChip,
} from "@sito/dashboard";

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

// utils
import { icons } from "../../../Transactions/components/utils";

// components
import { Currency } from "../../../Currencies";
import { Accordion, Loading } from "components";

export const TransactionTypeResume = () => {
  const { t } = useTranslation();

  // #region filters

  const [type, setSetSelectType] = useState(TransactionType.In);

  const [account, setSelectedAccount] = useState<CommonAccountDto | null>(null);

  const parsedTypes = useMemo(
    () =>
      enumToKeyValueArray(TransactionType)?.map((item) => ({
        id: item.value,
        value: t(`_entities:transactionCategory:type.values.${item.key}`),
      })) as Option[],
    [t]
  );

  const { data: accounts } = useAccountsCommon();

  useEffect(() => {
    if (accounts?.length) {
      setSelectedAccount(accounts[0]);
    }
  }, [accounts]);

  const [category, setCategory] = useState<CommonTransactionCategoryDto | null>(
    null
  );

  const { data: categories } = useTransactionCategoriesCommon();

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // #endregion filters

  const { data, isLoading } = useTransactionTypeResume({
    type: type,
    accountId: account?.id,
    category: category ? [category?.id] : undefined,
    date: {
      start: startDate,
      end: endDate,
    },
  });

  const [showFilters, setShowFilters] = useState(false);

  return (
    <article className="relative flex flex-col gap-3 border-border border-2 p-5 rounded-2xl min-md:min-w-100 min-w-auto max-md:w-5/6">
      {isLoading ? <Loading containerClassName="flex items-center justify-center rounded-2xl backdrop-blur-xl bg-base/80 w-full h-full absolute top-0 left-0" /> : null}
      <div className="flex items-center justify-between gap-5">
        <h2 className="text-3xl max-xs:text-xl">
          {t("_pages:home.dashboard.transactionTypeResume.title", {
            transactionType: t(
              `_entities:transactionCategory.type.values.${String(
                TransactionType[type]
              )}`
            ),
          })}
        </h2>
        <button
          className={`icon-button ${showFilters ? "primary submit" : ""}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <FontAwesomeIcon icon={faFilter} />
        </button>
      </div>

      <Accordion open={showFilters} className="relative">
        <div
          className={`flex max-xs:flex-col flex-wrap min-xs:items-center justify-between gap-2 gap-y-6 transition-all 300ms ease-in-out ${
            showFilters ? "pt-4" : ""
          } overflow-hidden`}
        >
          <AutocompleteInput
            value={account}
            multiple={false}
            label={t("_entities:transaction.account.label")}
            autoComplete={`${Tables.Transactions}-${t(
              "_entities:transaction.account.label"
            )}`}
            onChange={(value) => setSelectedAccount(value as CommonAccountDto)}
            options={accounts ?? []}
            containerClassName="!w-full"
          />
          <div className="range-widget-container">
            <p className="text-input-label input-widget-label input-label-normal">
              {t("_entities:transaction.date.label")}
            </p>
            <div className="flex max-xs:flex-col items-center justify-start gap-2">
              <TextInput
                value={startDate}
                placeholder={t(
                  "_accessibility:components.table.filters.range.start"
                )}
                type="date"
                onChange={(e) =>
                  setStartDate((e.target as HTMLInputElement).value)
                }
              />
              <TextInput
                value={endDate}
                placeholder={t(
                  "_accessibility:components.table.filters.range.end"
                )}
                type="date"
                onChange={(e) =>
                  setEndDate((e.target as HTMLInputElement).value)
                }
              />
            </div>
          </div>
          <AutocompleteInput
            value={category}
            multiple={false}
            options={categories ?? []}
            label={t("_entities:transaction.category.label")}
            autoComplete={`${Tables.Transactions}-${t(
              "_entities:transaction.category.label"
            )}`}
            containerClassName="!w-[unset] flex-1"
            onChange={(value) =>
              setCategory(value as CommonTransactionCategoryDto)
            }
          />
          <SelectInput
            value={type}
            label={t("_entities:transactionCategory.type.label")}
            onChange={(e) =>
              setSetSelectType(Number((e.target as HTMLSelectElement).value))
            }
            containerClassName="!w-[unset] flex-1"
            options={parsedTypes}
          />
        </div>
      </Accordion>

      <div className="flex flex-wrap gap-2 items-center justify-start">
        <Chip label={account?.name} />
        <Chip
          label={
            category ? (
              <p>{category?.name}</p>
            ) : (
              <p>
                {t(
                  `_entities:transactionCategory.type.values.${String(
                    TransactionType[type]
                  )}`
                )}
              </p>
            )
          }
        />
        {(startDate || endDate) && (
          <RangeChip
            start={startDate}
            end={endDate}
            label={t("_entities:transaction.date.label")}
            onClearFilter={() => {
              setStartDate("");
              setEndDate("");
            }}
          />
        )}
      </div>
      <FontAwesomeIcon
        icon={icons[(type ?? 0) as keyof typeof icons]}
        className={`text-lg mt-2 self-end ${
          Number(type) === TransactionType.In
            ? "inverted-success"
            : "inverted-error"
        }`}
      />
      <p
        className={`!text-4xl font-bold self-end poppins ${
          (category && category?.type === TransactionType.In) ||
          (!category && type === TransactionType.In)
            ? "!text-bg-success"
            : "!text-bg-error"
        }`}
      >
        {data?.total}{" "}
        <Currency
          name={data?.account?.currency?.name}
          symbol={data?.account?.currency?.symbol}
        />
      </p>
    </article>
  );
};
