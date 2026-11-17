import { useTranslation } from "react-i18next";

// components
import { ProgressBar } from "components";

// lib
import { formatAmount, formatGoalPercent, getGoalDeadlineInfo } from "lib";

// types
import type { GoalsCardRowPropsType } from "./types";

export const GoalsCardRow = (props: GoalsCardRowPropsType) => {
  const { goal, locale } = props;
  const { t } = useTranslation();
  const deadlineInfo = getGoalDeadlineInfo(goal.daysLeft);
  const currency = goal.currency?.symbol ?? "";

  return (
    <li className="goals-card-row">
      <div className="goals-card-row-header">
        <span className="goals-card-row-name">{goal.name}</span>
        <span className="goals-card-row-percent">
          {goal.reached
            ? t("_pages:goals.labels.reached")
            : t("_pages:goals.labels.percent", {
                percent: formatGoalPercent(goal.progressPercent, locale),
              })}
        </span>
      </div>
      <ProgressBar
        value={goal.progressPercent}
        variant={goal.reached ? "success" : "primary"}
        label={t("_pages:goals.labels.progressAria", { name: goal.name })}
      />
      <div className="goals-card-row-meta">
        <span>
          {t("_pages:goals.labels.progress", {
            saved: formatAmount(goal.saved, locale),
            target: formatAmount(goal.targetAmount, locale),
            currency,
          })}
        </span>
        {deadlineInfo.kind === "left" && (
          <span>
            {t("_pages:goals.labels.daysLeft", { count: deadlineInfo.days })}
          </span>
        )}
        {deadlineInfo.kind === "today" && (
          <span>{t("_pages:goals.labels.dueToday")}</span>
        )}
        {deadlineInfo.kind === "overdue" && !goal.reached && (
          <span className="goals-card-row-overdue">
            {t("_pages:goals.labels.overdue")}
          </span>
        )}
      </div>
    </li>
  );
};
