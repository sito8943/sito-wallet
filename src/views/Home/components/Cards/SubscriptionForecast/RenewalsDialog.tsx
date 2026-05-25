import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { Dialog } from "@sito/dashboard-app";

// hooks
import { useCurrenciesCommon } from "hooks/queries/useCurrenciesCommon";

// components
import { Currency } from "../../../../Currencies";

// types
import type { RenewalsDialogPropsType } from "./types";

import "../styles.css";

export const RenewalsDialog = (props: RenewalsDialogPropsType) => {
  const { open, closeDialog, renewals } = props;
  const { t, i18n } = useTranslation();
  const { data: currencies } = useCurrenciesCommon();

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(i18n.language, {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    [i18n.language],
  );

  const resolveCurrency = (currencyName: string | null) => {
    if (!currencyName) return { name: "", symbol: "" };
    const match = currencies?.find((c) => c.name === currencyName);
    return { name: currencyName, symbol: match?.symbol ?? "" };
  };

  return (
    <Dialog
      open={open}
      handleClose={closeDialog}
      title={t("_pages:home.dashboard.subscriptionForecast.details.title")}
      className="renewals-dialog"
    >
      {renewals.length === 0 ? (
        <p className="renewals-dialog-empty">
          {t("_pages:home.dashboard.subscriptionForecast.details.empty")}
        </p>
      ) : (
        <ul className="renewals-dialog-list">
          {renewals.map((renewal, index) => {
            const currency = resolveCurrency(renewal.currency);
            const renewalDate = new Date(renewal.nextRenewalAt);
            const dateLabel = Number.isNaN(renewalDate.getTime())
              ? renewal.nextRenewalAt
              : dateFormatter.format(renewalDate);

            return (
              <li
                key={`${renewal.subscriptionId}-${renewal.nextRenewalAt}-${index}`}
                className="renewals-dialog-item"
              >
                <div className="renewals-dialog-item-copy">
                  <p className="renewals-dialog-item-title">
                    {renewal.subscriptionName}
                  </p>
                  {renewal.providerName ? (
                    <p className="renewals-dialog-item-meta">
                      {renewal.providerName}
                    </p>
                  ) : null}
                  <p className="renewals-dialog-item-date">{dateLabel}</p>
                </div>
                <p className="renewals-dialog-item-amount">
                  {renewal.amount}{" "}
                  <Currency name={currency.name} symbol={currency.symbol} />
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </Dialog>
  );
};
