import type { TFunction } from "i18next";

// @sito/dashboard
import type { Option, ColumnType } from "@sito/dashboard-app";
import {
  FilterTypes,
  enumToKeyValueArray,
  getFormattedDateTime,
} from "@sito/dashboard-app";

// lib
import type { CommonTransactionCategoryDto } from "lib";
import {
  TransactionType,
  getPrimaryTransactionCategory,
  getTransactionCategories,
} from "lib";
import type { TransactionTableRowType } from "../../types";

// views
import { Currency } from "views/Currencies/components/Currency";
import { Type } from "views/TransactionCategories/components/Type";
import { ColorVignette } from "components";

import "./styles.css";

export const getTransactionTypeOptions = (t: TFunction): Option[] =>
  enumToKeyValueArray(TransactionType)?.map((item) => ({
    id: item.value,
    name: t(`_entities:transactionCategory:type.values.${item.key}`),
  })) as Option[];

const getTransactionAutoTableFilterOptions = (t: TFunction): Option[] =>
  [
    {
      id: "false",
      name: t("_pages:transactions.filters.auto.values.manual"),
    },
    {
      id: "all",
      name: t("_pages:transactions.filters.auto.values.all"),
    },
    {
      id: "true",
      name: t("_pages:transactions.filters.auto.values.auto"),
    },
  ] as Option[];

export const getTransactionColumns = (
  t: TFunction,
  categories: CommonTransactionCategoryDto[],
  onCategoryClick?: (id: number) => void,
): ColumnType<TransactionTableRowType>[] => {
  const renderEmpty = (value: string | undefined | null) => {
    if (value && value.length) {
      return value;
    }
    return t("_entities:base.description.empty");
  };

  return [
    {
      key: "category",
      label: t("_entities:transaction.category.label"),
      filterOptions: {
        type: FilterTypes.autocomplete,
        defaultValue: [],
        options: categories,
        placeholder: t("_entities:transaction.category.placeholder"),
      },
      renderBody: (_value: unknown, entity: TransactionTableRowType) => {
        const transactionCategories = getTransactionCategories(entity);
        if (!transactionCategories.length) return undefined;

        return transactionCategories.map((category) =>
          category.auto ? (
            t("_entities:transactionCategory.name.init")
          ) : onCategoryClick ? (
            <button
              key={category.id}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onCategoryClick(category.id);
              }}
              className="transaction-table-category-button"
            >
              {category.color && <ColorVignette color={category.color} />}
              {category.name}
            </button>
          ) : (
            <p key={category.id} className="transaction-table-category-label">
              {category.color && <ColorVignette color={category.color} />}
              {category.name}
            </p>
          ),
        );
        /* .join(", "); */
      },
    },
    {
      key: "amount",
      filterOptions: { type: FilterTypes.number },
      renderBody: (value: unknown, entity: TransactionTableRowType) => {
        const amount = typeof value === "number" ? value : Number(value) || 0;
        const primaryCategory = getPrimaryTransactionCategory(entity);

        return (
          <p>
            {primaryCategory?.type === TransactionType.Out ? "- " : ""}
            {amount}{" "}
            <Currency
              name={entity.account?.currency?.name}
              symbol={entity.account?.currency?.symbol}
            />
          </p>
        );
      },
    },
    {
      key: "type",
      label: t("_entities:transactionCategory.type.label"),
      filterOptions: {
        multiple: false,
        type: FilterTypes.autocomplete,
        placeholder: t("_entities:transactionCategory.type.placeholder"),
        options: getTransactionTypeOptions(t),
      },
      renderBody: (_: unknown, entity: TransactionTableRowType) => (
        <div className="transaction-table-type-cell">
          <Type
            type={
              getPrimaryTransactionCategory(entity)?.type ?? TransactionType.In
            }
          />
        </div>
      ),
    },
    {
      key: "description",
      label: t("_entities:base.description.label"),
      filterOptions: {
        type: FilterTypes.text,
        placeholder: t("_entities:base.description.placeholder"),
      },
      renderBody: (value: unknown, entity: TransactionTableRowType) => (
        <span className="transaction-table-description">
          {entity.auto
            ? t("_entities:transactionCategory.name.init")
            : renderEmpty(
                typeof value === "string" || value == null
                  ? value
                  : String(value),
              )}
        </span>
      ),
    },
    {
      key: "auto",
      label: t("_entities:transaction.auto.label"),
      filterOptions: {
        type: FilterTypes.select,
        defaultValue: "false",
        options: getTransactionAutoTableFilterOptions(t),
        label: t("_entities:transaction.auto.label"),
      },
      display: "none",
      renderBody: () => "",
    },
    {
      key: "date",
      filterOptions: { type: FilterTypes.date },
      renderBody: (value: unknown) => (
        <p>{getFormattedDateTime(String(value ?? ""))}</p>
      ),
    },
  ];
};
