import { useMemo, useState } from "react";

// @sito/dashboard-app
// @sito/dashboard-app

// lib
import { TransactionType } from "lib";

// hooks
import { useWeekly } from "../../../../../hooks/queries/useWeekly";

// components
import { Currency } from "../../../../Currencies";
import { ConfigFormDialog } from "./ConfigFormDialog";
import { ActiveFilters } from "./ActiveFilters";
import { DashboardCard } from "../DashboardCard";
import { resolveCardConfig } from "../utils";

// styles
import "../styles.css";

// types
import type {
  WeeklySpentFormType,
  WeeklySpentPropsType,
  FilterWeeklyConfigType,
} from "./types";
import type { CardConfigOverrideType } from "../types";

// utils
import { formToDto } from "./utils";

// providers
// providers
// (none)

const defaultConfig: WeeklySpentFormType = {
  type: TransactionType.In,
  accounts: [],
};

const getCurrentWeekRange = () => {
  const today = new Date();
  const day = today.getDay(); // 0 = Sunday
  const start = new Date(today);
  start.setDate(today.getDate() - day);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  const toYMD = (d: Date) => d.toISOString().slice(0, 10);
  return { start: toYMD(start), end: toYMD(end) };
};

export const WeeklySpentCard = (props: WeeklySpentPropsType) => {
  const { title, config, id, user, onDelete } = props;
  const [configOverride, setConfigOverride] =
    useState<CardConfigOverrideType | null>(null);
  const effectiveConfig = resolveCardConfig(config, configOverride);

  const parseFormConfig = (cfg?: string | null): WeeklySpentFormType => {
    try {
      return (cfg ? JSON.parse(cfg) : {}) as WeeklySpentFormType;
    } catch (err) {
      console.error(err);
      return defaultConfig;
    }
  };

  const filterConfig = useMemo(() => {
    try {
      const parsed = parseFormConfig(effectiveConfig);
      const transformed: FilterWeeklyConfigType = { type: parsed.type };
      transformed.accounts = parsed.accounts?.map((a) => a.id) ?? [];
      return transformed;
    } catch (err) {
      console.error(err);
      return { type: defaultConfig.type } as FilterWeeklyConfigType;
    }
  }, [effectiveConfig]);

  const range = useMemo(() => getCurrentWeekRange(), []);

  const { data, isLoading } = useWeekly({ ...filterConfig });

  const amount = data?.currentWeek ?? 0;
  const symbol = data?.account?.currency?.symbol ?? "";
  const name = data?.account?.currency?.name ?? "";

  return (
    <DashboardCard
      id={id}
      userId={user?.id ?? 0}
      title={title}
      config={effectiveConfig}
      onDelete={onDelete}
      isBusy={isLoading}
      loadingOverlay={isLoading}
      parseFormConfig={parseFormConfig}
      formToDto={(data) => formToDto(data)}
      onConfigSaved={(savedConfig) =>
        setConfigOverride({ baseConfig: config, savedConfig })
      }
      ConfigFormDialog={ConfigFormDialog}
      renderActiveFilters={({ formConfig, onSubmit }) => (
        <ActiveFilters
          {...formConfig}
          startDate={range.start}
          endDate={range.end}
          clearAccounts={() => onSubmit({ ...formConfig, accounts: [] })}
        />
      )}
    >
      {() => (
        <p className="weekly-spent-amount poppins">
          {isLoading ? "…" : amount} <Currency name={name} symbol={symbol} />
        </p>
      )}
    </DashboardCard>
  );
};
