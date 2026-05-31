import { useMemo, useState } from "react";
import { faAdd, faList } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

import { classNames, IconButton } from "@sito/dashboard-app";

// lib
import { TransactionType } from "lib";

// hooks
import { useTransactionTypeResume } from "hooks";
import { useAddTransaction } from "../../../../Transactions/hooks";

// utils
import { DEFAULT_TYPE_RESUME_CONFIG } from "./constants";
import { formToDto } from "./utils";

// components
import { Currency } from "../../../../Currencies";
import { ActiveFilters } from "./ActiveFilters";
import { AddTransactionDialog } from "../../../../Transactions/components";
import { ConfigFormDialog } from "./ConfigFormDialog";
import { DashboardCard } from "../DashboardCard";
import { TypeResumeCategoriesDialog } from "./TypeResumeCategoriesDialog";
import { resolveCardConfig } from "../utils";

// styles
import "./styles.css";

// types
import type {
  TransactionTypePropsType,
  FilterTypeResumeConfigType,
  TypeResumeTypeFormType,
} from "./types";
import { useTypeResumeDialog } from "./useTypeResumeDialog";
import type { CardConfigOverrideType } from "../types";
import { Type } from "views/TransactionCategories/components/Type";

export const TransactionTypeResume = (props: TransactionTypePropsType) => {
  const { title, config, id, user, onDelete } = props;
  const { t } = useTranslation();
  const typeResumeDialog = useTypeResumeDialog();
  const [configOverride, setConfigOverride] =
    useState<CardConfigOverrideType | null>(null);
  const effectiveConfig = useMemo(
    () => resolveCardConfig(config, configOverride),
    [config, configOverride],
  );

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

  const resolvedFormConfig = useMemo(
    () => parseFormConfig(effectiveConfig),
    [effectiveConfig],
  );

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
  const selectedAccount = data?.account ?? resolvedFormConfig.account ?? null;
  const currencyName = selectedAccount?.currency?.name;
  const currencySymbol = selectedAccount?.currency?.symbol;
  const addTransaction = useAddTransaction({
    account: selectedAccount,
  });

  return (
    <>
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
            clearAccount={() => onSubmit({ ...formConfig, account: undefined })}
          />
        )}
      >
        {({ formConfig }) => (
          <div className="type-resume-content">
            <Type type={formConfig.type} filled={false} noText />
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
              <div className="type-resume-actions">
                <IconButton
                  onClick={() => addTransaction.openDialog()}
                  icon={faAdd}
                  aria-label={t("_pages:transactions.add")}
                />
                <IconButton
                  disabled={isLoading || categories.length === 0}
                  onClick={() => typeResumeDialog.openDialog()}
                  icon={faList}
                  aria-label={t(
                    "_pages:home.dashboard.transactionTypeResume.details.title",
                  )}
                />
              </div>
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
      <AddTransactionDialog {...addTransaction} />
    </>
  );
};
