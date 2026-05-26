import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { Dialog } from "@sito/dashboard-app";

import { TypeResumeCategoryItem } from "./TypeResumeCategoryItem";

// types
import type { TypeResumeCategoriesDialogPropsType } from "./types";

import "../styles.css";

export const TypeResumeCategoriesDialog = (
  props: TypeResumeCategoriesDialogPropsType,
) => {
  const {
    open,
    closeDialog,
    categories,
    accountId,
    currencyName,
    currencySymbol,
    startDate,
    endDate,
    transactionType,
  } = props;
  const { t } = useTranslation();
  const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(
    null,
  );

  const handleClose = useCallback(() => {
    setExpandedCategoryId(null);
    closeDialog();
  }, [closeDialog]);

  return (
    <Dialog
      open={open}
      handleClose={handleClose}
      mobileFullScreen
      title={t("_pages:home.dashboard.transactionTypeResume.details.title")}
      className="type-resume-dialog"
    >
      {categories.length === 0 ? (
        <p className="type-resume-dialog-empty poppins">
          {t("_pages:home.dashboard.transactionTypeResume.details.empty")}
        </p>
      ) : (
        <ul className="type-resume-dialog-list">
          {categories.map((category) => (
            <TypeResumeCategoryItem
              key={category.id}
              category={category}
              open={expandedCategoryId === category.id}
              onToggle={() =>
                setExpandedCategoryId((currentValue) =>
                  currentValue === category.id ? null : category.id,
                )
              }
              accountId={accountId}
              currencyName={currencyName}
              currencySymbol={currencySymbol}
              startDate={startDate}
              endDate={endDate}
              transactionType={transactionType}
            />
          ))}
        </ul>
      )}
    </Dialog>
  );
};
