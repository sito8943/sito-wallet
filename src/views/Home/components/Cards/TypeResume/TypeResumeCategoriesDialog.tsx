import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { Dialog, TabsLayout } from "@sito/dashboard-app";

import { EditTransactionDialog, useEditTransaction } from "views/Transactions";

import { TypeResumeCategoriesList } from "./TypeResumeCategoriesList";

// utils
import { getCurrentPeriodLabelKey, getPreviousPeriodLabelKey } from "./utils";

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
    total,
    accountId,
    currencyName,
    currencySymbol,
    startDate,
    endDate,
    transactionType,
    excludedCategoryIds,
    time,
    previous,
  } = props;
  const { t } = useTranslation();
  const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(
    null,
  );
  const [currentTab, setCurrentTab] = useState(0);
  const editTransaction = useEditTransaction();

  const handleClose = useCallback(() => {
    setExpandedCategoryId(null);
    setCurrentTab(0);
    closeDialog();
  }, [closeDialog]);

  const handleToggle = useCallback(
    (categoryId: number) =>
      setExpandedCategoryId((currentValue) =>
        currentValue === categoryId ? null : categoryId,
      ),
    [],
  );

  const sharedListProps = {
    accountId,
    currencyName,
    currencySymbol,
    transactionType,
    excludedCategoryIds,
    expandedCategoryId,
    onToggle: handleToggle,
    onTransactionClick: editTransaction.openDialog,
  };

  const tabs = previous
    ? [
        {
          id: 0,
          label: t(getCurrentPeriodLabelKey(time)),
          content: (
            <TypeResumeCategoriesList
              {...sharedListProps}
              categories={categories}
              total={total}
              startDate={startDate}
              endDate={endDate}
            />
          ),
        },
        {
          id: 1,
          label: t(getPreviousPeriodLabelKey(time)),
          content: (
            <TypeResumeCategoriesList
              {...sharedListProps}
              categories={previous.categories}
              total={previous.total}
              startDate={previous.startDate}
              endDate={previous.endDate}
            />
          ),
        },
      ]
    : [];

  return (
    <Dialog
      open={open}
      handleClose={handleClose}
      mobileFullScreen
      title={t("_pages:home.dashboard.transactionTypeResume.details.title")}
      className="type-resume-dialog"
    >
      {previous ? (
        <TabsLayout
          tabs={tabs}
          currentTab={currentTab}
          useLinks={false}
          onTabChange={(id) => {
            setCurrentTab(Number(id));
            setExpandedCategoryId(null);
          }}
          tabsContainerClassName="type-resume-dialog-tabs"
        />
      ) : (
        <TypeResumeCategoriesList
          {...sharedListProps}
          categories={categories}
          total={total}
          startDate={startDate}
          endDate={endDate}
        />
      )}
      <EditTransactionDialog {...editTransaction} containerClassName="!z-60" />
    </Dialog>
  );
};
