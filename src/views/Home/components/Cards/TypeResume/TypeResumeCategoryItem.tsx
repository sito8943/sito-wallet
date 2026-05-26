import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import { Accordion } from "components";

import { classNames, Loading } from "@sito/dashboard-app";

import { Currency } from "../../../../Currencies";
import { useTypeResumeCategoryTransactions } from "./useTypeResumeCategoryTransactions";
import { TypeResumeTransactionItem } from "./TypeResumeTransactionItem";

import type { TypeResumeCategoryItemPropsType } from "./types";

import "../styles.css";

export const TypeResumeCategoryItem = (
  props: TypeResumeCategoryItemPropsType,
) => {
  const {
    category,
    open,
    onToggle,
    total,
    accountId,
    currencyName,
    currencySymbol,
    startDate,
    endDate,
    transactionType,
  } = props;
  const { t } = useTranslation();

  const { data, isLoading } = useTypeResumeCategoryTransactions({
    accountId,
    categoryId: category.id,
    type: transactionType,
    startDate,
    endDate,
    open,
  });

  const transactions = useMemo(() => data?.items ?? [], [data?.items]);
  const colorBarWidth = useMemo(() => {
    if (!total || total <= 0) return "0%";

    const percentage = (category.total / total) * 100;
    const normalized = Math.max(0, Math.min(100, percentage));
    return `${normalized}%`;
  }, [category.total, total]);

  return (
    <li className="type-resume-dialog-item">
      <button
        type="button"
        className="type-resume-dialog-trigger"
        onClick={onToggle}
        aria-expanded={open}
      >
        <div className="type-resume-dialog-item-copy">
          <p className="type-resume-dialog-item-title poppins">
            {category.name}
          </p>
          {category.color ? (
            <span
              className="type-resume-dialog-item-color base-border"
              style={{
                backgroundColor: category.color,
                width: colorBarWidth,
              }}
              aria-hidden="true"
            />
          ) : null}
        </div>
        <div className="type-resume-dialog-item-side">
          <p className="type-resume-dialog-item-amount poppins">
            {category.total}{" "}
            <Currency name={currencyName} symbol={currencySymbol} />
          </p>
          {isLoading ? (
            <Loading className="type-resume-dialog-item-loading" />
          ) : (
            <FontAwesomeIcon
              icon={faChevronDown}
              className={classNames(
                "type-resume-dialog-item-chevron",
                open ? "type-resume-dialog-item-chevron-open" : "",
              )}
            />
          )}
        </div>
      </button>
      <Accordion open={open} contentClassName="type-resume-dialog-accordion">
        {isLoading ? (
          <div className="type-resume-dialog-transactions-loading">
            <Loading />
          </div>
        ) : transactions.length === 0 ? (
          <p className="type-resume-dialog-transactions-empty">
            {t("_pages:transactions.empty")}
          </p>
        ) : (
          <ul className="type-resume-transaction-list">
            {transactions.map((transaction) => (
              <TypeResumeTransactionItem
                key={transaction.id}
                transaction={transaction}
                currencyName={currencyName}
                currencySymbol={currencySymbol}
              />
            ))}
          </ul>
        )}
      </Accordion>
    </li>
  );
};
