import { useCallback } from "react";
import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTags } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import type { UseActionDialog } from "@sito/dashboard-app";
import { useNotification, usePostDialog } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// hooks
import { TransactionsQueryKeys } from "hooks";

// lib
import type { AssignTransactionCategoryDto, TransactionDto } from "lib";

// types
import type { AssignTransactionCategoryFormType } from "../types";
import { TransactionActions } from "../types";

// utils
import { assignCategoryFormToDto, emptyAssignCategoryForm } from "../utils";

import "./styles.css";

export function useAssignTransactionCategoryAction(): UseActionDialog<
  TransactionDto,
  AssignTransactionCategoryFormType
> {
  const { t } = useTranslation();

  const manager = useManager();
  const { showErrorNotification } = useNotification();

  const dialog = usePostDialog<
    AssignTransactionCategoryDto,
    number,
    AssignTransactionCategoryFormType
  >({
    formToDto: assignCategoryFormToDto,
    defaultValues: emptyAssignCategoryForm(),
    mutationFn: (data) => manager.Transactions.assignCategory(data),
    onSuccessMessage: t(
      "_pages:transactions.actions.assignCategory.successMessage",
    ),
    title: t("_pages:transactions.actions.assignCategory.title"),
    onError: (error) => {
      showErrorNotification({
        message: error.message || t("_accessibility:errors.500"),
      });
    },
    ...TransactionsQueryKeys.all(),
  });

  const { openDialog, reset, isLoading } = dialog;

  const handleOpenDialog = useCallback(
    (transactions: TransactionDto[]) => {
      reset?.({
        categories: [],
        transactionIds: transactions.map((item) => item.id),
      });
      openDialog();
    },
    [openDialog, reset],
  );

  const action = useCallback(
    (record: TransactionDto) => ({
      id: TransactionActions.AssignCategory,
      tooltip: t("_pages:transactions.actions.assignCategory.text"),
      icon: (
        <FontAwesomeIcon className="transaction-action-icon" icon={faTags} />
      ),
      onClick: () => handleOpenDialog([record]),
      multiple: true,
      onMultipleClick: handleOpenDialog,
      disabled: isLoading || !!record.deletedAt,
      hidden: !!record.deletedAt,
    }),
    [handleOpenDialog, isLoading, t],
  );

  return {
    action,
    ...dialog,
  };
}
