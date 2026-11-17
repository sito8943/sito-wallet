import { useTranslation } from "react-i18next";

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Dialog, Empty, GlobalActions, Loading } from "@sito/dashboard-app";

import { Money } from "components";

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
        <Empty
          message={t("_pages:subscriptions.empty")}
          action={{
            icon: <FontAwesomeIcon icon={faPlus} />,
            id: GlobalActions.Add,
            onClick: onAddSubscription,
            tooltip: t("_pages:subscriptions.add"),
          }}
        />
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
                  <Money
                    amount={subscription.amount}
                    currency={subscription.currency}
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
