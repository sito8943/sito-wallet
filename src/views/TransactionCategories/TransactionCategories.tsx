import { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

// @sito-dashboard
import {
  Page,
  Empty,
  Error,
  useDeleteDialog,
  useRestoreDialog,
  useExportActionMutate,
  GlobalActions,
  ConfirmationDialog,
  ImportDialog,
  useImportDialog,
  PrettyGrid,
  useNotification,
} from "@sito/dashboard-app";

// icons
import { faAdd, faTags } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// providers
import { useManager, useRegisterBottomNavAction } from "providers";

// components]=
import {
  AddTransactionCategoryDialog,
  TransactionCategoryCard,
  EditTransactionCategoryDialog,
} from "./components";

// hooks
import {
  useInfiniteTransactionCategoriesList,
  TransactionCategoriesQueryKeys,
  useMobileNavbar,
} from "hooks";
import {
  useAddTransactionCategoryDialog,
  useEditTransactionCategoryDialog,
} from "./hooks";

// types
import {
  Tables,
  TransactionCategoryDto,
  ImportPreviewTransactionCategoryDto,
  TablesCamelCase,
  isFeatureDisabledBusinessError,
} from "lib";

export function TransactionCategories() {
  const { t } = useTranslation();
  const { showErrorNotification } = useNotification();

  const manager = useManager();

  const {
    data,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteTransactionCategoriesList({});

  const items = useMemo(
    () => data?.pages?.flatMap((page) => page.items) ?? [],
    [data?.pages],
  );

  useEffect(() => {
    if (!isFeatureDisabledBusinessError(error)) return;

    showErrorNotification({
      message: t("_pages:featureFlags.moduleUnavailable"),
    });
  }, [error, showErrorNotification, t]);

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

  const exportTransactionCategory = useExportActionMutate({
    entity: Tables.TransactionCategories,
    mutationFn: () => manager.TransactionCategories.export(),
  });

  const importTransactionCategories = useImportDialog<
    TransactionCategoryDto,
    ImportPreviewTransactionCategoryDto
  >({
    entity: TablesCamelCase.TransactionCategories,
    fileProcessor: (file, options) =>
      manager.TransactionCategories.processImport(file, options?.override),
    mutationFn: (data) => manager.TransactionCategories.import(data),
    ...TransactionCategoriesQueryKeys.all(),
  });

  // #endregion

  const getActions = useCallback(
    (record: TransactionCategoryDto) => [
      deleteTransactionCategory.action(record),
      restoreTransactionCategory.action(record),
    ],
    [deleteTransactionCategory, restoreTransactionCategory],
  );

  const pageToolbar = useMemo(() => {
    return [
      exportTransactionCategory.action(),
      importTransactionCategories.action(),
    ];
  }, [exportTransactionCategory, importTransactionCategories]);

  useMobileNavbar(t("_pages:transactionCategories.title"), pageToolbar);

  useRegisterBottomNavAction(
    useCallback(() => addTransactionCategory.openDialog(), [addTransactionCategory]),
  );

  return (
    <Page
      title={t("_pages:transactionCategories.title")}
      isLoading={isLoading}
      actions={pageToolbar}
      addOptions={{
        onClick: () => addTransactionCategory.openDialog(),
        disabled: isLoading,
        tooltip: t("_pages:transactionCategories.add"),
      }}
      queryKey={TransactionCategoriesQueryKeys.all().queryKey}
    >
      {!error ? (
        <>
          <PrettyGrid
            data={items}
            className="full-grid"
            hasMore={!!hasNextPage}
            loadingMore={isFetchingNextPage}
            onLoadMore={() => {
              if (!hasNextPage || isFetchingNextPage) return;
              void fetchNextPage();
            }}
            emptyComponent={
              <Empty
                message={t("_pages:transactionCategories.empty")}
                iconProps={{
                  icon: faTags,
                  className: "text-5xl max-md:text-3xl text-gray-400",
                }}
                action={{
                  icon: <FontAwesomeIcon icon={faAdd} />,
                  id: GlobalActions.Add,
                  disabled: isLoading,
                  onClick: () => addTransactionCategory.openDialog(),
                  tooltip: t("_pages:transactionCategories.add"),
                }}
              />
            }
            renderComponent={(transactionCategory) => (
              <TransactionCategoryCard
                actions={getActions(transactionCategory)}
                onClick={(id: number) => editTransactionCategory.openDialog(id)}
                {...transactionCategory}
              />
            )}
          />
          {/* Dialogs */}
          <AddTransactionCategoryDialog {...addTransactionCategory} />
          <EditTransactionCategoryDialog {...editTransactionCategory} />
          <ConfirmationDialog {...deleteTransactionCategory} />
          <ConfirmationDialog {...restoreTransactionCategory} />
          <ImportDialog {...importTransactionCategories} />
        </>
      ) : (
        <Error error={error} />
      )}
    </Page>
  );
}
