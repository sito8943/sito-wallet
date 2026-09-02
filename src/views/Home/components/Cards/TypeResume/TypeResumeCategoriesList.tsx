import { useTranslation } from "react-i18next";

import { TypeResumeCategoryItem } from "./TypeResumeCategoryItem";

// types
import type { TypeResumeCategoriesListPropsType } from "./types";

import "../styles.css";

export const TypeResumeCategoriesList = (
  props: TypeResumeCategoriesListPropsType,
) => {
  const {
    categories,
    total,
    accountId,
    currencyName,
    currencySymbol,
    startDate,
    endDate,
    transactionType,
    excludedCategoryIds,
    expandedCategoryId,
    onToggle,
    onTransactionClick,
  } = props;
  const { t } = useTranslation();

  if (categories.length === 0)
    return (
      <p className="type-resume-dialog-empty poppins">
        {t("_pages:home.dashboard.transactionTypeResume.details.empty")}
      </p>
    );

  return (
    <ul className="type-resume-dialog-list">
      {categories.map((category) => (
        <TypeResumeCategoryItem
          key={category.id}
          category={category}
          open={expandedCategoryId === category.id}
          onToggle={() => onToggle(category.id)}
          total={total}
          accountId={accountId}
          currencyName={currencyName}
          currencySymbol={currencySymbol}
          startDate={startDate}
          endDate={endDate}
          transactionType={transactionType}
          excludedCategoryIds={excludedCategoryIds}
          onTransactionClick={onTransactionClick}
        />
      ))}
    </ul>
  );
};
