import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullseye,
  faCheckCircle,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import { Button, classNames } from "@sito/dashboard-app";

// components
import {
  ItemCard,
  ItemCardTitle,
  ProgressBar,
  ProviderPhoto,
} from "components";

// lib
import type { GoalDto } from "lib";
import {
  GOAL_STATUS_NAME,
  GoalStatus,
  formatAmount,
  formatGoalDeadline,
  formatGoalPercent,
  getGoalDeadlineInfo,
  isGoalReachedAndActive,
} from "lib";

// types
import type { GoalCardPropsType } from "../../types";

import "./styles.css";

export function GoalCard(props: GoalCardPropsType) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const {
    actions,
    onClick,
    onComplete,
    completing,
    swipeDeleteOpen,
    onSwipeDelete,
    ...goal
  } = props;
  const {
    id,
    name,
    description,
    status,
    photo,
    account,
    currency,
    saved,
    targetAmount,
    progressPercent,
    reached,
    deadline,
    daysLeft,
    monthlyNeeded,
    deletedAt,
  } = goal;

  const currencySymbol = currency?.symbol ?? "";
  const showReached = isGoalReachedAndActive(goal);
  const active = status === GoalStatus.Active;
  const deadlineInfo = getGoalDeadlineInfo(daysLeft);
  const deadlineDate = formatGoalDeadline(deadline, locale);

  return (
    <ItemCard<GoalDto>
      title={
        <div className="goal-card-title-row">
          <div className="goal-card-photo">
            {photo ? (
              <ProviderPhoto className="goal-card-photo-image" photo={photo} />
            ) : (
              <FontAwesomeIcon icon={faBullseye} />
            )}
          </div>
          <div className="goal-card-heading">
            <ItemCardTitle>{name}</ItemCardTitle>
            {description && (
              <span className="goal-card-description">{description}</span>
            )}
          </div>
        </div>
      }
      deleted={!!deletedAt}
      name={t("_pages:goals.forms.edit")}
      aria-label={t("_pages:goals.forms.editAria")}
      onClick={() => onClick(id)}
      actions={actions}
      swipeDeleteOpen={swipeDeleteOpen}
      onSwipeDelete={onSwipeDelete}
      className="goal-card-content"
      containerClassName={classNames(!active && "goal-card--closed")}
    >
      <div className="goal-card-progress">
        <div className="goal-card-progress-row">
          <span className="goal-card-amounts">
            {t("_pages:goals.labels.progress", {
              saved: formatAmount(saved, locale),
              target: formatAmount(targetAmount, locale),
              currency: currencySymbol,
            })}
          </span>
          <span className="goal-card-percent">
            {t("_pages:goals.labels.percent", {
              percent: formatGoalPercent(progressPercent, locale),
            })}
          </span>
        </div>
        <ProgressBar
          value={progressPercent}
          variant={reached ? "success" : "primary"}
          label={t("_pages:goals.labels.progressAria", { name })}
        />
      </div>
      <p className="goal-card-meta">
        {deadlineDate
          ? t("_pages:goals.labels.deadline", { date: deadlineDate })
          : t("_pages:goals.labels.noDeadline")}
        {active && deadlineInfo.kind === "left" && (
          <span className="goal-card-days">
            {t("_pages:goals.labels.daysLeft", { count: deadlineInfo.days })}
          </span>
        )}
        {active && deadlineInfo.kind === "today" && (
          <span className="goal-card-days goal-card-days--today">
            {t("_pages:goals.labels.dueToday")}
          </span>
        )}
        {active && deadlineInfo.kind === "overdue" && !reached && (
          <span className="goal-card-days goal-card-days--overdue">
            {t("_pages:goals.labels.overdue")}
          </span>
        )}
      </p>
      {active && monthlyNeeded !== null && (
        <p className="goal-card-meta">
          {t("_pages:goals.labels.monthlyNeeded", {
            amount: formatAmount(monthlyNeeded, locale),
            currency: currencySymbol,
          })}
        </p>
      )}
      <div className="goal-card-chips">
        {account && (
          <span className="goal-card-chip">
            <FontAwesomeIcon icon={faCreditCard} />
            {account.name}
          </span>
        )}
        {!active && (
          <span
            className={classNames(
              "goal-card-chip",
              status === GoalStatus.Completed && "goal-card-chip--completed",
            )}
          >
            {t(`_entities:goal.status.values.${GOAL_STATUS_NAME[status]}`)}
          </span>
        )}
      </div>
      {showReached && !deletedAt && (
        <div className="goal-card-reached">
          <span className="goal-card-reached-badge">
            <FontAwesomeIcon icon={faCheckCircle} />
            {t("_pages:goals.labels.reached")}
          </span>
          <Button
            type="button"
            color="primary"
            variant="submit"
            disabled={completing}
            onClick={(event) => {
              event.stopPropagation();
              onComplete(goal);
            }}
          >
            {t("_pages:goals.actions.complete.text")}
          </Button>
        </div>
      )}
    </ItemCard>
  );
}
