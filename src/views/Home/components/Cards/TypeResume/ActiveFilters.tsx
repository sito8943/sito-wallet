import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { ArrayChip, Chip } from "@sito/dashboard-app";

// types
import type { ActiveFiltersPropsType } from "./types";

// lib
import { TransactionType } from "lib";

import "../styles.css";

export const ActiveFilters = (props: ActiveFiltersPropsType) => {
  const { type, account, clearAccount, time } = props;

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
