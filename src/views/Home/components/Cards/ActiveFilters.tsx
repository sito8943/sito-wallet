import { useTranslation } from "react-i18next";

// @sito/dashboard
import { ArrayChip, Chip, RangeChip } from "@sito/dashboard";

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
          label={t("_entities:transaction.account.label")}
          items={accounts ?? []}
          onClearFilter={() => clearAccounts()}
        />
      )}
      {categories?.length ? (
        <ArrayChip
          id="category"
          label={t("_entities:transaction.category.label")}
          items={categories ?? []}
          onClearFilter={() => clearCategories()}
        />
      ) : (
        <Chip
          label={
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
          label={t("_entities:transaction.date.label")}
          onClearFilter={() => {
            clearDate();
          }}
        />
      )}
    </div>
  );
};
