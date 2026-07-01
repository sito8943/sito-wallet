import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  CurrentBalanceCard,
  SubscriptionForecastCard,
  BalanceHistoryCard,
  LastTransactionsCard,
} from "../components/Cards";
import { AddDashboardCardDialog } from "../components";
import { resolveCardConfig } from "../components/Cards/utils";
import type { CardConfigOverrideType } from "../components/Cards/types";
import type { TypeResumeBatchCardResultType } from "../components/Cards/TypeResume/types";
import {
  parseFormConfig,
  toTypeResumeBatchRequestItem,
} from "../components/Cards/TypeResume/utils";

// styles
import "./styles.css";

// hooks
import {
  DashboardsQueryKeys,
  useDashboardsList,
  useTransactionTypeResumeBatch,
} from "hooks";
import { useAddDashboardCard } from "../hooks";

// lib
import { DashboardCardType } from "lib";

// providers
import {
  useFeatureFlags,
  useManager,
  useRegisterBottomNavAction,
} from "providers";
import { isDashboardCardEnabled } from "../utils";
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
      isDashboardCardEnabled(item.type, subscriptionsEnabled),
    );
  }, [data, subscriptionsEnabled]);
  const [typeResumeConfigOverrides, setTypeResumeConfigOverrides] = useState<
    Record<number, CardConfigOverrideType>
  >({});
  const handleTypeResumeConfigSaved = useCallback(
    (
      cardId: number,
      baseConfig: string | null | undefined,
      savedConfig: string,
    ) => {
      setTypeResumeConfigOverrides((currentValue) => ({
        ...currentValue,
        [cardId]: { baseConfig, savedConfig },
      }));
    },
    [],
  );
  const typeResumeBatchItems = useMemo(
    () =>
      visibleItems
        .filter((item) => item.type === DashboardCardType.TypeResume)
        .map((item) => {
          const effectiveConfig = resolveCardConfig(
            item.config,
            typeResumeConfigOverrides[item.id] ?? null,
          );
          const formConfig = parseFormConfig(effectiveConfig);

          return toTypeResumeBatchRequestItem(item.id, formConfig);
        }),
    [typeResumeConfigOverrides, visibleItems],
  );
  const typeResumeBatch = useTransactionTypeResumeBatch(typeResumeBatchItems);
  const typeResumeBatchItemsByCardId = useMemo(
    () =>
      new Map(
        (typeResumeBatch.data?.items ?? []).map((item) => [item.cardId, item]),
      ),
    [typeResumeBatch.data?.items],
  );
  const typeResumeBatchResultsByCardId = useMemo(() => {
    const batchResults = new Map<number, TypeResumeBatchCardResultType>();

    typeResumeBatchItems.forEach((item) => {
      const responseItem = typeResumeBatchItemsByCardId.get(item.cardId);

      batchResults.set(item.cardId, {
        primary: responseItem?.primary,
        opposite: responseItem?.opposite,
        isLoading: typeResumeBatch.isLoading,
      });
    });

    return batchResults;
  }, [
    typeResumeBatch.isLoading,
    typeResumeBatchItems,
    typeResumeBatchItemsByCardId,
  ]);

  const dashboardReorder = useDashboardReorder({
    items: visibleItems,
    allItems: data?.items,
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
                batchResult={typeResumeBatchResultsByCardId.get(item.id)}
                onTypeResumeConfigSaved={handleTypeResumeConfigSaved}
                key={item.id}
                {...item}
              />
            </li>
          );
        case DashboardCardType.WeeklySpent:
          return null;
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
        case DashboardCardType.BalanceHistory:
          return (
            <li key={item.id} {...listItemProps}>
              <BalanceHistoryCard
                onDelete={() => {
                  void deleteDashboardCard.onClick([item.id]);
                }}
                dragHandleProps={dragHandleProps}
                key={item.id}
                {...item}
              />
            </li>
          );
        case DashboardCardType.LastTransactions:
          return (
            <li key={item.id} {...listItemProps}>
              <LastTransactionsCard
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
  }, [
    dashboardReorder,
    deleteDashboardCard,
    handleTypeResumeConfigSaved,
    typeResumeBatchResultsByCardId,
  ]);

  const openAddDashboardRef = useRef(addDashboardCard.openDialog);
  useEffect(() => {
    openAddDashboardRef.current = addDashboardCard.openDialog;
  }, [addDashboardCard.openDialog]);
  useRegisterBottomNavAction(
    useCallback(() => openAddDashboardRef.current(), []),
  );

  const hasCards = (cards?.length ?? 0) > 0;

  return !error ? (
    <section id="dashboard" className="dashboard-section">
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
