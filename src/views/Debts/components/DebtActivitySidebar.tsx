import { useTranslation } from "react-i18next";

import { IconButton, Loading } from "@sito/dashboard-app";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";

import { ActivityItem, Money } from "components";

import { formatDate, formatDateTime } from "lib";

import { RAW_INTERPOLATION } from "../constants";
import type { DebtActivitySidebarPropsType } from "../types";
import { getDebtPaymentAmountLabel } from "../utils";

export function DebtActivitySidebar(props: DebtActivitySidebarPropsType) {
  const { t, i18n } = useTranslation();

  const {
    issuedAt,
    dueAt,
    originalAmount,
    pendingAmount,
    currency,
    payments,
    paymentsLoading,
    paymentsError,
    onEditPayment,
    onDeletePayment,
    onPaymentClick,
  } = props;

  const paymentsErrorMessage =
    paymentsError instanceof Error
      ? paymentsError.message
      : typeof paymentsError === "object" &&
          paymentsError !== null &&
          "message" in paymentsError &&
          typeof paymentsError.message === "string"
        ? paymentsError.message
        : t("_accessibility:errors.500");

  return (
    <aside className="debt-editor-sidebar">
      <section className="debt-activity-section">
        <ul className="debt-activity-list">
          <li className="debt-activity-item">
            <p className="debt-activity-meta">
              {t("_entities:debt.issuedAt.label")}:{" "}
              {formatDateTime(issuedAt, i18n.language)}
            </p>
            <p className="debt-activity-meta">
              {t("_entities:debt.dueAt.label")}:{" "}
              {formatDate(dueAt, i18n.language)}
            </p>
            <p className="debt-activity-meta">
              {t("_entities:debt.originalAmount.label")}:{" "}
              <Money amount={originalAmount} currency={currency} />
            </p>
            <p className="debt-activity-meta">
              {t("_entities:debt.pendingAmount.label")}:{" "}
              <Money amount={pendingAmount} currency={currency} />
            </p>
          </li>
        </ul>
      </section>

      <section className="debt-activity-section">
        <h3 className="debt-activity-section-title">
          {t("_pages:debts.actions.payment.title")}
        </h3>

        {paymentsLoading ? (
          <Loading className="debt-activity-loading" />
        ) : paymentsError ? (
          <p className="debt-activity-error">{paymentsErrorMessage}</p>
        ) : payments.length ? (
          <ul className="debt-activity-list">
            {payments.map((payment) => {
              const paidAt = formatDateTime(payment.paidAt, i18n.language);
              const transactionId = payment.transactionId ?? null;
              const clickable = transactionId !== null && !!onPaymentClick;

              return (
                <ActivityItem
                  key={payment.id}
                  amount={<Money amount={payment.amount} currency={currency} />}
                  meta={`${t("_entities:debtPayment.paidAt.label")}: ${paidAt}`}
                  note={payment.note}
                  onClick={
                    clickable ? () => onPaymentClick(transactionId) : undefined
                  }
                  aria-label={
                    clickable
                      ? t("_pages:debts.actions.payment.openTransaction", {
                          amount: getDebtPaymentAmountLabel(
                            payment.amount,
                            currency,
                            i18n.language,
                          ),
                          paidAt,
                          interpolation: RAW_INTERPOLATION,
                        })
                      : undefined
                  }
                  actions={
                    onEditPayment || onDeletePayment ? (
                      <>
                        {onEditPayment ? (
                          <IconButton
                            icon={faPencil}
                            color="primary"
                            onClick={() => onEditPayment(payment)}
                            aria-label={t(
                              "_pages:debts.actions.editPayment.text",
                            )}
                          />
                        ) : null}
                        {onDeletePayment ? (
                          <IconButton
                            icon={faTrash}
                            color="error"
                            onClick={() => onDeletePayment(payment)}
                            aria-label={t(
                              "_pages:debts.actions.deletePayment.text",
                            )}
                          />
                        ) : null}
                      </>
                    ) : null
                  }
                />
              );
            })}
          </ul>
        ) : (
          <p className="debt-activity-empty">
            {t("_accessibility:messages.empty")}
          </p>
        )}
      </section>
    </aside>
  );
}
