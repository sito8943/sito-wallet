import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

// icons
import { faAdd, faClock } from "@fortawesome/free-solid-svg-icons";

// react-query
import { useQuery } from "@tanstack/react-query";

// @sito/dashboard-app
import type { QueryParam } from "@sito/dashboard-app";
import {
  Empty,
  IconButton,
  SortOrder,
  classNames,
  useAuth,
  useDialog,
} from "@sito/dashboard-app";

// lib
import type { FilterTransactionDto, TransactionDto } from "lib";
import { normalizeListFilters } from "lib";

// hooks
import { TransactionsQueryKeys } from "hooks";

// providers
import { useManager } from "providers";

// views
import { TransactionCard } from "views/Transactions";
import { AddTransactionDialog } from "../../../../Transactions/components";
import { useAddTransaction } from "../../../../Transactions/hooks";

// components
import { ConfigFormDialog } from "./ConfigFormDialog";
import { ActiveFilters } from "./ActiveFilters";
import { DashboardCard } from "../DashboardCard";
import { RecentTransactionsDialog } from "../RecentTransactionsDialog";
import { resolveCardConfig } from "../utils";

// styles
import "../styles.css";
import "./styles.css";

// types
import type { LastTransactionsPropsType } from "./types";
import type { CardConfigOverrideType } from "../types";

// utils
import { formToDto, getActiveFiltersCount, parseFormConfig } from "./utils";

export const LastTransactionsCard = (props: LastTransactionsPropsType) => {
  const { title, config, id, user, onDelete, dragHandleProps } = props;
  const { t } = useTranslation();
  const manager = useManager();
  const { account: authAccount } = useAuth();
  const [configOverride, setConfigOverride] =
    useState<CardConfigOverrideType | null>(null);
  const effectiveConfig = resolveCardConfig(config, configOverride);

  // Everything derives from the (opaque) config string, so a single memo keyed
  // on it keeps the React Compiler happy — deriving filters/query in separate
  // memos off `account?.id` trips preserve-manual-memoization.
  const { account, categories, limit, filters, query } = useMemo(() => {
    const parsed = parseFormConfig(effectiveConfig);
    const account = parsed.account;
    const categoryIds = parsed.categoryIds ?? [];
    const categories = parsed.categories ?? [];
    const limit = parsed.limit;
    const filters: FilterTransactionDto = {
      ...(account?.id ? { accountId: account.id } : {}),
      ...(categoryIds.length ? { category: categoryIds } : {}),
      softDeleteScope: "ACTIVE",
    };
    const query: QueryParam<TransactionDto> = {
      currentPage: 0,
      pageSize: limit,
      sortingBy: "date",
      sortingOrder: SortOrder.DESC,
    };
    return { account, categoryIds, categories, limit, filters, query };
  }, [effectiveConfig]);

  const normalizedFilters = useMemo(
    () => normalizeListFilters(filters) as FilterTransactionDto,
    [filters],
  );

  const { data, isLoading } = useQuery<TransactionDto[]>({
    queryKey: [
      ...TransactionsQueryKeys.all().queryKey,
      "lastTransactions",
      query,
      normalizedFilters,
    ],
    enabled: !!authAccount?.id,
    queryFn: async () => {
      const response = await manager.Transactions.get(query, normalizedFilters);
      return (response.items ?? []).slice(0, limit);
    },
  });

  const transactions = useMemo<TransactionDto[]>(() => data ?? [], [data]);

  // Prefill only the unambiguous: account if set, category only if exactly one.
  const addTransaction = useAddTransaction({
    account: account ?? null,
    categories: categories.length === 1 ? categories : [],
  });

  const recentTransactionsDialog = useDialog();

  return (
    <>
      <DashboardCard
        id={id}
        userId={user?.id ?? 0}
        title={title}
        config={effectiveConfig}
        className="last-transactions-card"
        onDelete={onDelete}
        dragHandleProps={dragHandleProps}
        isBusy={isLoading}
        loadingOverlay={isLoading}
        parseFormConfig={parseFormConfig}
        formToDto={(data) => formToDto(data)}
        onConfigSaved={(savedConfig) =>
          setConfigOverride({ baseConfig: config, savedConfig })
        }
        ConfigFormDialog={ConfigFormDialog}
        shouldShowActiveFiltersBadge={(formConfig) =>
          !!formConfig.showFiltersAsBadge
        }
        getActiveFiltersCount={getActiveFiltersCount}
        renderActiveFilters={({ formConfig }) => (
          <ActiveFilters
            account={formConfig.account}
            categories={formConfig.categories ?? []}
            limit={formConfig.limit}
          />
        )}
      >
        {() => (
          <div className="last-transactions-content">
            <div className="last-transactions-actions">
              <IconButton
                onClick={() => addTransaction.openDialog()}
                icon={faAdd}
                data-tooltip-id="tooltip"
                data-tooltip-content={t("_pages:transactions.add")}
                aria-label={t("_pages:transactions.add")}
              />
              <IconButton
                onClick={recentTransactionsDialog.handleOpen}
                icon={faClock}
                data-tooltip-id="tooltip"
                data-tooltip-content={t(
                  "_pages:home.dashboard.recentTransactions.action",
                )}
                aria-label={t(
                  "_pages:home.dashboard.recentTransactions.action",
                )}
              />
            </div>
            {!isLoading && transactions.length === 0 ? (
              <Empty
                message={t("_pages:home.dashboard.lastTransactions.empty")}
              />
            ) : (
              <ul className="last-transactions-list">
                {transactions.map((transaction, index) => (
                  <li
                    key={transaction.id}
                    className={classNames(
                      "last-transactions-row",
                      index === transactions.length - 1 &&
                        "last-transactions-row--faded",
                    )}
                  >
                    <TransactionCard
                      {...transaction}
                      actions={[]}
                      onClick={() => recentTransactionsDialog.handleOpen()}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </DashboardCard>
      <AddTransactionDialog {...addTransaction} />
      <RecentTransactionsDialog
        open={recentTransactionsDialog.open}
        onClose={recentTransactionsDialog.handleClose}
        title={t("_pages:home.dashboard.recentTransactions.title")}
        filters={filters}
        enabled={!!authAccount?.id}
      />
    </>
  );
};
