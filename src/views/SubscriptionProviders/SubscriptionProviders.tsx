import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

import {
  ConfirmationDialog,
  Empty,
  Error as ErrorView,
  GlobalActions,
  Page,
  PrettyGrid,
  useDeleteDialog,
  useExportActionMutate,
  useNotification,
  useRestoreDialog,
} from "@sito/dashboard-app";

import { faAdd, faBuilding } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  SubscriptionProvidersQueryKeys,
  useInfiniteSubscriptionProvidersList,
  useMobileMultiSelection,
  useMobileNavbar,
} from "hooks";
import { MobileSelectionBar } from "components";
import { useManager, useRegisterBottomNavAction } from "providers";

import {
  FilterSubscriptionProviderDto,
  SubscriptionProviderDto,
  Tables,
  defaultSubscriptionProvidersListFilters,
  isFeatureDisabledBusinessError,
  normalizeListFilters,
} from "lib";

import {
  AddSubscriptionProviderDialog,
  EditSubscriptionProviderDialog,
  SubscriptionProviderCard,
} from "./components";
import {
  useAddSubscriptionProviderDialog,
  useEditSubscriptionProviderDialog,
} from "./hooks";

import "./styles.css";

export function SubscriptionProviders() {
  const { t } = useTranslation();
  const { showErrorNotification } = useNotification();

  const manager = useManager();
  const subscriptionProvidersClient =
    "SubscriptionProviders" in manager ? manager.SubscriptionProviders : null;

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
  });

  const pageToolbar = useMemo(
    () =>
      subscriptionProvidersClient
        ? [exportSubscriptionProviders.action()]
        : [],
    [exportSubscriptionProviders, subscriptionProvidersClient],
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
            className="full-grid max-sm:pb-6"
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
                  className: "text-5xl max-md:text-3xl text-text-muted",
                }}
                action={{
                  icon: <FontAwesomeIcon icon={faAdd} />,
                  id: GlobalActions.Add,
                  disabled: isLoading || !subscriptionProvidersClient,
                  onClick: () => addSubscriptionProvider.openDialog(),
                  tooltip: t("_pages:subscriptionProviders.add"),
                }}
              />
            }
            renderComponent={(subscriptionProvider) => (
              <SubscriptionProviderCard
                actions={getActions(subscriptionProvider)}
                onClick={(id: number) => editSubscriptionProvider.openDialog(id)}
                selectionMode={mobileSelection.selectionMode}
                selected={mobileSelection.isSelected(subscriptionProvider.id)}
                onSelect={mobileSelection.onToggleRowSelection}
                onLongPress={mobileSelection.onLongPressRow}
                {...subscriptionProvider}
              />
            )}
          />

          <AddSubscriptionProviderDialog {...addSubscriptionProvider} />
          <EditSubscriptionProviderDialog {...editSubscriptionProvider} />
          <ConfirmationDialog {...deleteSubscriptionProvider} />
          <ConfirmationDialog {...restoreSubscriptionProvider} />
        </>
      ) : (
        <ErrorView error={error} />
      )}
    </Page>
  );
}
