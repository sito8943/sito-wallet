import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// @sito/dashboard
import { Chip, FilterTypes, Option } from "@sito/dashboard";

// components
import { Error, WalletTable } from "components";

// hooks
import { useTransactionsList } from "hooks";

// lib
import {
  EntityName,
  enumToKeyValueArray,
  getFormattedDateTime,
  TransactionDto,
  TransactionType,
  useParseColumns,
} from "lib";

// utils
import { icons } from "../utils";

// types
import { TransactionContainerPropsType } from "./types";

// views
import { Currency } from "views";

export const TransactionTable = (props: TransactionContainerPropsType) => {
  const { accountId, categories, getActions, showFilters, setShowFilters } =
    props;

  const { t } = useTranslation();

  const { data, isLoading, error } = useTransactionsList({
    filters: { accountId },
  });

  // #region columns

  const renderEmpty = (value: string | undefined | null) => {
    if (value && value.length) {
      return value;
    }
    return t("_entities:base.description.empty");
  };

  const { columns } = useParseColumns<TransactionDto>(
    [
      {
        key: "category",
        label: t("_entities:transaction.category.label"),
        filterOptions: {
          type: FilterTypes.autocomplete,
          defaultValue: [],
          options: categories,
          placeholder: t("_entities:transaction.category.placeholder"),
        },
        renderBody: (_: string, entity: TransactionDto) => (
          <span className="truncate">
            {entity.category?.initial
              ? t("_entities:transactionCategory.name.init")
              : entity.category?.name}
          </span>
        ),
      },
      {
        key: "description",
        label: t("_entities:base.description.label"),
        filterOptions: {
          type: FilterTypes.text,
          placeholder: t("_entities:base.description.placeholder"),
        },
        renderBody: (value: string, entity: TransactionDto) => (
          <span className="truncate">
            {entity.initial
              ? t("_entities:transactionCategory.name.init")
              : renderEmpty(value)}
          </span>
        ),
      },
      {
        key: "amount",
        filterOptions: { type: FilterTypes.number },
        renderBody: (value: number, entity: TransactionDto) => (
          <p>
            {value}{" "}
            <Currency
              name={entity.account?.currency?.name}
              symbol={entity.account?.currency?.symbol}
            />
          </p>
        ),
      },
      {
        key: "date",
        filterOptions: { type: FilterTypes.date },
        renderBody: (value) => <p>{getFormattedDateTime(value)}</p>,
      },
      {
        key: "type",
        label: t("_entities:transactionCategory.type.label"),
        filterOptions: {
          multiple: false,
          type: FilterTypes.autocomplete,
          placeholder: t("_entities:transactionCategory.type.placeholder"),
          options: enumToKeyValueArray(TransactionType)?.map((item) => ({
            id: item.value,
            value: t(`_entities:transactionCategory:type.values.${item.key}`),
          })) as Option[],
        },

        renderBody: (_: unknown, entity: TransactionDto) => (
          <div className="w-fit">
            <Chip
              className={
                entity.category?.type === TransactionType.In
                  ? "success"
                  : "error"
              }
              label={
                <div className="flex gap-2 items-center justify-center">
                  <FontAwesomeIcon
                    icon={
                      icons[(entity.category?.type ?? 0) as keyof typeof icons]
                    }
                  />
                  {t(
                    `_entities:transactionCategory:type.values.${String(
                      TransactionType[entity.category?.type ?? 0]
                    )}`
                  )}
                </div>
              }
            />
          </div>
        ),
      },
    ],
    EntityName.Transaction,
    ["createdAt", "updatedAt"]
  );

  // #endregion

  return error ? (
    <Error message={error?.message} />
  ) : (
    <WalletTable
      total={data?.totalElements ?? 0}
      data={data?.items ?? []}
      actions={getActions}
      isLoading={isLoading}
      entity={EntityName.Transaction}
      columns={columns}
      filterOptions={{
        button: {
          hide: true,
        },
        dropdown:
          setShowFilters && !!showFilters
            ? {
                opened: showFilters,
                setOpened: setShowFilters,
              }
            : undefined,
      }}
    />
  );
};
