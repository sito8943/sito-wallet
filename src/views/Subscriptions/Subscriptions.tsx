import { useCallback, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";

// @sito/dashboard-app
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
  useTranslation,
} from "@sito/dashboard-app";

// icons
import { faAdd, faRepeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// hooks
import {
  SubscriptionsQueryKeys,
  useInfiniteSubscriptionsList,
  useMobileMultiSelection,
  useMobileNavbar,
} from "hooks";
import { useAddSubscriptionBillingLogDialog } from "./hooks"

// components
import { MobileSelectionBar } from "components";
import {
  AddSubscriptionBillingLogDialog,
  SubscriptionCard,
} from "./components";

// providers
import { useManager, useRegisterBottomNavAction } from "providers";

// lib
import {
  AppRoutes,
  FilterSubscriptionDto,
  SubscriptionDto,
  Tables,
  defaultSubscriptionsListFilters,
  getSubscriptionEditRoute,
  isFeatureDisabledBusinessError,
  normalizeListFilters,
} from "lib";

// styles
import "./styles.css";

export function Subscriptions() {
  const { t } = useTranslation();
  const navigate = useNavigate();
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
      if (!subscriptionsClient)
        throw new Error("subscriptions.featureDisabled");
      return await subscriptionsClient.softDelete(ids);
    },
    ...SubscriptionsQueryKeys.all(),
  });

  const restoreSubscription = useRestoreDialog({
    mutationFn: async (ids) => {
      if (!subscriptionsClient)
        throw new Error("subscriptions.featureDisabled");
      return await subscriptionsClient.restore(ids);
    },
    ...SubscriptionsQueryKeys.all(),
  });

  const addBillingLog = useAddSubscriptionBillingLogDialog();

  const exportSubscriptions = useExportActionMutate({
    entity: Tables.Subscriptions,
    mutationFn: async () => {
      if (!subscriptionsClient)
        throw new Error("subscriptions.featureDisabled");

      return await subscriptionsClient.export(
        normalizeListFilters(
          defaultSubscriptionsListFilters,
        ) as FilterSubscriptionDto,
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

  const openAddSubscriptionRef = useRef(() =>
    navigate(AppRoutes.subscriptionNew),
  );
  useEffect(() => {
    openAddSubscriptionRef.current = () => navigate(AppRoutes.subscriptionNew);
  }, [navigate]);

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
        onClick: () => navigate(AppRoutes.subscriptionNew),
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
                  onClick: () => navigate(AppRoutes.subscriptionNew),
                  tooltip: t("_pages:subscriptions.add"),
                }}
              />
            }
            renderComponent={(subscription) => (
              <SubscriptionCard
                actions={getActions(subscription)}
                onClick={(id: number) => navigate(getSubscriptionEditRoute(id))}
                selectionMode={mobileSelection.selectionMode}
                selected={mobileSelection.isSelected(subscription.id)}
                onSelect={mobileSelection.onToggleRowSelection}
                onLongPress={mobileSelection.onLongPressRow}
                {...subscription}
              />
            )}
          />

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
