import { useCallback } from "react";
import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTags } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import { useFormDialog, UseActionDialog } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// hooks
import { TransactionsQueryKeys } from "hooks";

// lib
import { AssignTransactionCategoryDto, TransactionDto } from "lib";

// types
import {
  AssignTransactionCategoryFormType,
  TransactionActions,
} from "../types";

// utils
import {
  assignCategoryFormToDto,
  emptyAssignCategoryForm,
} from "../utils";

export function useAssignTransactionCategoryAction(): UseActionDialog<
  TransactionDto,
  AssignTransactionCategoryFormType
> {
  const { t } = useTranslation();

  const manager = useManager();

  const dialog = useFormDialog<
    AssignTransactionCategoryDto,
    AssignTransactionCategoryDto,
    number,
    AssignTransactionCategoryFormType
  >({
    formToDto: assignCategoryFormToDto,
    defaultValues: emptyAssignCategoryForm(),
    mutationFn: (data) => manager.Transactions.assignCategory(data),
    onSuccessMessage: t(
      "_pages:transactions.actions.assignCategory.successMessage"
    ),
    title: t("_pages:transactions.actions.assignCategory.title"),
    ...TransactionsQueryKeys.all(),
  });

  const { openDialog, reset, isLoading } = dialog;

  const handleOpenDialog = useCallback(
    (transactions: TransactionDto[]) => {
      reset?.({
        category: null,
        transactionIds: transactions.map((item) => item.id),
      });
      openDialog();
    },
    [openDialog, reset]
  );

  const action = useCallback(
    (record: TransactionDto) => ({
      id: TransactionActions.AssignCategory,
      tooltip: t("_pages:transactions.actions.assignCategory.text"),
      icon: <FontAwesomeIcon className="text-bg-primary" icon={faTags} />,
      onClick: () => handleOpenDialog([record]),
      multiple: true,
      onMultipleClick: handleOpenDialog,
      disabled: isLoading || !!record.deletedAt,
      hidden: !!record.deletedAt,
    }),
    [handleOpenDialog, isLoading, t]
  );

  return {
    action,
    ...dialog,
  };
}
