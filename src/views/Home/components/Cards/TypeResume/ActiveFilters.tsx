import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { ArrayChip, Chip } from "@sito/dashboard-app";

// types
import type { ActiveFiltersPropsType } from "./types";

// lib
import { TransactionType } from "lib";

import "../styles.css";

export const ActiveFilters = (props: ActiveFiltersPropsType) => {
  const {
    type,
    account,
    clearAccount,
    time,
    excludedCategories = [],
    oppositeExcludedCategories = [],
    showOppositeType,
    clearExcludedCategories,
    clearOppositeExcludedCategories,
  } = props;

  const { t } = useTranslation();
  const accountItems = account ? [account] : [];

  const timeKeyByValue = {
    currentDay: "CurrentDay",
    currentWeek: "CurrentWeek",
    currentMonth: "CurrentMonth",
    currentYear: "CurrentYear",
  } as const;

  return (
    <div className="dashboard-card-active-filters">
      {!!account && (
        <ArrayChip
          id="account"
          text={t("_entities:entities.account.plural")}
          items={accountItems}
          onClearFilter={() => clearAccount()}
        />
      )}
      {!!excludedCategories.length && (
        <ArrayChip
          id="excludedCategories"
          text={t("_entities:transaction.typeResume.excludedCategories.label")}
          items={excludedCategories}
          onClearFilter={() => clearExcludedCategories()}
        />
      )}
      {showOppositeType && !!oppositeExcludedCategories.length && (
        <ArrayChip
          id="oppositeExcludedCategories"
          text={t(
            "_entities:transaction.typeResume.oppositeExcludedCategories.label",
          )}
          items={oppositeExcludedCategories}
          onClearFilter={() => clearOppositeExcludedCategories()}
        />
      )}
      <Chip
        text={
          <p>
            {t(
              `_entities:transactionCategory.type.values.${String(
                TransactionType[type],
              )}`,
            )}
          </p>
        }
      />
      <Chip
        text={
          <p>
            {t(
              `_entities:transaction.typeResume.time.values.${timeKeyByValue[time]}`,
            )}
          </p>
        }
      />
    </div>
  );
};
