import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTags, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";

// @sito-dashboard
import {
  Page,
  Error,
  Empty,
  useDeleteDialog,
  useRestoreDialog,
  useExportActionMutate,
  ConfirmationDialog,
  ImportDialog,
  useImportDialog,
  PrettyGrid,
  useNotification,
} from "@sito/dashboard-app";

// providers
import { useManager, useRegisterBottomNavAction } from "providers";

// components]=
import {
  AddTransactionCategoryDialog,
  TransactionCategoryCard,
  EditTransactionCategoryDialog,
} from "./components";
import {
  MobileSelectionBar,
  PrefabCategorySuggestions,
  PrefabSuggestionsDialog,
} from "components";

// hooks
import {
  useInfiniteTransactionCategoriesList,
  TransactionCategoriesQueryKeys,
  useMobileNavbar,
  useMobileMultiSelection,
} from "hooks";
import {
  useAddTransactionCategoryDialog,
  useEditTransactionCategoryDialog,
} from "./hooks";

// types
import type {
  TransactionCategoryDto,
  FilterTransactionCategoryDto,
  ImportPreviewTransactionCategoryDto,
} from "lib";
import {
  Tables,
  TablesCamelCase,
  isFeatureDisabledBusinessError,
  defaultTransactionCategoriesListFilters,
  normalizeListFilters,
} from "lib";

// styles
import "./styles.css";

export function TransactionCategories() {
  const { t } = useTranslation();
  const { showErrorNotification } = useNotification();
  const queryClient = useQueryClient();

  const manager = useManager();

  const [prefabOpen, setPrefabOpen] = useState(false);

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
    mutationFn: () =>
      manager.TransactionCategories.export(
        normalizeListFilters(
          defaultTransactionCategoriesListFilters,
        ) as FilterTransactionCategoryDto,
      ),
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

  const mobileSelection = useMobileMultiSelection<TransactionCategoryDto>({
    items,
    getActions,
  });

  const pageToolbar = useMemo(() => {
    return [
      exportTransactionCategory.action(),
      importTransactionCategories.action(),
    ];
  }, [exportTransactionCategory, importTransactionCategories]);

  useMobileNavbar(t("_pages:transactionCategories.title"), pageToolbar);

  const openAddCategoryRef = useRef(addTransactionCategory.openDialog);
  useEffect(() => {
    openAddCategoryRef.current = addTransactionCategory.openDialog;
  }, [addTransactionCategory.openDialog]);
  useRegisterBottomNavAction(
    useCallback(() => openAddCategoryRef.current(), []),
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
          <MobileSelectionBar
            className="transaction-category-selection-bar"
            count={mobileSelection.selectedCount}
            multiActions={mobileSelection.multiActions}
            onActionClick={mobileSelection.onMultiActionClick}
            onCancel={mobileSelection.clearSelection}
          />
          <PrettyGrid
            data={items}
            className="full-grid max-sm:pb-6"
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
                  className: "text-5xl max-md:text-3xl text-text-muted",
                }}
                action={{
                  icon: <FontAwesomeIcon icon={faWandMagicSparkles} />,
                  id: "prefab-suggestions",
                  disabled: isLoading,
                  onClick: () => setPrefabOpen(true),
                  tooltip: t("_pages:prefabs.trySuggestions"),
                }}
              />
            }
            renderComponent={(transactionCategory) => (
              <TransactionCategoryCard
                actions={getActions(transactionCategory)}
                onClick={(id: number) => editTransactionCategory.openDialog(id)}
                selectionMode={mobileSelection.selectionMode}
                selected={mobileSelection.isSelected(transactionCategory.id)}
                onSelect={mobileSelection.onToggleRowSelection}
                onLongPress={mobileSelection.onLongPressRow}
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
          <PrefabSuggestionsDialog
            open={prefabOpen}
            title={t("_pages:prefabs.dialog.categoriesTitle")}
            onClose={() => setPrefabOpen(false)}
            onComplete={() =>
              void queryClient.invalidateQueries({
                queryKey: TransactionCategoriesQueryKeys.all().queryKey,
              })
            }
          >
            {(handleComplete) => (
              <PrefabCategorySuggestions onComplete={handleComplete} />
            )}
          </PrefabSuggestionsDialog>
        </>
      ) : (
        <Error error={error} />
      )}
    </Page>
  );
}
