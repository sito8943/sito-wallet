import { useEffect, useMemo } from "react";

// @sito/dashboard-app
import {
  useDeleteDialog,
  Error,
  ConfirmationDialog,
} from "@sito/dashboard-app";

// components
import { AddCard, TransactionTypeResume } from "../components/Cards";
import { AddDashboardCardDialog } from "../components";

// styles
import "./styles.css";

// hooks
import { DashboardsQueryKeys, useDashboardsList } from "hooks";
import { useAddDashboardCard } from "../hooks";

// lib
import { DashboardCardType } from "lib";

// providers
import { useManager } from "providers";

export const Dashboard = () => {
  const { data, isLoading, error } = useDashboardsList({});

  const manager = useManager();

  const addDashboardCard = useAddDashboardCard();

  const deleteDashboardCard = useDeleteDialog({
    mutationFn: (data) => manager.Dashboard.delete(data),
    ...DashboardsQueryKeys.all(),
  });

  useEffect(() => {
    if (data && addDashboardCard.setValue)
      addDashboardCard.setValue("position", data.items.length);
  }, [addDashboardCard, data]);

  const cards = useMemo(() => {
    if (!data) return [];
    return data.items.map((item) => {
      switch (item.type) {
        case DashboardCardType.TypeResume:
          return (
            <li key={item.id}>
              <TransactionTypeResume
                onDelete={() => {
                  deleteDashboardCard.onClick([item.id]);
                }}
                key={item.id}
                {...item}
              />
            </li>
          );
      }
    });
  }, [data, deleteDashboardCard]);

  return !error ? (
    <section id="dashboard">
      <ul className={cards?.length ? "dashboard" : "dashboard empty"}>
        {cards}
        <li>
          <AddCard
            disabled={isLoading}
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
