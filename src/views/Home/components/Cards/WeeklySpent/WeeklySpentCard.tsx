import { useMemo, useState } from "react";

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
import type { WeeklySpentPropsType, FilterWeeklyConfigType } from "./types";
import type { CardConfigOverrideType } from "../types";

// utils
import {
  defaultConfig,
  formToDto,
  getActiveFiltersCount,
  getCurrentWeekRange,
  parseFormConfig,
} from "./utils";

export const WeeklySpentCard = (props: WeeklySpentPropsType) => {
  const { title, config, id, user, onDelete, dragHandleProps } = props;
  const [configOverride, setConfigOverride] =
    useState<CardConfigOverrideType | null>(null);
  const effectiveConfig = resolveCardConfig(config, configOverride);

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
