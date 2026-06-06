import { useTranslation } from "react-i18next";

import { Button, Dialog, Loading } from "@sito/dashboard-app";

import { Currency } from "../../../../Currencies";

import type { SelectSubscriptionDialogPropsType } from "./types";

import "../styles.css";

export const SelectSubscriptionDialog = (
  props: SelectSubscriptionDialogPropsType,
) => {
  const {
    open,
    handleClose,
    subscriptions,
    isLoading = false,
    errorMessage,
    onSelect,
    onAddSubscription,
  } = props;
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      handleClose={handleClose}
      title={t("_pages:subscriptions.actions.billingLog.title")}
      className="select-subscription-dialog"
    >
      {isLoading ? (
        <div className="select-subscription-dialog-loading">
          <Loading />
        </div>
      ) : errorMessage ? (
        <p className="select-subscription-dialog-empty">{errorMessage}</p>
      ) : subscriptions.length === 0 ? (
        <div className="select-subscription-dialog-empty-state">
          <p className="select-subscription-dialog-empty">
            {t("_pages:subscriptions.empty")}
          </p>
          <Button type="button" color="primary" onClick={onAddSubscription}>
            {t("_pages:subscriptions.add")}
          </Button>
        </div>
      ) : (
        <ul className="select-subscription-dialog-list">
          {subscriptions.map((subscription) => (
            <li key={subscription.id}>
              <button
                type="button"
                onClick={() => onSelect(subscription)}
                className="select-subscription-dialog-item base-border"
              >
                <div className="select-subscription-dialog-item-copy">
                  <p className="select-subscription-dialog-item-title poppins">
                    {subscription.name}
                  </p>
                  {subscription.provider?.name ? (
                    <p className="select-subscription-dialog-item-meta">
                      {subscription.provider.name}
                    </p>
                  ) : null}
                </div>
                <p className="select-subscription-dialog-item-amount poppins">
                  {subscription.amount}{" "}
                  <Currency
                    name={subscription.currency?.name}
                    symbol={subscription.currency?.symbol}
                  />
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Dialog>
  );
};

export default SelectSubscriptionDialog;
