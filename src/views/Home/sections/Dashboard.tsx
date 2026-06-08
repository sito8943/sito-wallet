import { useCallback, useEffect, useMemo, useRef } from "react";

// @sito/dashboard-app
import {
  useDeleteDialog,
  Error,
  ConfirmationDialog,
  classNames,
} from "@sito/dashboard-app";

// components
import {
  AddCard,
  TransactionTypeResume,
  WeeklySpentCard,
  CurrentBalanceCard,
  SubscriptionForecastCard,
} from "../components/Cards";
import { AddDashboardCardDialog } from "../components";

// styles
import "./styles.css";

// hooks
import { DashboardsQueryKeys, useDashboardsList } from "hooks";
import { useAddDashboardCard } from "../hooks";

// lib
import { DashboardCardType } from "lib";

// providers
import {
  useFeatureFlags,
  useManager,
  useRegisterBottomNavAction,
} from "providers";
import { useDashboardReorder } from "./useDashboardReorder";
import { sortDashboardItems } from "./utils";

export const Dashboard = () => {
  const { data, isLoading, error } = useDashboardsList({});

  const manager = useManager();
  const { isFeatureEnabled } = useFeatureFlags();
  const subscriptionsEnabled = isFeatureEnabled("subscriptionsEnabled");

  const addDashboardCard = useAddDashboardCard();

  const deleteDashboardCard = useDeleteDialog({
    mutationFn: (data) => manager.Dashboard.delete(data),
    ...DashboardsQueryKeys.all(),
  });

  useEffect(() => {
    if (data && addDashboardCard.setValue)
      addDashboardCard.setValue("position", data.items.length);
  }, [addDashboardCard, data]);

  const visibleItems = useMemo(() => {
    if (!data) return [];
    return sortDashboardItems(data.items).filter((item) =>
      item.type === DashboardCardType.SubscriptionForecast
        ? subscriptionsEnabled
        : true,
    );
  }, [data, subscriptionsEnabled]);

  const canReorderCards = useMemo(
    () => !data || visibleItems.length === data.items.length,
    [data, visibleItems.length],
  );

  const dashboardReorder = useDashboardReorder({
    items: visibleItems,
    enabled: canReorderCards,
  });

  const cards = useMemo(() => {
    return dashboardReorder.items.map((item) => {
      const dragHandleProps = dashboardReorder.getHandleProps(item.id);
      const listItemProps = dashboardReorder.getItemProps(item.id);

      switch (item.type) {
        case DashboardCardType.TypeResume:
          return (
            <li key={item.id} {...listItemProps}>
              <TransactionTypeResume
                onDelete={() => {
                  void deleteDashboardCard.onClick([item.id]);
                }}
                dragHandleProps={dragHandleProps}
                key={item.id}
                {...item}
              />
            </li>
          );
        case DashboardCardType.WeeklySpent:
          return (
            <li key={item.id} {...listItemProps}>
              <WeeklySpentCard
                onDelete={() => {
                  void deleteDashboardCard.onClick([item.id]);
                }}
                dragHandleProps={dragHandleProps}
                key={item.id}
                {...item}
              />
            </li>
          );
        case DashboardCardType.CurrentBalance:
          return (
            <li key={item.id} {...listItemProps}>
              <CurrentBalanceCard
                onDelete={() => {
                  void deleteDashboardCard.onClick([item.id]);
                }}
                dragHandleProps={dragHandleProps}
                key={item.id}
                {...item}
              />
            </li>
          );
        case DashboardCardType.SubscriptionForecast:
          return (
            <li key={item.id} {...listItemProps}>
              <SubscriptionForecastCard
                onDelete={() => {
                  void deleteDashboardCard.onClick([item.id]);
                }}
                dragHandleProps={dragHandleProps}
                key={item.id}
                {...item}
              />
            </li>
          );
      }
    });
  }, [dashboardReorder, deleteDashboardCard]);

  const openAddDashboardRef = useRef(addDashboardCard.openDialog);
  useEffect(() => {
    openAddDashboardRef.current = addDashboardCard.openDialog;
  }, [addDashboardCard.openDialog]);
  useRegisterBottomNavAction(
    useCallback(() => openAddDashboardRef.current(), []),
  );

  const hasCards = (cards?.length ?? 0) > 0;

  return !error ? (
    <section id="dashboard">
      <ul className={classNames("dashboard", !hasCards && "empty")}>
        {cards}
        <li className="dashboard-item dashboard-item--add">
          <AddCard
            disabled={isLoading || dashboardReorder.isReordering}
            onClick={() => addDashboardCard.openDialog()}
          />
        </li>
      </ul>

      {/* Dialogs */}
      <AddDashboardCardDialog {...addDashboardCard} />
      <ConfirmationDialog {...deleteDashboardCard} />
    </section>
  ) : (
    <Error error={error} />
  );
};
