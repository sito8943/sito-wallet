import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard
import { Error, SortOrder, Loading, PrettyGrid } from "@sito/dashboard-app";

// components
import { TransactionCard } from "../TransactionCard";
import { TransactionsMobileFilters } from "../TransactionsFiltersDialog";

// types
import { TransactionContainerPropsType } from "./types";

// hooks
import { useInfiniteTransactionsList } from "hooks";
import { useTransactionsMobileFiltersDialog } from "../../hooks";

export const TransactionGrid = (props: TransactionContainerPropsType) => {
  const { t } = useTranslation();

  const {
    accountId,
    categories,
    getActions,
    editAction,
    hideDeletedEntities = false,
    showFilters = false,
    setShowFilters,
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

  const items = useMemo(
    () => data?.pages?.flatMap((page) => page.items) ?? [],
    [data?.pages],
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
      <PrettyGrid
        data={items}
        className="max-sm:pb-6"
        itemClassName="w-full min-w-0"
        emptyMessage={t("_pages:transactions.empty")}
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
            {...transaction}
          />
        )}
      />
    </>
  );
};
