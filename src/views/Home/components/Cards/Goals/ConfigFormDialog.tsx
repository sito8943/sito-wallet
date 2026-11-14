import { useMemo } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import type { Option } from "@sito/dashboard-app";
import { AutocompleteInput, FormDialog } from "@sito/dashboard-app";

// hooks
import { useGoalsList } from "../../../../../hooks/queries/useGoalsList";

// lib
import { Tables } from "lib";

// constants
import { ACTIVE_GOALS_FILTERS } from "./constants";

// types
import type { ConfigFormDialogPropsType, GoalsCardFormType } from "./types";

import "../styles.css";
import "./styles.css";

export const ConfigFormDialog = (
  props: ConfigFormDialogPropsType<GoalsCardFormType>,
) => {
  const { control } = props;
  const { t } = useTranslation();

  const { data } = useGoalsList({ filters: ACTIVE_GOALS_FILTERS });
  const goalOptions = useMemo<Option[]>(
    () =>
      (data?.items ?? [])
        .filter((goal) => !goal.deletedAt)
        .map((goal) => ({ id: goal.id, name: goal.name })),
    [data?.items],
  );

  return (
    <FormDialog title={t("_pages:home.dashboard.goals.configTitle")} {...props}>
      <div className="goals-card-config">
        <Controller
          control={control}
          name="goals"
          render={({ field: { value, onChange, ...rest } }) => (
            <AutocompleteInput
              value={value}
              multiple
              label={t("_pages:home.dashboard.goals.goalsLabel")}
              autoComplete={`${Tables.Goals}-${t(
                "_pages:home.dashboard.goals.goalsLabel",
              )}`}
              onChange={(v) => onChange(v)}
              options={goalOptions}
              containerClassName="dashboard-card-autocomplete-full"
              {...rest}
            />
          )}
        />
        {/* Outside the input: the lib centers chips on input + helper text. */}
        <p className="goals-card-config-helper">
          {t("_pages:home.dashboard.goals.goalsHelper")}
        </p>
      </div>
    </FormDialog>
  );
};
