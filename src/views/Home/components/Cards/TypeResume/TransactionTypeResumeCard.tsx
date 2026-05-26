import { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { classNames, IconButton } from "@sito/dashboard-app";

// lib
import { TransactionType } from "lib";

// hooks
import { TransactionsQueryKeys, useTransactionTypeResume } from "hooks";

// utils
import { icons } from "../../../../Transactions/components/utils";
import { DEFAULT_TYPE_RESUME_CONFIG } from "./constants";
import { formToDto } from "./utils";

// components
import { Currency } from "../../../../Currencies";
import { ActiveFilters } from "./ActiveFilters";
import { ConfigFormDialog } from "./ConfigFormDialog";
import { DashboardCard } from "../DashboardCard";
import { TypeResumeCategoriesDialog } from "./TypeResumeCategoriesDialog";

// styles
import "./styles.css";

// types
import type {
  TransactionTypePropsType,
  FilterTypeResumeConfigType,
  TypeResumeTypeFormType,
} from "./types";
import { useTypeResumeDialog } from "./useTypeResumeDialog";

export const TransactionTypeResume = (props: TransactionTypePropsType) => {
  const { title, config, id, user, onDelete } = props;
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const typeResumeDialog = useTypeResumeDialog();

  const parseFormConfig = (cfg?: string | null): TypeResumeTypeFormType => {
    try {
      const parsed = cfg ? (JSON.parse(cfg) as Record<string, unknown>) : {};
      const legacyAccounts = Array.isArray(parsed.accounts)
        ? (parsed.accounts as NonNullable<TypeResumeTypeFormType["account"]>[])
        : [];

      return {
        account:
          (parsed.account as TypeResumeTypeFormType["account"]) ??
          legacyAccounts[0],
        type: Number(
          parsed.type ?? DEFAULT_TYPE_RESUME_CONFIG.type,
        ) as TransactionType,
        time:
          (parsed.time as TypeResumeTypeFormType["time"]) ??
          DEFAULT_TYPE_RESUME_CONFIG.time,
      };
    } catch (err) {
      console.error(err);
      return DEFAULT_TYPE_RESUME_CONFIG;
    }
  };

  const resolvedFormConfig = useMemo(() => parseFormConfig(config), [config]);

  const filterConfig = useMemo(() => {
    try {
      const transformed: FilterTypeResumeConfigType = {
        type: resolvedFormConfig.type,
        time: resolvedFormConfig.time,
      };
      transformed.accountId = resolvedFormConfig.account?.id;
      return transformed;
    } catch (err) {
      console.error(err);
      return {
        type: DEFAULT_TYPE_RESUME_CONFIG.type,
        time: DEFAULT_TYPE_RESUME_CONFIG.time,
      } as FilterTypeResumeConfigType;
    }
  }, [resolvedFormConfig]);

  const { data, isLoading } = useTransactionTypeResume({ ...filterConfig });
  const categories = data?.categories ?? [];
  const currencyName =
    data?.account?.currency?.name ?? resolvedFormConfig.account?.currency?.name;
  const currencySymbol =
    data?.account?.currency?.symbol ??
    resolvedFormConfig.account?.currency?.symbol;

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
          // Keep original behavior: refresh related queries on save
          void queryClient.invalidateQueries({
            ...TransactionsQueryKeys.all(),
          });
        }}
        ConfigFormDialog={ConfigFormDialog}
        renderActiveFilters={({ formConfig, onSubmit }) => (
          <ActiveFilters
            {...formConfig}
            clearAccount={() => onSubmit({ ...formConfig, account: undefined })}
          />
        )}
      >
        {({ formConfig }) => (
          <div className="type-resume-content">
            <FontAwesomeIcon
              icon={icons[(formConfig.type ?? 0) as keyof typeof icons]}
              className={classNames(
                "type-resume-icon",
                Number(formConfig.type) === TransactionType.In
                  ? "type-resume-icon--income inverted-success"
                  : "type-resume-icon--expense inverted-error",
              )}
            />
            <div className="type-resume-summary">
              <p
                className={classNames(
                  "type-resume-amount poppins",
                  formConfig.type === TransactionType.In
                    ? "type-resume-amount--income"
                    : "type-resume-amount--expense",
                )}
              >
                {isLoading ? "…" : (data?.total ?? 0)}{" "}
                <Currency
                  name={currencyName ?? formConfig.account?.currency?.name}
                  symbol={
                    currencySymbol ?? formConfig.account?.currency?.symbol
                  }
                />
              </p>
              <IconButton
                disabled={isLoading || categories.length === 0}
                onClick={typeResumeDialog.openDialog}
                icon={faList}
                aria-label={t(
                  "_pages:home.dashboard.transactionTypeResume.details.title",
                )}
              />
            </div>
          </div>
        )}
      </DashboardCard>
      <TypeResumeCategoriesDialog
        {...typeResumeDialog}
        categories={categories}
        total={data?.total}
        accountId={data?.account?.id ?? resolvedFormConfig.account?.id}
        currencyName={currencyName}
        currencySymbol={currencySymbol}
        startDate={data?.startDate}
        endDate={data?.endDate}
        transactionType={data?.transactionType ?? resolvedFormConfig.type}
      />
    </>
  );
};
