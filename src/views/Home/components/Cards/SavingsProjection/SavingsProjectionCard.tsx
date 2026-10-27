import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import { Button } from "@sito/dashboard-app";

// hooks
import { useSavingsProjection } from "../../../../../hooks/queries/useSavingsProjection";
import { useEditAccountDialog } from "../../../../Accounts/hooks";

// components
import { EditAccountDialog } from "../../../../Accounts/components/AccountDialog";
import { ConfigFormDialog } from "./ConfigFormDialog";
import { ActiveFilters } from "./ActiveFilters";
import { ProjectionSummary } from "./ProjectionSummary";
import { ProjectionChart } from "./ProjectionChart";
import { DailyBreakdownDialog } from "./DailyBreakdownDialog";
import { DashboardCard } from "../DashboardCard";
import { resolveCardConfig } from "../utils";

// styles
import "../styles.css";
import "./styles.css";

// types
import type { SavingsProjectionPropsType } from "./types";
import { SavingsProjectionViewState } from "./types";
import type { CardConfigOverrideType } from "../types";

// utils
import {
  formToDto,
  getActiveFiltersCount,
  parseFormConfig,
  resolveViewState,
} from "./utils";

export const SavingsProjectionCard = (props: SavingsProjectionPropsType) => {
  const { title, config, id, user, onDelete, dragHandleProps } = props;
  const { t, i18n } = useTranslation();
  const [configOverride, setConfigOverride] =
    useState<CardConfigOverrideType | null>(null);
  const effectiveConfig = resolveCardConfig(config, configOverride);

  const { accountId, horizon, currencySymbol } = useMemo(() => {
    const parsed = parseFormConfig(effectiveConfig);
    return {
      accountId: parsed.account?.id,
      horizon: parsed.horizon,
      currencySymbol: parsed.account?.currency?.symbol ?? "",
    };
  }, [effectiveConfig]);

  const { data, isLoading, error } = useSavingsProjection({
    accountId,
    horizon,
  });

  const viewState = resolveViewState({ accountId, isLoading, error, data });

  // Month stays set while the dialog closes so its title doesn't flash empty.
  const [selectedMonth, setSelectedMonth] = useState<string>();
  const [dailyOpen, setDailyOpen] = useState(false);
  const openDailyBreakdown = useCallback((month: string) => {
    setSelectedMonth(month);
    setDailyOpen(true);
  }, []);
  const closeDailyBreakdown = useCallback(() => setDailyOpen(false), []);

  const editAccount = useEditAccountDialog();
  const { openDialog: openEditAccount } = editAccount;

  const renderBody = () => {
    switch (viewState) {
      case SavingsProjectionViewState.NoAccount:
        return (
          <p className="savings-projection-empty">
            {t("_pages:home.dashboard.savingsProjection.noAccount")}
          </p>
        );
      case SavingsProjectionViewState.Loading:
        return null;
      case SavingsProjectionViewState.NotConfigured:
        return (
          <div className="savings-projection-empty">
            <p>{t("_pages:home.dashboard.savingsProjection.notConfigured")}</p>
            <Button
              type="button"
              variant="outlined"
              onClick={() => accountId && openEditAccount(accountId)}
            >
              <FontAwesomeIcon icon={faPencil} />
              {t("_pages:home.dashboard.savingsProjection.editAccount")}
            </Button>
          </div>
        );
      case SavingsProjectionViewState.Error:
        return (
          <p className="savings-projection-empty">
            {t("_pages:home.dashboard.savingsProjection.error")}
          </p>
        );
      case SavingsProjectionViewState.Empty:
        return (
          <p className="savings-projection-empty">
            {t("_pages:home.dashboard.savingsProjection.empty")}
          </p>
        );
      case SavingsProjectionViewState.Ready:
        if (!data) return null;
        return (
          <div className="savings-projection-content">
            <ProjectionSummary
              data={data}
              locale={i18n.language}
              currencySymbol={currencySymbol}
            />
            <ProjectionChart
              points={data.points}
              locale={i18n.language}
              currencySymbol={currencySymbol}
              balanceLabel={t(
                "_pages:home.dashboard.savingsProjection.balance",
              )}
              accruedLabel={t(
                "_pages:home.dashboard.savingsProjection.accrued",
              )}
              creditedLabel={t(
                "_pages:home.dashboard.savingsProjection.credited",
              )}
              onMonthClick={openDailyBreakdown}
            />
            <p className="savings-projection-hint">
              {t("_pages:home.dashboard.savingsProjection.clickHint")}
            </p>
          </div>
        );
    }
  };

  return (
    <>
      <DashboardCard
        id={id}
        userId={user?.id ?? 0}
        title={title}
        config={effectiveConfig}
        className="savings-projection-card"
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
          <ActiveFilters
            account={formConfig.account}
            horizon={formConfig.horizon}
          />
        )}
      >
        {renderBody}
      </DashboardCard>
      <DailyBreakdownDialog
        open={dailyOpen}
        onClose={closeDailyBreakdown}
        accountId={accountId}
        month={selectedMonth}
        locale={i18n.language}
        currencySymbol={currencySymbol}
      />
      <EditAccountDialog {...editAccount} />
    </>
  );
};
