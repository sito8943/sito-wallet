import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

// hooks
import { useTransactionCategoryAverage } from "../../../../../hooks/queries/useTransactionCategoryAverage";

// components
import { Currency } from "../../../../Currencies";
import { ConfigFormDialog } from "./ConfigFormDialog";
import { ActiveFilters } from "./ActiveFilters";
import { CategoryAverageBreakdown } from "./CategoryAverageBreakdown";
import { DashboardCard } from "../DashboardCard";
import { resolveCardConfig } from "../utils";

// lib
import { CategoryAverageGranularity } from "lib";

// styles
import "../styles.css";
import "./styles.css";

// types
import type { CategoryAveragePropsType } from "./types";
import type { CardConfigOverrideType } from "../types";

// utils
import {
  formToDto,
  getActiveFiltersCount,
  parseFormConfig,
  presetGranularity,
  presetToRange,
  resolvePreset,
} from "./utils";

export const CategoryAverageCard = (props: CategoryAveragePropsType) => {
  const { title, config, id, user, onDelete, dragHandleProps } = props;
  const { t } = useTranslation();
  const [configOverride, setConfigOverride] =
    useState<CardConfigOverrideType | null>(null);
  const effectiveConfig = resolveCardConfig(config, configOverride);

  const { accountId, categoryIds, type, preset, currency } = useMemo(() => {
    const parsed = parseFormConfig(effectiveConfig);
    return {
      accountId: parsed.account?.id,
      categoryIds: parsed.categoryIds ?? [],
      type: parsed.type,
      preset: resolvePreset(parsed.preset),
      currency: {
        name: parsed.account?.currency?.name ?? "",
        symbol: parsed.account?.currency?.symbol ?? "",
      },
    };
  }, [effectiveConfig]);

  const range = useMemo(() => presetToRange(preset), [preset]);
  const granularity = presetGranularity(preset);

  const { data, isLoading } = useTransactionCategoryAverage({
    accountId,
    categoryIds,
    type,
    from: range.from,
    to: range.to,
    granularity,
  });

  const periodLabel = t(
    `_pages:home.dashboard.categoryAverage.period.${
      granularity === CategoryAverageGranularity.Week ? "week" : "month"
    }`,
  );

  const categories = useMemo(() => data?.categories ?? [], [data?.categories]);

  return (
    <DashboardCard
      id={id}
      userId={user?.id ?? 0}
      title={title}
      config={effectiveConfig}
      className="category-average-card"
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
          type={formConfig.type}
          categories={formConfig.categories ?? []}
          preset={resolvePreset(formConfig.preset)}
        />
      )}
    >
      {() => {
        if (!isLoading && !data?.transactionCount)
          return (
            <p className="category-average-empty">
              {t("_pages:home.dashboard.categoryAverage.empty")}
            </p>
          );

        return (
          <div className="category-average-content">
            <p className="category-average-amount poppins">
              {isLoading ? "…" : (data?.averagePerPeriod ?? 0)}{" "}
              <Currency name={currency.name} symbol={currency.symbol} />
              <span className="category-average-period">/{periodLabel}</span>
            </p>
            <div className="category-average-stats">
              <span>
                {t("_pages:home.dashboard.categoryAverage.total", {
                  total: data?.total ?? 0,
                  symbol: currency.symbol,
                })}
              </span>
              <span>
                {t("_pages:home.dashboard.categoryAverage.periods", {
                  count: data?.periodCount ?? 0,
                })}
              </span>
              <span>
                {t("_pages:home.dashboard.categoryAverage.perTransaction", {
                  amount: data?.averagePerTransaction ?? 0,
                  symbol: currency.symbol,
                  count: data?.transactionCount ?? 0,
                })}
              </span>
            </div>
            {categories.length > 1 ? (
              <CategoryAverageBreakdown
                categories={categories}
                currencyName={currency.name}
                currencySymbol={currency.symbol}
                periodLabel={periodLabel}
              />
            ) : null}
          </div>
        );
      }}
    </DashboardCard>
  );
};
