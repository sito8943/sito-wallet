import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

// icons
import {
  faAdd,
  faArrowsRotate,
  faCircleNotch,
  faScaleBalanced,
} from "@fortawesome/free-solid-svg-icons";

import { useQueryClient } from "@tanstack/react-query";

// @sito/dashboard-app
import { IconButton, classNames } from "@sito/dashboard-app";

// hooks
import { AccountsQueryKeys } from "../../../../../hooks/queries/queryKeys/accountsQueryKeys";
import { useAccountsList } from "../../../../../hooks/queries/useAccountsList";
import { useAdjustBalanceMutation } from "../../../../Accounts/hooks";
import { useAddTransaction } from "../../../../Transactions/hooks";

// components
import { Currency } from "../../../../Currencies";
import { AdjustBalanceDialog } from "../../../../Accounts/components/AdjustBalanceDialog";
import { AddTransactionDialog } from "../../../../Transactions/components";
import { ConfigFormDialog } from "./ConfigFormDialog";
import { ActiveFilters } from "./ActiveFilters";
import { DashboardCard } from "../DashboardCard";
import { resolveCardConfig } from "../utils";

// styles
import "../styles.css";

// types
import type { CurrentBalanceFormType, CurrentBalancePropsType } from "./types";
import type { CardConfigOverrideType } from "../types";

// utils
import { formToDto } from "./utils";

// providers
import { useManager } from "providers";

const defaultConfig: CurrentBalanceFormType = {
  account: null,
};

export const CurrentBalanceCard = (props: CurrentBalancePropsType) => {
  const { title, config, id, user, onDelete, dragHandleProps } = props;
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const manager = useManager();
  const [configOverride, setConfigOverride] =
    useState<CardConfigOverrideType | null>(null);
  const effectiveConfig = resolveCardConfig(config, configOverride);

  const parseFormConfig = (cfg?: string | null): CurrentBalanceFormType => {
    try {
      return (cfg ? JSON.parse(cfg) : {}) as CurrentBalanceFormType;
    } catch (err) {
      console.error(err);
      return defaultConfig;
    }
  };

  const accountId = useMemo(() => {
    try {
      const parsed = parseFormConfig(effectiveConfig);
      return parsed.account?.id;
    } catch {
      return undefined;
    }
  }, [effectiveConfig]);

  const { data, isLoading } = useAccountsList({});

  const account = useMemo(() => {
    if (!accountId || !data?.items) return null;
    return data.items.find((a) => a.id === accountId) ?? null;
  }, [accountId, data]);

  const balance = account?.balance ?? 0;
  const symbol = account?.currency?.symbol ?? "";
  const currencyName = account?.currency?.name ?? "";

  const [isSyncing, setIsSyncing] = useState(false);

  const adjustBalance = useAdjustBalanceMutation();
  const addTransaction = useAddTransaction({
    account,
  });

  const handleRefresh = async () => {
    if (!account) return;
    setIsSyncing(true);
    try {
      await manager.Accounts.sync(account.id);
      await queryClient.invalidateQueries({ ...AccountsQueryKeys.all() });
    } catch {
      // sync error is non-blocking
    } finally {
      setIsSyncing(false);
    }
  };

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
        formToDto={(data) => formToDto(data)}
        onConfigSaved={(savedConfig) =>
          setConfigOverride({ baseConfig: config, savedConfig })
        }
        ConfigFormDialog={ConfigFormDialog}
        renderActiveFilters={({ formConfig }) => (
          <ActiveFilters account={formConfig.account} />
        )}
      >
        {() => (
          <div className="current-balance-content">
            <p className="current-balance-amount poppins">
              {isLoading ? "…" : balance}{" "}
              <Currency name={currencyName} symbol={symbol} />
            </p>
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
                  disabled={adjustBalance.isLoading}
                  onClick={() => {
                    void adjustBalance.action(account).onClick?.();
                  }}
                  icon={faScaleBalanced}
                  data-tooltip-id="tooltip"
                  data-tooltip-content={t(
                    "_pages:accounts.actions.adjustBalance.text",
                  )}
                  aria-label={t("_pages:accounts.actions.adjustBalance.text")}
                />
                <IconButton
                  disabled={isSyncing}
                  onClick={() => {
                    void handleRefresh();
                  }}
                  icon={isSyncing ? faCircleNotch : faArrowsRotate}
                  className={classNames(isSyncing && "rotate")}
                  data-tooltip-id="tooltip"
                  data-tooltip-content={t(
                    "_pages:home.dashboard.currentBalance.refresh",
                  )}
                  aria-label={t("_pages:home.dashboard.currentBalance.refresh")}
                />
              </div>
            )}
          </div>
        )}
      </DashboardCard>
      <AdjustBalanceDialog {...adjustBalance} />
      <AddTransactionDialog {...addTransaction} />
    </>
  );
};
