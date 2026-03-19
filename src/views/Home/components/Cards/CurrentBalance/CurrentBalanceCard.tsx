import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

// icons
import {
  faArrowsRotate,
  faCircleNotch,
  faScaleBalanced,
} from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import { IconButton, queryClient, useNotification } from "@sito/dashboard-app";

// hooks
import { AccountsQueryKeys, DashboardsQueryKeys, useAccountsList } from "hooks";

// components
import { Currency } from "../../../../Currencies";
import { AdjustBalanceDialog } from "../../../../Accounts/components/AdjustBalanceDialog";
import { ConfigFormDialog } from "./ConfigFormDialog";
import { ActiveFilters } from "./ActiveFilters";
import { DashboardCard } from "../DashboardCard";

// styles
import "../TypeResume/styles.css";

// types
import { CurrentBalanceFormType, CurrentBalancePropsType } from "./types";

// lib
import { AdjustBalanceDto } from "lib";

// utils
import { formToDto } from "./utils";

// providers
import { useManager } from "providers";

const defaultConfig: CurrentBalanceFormType = {
  account: null,
};

export const CurrentBalanceCard = (props: CurrentBalancePropsType) => {
  const { title, config, id, user, onDelete } = props;
  const { t } = useTranslation();
  const manager = useManager();
  const { showErrorNotification, showSuccessNotification } = useNotification();

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
      const parsed = parseFormConfig(config);
      return parsed.account?.id;
    } catch {
      return undefined;
    }
  }, [config]);

  const { data, isLoading } = useAccountsList({});

  const account = useMemo(() => {
    if (!accountId || !data?.items) return null;
    return data.items.find((a) => a.id === accountId) ?? null;
  }, [accountId, data]);

  const balance = account?.balance ?? 0;
  const symbol = account?.currency?.symbol ?? "";
  const currencyName = account?.currency?.name ?? "";

  const [isSyncing, setIsSyncing] = useState(false);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [isAdjusting, setIsAdjusting] = useState(false);

  const handleAdjustBalance = async (data: AdjustBalanceDto) => {
    if (!account) return;
    setIsAdjusting(true);
    try {
      await manager.Accounts.adjustBalance(account.id, data);
      await queryClient.invalidateQueries({ ...AccountsQueryKeys.all() });
      showSuccessNotification({
        message: t("_pages:accounts.actions.adjustBalance.successMessage"),
      });
      setAdjustOpen(false);
    } catch (error) {
      showErrorNotification({
        message: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsAdjusting(false);
    }
  };

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
      config={config}
      onDelete={onDelete}
      isBusy={isLoading}
      loadingOverlay={isLoading}
      parseFormConfig={parseFormConfig}
      formToDto={(data) => formToDto(data)}
      onConfigSaved={() => {
        void queryClient.invalidateQueries({ ...DashboardsQueryKeys.all() });
      }}
      ConfigFormDialog={ConfigFormDialog}
      renderActiveFilters={({ formConfig }) => (
        <ActiveFilters account={formConfig.account} />
      )}
    >
      {() => (
        <div className="flex items-center justify-between w-full mt-auto">
          <p className="!text-4xl font-bold poppins">
            {isLoading ? "…" : balance}{" "}
            <Currency name={currencyName} symbol={symbol} />
          </p>
          {account && (
            <div className="flex items-center gap-1">
              <IconButton
                disabled={isAdjusting}
                onClick={() => setAdjustOpen(true)}
                icon={faScaleBalanced}
                aria-label={t("_pages:accounts.actions.adjustBalance.text")}
              />
              <IconButton
                disabled={isSyncing}
                onClick={handleRefresh}
                icon={isSyncing ? faCircleNotch : faArrowsRotate}
                className={isSyncing ? "rotate" : ""}
              />
            </div>
          )}
        </div>
      )}
    </DashboardCard>
    {account && (
      <AdjustBalanceDialog
        open={adjustOpen}
        selectedAccount={account}
        isLoading={isAdjusting}
        onClose={() => setAdjustOpen(false)}
        onSubmit={handleAdjustBalance}
      />
    )}
    </>
  );
};
