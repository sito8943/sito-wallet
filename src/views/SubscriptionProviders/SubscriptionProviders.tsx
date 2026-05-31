import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faBuilding,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";

import {
  ConfirmationDialog,
  Empty,
  Error as ErrorView,
  GlobalActions,
  ImportDialog,
  Page,
  PrettyGrid,
  useDeleteDialog,
  useExportActionMutate,
  useImportDialog,
  useNotification,
  useRestoreDialog,
} from "@sito/dashboard-app";

import {
  SubscriptionProvidersQueryKeys,
  useInfiniteSubscriptionProvidersList,
  useMobileMultiSelection,
  useMobileNavbar,
  useSwipeDeleteState,
} from "hooks";
import { MobileSelectionBar } from "components";
import { useManager, useRegisterBottomNavAction } from "providers";

import type {
  FilterSubscriptionProviderDto,
  ImportPreviewSubscriptionProviderDto,
  SubscriptionProviderDto,
} from "lib";
import { getDeleteAction } from "../../components/Card/utils";
import {
  Tables,
  TablesCamelCase,
  defaultSubscriptionProvidersListFilters,
  isFeatureDisabledBusinessError,
  normalizeListFilters,
} from "lib";

import {
  AddPrefabSubscriptionProvidersDialog,
  AddSubscriptionProviderDialog,
  EditSubscriptionProviderDialog,
  SubscriptionProviderCard,
} from "./components";
import {
  useAddPrefabSubscriptionProvidersDialog,
  useAddSubscriptionProviderDialog,
  useEditSubscriptionProviderDialog,
} from "./hooks";

export function SubscriptionProviders() {
  const { t } = useTranslation();
  const { showErrorNotification } = useNotification();

  const manager = useManager();
  const subscriptionProvidersClient =
    "SubscriptionProviders" in manager ? manager.SubscriptionProviders : null;

  const prefabSubscriptionProviders = useAddPrefabSubscriptionProvidersDialog();

  const {
    data,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteSubscriptionProvidersList({});

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

  const deleteSubscriptionProvider = useDeleteDialog({
    mutationFn: async (ids) => {
      if (!subscriptionProvidersClient) {
        throw new Error("subscriptions.featureDisabled");
      }

      return await subscriptionProvidersClient.softDelete(ids);
    },
    ...SubscriptionProvidersQueryKeys.all(),
  });
  const subscriptionProviderSwipeDelete = useSwipeDeleteState(
    deleteSubscriptionProvider.handleClose,
  );

  const restoreSubscriptionProvider = useRestoreDialog({
    mutationFn: async (ids) => {
      if (!subscriptionProvidersClient) {
        throw new Error("subscriptions.featureDisabled");
      }

      return await subscriptionProvidersClient.restore(ids);
    },
    ...SubscriptionProvidersQueryKeys.all(),
  });

  const addSubscriptionProvider = useAddSubscriptionProviderDialog();
  const editSubscriptionProvider = useEditSubscriptionProviderDialog();

  const exportSubscriptionProviders = useExportActionMutate({
    entity: Tables.SubscriptionProviders,
    mutationFn: async () => {
      if (!subscriptionProvidersClient) {
        throw new Error("subscriptions.featureDisabled");
      }

      return await subscriptionProvidersClient.export(
        normalizeListFilters(
          defaultSubscriptionProvidersListFilters,
        ) as FilterSubscriptionProviderDto,
      );
    },
  });

  const importSubscriptionProviders = useImportDialog<
    SubscriptionProviderDto,
    ImportPreviewSubscriptionProviderDto
  >({
    entity: TablesCamelCase.SubscriptionProviders,
    fileProcessor: async (file, options) => {
      if (!subscriptionProvidersClient) {
        throw new Error("subscriptions.featureDisabled");
      }

      return await subscriptionProvidersClient.processImport(
        file,
        options?.override,
      );
    },
    mutationFn: async (data) => {
      if (!subscriptionProvidersClient) {
        throw new Error("subscriptions.featureDisabled");
      }

      return await subscriptionProvidersClient.import(data);
    },
    ...SubscriptionProvidersQueryKeys.all(),
  });

  const getActions = useCallback(
    (record: SubscriptionProviderDto) => [
      deleteSubscriptionProvider.action(record),
      restoreSubscriptionProvider.action(record),
    ],
    [deleteSubscriptionProvider, restoreSubscriptionProvider],
  );

  const mobileSelection = useMobileMultiSelection<SubscriptionProviderDto>({
    items,
    getActions,
    onInteraction: subscriptionProviderSwipeDelete.resetSwipe,
  });

  const pageToolbar = useMemo(
    () =>
      subscriptionProvidersClient
        ? [
            exportSubscriptionProviders.action(),
            importSubscriptionProviders.action(),
          ]
        : [],
    [
      exportSubscriptionProviders,
      importSubscriptionProviders,
      subscriptionProvidersClient,
    ],
  );

  useMobileNavbar(t("_pages:subscriptionProviders.title"), pageToolbar);

  const openAddSubscriptionProviderRef = useRef(
    addSubscriptionProvider.openDialog,
  );
  useEffect(() => {
    openAddSubscriptionProviderRef.current = addSubscriptionProvider.openDialog;
  }, [addSubscriptionProvider.openDialog]);

  useRegisterBottomNavAction(
    useCallback(() => {
      if (!subscriptionProvidersClient) return;
      openAddSubscriptionProviderRef.current();
    }, [subscriptionProvidersClient]),
  );

  return (
    <Page
      title={t("_pages:subscriptionProviders.title")}
      isLoading={isLoading}
      actions={pageToolbar}
      addOptions={{
        onClick: () => addSubscriptionProvider.openDialog(),
        disabled: isLoading || !subscriptionProvidersClient,
        tooltip: t("_pages:subscriptionProviders.add"),
      }}
      queryKey={SubscriptionProvidersQueryKeys.all().queryKey}
    >
      {!error ? (
        <>
          <MobileSelectionBar
            className="subscription-provider-selection-bar"
            count={mobileSelection.selectedCount}
            multiActions={mobileSelection.multiActions}
            onActionClick={mobileSelection.onMultiActionClick}
            onCancel={mobileSelection.clearSelection}
          />
          <PrettyGrid
            data={items}
            className="full-grid subscription-providers-grid"
            hasMore={!!hasNextPage}
            loadingMore={isFetchingNextPage}
            onLoadMore={() => {
              if (!hasNextPage || isFetchingNextPage) return;
              void fetchNextPage();
            }}
            emptyComponent={
              <Empty
                message={t("_pages:subscriptionProviders.empty")}
                iconProps={{
                  icon: faBuilding,
                  className: "subscription-providers-empty-icon",
                }}
                action={[
                  {
                    icon: <FontAwesomeIcon icon={faAdd} />,
                    id: GlobalActions.Add,
                    disabled: isLoading || !subscriptionProvidersClient,
                    onClick: () => addSubscriptionProvider.openDialog(),
                    tooltip: t("_pages:subscriptionProviders.add"),
                  },
                  {
                    icon: <FontAwesomeIcon icon={faWandMagicSparkles} />,
                    id: "prefab-suggestions",
                    disabled: isLoading || !subscriptionProvidersClient,
                    onClick: () => prefabSubscriptionProviders.openDialog(),
                    tooltip: t("_pages:prefabs.trySuggestions"),
                  },
                ]}
              />
            }
            renderComponent={(subscriptionProvider) => {
              const actions = getActions(subscriptionProvider);
              const deleteAction = getDeleteAction(actions);

              return (
                <SubscriptionProviderCard
                  actions={actions}
                  onClick={(id: number) =>
                    editSubscriptionProvider.openDialog(id)
                  }
                  selectionMode={mobileSelection.selectionMode}
                  selected={mobileSelection.isSelected(subscriptionProvider.id)}
                  onSelect={mobileSelection.onToggleRowSelection}
                  onLongPress={mobileSelection.onLongPressRow}
                  swipeDeleteOpen={
                    !mobileSelection.selectionMode &&
                    subscriptionProviderSwipeDelete.swipedId ===
                      subscriptionProvider.id
                  }
                  onSwipeDelete={
                    deleteAction
                      ? () => {
                          subscriptionProviderSwipeDelete.openSwipe(
                            subscriptionProvider.id,
                          );
                          deleteAction.onClick(subscriptionProvider);
                        }
                      : undefined
                  }
                  {...subscriptionProvider}
                />
              );
            }}
          />

          <AddSubscriptionProviderDialog {...addSubscriptionProvider} />
          <EditSubscriptionProviderDialog {...editSubscriptionProvider} />
          <ConfirmationDialog
            {...deleteSubscriptionProvider}
            handleClose={subscriptionProviderSwipeDelete.handleDialogClose}
          />
          <ConfirmationDialog {...restoreSubscriptionProvider} />
          <ImportDialog {...importSubscriptionProviders} />
          <AddPrefabSubscriptionProvidersDialog
            {...prefabSubscriptionProviders}
          />
        </>
      ) : (
        <ErrorView error={error} />
      )}
    </Page>
  );
}
