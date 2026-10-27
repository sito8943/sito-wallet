import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { Dialog, Empty, Loading, classNames } from "@sito/dashboard-app";

// components
import { QueryError } from "components";

// hooks
import { useSavingsProjectionDaily } from "../../../../../../hooks/queries/useSavingsProjectionDaily";

// types
import type { DailyBreakdownDialogPropsType } from "./types";

// constants
import { DAILY_BREAKDOWN_DIALOG_CLASS_NAME } from "./constants";
import { ACCRUED_MAX_DECIMALS } from "../constants";

// utils
import {
  formatAmount,
  formatDayLabel,
  formatMonthLabel,
  hasDailyDeposits,
} from "../utils";

import "./styles.css";

export const DailyBreakdownDialog = (props: DailyBreakdownDialogPropsType) => {
  const {
    open,
    onClose,
    accountId,
    month,
    monthlyDeposit,
    depositDay,
    locale,
    currencySymbol,
  } = props;
  const { t } = useTranslation();

  // Lazy: only fetch while the dialog is open for a given month.
  const { data, isLoading, error } = useSavingsProjectionDaily({
    accountId,
    month: open ? month : undefined,
    monthlyDeposit,
    depositDay,
  });

  const days = data?.days ?? [];
  const showDeposits = hasDailyDeposits(data);

  return (
    <Dialog
      open={open}
      handleClose={onClose}
      mobileFullScreen
      closeOnBackdropClick
      title={t("_pages:home.dashboard.savingsProjection.daily.title", {
        month: month ? formatMonthLabel(month, locale, "long") : "",
      })}
      className={DAILY_BREAKDOWN_DIALOG_CLASS_NAME}
    >
      <div className="savings-projection-daily-content">
        {isLoading ? (
          <Loading className="savings-projection-daily-loading" />
        ) : error ? (
          <QueryError error={error} />
        ) : !days.length ? (
          <Empty
            message={t("_pages:home.dashboard.savingsProjection.daily.empty")}
          />
        ) : (
          <div className="savings-projection-daily-scroll">
            <table className="savings-projection-daily-table">
              <caption className="sr-only">
                {t("_pages:home.dashboard.savingsProjection.daily.caption", {
                  currency: currencySymbol,
                })}
              </caption>
              <thead>
                <tr>
                  <th scope="col">
                    {t("_pages:home.dashboard.savingsProjection.daily.date")}
                  </th>
                  <th scope="col">
                    {t("_pages:home.dashboard.savingsProjection.daily.opening")}
                  </th>
                  {showDeposits && (
                    <th scope="col">
                      {t(
                        "_pages:home.dashboard.savingsProjection.daily.deposited",
                      )}
                    </th>
                  )}
                  <th scope="col">
                    {t("_pages:home.dashboard.savingsProjection.daily.earning")}
                  </th>
                  <th scope="col">
                    {t("_pages:home.dashboard.savingsProjection.daily.accrued")}
                  </th>
                  <th scope="col">
                    {t(
                      "_pages:home.dashboard.savingsProjection.daily.credited",
                    )}
                  </th>
                  <th scope="col">
                    {t("_pages:home.dashboard.savingsProjection.daily.closing")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {days.map((day) => (
                  <tr
                    key={day.date}
                    className={classNames(day.credited > 0 && "credited")}
                  >
                    <td>{formatDayLabel(day.date, locale)}</td>
                    <td>{formatAmount(day.openingBalance, locale)}</td>
                    {showDeposits && (
                      <td>
                        {day.deposited > 0 && "+"}
                        {formatAmount(day.deposited, locale)}
                      </td>
                    )}
                    <td>{formatAmount(day.earningBalance, locale)}</td>
                    <td>
                      {formatAmount(day.accrued, locale, ACCRUED_MAX_DECIMALS)}
                    </td>
                    <td>{formatAmount(day.credited, locale)}</td>
                    <td>{formatAmount(day.closingBalance, locale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Dialog>
  );
};
