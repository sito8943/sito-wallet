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
import { faAdd, faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// hooks
import {
  DebtsQueryKeys,
  useInfiniteDebtsList,
  useMobileMultiSelection,
  useMobileNavbar,
  useSwipeDeleteState,
} from "hooks";
import { useAddDebtPaymentDialog, useCancelDebtDialog } from "./hooks";

// components
import { MobileSelectionBar } from "components";
import { AddDebtPaymentDialog, DebtCard } from "./components";

// providers
import { useManager, useRegisterBottomNavAction } from "providers";

// lib
import type { DebtDto, FilterDebtDto } from "lib";
import { getDeleteAction } from "../../components/Card/utils";
import {
  AppRoutes,
  Tables,
  defaultDebtsListFilters,
  getDebtEditRoute,
  isFeatureDisabledBusinessError,
  normalizeListFilters,
} from "lib";

// styles
import "./styles.css";

export function Debts() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showErrorNotification } = useNotification();

  const manager = useManager();
  const debtsClient = "Debts" in manager ? manager.Debts : null;

  const {
    data,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteDebtsList({});

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

  const deleteDebt = useDeleteDialog({
    mutationFn: async (ids) => {
      if (!debtsClient) throw new Error("debts.featureDisabled");
      return await debtsClient.softDelete(ids);
    },
    ...DebtsQueryKeys.all(),
  });
  const debtSwipeDelete = useSwipeDeleteState(deleteDebt.handleClose);

  const restoreDebt = useRestoreDialog({
    mutationFn: async (ids) => {
      if (!debtsClient) throw new Error("debts.featureDisabled");
      return await debtsClient.restore(ids);
    },
    ...DebtsQueryKeys.all(),
  });

  const addPayment = useAddDebtPaymentDialog();
  const cancelDebt = useCancelDebtDialog();

  const exportDebts = useExportActionMutate({
    entity: Tables.Debts,
    mutationFn: async () => {
      if (!debtsClient) throw new Error("debts.featureDisabled");

      return await debtsClient.export(
        normalizeListFilters(defaultDebtsListFilters) as FilterDebtDto,
      );
    },
  });

  const getActions = useCallback(
    (record: DebtDto) => [
      addPayment.action(record),
      cancelDebt.action(record),
      deleteDebt.action(record),
      // restore defaults to multiple:false in the lib; enable batch restore
      { ...restoreDebt.action(record), multiple: true },
    ],
    [addPayment, cancelDebt, deleteDebt, restoreDebt],
  );

  const mobileSelection = useMobileMultiSelection<DebtDto>({
    items,
    getActions,
    onInteraction: debtSwipeDelete.resetSwipe,
  });

  const pageToolbar = useMemo(
    () => (debtsClient ? [exportDebts.action()] : []),
    [exportDebts, debtsClient],
  );

  useMobileNavbar(t("_pages:debts.title"), pageToolbar);

  const openAddDebtRef = useRef(() => navigate(AppRoutes.debtNew));
  useEffect(() => {
    openAddDebtRef.current = () => navigate(AppRoutes.debtNew);
  }, [navigate]);

  useRegisterBottomNavAction(
    useCallback(() => {
      if (!debtsClient) return;
      openAddDebtRef.current();
    }, [debtsClient]),
  );

  return (
    <Page
      title={t("_pages:debts.title")}
      isLoading={isLoading}
      actions={pageToolbar}
      addOptions={{
        onClick: () => navigate(AppRoutes.debtNew),
        disabled: isLoading || !debtsClient,
        tooltip: t("_pages:debts.add"),
      }}
      queryKey={DebtsQueryKeys.all().queryKey}
    >
      {!error ? (
        <>
          <MobileSelectionBar
            className="debt-selection-bar"
            count={mobileSelection.selectedCount}
            multiActions={mobileSelection.multiActions}
            onActionClick={mobileSelection.onMultiActionClick}
            onCancel={mobileSelection.clearSelection}
          />
          <PrettyGrid
            data={items}
            className="full-grid debts-grid"
            hasMore={!!hasNextPage}
            loadingMore={isFetchingNextPage}
            onLoadMore={() => {
              if (!hasNextPage || isFetchingNextPage) return;
              void fetchNextPage();
            }}
            emptyComponent={
              <Empty
                message={t("_pages:debts.empty")}
                iconProps={{
                  icon: faHandHoldingDollar,
                  className: "debts-empty-icon",
                }}
                action={{
                  icon: <FontAwesomeIcon icon={faAdd} />,
                  id: GlobalActions.Add,
                  disabled: isLoading || !debtsClient,
                  onClick: () => navigate(AppRoutes.debtNew),
                  tooltip: t("_pages:debts.add"),
                }}
              />
            }
            renderComponent={(debt) => {
              const actions = getActions(debt);
              const deleteAction = getDeleteAction(actions);

              return (
                <DebtCard
                  actions={actions}
                  onClick={(id: number) => navigate(getDebtEditRoute(id))}
                  selectionMode={mobileSelection.selectionMode}
                  selected={mobileSelection.isSelected(debt.id)}
                  onSelect={mobileSelection.onToggleRowSelection}
                  onLongPress={mobileSelection.onLongPressRow}
                  swipeDeleteOpen={
                    !mobileSelection.selectionMode &&
                    debtSwipeDelete.swipedId === debt.id
                  }
                  onSwipeDelete={
                    deleteAction
                      ? () => {
                          debtSwipeDelete.openSwipe(debt.id);
                          deleteAction.onClick(debt);
                        }
                      : undefined
                  }
                  {...debt}
                />
              );
            }}
          />

          <AddDebtPaymentDialog {...addPayment} />
          <ConfirmationDialog
            {...deleteDebt}
            handleClose={debtSwipeDelete.handleDialogClose}
          />
          <ConfirmationDialog {...restoreDebt} />
          <ConfirmationDialog
            {...cancelDebt}
            title={t("_pages:debts.actions.cancel.confirmTitle")}
          />
        </>
      ) : (
        <ErrorView error={error} />
      )}
    </Page>
  );
}
