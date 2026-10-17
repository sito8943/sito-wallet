import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// @sito/dashboard-app
import { classNames, Dialog } from "@sito/dashboard-app";

import { TypeResumePredictionRow } from "./TypeResumePredictionRow";

// constants
import { PREDICTION_STATUS_ICON } from "./constants";

// utils
import { getPredictionDescriptionKey } from "./utils";

// types
import type { TypeResumePredictionDialogPropsType } from "./types";

import "../styles.css";

export const TypeResumePredictionDialog = (
  props: TypeResumePredictionDialogPropsType,
) => {
  const { open, closeDialog, prediction, currencyName, currencySymbol } = props;
  const { t } = useTranslation();
  const { status, progress, margin, expense, income, balance, minBalance } =
    prediction;
  const currencyProps = { currencyName, currencySymbol };

  return (
    <Dialog
      open={open}
      handleClose={closeDialog}
      title={t("_pages:home.dashboard.transactionTypeResume.prediction.title")}
      className="type-resume-prediction-dialog"
    >
      <div className="type-resume-prediction">
        <div
          className={classNames(
            "type-resume-prediction-status",
            `type-resume-prediction-status--${status}`,
          )}
        >
          <FontAwesomeIcon icon={PREDICTION_STATUS_ICON[status]} />
          <div className="type-resume-prediction-status-copy">
            <p className="type-resume-prediction-status-title">
              {t(
                `_pages:home.dashboard.transactionTypeResume.prediction.status.${status}.title`,
              )}
            </p>
            <p className="type-resume-prediction-status-description">
              {t(getPredictionDescriptionKey(prediction), {
                current: expense.current,
                previous: expense.previous,
                predicted: expense.predicted,
                currentBalance: balance?.current,
                predictedBalance: balance?.predicted,
                minBalance,
                margin: Math.round(Math.abs(margin ?? 0) * 100),
              })}
            </p>
          </div>
        </div>
        <p className="type-resume-prediction-progress">
          {t(
            "_pages:home.dashboard.transactionTypeResume.prediction.progress",
            {
              elapsed: progress.elapsedDays,
              total: progress.totalDays,
            },
          )}
          {minBalance !== undefined &&
            ` · ${t(
              "_pages:home.dashboard.transactionTypeResume.prediction.minBalance",
              { value: minBalance },
            )}`}
        </p>
        <div className="type-resume-prediction-table">
          <span aria-hidden="true" />
          <span className="type-resume-compare-header">
            {t(
              "_pages:home.dashboard.transactionTypeResume.compareColumns.previous",
            )}
          </span>
          <span className="type-resume-compare-header">
            {t(
              "_pages:home.dashboard.transactionTypeResume.compareColumns.current",
            )}
          </span>
          <span
            className="type-resume-compare-header"
            title={t(
              "_pages:home.dashboard.transactionTypeResume.prediction.estimate",
            )}
          >
            {t(
              "_pages:home.dashboard.transactionTypeResume.prediction.columns.predicted",
            )}
          </span>
          {income && (
            <TypeResumePredictionRow
              {...currencyProps}
              label={t(
                "_pages:home.dashboard.transactionTypeResume.prediction.rows.income",
              )}
              values={income}
            />
          )}
          <TypeResumePredictionRow
            {...currencyProps}
            label={t(
              "_pages:home.dashboard.transactionTypeResume.prediction.rows.expense",
            )}
            values={expense}
          />
          {balance && (
            <TypeResumePredictionRow
              {...currencyProps}
              label={t(
                "_pages:home.dashboard.transactionTypeResume.prediction.rows.balance",
              )}
              values={balance}
              total
            />
          )}
        </div>
        <p className="type-resume-prediction-hint">
          {t("_pages:home.dashboard.transactionTypeResume.prediction.hint")}
        </p>
      </div>
    </Dialog>
  );
};
