import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";

// hooks
import { useBalanceHistory } from "../../../../../hooks/queries/useBalanceHistory";

// components
import { ConfigFormDialog } from "./ConfigFormDialog";
import { ActiveFilters } from "./ActiveFilters";
import { BalanceChart } from "./BalanceChart";
import { DashboardCard } from "../DashboardCard";
import { resolveCardConfig } from "../utils";

// styles
import "../styles.css";
import "./styles.css";

// types
import type { BalanceHistoryFormType, BalanceHistoryPropsType } from "./types";
import type { CardConfigOverrideType } from "../types";

// utils
import {
  formToDto,
  presetGranularity,
  presetToRange,
  resolvePreset,
} from "./utils";
import { defaultConfig } from "./constants";

export const BalanceHistoryCard = (props: BalanceHistoryPropsType) => {
  const { title, config, id, user, onDelete, dragHandleProps } = props;
  const { t, i18n } = useTranslation();
  const [configOverride, setConfigOverride] =
    useState<CardConfigOverrideType | null>(null);
  const effectiveConfig = resolveCardConfig(config, configOverride);

  const parseFormConfig = (cfg?: string | null): BalanceHistoryFormType => {
    try {
      const parsed = (cfg ? JSON.parse(cfg) : {}) as BalanceHistoryFormType;
      return { ...defaultConfig, ...parsed };
    } catch (err) {
      console.error(err);
      return defaultConfig;
    }
  };

  const { accountId, preset } = useMemo(() => {
    const parsed = parseFormConfig(effectiveConfig);
    return {
      accountId: parsed.account?.id,
      preset: resolvePreset(parsed.preset),
    };
  }, [effectiveConfig]);

  const currencySymbol = useMemo(() => {
    const parsed = parseFormConfig(effectiveConfig);
    return parsed.account?.currency?.symbol ?? "";
  }, [effectiveConfig]);

  const range = useMemo(() => presetToRange(preset), [preset]);

  const { data, isLoading } = useBalanceHistory({
    accountId,
    from: range.from,
    to: range.to,
    granularity: presetGranularity(preset),
  });

  const points = useMemo(() => data?.points ?? [], [data?.points]);
  const hasAdjustments = useMemo(
    () => points.some((p) => p.adjustmentTotal !== 0),
    [points],
  );

  return (
    <DashboardCard
      id={id}
      userId={user?.id ?? 0}
      title={title}
      config={effectiveConfig}
      className="balance-history-card"
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
        <ActiveFilters
          account={formConfig.account}
          preset={resolvePreset(formConfig.preset)}
        />
      )}
    >
      {() => {
        if (!accountId)
          return (
            <p className="balance-history-empty">
              {t("_pages:home.dashboard.balanceHistory.noAccount")}
            </p>
          );

        if (!isLoading && points.length === 0)
          return (
            <p className="balance-history-empty">
              {t("_pages:home.dashboard.balanceHistory.empty")}
            </p>
          );

        return (
          <div className="balance-history-content">
            <BalanceChart
              points={points}
              granularity={data?.granularity ?? presetGranularity(preset)}
              locale={i18n.language}
              currencySymbol={currencySymbol}
              balanceLabel={t("_pages:home.dashboard.balanceHistory.balance")}
              netLabel={t("_pages:home.dashboard.balanceHistory.net")}
            />
            {hasAdjustments && (
              <p className="balance-history-adjustment">
                <FontAwesomeIcon icon={faWarning} />
                {t("_pages:home.dashboard.balanceHistory.adjustmentWarning")}
              </p>
            )}
          </div>
        );
      }}
    </DashboardCard>
  );
};
