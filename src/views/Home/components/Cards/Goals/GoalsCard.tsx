import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// hooks
import { useGoalsList } from "../../../../../hooks/queries/useGoalsList";

// lib
import { AppRoutes } from "lib";

// components
import { ConfigFormDialog } from "./ConfigFormDialog";
import { GoalsCardRow } from "./GoalsCardRow";
import { DashboardCard } from "../DashboardCard";
import { resolveCardConfig } from "../utils";

// constants
import { ACTIVE_GOALS_FILTERS } from "./constants";

// styles
import "../styles.css";
import "./styles.css";

// types
import type { GoalsCardPropsType } from "./types";
import type { CardConfigOverrideType } from "../types";

// utils
import {
  formToDto,
  getActiveFiltersCount,
  parseFormConfig,
  selectCardGoals,
} from "./utils";

export const GoalsCard = (props: GoalsCardPropsType) => {
  const { title, config, id, user, onDelete, dragHandleProps } = props;
  const { t, i18n } = useTranslation();
  const [configOverride, setConfigOverride] =
    useState<CardConfigOverrideType | null>(null);
  const effectiveConfig = resolveCardConfig(config, configOverride);

  const selectedGoals = useMemo(
    () => parseFormConfig(effectiveConfig).goals,
    [effectiveConfig],
  );

  const { data, isLoading, error } = useGoalsList({
    filters: ACTIVE_GOALS_FILTERS,
  });
  const goals = useMemo(
    () => selectCardGoals(data?.items ?? [], selectedGoals),
    [data?.items, selectedGoals],
  );

  const renderBody = () => {
    if (isLoading) return null;
    if (error)
      return (
        <p className="card-empty">{t("_pages:home.dashboard.goals.error")}</p>
      );

    return (
      <div className="goals-card-content">
        {goals.length ? (
          <ul className="goals-card-list">
            {goals.map((goal) => (
              <GoalsCardRow key={goal.id} goal={goal} locale={i18n.language} />
            ))}
          </ul>
        ) : (
          <p className="card-empty">{t("_pages:home.dashboard.goals.empty")}</p>
        )}
        <Link to={AppRoutes.goals} className="goals-card-link">
          {t("_pages:home.dashboard.goals.viewAll")}
        </Link>
      </div>
    );
  };

  return (
    <DashboardCard
      id={id}
      userId={user?.id ?? 0}
      title={title}
      config={effectiveConfig}
      className="goals-card"
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
      getActiveFiltersCount={getActiveFiltersCount}
    >
      {renderBody}
    </DashboardCard>
  );
};
