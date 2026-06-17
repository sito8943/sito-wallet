import { useMemo, useState } from "react";
import { faAdd, faList } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

import { IconButton } from "@sito/dashboard-app";

// hooks
import { useTransactionTypeResume } from "hooks";
import { useTransactionCategoriesCommon } from "../../../../../hooks/queries/useTransactionCategoriesCommon";
import { useAddTransaction } from "../../../../Transactions/hooks";

// utils
import {
  formToDto,
  getActiveFiltersCount,
  getOppositeTransactionType,
  parseFormConfig,
  toTypeResumeFilterConfig,
} from "./utils";

// components
import { ActiveFilters } from "./ActiveFilters";
import { AddTransactionDialog } from "../../../../Transactions/components";
import { ConfigFormDialog } from "./ConfigFormDialog";
import { DashboardCard } from "../DashboardCard";
import { TypeResumeRow } from "./TypeResumeRow";
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
  const oppositeType = useMemo(
    () => getOppositeTransactionType(resolvedFormConfig.type),
    [resolvedFormConfig.type],
  );

  const { data, isLoading } = useTransactionTypeResume({ ...filterConfig });
  const oppositeTypeResume = useTransactionTypeResume({
    ...filterConfig,
    type: oppositeType,
    enabled: resolvedFormConfig.showOppositeType,
  });
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
  const oppositeTotal = oppositeTypeResume.data?.total ?? 0;
  const isOppositeLoading =
    resolvedFormConfig.showOppositeType && oppositeTypeResume.isLoading;

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
        shouldShowActiveFiltersBadge={(formConfig) =>
          !!formConfig.showFiltersAsBadge
        }
        getActiveFiltersCount={getActiveFiltersCount}
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
            <div className="type-resume-summary">
              <div className="type-resume-totals">
                {formConfig.showOppositeType && (
                  <TypeResumeRow
                    type={oppositeType}
                    amount={oppositeTotal}
                    isLoading={isOppositeLoading}
                    currencyName={
                      currencyName ?? formConfig.account?.currency?.name
                    }
                    currencySymbol={
                      currencySymbol ?? formConfig.account?.currency?.symbol
                    }
                    compact
                  />
                )}
                <TypeResumeRow
                  type={formConfig.type}
                  amount={data?.total ?? 0}
                  isLoading={isLoading}
                  currencyName={
                    currencyName ?? formConfig.account?.currency?.name
                  }
                  currencySymbol={
                    currencySymbol ?? formConfig.account?.currency?.symbol
                  }
                />
              </div>
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
