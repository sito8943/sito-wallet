import { useMemo, useState } from "react";
import { faAdd, faList } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

import { classNames, IconButton } from "@sito/dashboard-app";

// lib
import { TransactionType } from "lib";

// hooks
import { useTransactionTypeResume } from "hooks";
import { useTransactionCategoriesCommon } from "../../../../../hooks/queries/useTransactionCategoriesCommon";
import { useAddTransaction } from "../../../../Transactions/hooks";

// utils
import { formToDto, parseFormConfig, toTypeResumeFilterConfig } from "./utils";

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
} from "./types";
import { useTypeResumeDialog } from "./useTypeResumeDialog";
import type { CardConfigOverrideType } from "../types";
import { Type } from "views/TransactionCategories/components/Type";

export const TransactionTypeResume = (props: TransactionTypePropsType) => {
  const { title, config, id, user, onDelete, dragHandleProps } = props;
  const { t } = useTranslation();
  const typeResumeDialog = useTypeResumeDialog();
  const [configOverride, setConfigOverride] =
    useState<CardConfigOverrideType | null>(null);
  const effectiveConfig = useMemo(
    () => resolveCardConfig(config, configOverride),
    [config, configOverride],
  );

  const resolvedFormConfig = useMemo(
    () => parseFormConfig(effectiveConfig),
    [effectiveConfig],
  );

  const filterConfig = useMemo<FilterTypeResumeConfigType>(
    () => toTypeResumeFilterConfig(resolvedFormConfig),
    [resolvedFormConfig],
  );

  const { data, isLoading } = useTransactionTypeResume({ ...filterConfig });
  const transactionCategories = useTransactionCategoriesCommon();

  const categories = data?.categories ?? [];
  const selectedAccount = data?.account ?? resolvedFormConfig.account ?? null;
  const currencyName = selectedAccount?.currency?.name;
  const currencySymbol = selectedAccount?.currency?.symbol;
  const excludedCategories = useMemo(() => {
    const excludedIds = new Set(resolvedFormConfig.excludedCategoryIds);

    return (transactionCategories.data ?? [])
      .filter(
        (category) =>
          excludedIds.has(category.id) &&
          Number(category.type) === Number(resolvedFormConfig.type),
      )
      .map((category) => ({
        ...category,
        name: category.auto
          ? t("_entities:transactionCategory.name.init")
          : category.name,
      }));
  }, [
    resolvedFormConfig.excludedCategoryIds,
    resolvedFormConfig.type,
    t,
    transactionCategories.data,
  ]);
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
        dragHandleProps={dragHandleProps}
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
            account={formConfig.account}
            type={formConfig.type}
            time={formConfig.time}
            excludedCategories={excludedCategories}
            clearAccount={() => onSubmit({ ...formConfig, account: undefined })}
            clearExcludedCategories={() =>
              onSubmit({
                ...formConfig,
                excludedCategories: [],
                excludedCategoryIds: [],
              })
            }
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
                  data-tooltip-id="tooltip"
                  data-tooltip-content={t("_pages:transactions.add")}
                  aria-label={t("_pages:transactions.add")}
                />
                <IconButton
                  disabled={isLoading || categories.length === 0}
                  onClick={() => typeResumeDialog.openDialog()}
                  icon={faList}
                  data-tooltip-id="tooltip"
                  data-tooltip-content={t(
                    "_pages:home.dashboard.transactionTypeResume.details.title",
                  )}
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
        excludedCategoryIds={resolvedFormConfig.excludedCategoryIds}
      />
      <AddTransactionDialog {...addTransaction} />
    </>
  );
};
