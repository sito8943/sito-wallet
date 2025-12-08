import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { ArrayChip, Chip, RangeChip } from "@sito/dashboard-app";

// types
import { ActiveFiltersPropsType } from "./types";

// lib
import { TransactionType } from "lib";

export const ActiveFilters = (props: ActiveFiltersPropsType) => {
  const {
    type,
    accounts,
    categories,
    startDate,
    endDate,
    clearAccounts,
    clearCategories,
    clearDate,
  } = props;

  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-2 items-center justify-start">
      {!!accounts?.length && (
        <ArrayChip
          id="account"
          text={t("_entities:entities.account.plural")}
          items={accounts ?? []}
          onClearFilter={() => clearAccounts()}
        />
      )}
      {categories?.length ? (
        <ArrayChip
          id="category"
          text={t("_entities:entities.transactionCategory.plural")}
          items={categories ?? []}
          onClearFilter={() => clearCategories()}
        />
      ) : (
        <Chip
          text={
            <p>
              {t(
                `_entities:transactionCategory.type.values.${String(
                  TransactionType[type]
                )}`
              )}
            </p>
          }
        />
      )}
      {(startDate || endDate) && (
        <RangeChip
          id={"date"}
          start={startDate}
          end={endDate}
          text={t("_entities:transaction.date.label")}
          onClearFilter={() => {
            clearDate();
          }}
        />
      )}
    </div>
  );
};
