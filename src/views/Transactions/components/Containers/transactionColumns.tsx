import { TFunction } from "i18next";

// @sito/dashboard
import {
  FilterTypes,
  Option,
  enumToKeyValueArray,
  getFormattedDateTime,
  ColumnType,
} from "@sito/dashboard-app";

// lib
import {
  CommonTransactionCategoryDto,
  TransactionDto,
  TransactionType,
  getPrimaryTransactionCategory,
  getTransactionCategories,
} from "lib";

// views
import { Currency } from "views/Currencies/components/Currency";
import { Type } from "views/TransactionCategories/components/Type";

export const getTransactionTypeOptions = (t: TFunction): Option[] =>
  enumToKeyValueArray(TransactionType)?.map((item) => ({
    id: item.value,
    name: t(`_entities:transactionCategory:type.values.${item.key}`),
  })) as Option[];

export const getTransactionColumns = (
  t: TFunction,
  categories: CommonTransactionCategoryDto[],
): ColumnType<TransactionDto>[] => {
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
      renderBody: (_value: unknown, entity: TransactionDto) => {
        const transactionCategories = getTransactionCategories(entity);
        if (!transactionCategories.length) return undefined;

        return transactionCategories
          .map((category) =>
            category.auto ? t("_entities:transactionCategory.name.init") : category.name,
          )
          .join(", ");
      },
    },
    {
      key: "amount",
      filterOptions: { type: FilterTypes.number },
      renderBody: (value: unknown, entity: TransactionDto) => {
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
      renderBody: (_: unknown, entity: TransactionDto) => (
        <div className="w-fit">
          <Type
            type={getPrimaryTransactionCategory(entity)?.type ?? TransactionType.In}
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
      renderBody: (value: unknown, entity: TransactionDto) => (
        <span className="truncate">
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
      key: "date",
      filterOptions: { type: FilterTypes.date },
      renderBody: (value: unknown) => (
        <p>{getFormattedDateTime(String(value ?? ""))}</p>
      ),
    },
  ];
};
