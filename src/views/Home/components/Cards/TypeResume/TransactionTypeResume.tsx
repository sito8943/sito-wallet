import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useDebouncedCallback } from "use-debounce";

// @sito/dashboard
import {
  AutocompleteInput,
  SelectInput,
  Option,
  TextInput,
} from "@sito/dashboard";

// lib
import {
  CommonAccountDto,
  CommonTransactionCategoryDto,
  enumToKeyValueArray,
  Tables,
  TransactionType,
  UpdateDashboardCardTitleDto,
} from "lib";

// hooks
import {
  useAccountsCommon,
  useTransactionCategoriesCommon,
  useTransactionTypeResume,
} from "hooks";

// utils
import { icons } from "../../../../Transactions/components/utils";

// components
import { FormDialog, Loading } from "components";
import { Currency } from "../../../../Currencies";
import { ActiveFilters } from "../ActiveFilters";
import { BaseCard } from "../BaseCard";

// styles
import "./styles.css";

// types
import { TransactionTypePropsType } from "./types";

// providers
import { useManager } from "providers";

export const TransactionTypeResume = (props: TransactionTypePropsType) => {
  const { title, id, user, onDelete } = props;

  const { t } = useTranslation();
  const manager = useManager();

  // #region filters

  const [type, setSetSelectType] = useState(TransactionType.In);

  const [selectedAccounts, setSelectedAccounts] = useState<
    CommonAccountDto[] | null
  >(null);

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
      setSelectedAccounts([accounts[0]]);
    }
  }, [accounts]);

  const [selectedCategories, setSelectedCategories] = useState<
    CommonTransactionCategoryDto[] | null
  >(null);

  const { data: categories } = useTransactionCategoriesCommon();

  const categoriesByType = useMemo(() => {
    return categories?.filter((category) => category.type === type) ?? [];
  }, [categories, type]);

  useEffect(() => {
    setSelectedCategories(null);
  }, [type]);

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // #endregion filters

  const { data, isLoading } = useTransactionTypeResume({
    type: type,
    account: selectedAccounts ? selectedAccounts.map((a) => a.id) : undefined,
    category: selectedCategories
      ? selectedCategories.map((c) => c.id)
      : undefined,
    date: {
      start: startDate,
      end: endDate,
    },
  });

  const [showFilters, setShowFilters] = useState(false);

  const [cardTitle, setCardTitle] = useState(
    title ??
      t("_pages:home.dashboard.transactionTypeResume.title", {
        transactionType: t(
          `_entities:transactionCategory.type.values.${String(
            TransactionType[type]
          )}`
        ),
      })
  );
  // Debounce callback
  const debounced = useDebouncedCallback(
    // function
    (value) => {
      updateTitle.mutate({
        id,
        title: value,
        userId: user?.id,
      } as UpdateDashboardCardTitleDto);
    },
    // delay in ms
    500
  );

  useEffect(() => {
    debounced.flush();
  }, [debounced]);

  const updateTitle = useMutation<number, Error, UpdateDashboardCardTitleDto>({
    mutationFn: (data) => manager.Dashboard.updateCardTitle(data),
    onError: (error: Error) => {
      console.error(error);
    },
    onSuccess: () => {
      console.log("Saved?");
    },
  });

  const globalLoading = updateTitle.isPending || isLoading;

  return (
    <BaseCard className="type-resume-main">
      {isLoading ? (
        <Loading containerClassName="type-resume-main-loading" />
      ) : null}
      <div className="type-resume-header">
        <input
          className="type-resume-title poppins"
          value={cardTitle}
          onChange={(e) => {
            debounced(e.target.value);
            setCardTitle(e.target.value);
          }}
        />
        {!updateTitle.isPending ? <Loading className="mt-1" /> : null}
        <button
          disabled={globalLoading}
          className={`icon-button min-w-7`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <FontAwesomeIcon icon={faFilter} />
        </button>
        <button
          disabled={globalLoading}
          onClick={onDelete}
          className={`icon-button min-w-7 error`}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>

      <ActiveFilters
        accounts={selectedAccounts ?? []}
        clearAccounts={() => setSelectedAccounts([])}
        categories={selectedCategories ?? []}
        clearCategories={() => setSelectedCategories([])}
        startDate={startDate}
        endDate={endDate}
        clearDate={() => {
          setStartDate("");
          setEndDate("");
        }}
        type={type}
      />
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
          type === TransactionType.In ? "!text-bg-success" : "!text-bg-error"
        }`}
      >
        {data?.total}{" "}
        <Currency
          name={data?.account?.currency?.name}
          symbol={data?.account?.currency?.symbol}
        />
      </p>

      <FormDialog
        title={t("_accessibility:buttons.filters")}
        open={showFilters}
        handleClose={() => setShowFilters(false)}
        handleSubmit={() => null}
        onSubmit={() => {}}
      >
        <AutocompleteInput
          value={selectedAccounts}
          multiple
          label={t("_entities:transaction.account.label")}
          autoComplete={`${Tables.Transactions}-${t(
            "_entities:transaction.account.label"
          )}`}
          onChange={(value) => setSelectedAccounts(value as CommonAccountDto[])}
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
              onChange={(e) => setEndDate((e.target as HTMLInputElement).value)}
            />
          </div>
        </div>
        <AutocompleteInput
          multiple
          value={selectedCategories}
          options={categoriesByType ?? []}
          label={t("_entities:transaction.category.label")}
          autoComplete={`${Tables.Transactions}-${t(
            "_entities:transaction.category.label"
          )}`}
          containerClassName="!w-[unset] flex-1"
          onChange={(value) =>
            setSelectedCategories(value as CommonTransactionCategoryDto[])
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
      </FormDialog>
    </BaseCard>
  );
};
