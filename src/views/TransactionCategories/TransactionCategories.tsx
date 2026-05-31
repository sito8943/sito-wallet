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
      restoreTransactionCategory.action(record),
    ],
    [deleteTransactionCategory, restoreTransactionCategory],
  );

  const mobileSelection = useMobileMultiSelection<TransactionCategoryDto>({
    items,
    getActions,
    onInteraction: transactionCategorySwipeDelete.resetSwipe,
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
                action={[
                  {
                    icon: <FontAwesomeIcon icon={faAdd} />,
                    id: GlobalActions.Add,
                    disabled: isLoading,
                    onClick: () => addTransactionCategory.openDialog(),
                    tooltip: t("_pages:transactionCategories.add"),
                  },
                  {
                    icon: <FontAwesomeIcon icon={faWandMagicSparkles} />,
                    id: "prefab-suggestions",
                    disabled: isLoading,
                    onClick: () => prefabCategories.openDialog(),
                    tooltip: t("_pages:prefabs.trySuggestions"),
                  },
                ]}
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
