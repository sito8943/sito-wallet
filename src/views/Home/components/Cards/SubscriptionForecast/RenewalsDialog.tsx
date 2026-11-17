import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { Dialog, Empty, IconButton } from "@sito/dashboard-app";

import { faFileInvoice } from "@fortawesome/free-solid-svg-icons";

// hooks
import { useCurrenciesCommon } from "hooks/queries/useCurrenciesCommon";

// lib
import { formatDate } from "lib";

// components
import { Money } from "components";

// types
import type { RenewalsDialogPropsType } from "./types";

import "../styles.css";

export const RenewalsDialog = (props: RenewalsDialogPropsType) => {
  const {
    open,
    closeDialog,
    renewals,
    onRegisterPayment,
    registeringSubscriptionId = null,
  } = props;
  const { t, i18n } = useTranslation();
  const { data: currencies } = useCurrenciesCommon();

  const resolveCurrency = (currencyName: string | null) => {
    if (!currencyName) return { name: "", symbol: "" };
    const match = currencies?.find((c) => c.name === currencyName);
    return { name: currencyName, symbol: match?.symbol ?? "" };
  };

  return (
    <Dialog
      open={open}
      handleClose={closeDialog}
      mobileFullScreen
      title={t("_pages:home.dashboard.subscriptionForecast.details.title")}
      className="renewals-dialog"
    >
      {renewals.length === 0 ? (
        <Empty
          message={t(
            "_pages:home.dashboard.subscriptionForecast.details.empty",
          )}
        />
      ) : (
        <ul className="renewals-dialog-list">
          {renewals.map((renewal, index) => {
            const currency = resolveCurrency(renewal.currency);
            const dateLabel = formatDate(renewal.nextRenewalAt, i18n.language);

            return (
              <li
                key={`${renewal.subscriptionId}-${renewal.nextRenewalAt}-${index}`}
                className="renewals-dialog-item base-border"
              >
                <div className="renewals-dialog-item-copy">
                  <p className="renewals-dialog-item-title poppins">
                    {renewal.subscriptionName}
                  </p>
                  {renewal.providerName ? (
                    <p className="renewals-dialog-item-meta">
                      {renewal.providerName}
                    </p>
                  ) : null}
                  <p className="renewals-dialog-item-date">{dateLabel}</p>
                </div>
                <div className="renewals-dialog-item-side">
                  <p className="renewals-dialog-item-amount poppins">
                    <Money amount={renewal.amount} currency={currency} />
                  </p>
                  <IconButton
                    icon={faFileInvoice}
                    onClick={() => onRegisterPayment(renewal.subscriptionId)}
                    disabled={
                      registeringSubscriptionId === renewal.subscriptionId
                    }
                    aria-label={t(
                      "_pages:subscriptions.actions.billingLog.text",
                    )}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Dialog>
  );
};
