import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import {
  ConfirmationDialog,
  Empty,
  GlobalActions,
  Page,
  PrettyGrid,
  TabsLayout,
  useDeleteDialog,
  useNotification,
  useRestoreDialog,
} from "@sito/dashboard-app";

// components
import { QueryError } from "components";

// icons
import { faPlus, faBullseye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// hooks
import {
  GoalsQueryKeys,
  useGoalsList,
  useMobileNavbar,
  useSwipeDeleteState,
} from "hooks";
import {
  useAddGoalDialog,
  useCancelGoalDialog,
  useEditGoalDialog,
  useGoalActions,
  useGoalStatusMutation,
} from "./hooks";

// components
import { getDeleteAction } from "../../components/Card/utils";
import { AddGoalDialog, EditGoalDialog, GoalCard } from "./components";

// providers
import { useManager, useRegisterBottomNavAction } from "providers";

// lib
import { isFeatureDisabledBusinessError } from "lib";
import type { FilterGoalDto, GoalDto, GoalStatus } from "lib";

// constants
import {
  DEFAULT_GOAL_STATUS_TAB,
  GOAL_STATUS_TABS,
  GOAL_STATUS_TAB_KEYS,
} from "./constants";

// styles
import "./styles.css";

export function Goals() {
  const { t } = useTranslation();
  const { showErrorNotification } = useNotification();
  const manager = useManager();

  const [status, setStatus] = useState<GoalStatus>(DEFAULT_GOAL_STATUS_TAB);
  const filters = useMemo<FilterGoalDto>(() => ({ status }), [status]);
  const { data, isLoading, error } = useGoalsList({ filters });
  const items = useMemo(() => data?.items ?? [], [data?.items]);

  useEffect(() => {
    if (!isFeatureDisabledBusinessError(error)) return;

    showErrorNotification({
      message: t("_pages:featureFlags.moduleUnavailable"),
    });
  }, [error, showErrorNotification, t]);

  const addGoal = useAddGoalDialog({ goals: items });
  const editGoal = useEditGoalDialog({ goals: items });
  const statusMutation = useGoalStatusMutation();
  const cancelGoal = useCancelGoalDialog();

  const deleteGoal = useDeleteDialog({
    mutationFn: (ids) => manager.Goals.softDelete(ids),
    ...GoalsQueryKeys.all(),
  });
  const swipeDelete = useSwipeDeleteState(deleteGoal.handleClose);

  const restoreGoal = useRestoreDialog({
    mutationFn: (ids) => manager.Goals.restore(ids),
    ...GoalsQueryKeys.all(),
  });

  const { openDialog: openEditGoal } = editGoal;
  const { run: runStatus, pendingId } = statusMutation;
  const { onClick: openCancelGoal } = cancelGoal;

  const getStatusActions = useGoalActions({
    onEdit: openEditGoal,
    onComplete: useCallback((id) => runStatus(id, "complete"), [runStatus]),
    onReopen: useCallback((id) => runStatus(id, "reopen"), [runStatus]),
    onCancel: useCallback((id) => void openCancelGoal(id), [openCancelGoal]),
    busy: pendingId !== null,
  });

  const getActions = useCallback(
    (record: GoalDto) => [
      ...getStatusActions(record),
      deleteGoal.action(record),
      restoreGoal.action(record),
    ],
    [deleteGoal, getStatusActions, restoreGoal],
  );

  const goalsGrid = error ? (
    <QueryError error={error} />
  ) : (
    <PrettyGrid
      data={items}
      className="full-grid goals-grid"
      emptyComponent={
        <Empty
          message={t(`_pages:goals.empty.${GOAL_STATUS_TAB_KEYS[status]}`)}
          iconProps={{ icon: faBullseye }}
          action={{
            icon: <FontAwesomeIcon icon={faPlus} />,
            id: GlobalActions.Add,
            disabled: isLoading,
            onClick: () => addGoal.openDialog(),
            tooltip: t("_pages:goals.add"),
          }}
        />
      }
      renderComponent={(goal) => {
        const actions = getActions(goal);
        const deleteAction = getDeleteAction(actions);

        return (
          <GoalCard
            {...goal}
            actions={actions}
            onClick={(id) => openEditGoal(id)}
            onComplete={(record) => runStatus(record.id, "complete")}
            completing={pendingId === goal.id}
            swipeDeleteOpen={swipeDelete.swipedId === goal.id}
            onSwipeDelete={
              deleteAction
                ? () => {
                    swipeDelete.openSwipe(goal.id);
                    deleteAction.onClick(goal);
                  }
                : undefined
            }
          />
        );
      }}
    />
  );

  // Only the current tab renders the list (one request per status).
  const tabs = GOAL_STATUS_TABS.map((tabStatus) => ({
    id: tabStatus,
    label: t(`_pages:goals.tabs.${GOAL_STATUS_TAB_KEYS[tabStatus]}`),
    content: tabStatus === status ? goalsGrid : null,
  }));

  useMobileNavbar(t("_pages:goals.title"));

  const openAddRef = useRef(addGoal.openDialog);
  useEffect(() => {
    openAddRef.current = addGoal.openDialog;
  }, [addGoal.openDialog]);

  useRegisterBottomNavAction(useCallback(() => openAddRef.current(), []));

  return (
    <Page
      title={t("_pages:goals.title")}
      isLoading={isLoading}
      addOptions={{
        onClick: () => addGoal.openDialog(),
        disabled: isLoading,
        tooltip: t("_pages:goals.add"),
      }}
      queryKey={GoalsQueryKeys.all().queryKey}
    >
      <TabsLayout<GoalStatus>
        tabs={tabs}
        currentTab={status}
        onTabChange={setStatus}
        className="goals-tabs"
      />
      <AddGoalDialog {...addGoal} />
      <EditGoalDialog {...editGoal} />
      <ConfirmationDialog
        {...deleteGoal}
        handleClose={swipeDelete.handleDialogClose}
      />
      <ConfirmationDialog {...restoreGoal} />
      <ConfirmationDialog
        {...cancelGoal}
        title={t("_pages:goals.actions.cancel.confirmTitle")}
      />
    </Page>
  );
}
