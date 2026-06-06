import { useTranslation } from "react-i18next";

import { IconButton, Loading } from "@sito/dashboard-app";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import { Currency } from "views/Currencies/components/Currency";

import { formatDateTime } from "lib";

import type { DebtActivitySidebarPropsType } from "../types";

export function DebtActivitySidebar(props: DebtActivitySidebarPropsType) {
  const { t } = useTranslation();

  const {
    issuedAt,
    dueAt,
    originalAmount,
    pendingAmount,
    currency,
    payments,
    paymentsLoading,
    paymentsError,
    onDeletePayment,
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
              {t("_entities:debt.issuedAt.label")}: {formatDateTime(issuedAt)}
            </p>
            <p className="debt-activity-meta">
              {t("_entities:debt.dueAt.label")}: {formatDateTime(dueAt)}
            </p>
            <p className="debt-activity-meta">
              {t("_entities:debt.originalAmount.label")}: {originalAmount ?? 0}{" "}
              <Currency name={currency?.name} symbol={currency?.symbol} />
            </p>
            <p className="debt-activity-meta">
              {t("_entities:debt.pendingAmount.label")}: {pendingAmount ?? 0}{" "}
              <Currency name={currency?.name} symbol={currency?.symbol} />
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
              const paidAtDate = new Date(payment.paidAt);
              const paidAt = Number.isNaN(paidAtDate.getTime())
                ? payment.paidAt
                : paidAtDate.toLocaleString();

              return (
                <li key={payment.id} className="debt-activity-item">
                  <div className="debt-activity-item-row">
                    <p className="debt-activity-amount">
                      {payment.amount}{" "}
                      <Currency
                        name={currency?.name}
                        symbol={currency?.symbol}
                      />
                    </p>
                    {onDeletePayment ? (
                      <IconButton
                        icon={faTrash}
                        onClick={() => onDeletePayment(payment)}
                        aria-label={t(
                          "_pages:debts.actions.deletePayment.text",
                        )}
                      />
                    ) : null}
                  </div>
                  <p className="debt-activity-meta">
                    {t("_entities:debtPayment.paidAt.label")}: {paidAt}
                  </p>
                  {payment.note ? (
                    <p className="debt-activity-note">{payment.note}</p>
                  ) : null}
                </li>
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
