import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard
import type { ActionType } from "@sito/dashboard-app";
import {
  Empty,
  Error,
  GlobalActions,
  SortOrder,
  Loading,
  PrettyGrid,
  TableSelectionBar,
} from "@sito/dashboard-app";

// icons
import { faAdd, faReceipt, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// components
import { TransactionCard } from "../TransactionCard";
import { TransactionsMobileFilters } from "../TransactionsFiltersDialog";

// types
import type { TransactionContainerPropsType } from "./types";

// hooks
import { useInfiniteTransactionsList } from "hooks";
import { useTransactionsMobileFiltersDialog } from "../../hooks";

// lib
import type { TransactionDto } from "lib";

// styles
import "./styles.css";

export const TransactionGrid = (props: TransactionContainerPropsType) => {
  const { t } = useTranslation();

  const {
    accountId,
    categories,
    getActions,
    editAction,
    swipedTransactionId = null,
    hideDeletedEntities = false,
    showFilters = false,
    setShowFilters,
    onAddTransaction,
    onSwipeDeleteTrigger,
    onSwipeDeleteReset,
  } = props;

  const {
    data,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteTransactionsList({
    filters: { accountId },
    query: {
      sortingBy: "date",
      sortingOrder: SortOrder.DESC,
      pageSize: 20,
    },
  });
  const [selectedTransactions, setSelectedTransactions] = useState<number[]>(
    [],
  );

  const items = useMemo(
    () => data?.pages?.flatMap((page) => page.items) ?? [],
    [data?.pages],
  );

  const selectedTransactionsSet = useMemo(
    () => new Set(selectedTransactions),
    [selectedTransactions],
  );

  const selectedRowsData = useMemo(
    () => items.filter((item) => selectedTransactionsSet.has(item.id)),
    [items, selectedTransactionsSet],
  );
  const selectionMode = selectedRowsData.length > 0;
  const activeSwipedTransactionId = selectionMode ? null : swipedTransactionId;

  const handleClearSelection = useCallback(() => {
    setSelectedTransactions([]);
    onSwipeDeleteReset?.();
  }, [onSwipeDeleteReset]);

  const handleToggleSelection = useCallback((transactionId: number) => {
    onSwipeDeleteReset?.();
    setSelectedTransactions((previous) => {
      if (previous.includes(transactionId)) {
        return previous.filter((id) => id !== transactionId);
      }

      return [...previous, transactionId];
    });
  }, [onSwipeDeleteReset]);

  const handleLongPressSelection = useCallback((transactionId: number) => {
    onSwipeDeleteReset?.();
    setSelectedTransactions((previous) => {
      if (previous.includes(transactionId)) return previous;
      return [...previous, transactionId];
    });
  }, [onSwipeDeleteReset]);

  const multiActions = useMemo(() => {
    if (!selectedRowsData.length) return [];

    return selectedRowsData.reduce<ActionType<TransactionDto>[]>(
      (currentActions, transaction, index) => {
        const transactionActions = getActions(transaction).filter(
          (action) => action.multiple && !action.hidden,
        );

        if (index === 0) return transactionActions;

        const currentActionsMap = new Map(
          currentActions.map((action) => [action.id, action]),
        );

        return transactionActions.reduce<ActionType<TransactionDto>[]>(
          (sharedActions, action) => {
            const currentAction = currentActionsMap.get(action.id);
            if (!currentAction) return sharedActions;

            sharedActions.push({
              ...currentAction,
              ...action,
              disabled: !!(action.disabled || currentAction.disabled),
            });
            return sharedActions;
          },
          [],
        );
      },
      [],
    );
  }, [getActions, selectedRowsData]);

  const selectionBarActions = useMemo<ActionType<TransactionDto>[]>(() => {
    if (!selectionMode) return [];

    return [
      ...multiActions,
      {
        id: "cancel-selection",
        tooltip: t("_accessibility:buttons.cancel"),
        icon: <FontAwesomeIcon icon={faXmark} />,
        onClick: () => undefined,
      },
    ];
  }, [multiActions, selectionMode, t]);

  const handleMultipleActionClick = useCallback(
    (action: ActionType<TransactionDto>) => {
      if (action.id === "cancel-selection") {
        handleClearSelection();
        return;
      }

      if (!selectedRowsData.length) return;

      if (action.onMultipleClick) {
        action.onMultipleClick(selectedRowsData);
      } else {
        selectedRowsData.forEach((row) => action.onClick(row));
      }

      handleClearSelection();
    },
    [handleClearSelection, selectedRowsData],
  );

  const transactionMobileFilters = useTransactionsMobileFiltersDialog(
    categories,
    hideDeletedEntities,
    showFilters,
    () => setShowFilters?.(false),
  );

  return error ? (
    <Error error={error} />
  ) : (
    <>
      <TransactionsMobileFilters
        {...transactionMobileFilters}
        hideDeletedEntities={hideDeletedEntities}
      />
      {selectionMode && (
        <div className="transaction-grid-selection-bar">
          <TableSelectionBar
            count={selectedRowsData.length}
            multiActions={selectionBarActions}
            onActionClick={handleMultipleActionClick}
          />
        </div>
      )}
      <PrettyGrid
        data={items}
        className="transaction-grid"
        itemClassName="transaction-grid-item"
        emptyComponent={
          <Empty
            message={t("_pages:transactions.empty")}
            iconProps={{
              icon: faReceipt,
              className: "transaction-grid-empty-icon",
            }}
            action={
              onAddTransaction
                ? {
                    icon: <FontAwesomeIcon icon={faAdd} />,
                    id: GlobalActions.Add,
                    onClick: onAddTransaction,
                    tooltip: t("_pages:transactions.add"),
                  }
                : undefined
            }
          />
        }
        loading={isLoading}
        hasMore={!!hasNextPage}
        loadingMore={isFetchingNextPage}
        onLoadMore={() => {
          if (!hasNextPage || isFetchingNextPage) return;
          void fetchNextPage();
        }}
        loadMoreComponent={<Loading />}
        renderComponent={(transaction) => (
          <TransactionCard
            actions={getActions(transaction)}
            onClick={(id: number) => editAction.openDialog(id)}
            selectionMode={selectionMode}
            selected={selectedTransactionsSet.has(transaction.id)}
            onSelect={handleToggleSelection}
            onLongPress={handleLongPressSelection}
            swipeDeleteOpen={activeSwipedTransactionId === transaction.id}
            onSwipeDeleteTrigger={onSwipeDeleteTrigger}
            {...transaction}
          />
        )}
      />
    </>
  );
};
