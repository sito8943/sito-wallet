import { useMemo, useState } from "react";
import { faAdd, faClock, faList } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

import { IconButton, useDialog } from "@sito/dashboard-app";

// hooks
import { useTransactionTypeResume } from "hooks";
import { useTransactionCategoriesCommon } from "../../../../../hooks/queries/useTransactionCategoriesCommon";
import { useAddTransaction } from "../../../../Transactions/hooks";

// utils
import {
  formToDto,
  getActiveFiltersCount,
  getOppositeTransactionType,
  normalizeExcludedCategoryIds,
  parseFormConfig,
  toTypeResumeFilterConfig,
} from "./utils";

// components
import { ActiveFilters } from "./ActiveFilters";
import { AddTransactionDialog } from "../../../../Transactions/components";
import { ConfigFormDialog } from "./ConfigFormDialog";
import { DashboardCard } from "../DashboardCard";
import { RecentTransactionsDialog } from "../RecentTransactionsDialog";
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
import type { FilterTransactionDto } from "lib";

export const TransactionTypeResume = (props: TransactionTypePropsType) => {
  const {
    title,
    config,
    id,
    user,
    onDelete,
    dragHandleProps,
    batchResult,
    onTypeResumeConfigSaved,
  } = props;
  const { t } = useTranslation();
  const typeResumeDialog = useTypeResumeDialog();
  const recentTransactionsDialog = useDialog();
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
  const oppositeExcludedCategoryIds = useMemo(
    () =>
      normalizeExcludedCategoryIds(
        resolvedFormConfig.oppositeExcludedCategoryIds,
      ),
    [resolvedFormConfig.oppositeExcludedCategoryIds],
  );

  const isBatchResultEnabled = !!batchResult;
  const typeResume = useTransactionTypeResume({
    ...filterConfig,
    enabled: !isBatchResultEnabled,
  });
  const oppositeTypeResume = useTransactionTypeResume({
    ...filterConfig,
    type: oppositeType,
    ...(oppositeExcludedCategoryIds.length
      ? { excludedCategoryIds: oppositeExcludedCategoryIds }
      : {}),
    enabled: !isBatchResultEnabled && resolvedFormConfig.showOppositeType,
  });
  const transactionCategories = useTransactionCategoriesCommon();

  const data = batchResult?.primary ?? typeResume.data;
  const isLoading = batchResult?.isLoading ?? typeResume.isLoading;
  const categories = data?.categories ?? [];
  const startDate = data?.startDate;
  const endDate = data?.endDate;
  const hasRecentTransactionsRange = !!startDate && !!endDate;
  const recentTransactionsFilters = useMemo<FilterTransactionDto>(
    () => ({
      ...(filterConfig.accountId ? { accountId: filterConfig.accountId } : {}),
      type: filterConfig.type,
      ...(startDate && endDate
        ? {
            date: {
              start: startDate,
              end: endDate,
            },
          }
        : {}),
      softDeleteScope: "ACTIVE",
    }),
    [endDate, filterConfig.accountId, filterConfig.type, startDate],
  );
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
  const oppositeExcludedCategories = useMemo(() => {
    const excludedIds = new Set(resolvedFormConfig.oppositeExcludedCategoryIds);

    return (transactionCategories.data ?? [])
      .filter(
        (category) =>
          excludedIds.has(category.id) &&
          Number(category.type) === Number(oppositeType),
      )
      .map((category) => ({
        ...category,
        name: category.auto
          ? t("_entities:transactionCategory.name.init")
          : category.name,
      }));
  }, [
    oppositeType,
    resolvedFormConfig.oppositeExcludedCategoryIds,
    t,
    transactionCategories.data,
  ]);
  const addTransaction = useAddTransaction({
    account: selectedAccount,
  });
  const oppositeTotal =
    batchResult?.opposite?.total ?? oppositeTypeResume.data?.total ?? 0;
  const primaryPreviousTotal =
    (batchResult?.primary ?? typeResume.data)?.comparison?.total ?? 0;
  const oppositePreviousTotal =
    (batchResult?.opposite ?? oppositeTypeResume.data)?.comparison?.total ?? 0;
  const isOppositeLoading =
    resolvedFormConfig.showOppositeType &&
    (batchResult?.isLoading ?? oppositeTypeResume.isLoading);

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
        onConfigSaved={(savedConfig) => {
          setConfigOverride({ baseConfig: config, savedConfig });
          onTypeResumeConfigSaved?.(id, config, savedConfig);
        }}
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
            oppositeExcludedCategories={oppositeExcludedCategories}
            showOppositeType={!!formConfig.showOppositeType}
            clearAccount={() => onSubmit({ ...formConfig, account: undefined })}
            clearExcludedCategories={() =>
              onSubmit({
                ...formConfig,
                excludedCategories: [],
                excludedCategoryIds: [],
              })
            }
            clearOppositeExcludedCategories={() =>
              onSubmit({
                ...formConfig,
                oppositeExcludedCategories: [],
                oppositeExcludedCategoryIds: [],
              })
            }
          />
        )}
      >
        {({ formConfig }) => (
          <div className="type-resume-content">
            <div className="type-resume-summary">
              {formConfig.compare ? (
                <div className="type-resume-compare">
                  <span className="type-resume-compare-header">
                    {t(
                      "_pages:home.dashboard.transactionTypeResume.compareColumns.previous",
                    )}
                  </span>
                  <span className="type-resume-compare-header">
                    {t(
                      "_pages:home.dashboard.transactionTypeResume.compareColumns.current",
                    )}
                  </span>
                  <span aria-hidden="true" />
                  {formConfig.showOppositeType && (
                    <TypeResumeRow
                      type={oppositeType}
                      amount={oppositeTotal}
                      previousAmount={oppositePreviousTotal}
                      isLoading={isOppositeLoading}
                      currencyName={
                        currencyName ?? formConfig.account?.currency?.name
                      }
                      currencySymbol={
                        currencySymbol ?? formConfig.account?.currency?.symbol
                      }
                      compare
                    />
                  )}
                  <TypeResumeRow
                    type={formConfig.type}
                    amount={data?.total ?? 0}
                    previousAmount={primaryPreviousTotal}
                    isLoading={isLoading}
                    currencyName={
                      currencyName ?? formConfig.account?.currency?.name
                    }
                    currencySymbol={
                      currencySymbol ?? formConfig.account?.currency?.symbol
                    }
                    compare
                  />
                </div>
              ) : (
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
              )}
              <div className="type-resume-actions">
                <IconButton
                  onClick={() => addTransaction.openDialog()}
                  icon={faAdd}
                  data-tooltip-id="tooltip"
                  data-tooltip-content={t("_pages:transactions.add")}
                  aria-label={t("_pages:transactions.add")}
                />
                <IconButton
                  disabled={isLoading || !hasRecentTransactionsRange}
                  onClick={recentTransactionsDialog.handleOpen}
                  icon={faClock}
                  data-tooltip-id="tooltip"
                  data-tooltip-content={t(
                    "_pages:home.dashboard.recentTransactions.action",
                  )}
                  aria-label={t(
                    "_pages:home.dashboard.recentTransactions.action",
                  )}
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
      <RecentTransactionsDialog
        open={recentTransactionsDialog.open}
        onClose={recentTransactionsDialog.handleClose}
        title={t("_pages:home.dashboard.recentTransactions.title")}
        filters={recentTransactionsFilters}
        excludedCategoryIds={resolvedFormConfig.excludedCategoryIds}
        enabled={hasRecentTransactionsRange}
      />
      <AddTransactionDialog {...addTransaction} />
    </>
  );
};
