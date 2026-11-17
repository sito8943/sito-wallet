import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { faPlus, faStore } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// @sito/dashboard-app
import {
  ConfirmationDialog,
  Empty,
  GlobalActions,
  Page,
  PrettyGrid,
  useDeleteDialog,
  useRestoreDialog,
} from "@sito/dashboard-app";

// hooks
import {
  PurchaseProvidersQueryKeys,
  RESTORE_NAME_IN_USE_KEY,
  useInfinitePurchaseProvidersList,
  useMobileNavbar,
  useMutationErrorHandler,
  useSwipeDeleteState,
} from "hooks";

// views
import {
  RecentTransactionsDialog,
  useCatalogTransactionsDialog,
} from "views/Transactions";

// providers
import { useManager, useRegisterBottomNavAction } from "providers";

// components
import type { CatalogRowDto } from "components";
import { CatalogCard, QueryError } from "components";
import { getDeleteAction } from "../../components/Card/utils";
import {
  AddPurchaseProviderDialog,
  EditPurchaseProviderDialog,
} from "./components";

// hooks
import {
  useAddPurchaseProviderDialog,
  useEditPurchaseProviderDialog,
} from "./hooks";

export function PurchaseProviders() {
  const { t } = useTranslation();
  const manager = useManager();

  const handleMutationError = useMutationErrorHandler();

  const {
    data,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfinitePurchaseProvidersList({});
  const items = useMemo<CatalogRowDto[]>(
    () => data?.pages?.flatMap((page) => page.items) ?? [],
    [data?.pages],
  );

  const addPurchaseProvider = useAddPurchaseProviderDialog();
  const editPurchaseProvider = useEditPurchaseProviderDialog();
  const deletePurchaseProvider = useDeleteDialog({
    mutationFn: (ids) => manager.PurchaseProviders.softDelete(ids),
    ...PurchaseProvidersQueryKeys.all(),
  });
  const swipeDelete = useSwipeDeleteState(deletePurchaseProvider.handleClose);
  const restorePurchaseProvider = useRestoreDialog({
    mutationFn: (ids) => manager.PurchaseProviders.restore(ids),
    onError: (restoreError) =>
      handleMutationError(restoreError, { uniqueKey: RESTORE_NAME_IN_USE_KEY }),
    ...PurchaseProvidersQueryKeys.all(),
  });

  const purchaseProviderTransactions = useCatalogTransactionsDialog({
    filterKey: "purchaseProviderId",
    emptyMessage: t("_pages:purchaseProviders.transactionsEmpty"),
  });

  const getActions = useCallback(
    (record: CatalogRowDto) => [
      purchaseProviderTransactions.action(record),
      deletePurchaseProvider.action(record),
      restorePurchaseProvider.action(record),
    ],
    [
      deletePurchaseProvider,
      restorePurchaseProvider,
      purchaseProviderTransactions,
    ],
  );

  useMobileNavbar(t("_pages:purchaseProviders.title"));

  const openAddRef = useRef(addPurchaseProvider.openDialog);
  useEffect(() => {
    openAddRef.current = addPurchaseProvider.openDialog;
  }, [addPurchaseProvider.openDialog]);

  useRegisterBottomNavAction(useCallback(() => openAddRef.current(), []));

  return (
    <Page
      title={t("_pages:purchaseProviders.title")}
      isLoading={isLoading}
      addOptions={{
        onClick: () => addPurchaseProvider.openDialog(),
        disabled: isLoading,
        tooltip: t("_pages:purchaseProviders.add"),
      }}
      queryKey={PurchaseProvidersQueryKeys.all().queryKey}
    >
      {error ? (
        <QueryError error={error} />
      ) : (
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
                message={t("_pages:purchaseProviders.empty")}
                iconProps={{ icon: faStore }}
                action={{
                  icon: <FontAwesomeIcon icon={faPlus} />,
                  id: GlobalActions.Add,
                  disabled: isLoading,
                  onClick: () => addPurchaseProvider.openDialog(),
                  tooltip: t("_pages:purchaseProviders.add"),
                }}
              />
            }
            renderComponent={(item) => {
              const actions = getActions(item);
              const deleteAction = getDeleteAction(actions);

              return (
                <CatalogCard
                  {...item}
                  actions={actions}
                  showPhoto
                  onClick={(id) => editPurchaseProvider.openDialog(id)}
                  editLabel={t("_pages:purchaseProviders.forms.edit")}
                  editAriaLabel={t("_pages:purchaseProviders.forms.editAria")}
                  swipeDeleteOpen={swipeDelete.swipedId === item.id}
                  onSwipeDelete={
                    deleteAction
                      ? () => {
                          swipeDelete.openSwipe(item.id);
                          deleteAction.onClick(item);
                        }
                      : undefined
                  }
                />
              );
            }}
          />
          <AddPurchaseProviderDialog {...addPurchaseProvider} />
          <EditPurchaseProviderDialog {...editPurchaseProvider} />
          <RecentTransactionsDialog {...purchaseProviderTransactions.dialog} />
          <ConfirmationDialog
            {...deletePurchaseProvider}
            handleClose={swipeDelete.handleDialogClose}
          />
          <ConfirmationDialog {...restorePurchaseProvider} />
        </>
      )}
    </Page>
  );
}
