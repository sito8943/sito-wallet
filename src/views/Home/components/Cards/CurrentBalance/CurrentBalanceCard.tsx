import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

// icons
import {
  faAdd,
  faClock,
  faMoneyBillTransfer,
  faScaleBalanced,
} from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import { IconButton, useDialog } from "@sito/dashboard-app";

// hooks
import { useAccountById } from "hooks";
import {
  useAdjustBalanceMutation,
  useTransferDialog,
} from "../../../../Accounts/hooks";
import { useAddTransaction } from "../../../../Transactions/hooks";

// components
import { Currency } from "../../../../Currencies";
import { AdjustBalanceDialog } from "../../../../Accounts/components/AdjustBalanceDialog";
import { TransferDialog } from "../../../../Accounts/components/TransferDialog";
import { AddTransactionDialog } from "../../../../Transactions/components";
import { ConfigFormDialog } from "./ConfigFormDialog";
import { ActiveFilters } from "./ActiveFilters";
import { DashboardCard } from "../DashboardCard";
import { RecentTransactionsDialog } from "../RecentTransactionsDialog";
import { LastTransactionsList } from "../LastTransactions";
import { resolveCardConfig } from "../utils";

// styles
import "../styles.css";

// types
import type { CurrentBalancePropsType } from "./types";
import type { CardConfigOverrideType } from "../types";
import type { FilterTransactionDto } from "lib";

// utils
import {
  formToDto,
  getActiveFiltersCount,
  parseFormConfig,
  roundCurrency,
} from "./utils";

export const CurrentBalanceCard = (props: CurrentBalancePropsType) => {
  const { title, config, id, user, onDelete, dragHandleProps } = props;
  const { t } = useTranslation();
  const [configOverride, setConfigOverride] =
    useState<CardConfigOverrideType | null>(null);
  const effectiveConfig = resolveCardConfig(config, configOverride);

  const { accountId, showDebts, showLastTransactions } = useMemo(() => {
    try {
      const parsed = parseFormConfig(effectiveConfig);
      return {
        accountId: parsed.account?.id,
        showDebts: !!parsed.showDebts,
        showLastTransactions: !!parsed.showLastTransactions,
      };
    } catch {
      return {
        accountId: undefined,
        showDebts: false,
        showLastTransactions: false,
      };
    }
  }, [effectiveConfig]);

  const { data: accountData, isLoading } = useAccountById({
    id: accountId,
    includePendingDebts: showDebts,
    includeLastTransactions: showLastTransactions,
  });
  const account = accountData ?? null;

  const balance = account?.balance ?? 0;
  const symbol = account?.currency?.symbol ?? "";
  const currencyName = account?.currency?.name ?? "";

  const pendingDebt = roundCurrency(account?.pendingDebts ?? 0);
  const realBalance = roundCurrency(balance - pendingDebt);

  const recentTransactionsDialog = useDialog();

  const adjustBalance = useAdjustBalanceMutation();
  const addTransaction = useAddTransaction({
    account,
  });
  const transfer = useTransferDialog();
  const canTransfer = account ? transfer.canTransfer(account) : false;

  const recentTransactionsFilters = useMemo<FilterTransactionDto>(
    () => ({
      ...(accountId ? { accountId } : {}),
      softDeleteScope: "ACTIVE",
    }),
    [accountId],
  );

  const lastTransactions = account?.lastTransactions ?? [];

  return (
    <>
      <DashboardCard
        id={id}
        userId={user?.id ?? 0}
        title={title}
        config={effectiveConfig}
        onDelete={onDelete}
        dragHandleProps={dragHandleProps}
        isBusy={isLoading}
        loadingOverlay={isLoading}
        parseFormConfig={parseFormConfig}
        formToDto={formToDto}
        onConfigSaved={(savedConfig) =>
          setConfigOverride({ baseConfig: config, savedConfig })
        }
        ConfigFormDialog={ConfigFormDialog}
        shouldShowActiveFiltersBadge={(formConfig) =>
          !!formConfig.showFiltersAsBadge
        }
        getActiveFiltersCount={getActiveFiltersCount}
        renderActiveFilters={({ formConfig }) => (
          <ActiveFilters account={formConfig.account} />
        )}
      >
        {() => (
          <div className="current-balance-content">
            <div className="current-balance-summary">
              <div className="current-balance-amounts">
                <p className="current-balance-amount poppins">
                  {isLoading ? "…" : balance}{" "}
                  <Currency name={currencyName} symbol={symbol} />
                </p>
                {account && showDebts && pendingDebt > 0 && (
                  <p className="current-balance-real">
                    {t("_pages:home.dashboard.currentBalance.realBalance")}:{" "}
                    {realBalance}{" "}
                    <Currency name={currencyName} symbol={symbol} />{" "}
                    <span className="current-balance-debt">
                      · {t("_pages:home.dashboard.currentBalance.pendingDebts")}{" "}
                      −{pendingDebt}{" "}
                      <Currency name={currencyName} symbol={symbol} />
                    </span>
                  </p>
                )}
              </div>
              {account && (
                <div className="current-balance-actions">
                  <IconButton
                    onClick={() => addTransaction.openDialog()}
                    icon={faAdd}
                    data-tooltip-id="tooltip"
                    data-tooltip-content={t("_pages:transactions.add")}
                    aria-label={t("_pages:transactions.add")}
                  />
                  <IconButton
                    disabled={!canTransfer}
                    onClick={() => transfer.openTransferDialog(account)}
                    icon={faMoneyBillTransfer}
                    data-tooltip-id="tooltip"
                    data-tooltip-content={t(
                      canTransfer
                        ? "_pages:accounts.actions.transfer.text"
                        : "_pages:accounts.actions.transfer.unavailable",
                    )}
                    aria-label={t("_pages:accounts.actions.transfer.text")}
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
                  <IconButton
                    disabled={adjustBalance.isLoading}
                    onClick={() => {
                      adjustBalance.action(account).onClick?.();
                    }}
                    icon={faScaleBalanced}
                    data-tooltip-id="tooltip"
                    data-tooltip-content={t(
                      "_pages:accounts.actions.adjustBalance.text",
                    )}
                    aria-label={t("_pages:accounts.actions.adjustBalance.text")}
                  />
                </div>
              )}
            </div>
            {account && showLastTransactions ? (
              <LastTransactionsList
                transactions={lastTransactions}
                isLoading={isLoading}
                onClick={recentTransactionsDialog.handleOpen}
              />
            ) : null}
          </div>
        )}
      </DashboardCard>
      <AdjustBalanceDialog {...adjustBalance} />
      <AddTransactionDialog {...addTransaction} />
      <TransferDialog {...transfer} />
      <RecentTransactionsDialog
        open={recentTransactionsDialog.open}
        onClose={recentTransactionsDialog.handleClose}
        title={t("_pages:home.dashboard.recentTransactions.title")}
        filters={recentTransactionsFilters}
        enabled={!!account?.id}
      />
    </>
  );
};
