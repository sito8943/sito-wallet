import { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQueryClient } from "@tanstack/react-query";

import { classNames } from "@sito/dashboard-app";

// lib
import { TransactionType } from "lib";

// hooks
import { TransactionsQueryKeys, useTransactionTypeResume } from "hooks";

// utils
import { icons } from "../../../../Transactions/components/utils";
import { formToDto } from "./utils";

// components
import { Currency } from "../../../../Currencies";
import { ActiveFilters } from "./ActiveFilters";
import { ConfigFormDialog } from "./ConfigFormDialog";
import { DashboardCard } from "../DashboardCard";

// styles
import "./styles.css";

// types
import type {
  TransactionTypePropsType,
  FilterTypeResumeConfigType,
  TypeResumeTypeFormType,
} from "./types";

// providers
// providers
// (none)

const defaultConfig: TypeResumeTypeFormType = {
  type: TransactionType.In,
  accounts: [],
  categories: [],
};

export const TransactionTypeResume = (props: TransactionTypePropsType) => {
  const { title, config, id, user, onDelete } = props;
  const queryClient = useQueryClient();

  const parseFormConfig = (cfg?: string | null): TypeResumeTypeFormType => {
    try {
      return cfg ? (JSON.parse(cfg) as TypeResumeTypeFormType) : defaultConfig;
    } catch (err) {
      console.error(err);
      return defaultConfig;
    }
  };

  const filterConfig = useMemo(() => {
    try {
      const parsed = parseFormConfig(config);
      const transformed: FilterTypeResumeConfigType = {
        type: parsed.type,
      };
      transformed.accounts = parsed.accounts?.map((a) => a.id) ?? [];
      transformed.categories = parsed.categories?.map((c) => c.id) ?? [];
      transformed.date = parsed.date;
      return transformed;
    } catch (err) {
      console.error(err);
      return { type: defaultConfig.type } as FilterTypeResumeConfigType;
    }
  }, [config]);

  const { data, isLoading } = useTransactionTypeResume({ ...filterConfig });

  return (
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
        // Keep original behavior: refresh related queries on save
        void queryClient.invalidateQueries({ ...TransactionsQueryKeys.all() });
      }}
      ConfigFormDialog={ConfigFormDialog}
      renderActiveFilters={({ formConfig, onSubmit }) => (
        <ActiveFilters
          {...formConfig}
          clearAccounts={() => onSubmit({ ...formConfig, accounts: [] })}
          clearCategories={() => onSubmit({ ...formConfig, categories: [] })}
          clearDate={() => onSubmit({ ...formConfig, date: undefined })}
        />
      )}
    >
      {({ formConfig }) => (
        <>
          <FontAwesomeIcon
            icon={icons[(formConfig.type ?? 0) as keyof typeof icons]}
            className={classNames(
              "type-resume-icon",
              Number(formConfig.type) === TransactionType.In
                ? "type-resume-icon--income"
                : "type-resume-icon--expense",
            )}
          />
          <p
            className={classNames(
              "type-resume-amount",
              formConfig.type === TransactionType.In
                ? "type-resume-amount--income"
                : "type-resume-amount--expense",
            )}
          >
            {data?.total}{" "}
            <Currency
              name={data?.account?.currency?.name}
              symbol={data?.account?.currency?.symbol}
            />
          </p>
        </>
      )}
    </DashboardCard>
  );
};
