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

import { faAdd, faRepeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  SubscriptionsQueryKeys,
  useInfiniteSubscriptionsList,
  useMobileMultiSelection,
  useMobileNavbar,
} from "hooks";
import { MobileSelectionBar } from "components";
import { useManager, useRegisterBottomNavAction } from "providers";

import {
  FilterSubscriptionDto,
  SubscriptionDto,
  Tables,
  defaultSubscriptionsListFilters,
  isFeatureDisabledBusinessError,
  normalizeListFilters,
} from "lib";

import {
  AddSubscriptionBillingLogDialog,
  AddSubscriptionDialog,
  EditSubscriptionDialog,
  SubscriptionCard,
} from "./components";
import {
  useAddSubscriptionBillingLogDialog,
  useAddSubscriptionDialog,
  useEditSubscriptionDialog,
} from "./hooks";

import "./styles.css";

export function Subscriptions() {
  const { t } = useTranslation();
  const { showErrorNotification } = useNotification();

  const manager = useManager();
  const subscriptionsClient =
    "Subscriptions" in manager ? manager.Subscriptions : null;

  const {
    data,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteSubscriptionsList({});

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

  const deleteSubscription = useDeleteDialog({
    mutationFn: async (ids) => {
      if (!subscriptionsClient) throw new Error("subscriptions.featureDisabled");
      return await subscriptionsClient.softDelete(ids);
    },
    ...SubscriptionsQueryKeys.all(),
  });

  const restoreSubscription = useRestoreDialog({
    mutationFn: async (ids) => {
      if (!subscriptionsClient) throw new Error("subscriptions.featureDisabled");
      return await subscriptionsClient.restore(ids);
    },
    ...SubscriptionsQueryKeys.all(),
  });

  const addSubscription = useAddSubscriptionDialog();
  const editSubscription = useEditSubscriptionDialog();
  const addBillingLog = useAddSubscriptionBillingLogDialog();

  const exportSubscriptions = useExportActionMutate({
    entity: Tables.Subscriptions,
    mutationFn: async () => {
      if (!subscriptionsClient) throw new Error("subscriptions.featureDisabled");

      return await subscriptionsClient.export(
        normalizeListFilters(defaultSubscriptionsListFilters) as FilterSubscriptionDto,
      );
    },
  });

  const getActions = useCallback(
    (record: SubscriptionDto) => [
      addBillingLog.action(record),
      deleteSubscription.action(record),
      restoreSubscription.action(record),
    ],
    [addBillingLog, deleteSubscription, restoreSubscription],
  );

  const mobileSelection = useMobileMultiSelection<SubscriptionDto>({
    items,
    getActions,
  });

  const pageToolbar = useMemo(
    () => (subscriptionsClient ? [exportSubscriptions.action()] : []),
    [exportSubscriptions, subscriptionsClient],
  );

  useMobileNavbar(t("_pages:subscriptions.title"), pageToolbar);

  const openAddSubscriptionRef = useRef(addSubscription.openDialog);
  useEffect(() => {
    openAddSubscriptionRef.current = addSubscription.openDialog;
  }, [addSubscription.openDialog]);

  useRegisterBottomNavAction(
    useCallback(() => {
      if (!subscriptionsClient) return;
      openAddSubscriptionRef.current();
    }, [subscriptionsClient]),
  );

  return (
    <Page
      title={t("_pages:subscriptions.title")}
      isLoading={isLoading}
      actions={pageToolbar}
      addOptions={{
        onClick: () => addSubscription.openDialog(),
        disabled: isLoading || !subscriptionsClient,
        tooltip: t("_pages:subscriptions.add"),
      }}
      queryKey={SubscriptionsQueryKeys.all().queryKey}
    >
      {!error ? (
        <>
          <MobileSelectionBar
            className="subscription-selection-bar"
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
                message={t("_pages:subscriptions.empty")}
                iconProps={{
                  icon: faRepeat,
                  className: "text-5xl max-md:text-3xl text-text-muted",
                }}
                action={{
                  icon: <FontAwesomeIcon icon={faAdd} />,
                  id: GlobalActions.Add,
                  disabled: isLoading || !subscriptionsClient,
                  onClick: () => addSubscription.openDialog(),
                  tooltip: t("_pages:subscriptions.add"),
                }}
              />
            }
            renderComponent={(subscription) => (
              <SubscriptionCard
                actions={getActions(subscription)}
                onClick={(id: number) => editSubscription.openDialog(id)}
                selectionMode={mobileSelection.selectionMode}
                selected={mobileSelection.isSelected(subscription.id)}
                onSelect={mobileSelection.onToggleRowSelection}
                onLongPress={mobileSelection.onLongPressRow}
                {...subscription}
              />
            )}
          />

          <AddSubscriptionDialog {...addSubscription} />
          <EditSubscriptionDialog {...editSubscription} />
          <AddSubscriptionBillingLogDialog {...addBillingLog} />
          <ConfirmationDialog {...deleteSubscription} />
          <ConfirmationDialog {...restoreSubscription} />
        </>
      ) : (
        <ErrorView error={error} />
      )}
    </Page>
  );
}
