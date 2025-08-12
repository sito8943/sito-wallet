import { useCallback } from "react";
import { useTranslation } from "react-i18next";

// providers
import { useManager } from "providers";

// components
import { ConfirmationDialog, Error, Page, PrettyGrid } from "components";
import {
  AddTransactionCategoryDialog,
  TransactionCategoryCard,
  EditTransactionCategoryDialog,
} from "./components";

// hooks
import {
  useDeleteDialog,
  useTransactionCategoriesList,
  TransactionCategoriesQueryKeys,
  useRestoreDialog,
} from "hooks";
import {
  useAddTransactionCategoryDialog,
  useEditTransactionCategoryDialog,
} from "./hooks";

// types
import { TransactionCategoryDto } from "lib";

export function TransactionCategories() {
  const { t } = useTranslation();

  const manager = useManager();

  const { data, isLoading, error } = useTransactionCategoriesList({});

  // #region actions

  const deleteTransactionCategory = useDeleteDialog({
    mutationFn: (data) => manager.TransactionCategories.softDelete(data),
    ...TransactionCategoriesQueryKeys.all(),
  });

  const restoreTransactionCategory = useRestoreDialog({
    mutationFn: (data) => manager.TransactionCategories.restore(data),
    ...TransactionCategoriesQueryKeys.all(),
  });

  const addTransactionCategory = useAddTransactionCategoryDialog();

  const editTransactionCategory = useEditTransactionCategoryDialog();

  // #endregion

  const getActions = useCallback(
    (record: TransactionCategoryDto) => [
      deleteTransactionCategory.action(record),
      restoreTransactionCategory.action(record),
    ],
    [deleteTransactionCategory, restoreTransactionCategory]
  );

  return (
    <Page
      title={t("_pages:transactionCategories.title")}
      isLoading={isLoading}
      addOptions={{
        onClick: () => addTransactionCategory.onClick(),
        disabled: isLoading,
        tooltip: t("_pages:transactionCategories.add"),
      }}
      queryKey={TransactionCategoriesQueryKeys.all().queryKey}
    >
      {!error ? (
        <>
          <PrettyGrid
            data={data?.items}
            emptyMessage={t("_pages:transactionCategories.empty")}
            renderComponent={(transactionCategory) => (
              <TransactionCategoryCard
                actions={getActions(transactionCategory)}
                onClick={(id: number) => editTransactionCategory.onClick(id)}
                {...transactionCategory}
              />
            )}
          />
          {/* Dialogs */}
          <AddTransactionCategoryDialog {...addTransactionCategory} />
          <EditTransactionCategoryDialog {...editTransactionCategory} />
          <ConfirmationDialog {...deleteTransactionCategory} />
          <ConfirmationDialog {...restoreTransactionCategory} />
        </>
      ) : (
        <Error message={error?.message} />
      )}
    </Page>
  );
}
