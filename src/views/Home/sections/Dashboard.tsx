import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import {
  useDeleteDialog,
  Error,
  Button,
  ConfirmationDialog,
} from "@sito/dashboard-app";

// components
import {
  AddCard,
  TransactionTypeResume,
  WeeklySpentCard,
  CurrentBalanceCard,
} from "../components/Cards";
import { AddDashboardCardDialog } from "../components";
import {
  PrefabDashboardSuggestions,
  PrefabSuggestionsDialog,
} from "components";

// styles
import "./styles.css";

// hooks
import { DashboardsQueryKeys, useDashboardsList } from "hooks";
import { useAddDashboardCard } from "../hooks";

// lib
import { DashboardCardType } from "lib";

// providers
import { useManager, useRegisterBottomNavAction } from "providers";

export const Dashboard = () => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useDashboardsList({});
  const queryClient = useQueryClient();

  const manager = useManager();

  const [prefabOpen, setPrefabOpen] = useState(false);

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
                  void deleteDashboardCard.onClick([item.id]);
                }}
                key={item.id}
                {...item}
              />
            </li>
          );
        case DashboardCardType.WeeklySpent:
          return (
            <li key={item.id}>
              <WeeklySpentCard
                onDelete={() => {
                  void deleteDashboardCard.onClick([item.id]);
                }}
                key={item.id}
                {...item}
              />
            </li>
          );
        case DashboardCardType.CurrentBalance:
          return (
            <li key={item.id}>
              <CurrentBalanceCard
                onDelete={() => {
                  void deleteDashboardCard.onClick([item.id]);
                }}
                key={item.id}
                {...item}
              />
            </li>
          );
      }
    });
  }, [data, deleteDashboardCard]);

  const openAddDashboardRef = useRef(addDashboardCard.openDialog);
  useEffect(() => {
    openAddDashboardRef.current = addDashboardCard.openDialog;
  }, [addDashboardCard.openDialog]);
  useRegisterBottomNavAction(
    useCallback(() => openAddDashboardRef.current(), []),
  );

  const hasCards = (cards?.length ?? 0) > 0;
  const showPrefabs = !isLoading && !hasCards;

  return !error ? (
    <section id="dashboard">
      <ul className={hasCards ? "dashboard" : "dashboard empty"}>
        {cards}
        <li>
          <AddCard
            disabled={isLoading}
            onClick={() => addDashboardCard.openDialog()}
          />
        </li>
      </ul>

      {showPrefabs && (
        <div className="flex justify-center pt-4">
          <Button
            type="button"
            color="primary"
            variant="outlined"
            onClick={() => setPrefabOpen(true)}
          >
            <FontAwesomeIcon icon={faWandMagicSparkles} />
            {t("_pages:prefabs.trySuggestions")}
          </Button>
        </div>
      )}

      {/* Dialogs */}
      <AddDashboardCardDialog {...addDashboardCard} />
      <ConfirmationDialog {...deleteDashboardCard} />
      <PrefabSuggestionsDialog
        open={prefabOpen}
        title={t("_pages:prefabs.dialog.dashboardTitle")}
        onClose={() => setPrefabOpen(false)}
        onComplete={() =>
          void queryClient.invalidateQueries({
            queryKey: DashboardsQueryKeys.all().queryKey,
          })
        }
      >
        {(handleComplete) => (
          <PrefabDashboardSuggestions onComplete={handleComplete} />
        )}
      </PrefabSuggestionsDialog>
    </section>
  ) : (
    <Error error={error} />
  );
};
