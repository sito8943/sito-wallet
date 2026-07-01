import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faTags,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";

// @sito-dashboard
import {
  Page,
  Error,
  Empty,
  GlobalActions,
  useDeleteDialog,
  useRestoreDialog,
  useExportActionMutate,
  ConfirmationDialog,
  ImportDialog,
  useImportDialog,
  PrettyGrid,
  useNotification,
  IconButton,
} from "@sito/dashboard-app";

// providers
import { useManager, useRegisterBottomNavAction } from "providers";

// components
import {
  AddPrefabCategoriesDialog,
  AddTransactionCategoryDialog,
  TransactionCategoryCard,
  EditTransactionCategoryDialog,
} from "./components";
import { MobileSelectionBar } from "components";

// hooks
import {
  useInfiniteTransactionCategoriesList,
  TransactionCategoriesQueryKeys,
  useMobileNavbar,
  useMobileMultiSelection,
  useSwipeDeleteState,
} from "hooks";
import {
  useAddPrefabCategoriesDialog,
  useAddTransactionCategoryDialog,
  useEditTransactionCategoryDialog,
} from "./hooks";

// types
import type {
  TransactionCategoryDto,
  FilterTransactionCategoryDto,
  ImportPreviewTransactionCategoryDto,
} from "lib";
import { getDeleteAction } from "../../components/Card/utils";
import {
  Tables,
  TablesCamelCase,
  isFeatureDisabledBusinessError,
  defaultTransactionCategoriesListFilters,
  normalizeListFilters,
} from "lib";

export function TransactionCategories() {
  const { t } = useTranslation();
  const { showErrorNotification } = useNotification();

  const manager = useManager();

  const prefabCategories = useAddPrefabCategoriesDialog();

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
  const transactionCategorySwipeDelete = useSwipeDeleteState(
    deleteTransactionCategory.handleClose,
  );

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
      // restore defaults to multiple:false in the lib; enable batch restore
      // so deleted rows can be multi-selected and restored together
      { ...restoreTransactionCategory.action(record), multiple: true },
    ],
    [deleteTransactionCategory, restoreTransactionCategory],
  );

  const mobileSelection = useMobileMultiSelection<TransactionCategoryDto>({
    items,
    getActions,
    onInteraction: transactionCategorySwipeDelete.resetSwipe,
  });

  const addTransactionCategoryAction = useMemo(
    () => ({
      icon: <FontAwesomeIcon icon={faAdd} />,
      id: GlobalActions.Add,
      disabled: isLoading,
      onClick: () => addTransactionCategory.openDialog(),
      tooltip: t("_pages:transactionCategories.add"),
    }),
    [addTransactionCategory, isLoading, t],
  );

  const prefabCategoriesAction = useMemo(
    () => ({
      icon: <FontAwesomeIcon icon={faWandMagicSparkles} />,
      id: "prefab-suggestions",
      disabled: isLoading,
      onClick: () => prefabCategories.openDialog(),
      tooltip: t("_pages:prefabs.trySuggestions"),
    }),
    [isLoading, prefabCategories, t],
  );

  const pageToolbar = useMemo(() => {
    return [
      prefabCategoriesAction,
      exportTransactionCategory.action(),
      importTransactionCategories.action(),
    ];
  }, [
    exportTransactionCategory,
    importTransactionCategories,
    prefabCategoriesAction,
  ]);

  const mobilePageToolbar = useMemo(() => {
    return [
      exportTransactionCategory.action(),
      importTransactionCategories.action(),
    ];
  }, [exportTransactionCategory, importTransactionCategories]);

  useMobileNavbar(t("_pages:transactionCategories.title"), mobilePageToolbar);

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
            className="full-grid transaction-categories-grid"
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
                  className: "transaction-categories-empty-icon",
                }}
                action={[addTransactionCategoryAction, prefabCategoriesAction]}
              />
            }
            renderComponent={(transactionCategory) => {
              const actions = getActions(transactionCategory);
              const deleteAction = getDeleteAction(actions);

              return (
                <TransactionCategoryCard
                  actions={actions}
                  onClick={(id: number) =>
                    editTransactionCategory.openDialog(id)
                  }
                  selectionMode={mobileSelection.selectionMode}
                  selected={mobileSelection.isSelected(transactionCategory.id)}
                  onSelect={mobileSelection.onToggleRowSelection}
                  onLongPress={mobileSelection.onLongPressRow}
                  swipeDeleteOpen={
                    !mobileSelection.selectionMode &&
                    transactionCategorySwipeDelete.swipedId ===
                      transactionCategory.id
                  }
                  onSwipeDelete={
                    deleteAction
                      ? () => {
                          transactionCategorySwipeDelete.openSwipe(
                            transactionCategory.id,
                          );
                          deleteAction.onClick(transactionCategory);
                        }
                      : undefined
                  }
                  {...transactionCategory}
                />
              );
            }}
          />
          <IconButton
            type="button"
            icon={faWandMagicSparkles}
            variant="submit"
            color="primary"
            disabled={isLoading}
            onClick={() => prefabCategories.openDialog()}
            data-tooltip-id="tooltip"
            data-tooltip-content={t("_pages:prefabs.trySuggestions")}
            aria-label={t("_pages:prefabs.trySuggestions")}
            className="fixed right-4 bottom-20 z-30 !h-12 !w-12 !min-w-0 !rounded-full !p-0 shadow-lg sm:hidden"
          />
          {/* Dialogs */}
          <AddTransactionCategoryDialog {...addTransactionCategory} />
          <EditTransactionCategoryDialog {...editTransactionCategory} />
          <ConfirmationDialog
            {...deleteTransactionCategory}
            handleClose={transactionCategorySwipeDelete.handleDialogClose}
          />
          <ConfirmationDialog {...restoreTransactionCategory} />
          <ImportDialog {...importTransactionCategories} />
          <AddPrefabCategoriesDialog {...prefabCategories} />
        </>
      ) : (
        <Error error={error} />
      )}
    </Page>
  );
}
