import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

// icons
import {
  faFileInvoice,
  faList,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import { IconButton, SortOrder, useDialog } from "@sito/dashboard-app";

// hooks
import { useSubscriptionsRenewalsForecast } from "hooks";
import { SubscriptionsQueryKeys } from "hooks";
import { useCurrenciesCommon } from "hooks/queries/useCurrenciesCommon";
import { useRenewalsDialog } from "./useRenewalsDialog";

// lib
import type { FilterSubscriptionDto, SubscriptionDto } from "lib";
import {
  AppRoutes,
  RenewalRangePreset,
  defaultSubscriptionsListFilters,
  normalizeListFilters,
} from "lib";

// components
import { AddSubscriptionBillingLogDialog } from "views/Subscriptions/components";
import { useAddSubscriptionBillingLogDialog } from "views/Subscriptions/hooks";
import { toSubscriptionStatus } from "views/Subscriptions/utils";
import { Currency } from "../../../../Currencies";
import { ConfigFormDialog } from "./ConfigFormDialog";
import { ActiveFilters } from "./ActiveFilters";
import { RenewalsDialog } from "./RenewalsDialog";
import { SelectSubscriptionDialog } from "./SelectSubscriptionDialog";
import { DashboardCard } from "../DashboardCard";
import { resolveCardConfig } from "../utils";

// styles
import "../styles.css";

// types
import type {
  SubscriptionForecastFormType,
  SubscriptionForecastPropsType,
  SelectSubscriptionDialogPropsType,
} from "./types";
import type { CardConfigOverrideType } from "../types";

// utils
import { formToDto, resolveTimezone } from "./utils";
import { useManager } from "providers";

const defaultConfig: SubscriptionForecastFormType = {
  range: RenewalRangePreset.CurrentMonth,
};

export const SubscriptionForecastCard = (
  props: SubscriptionForecastPropsType,
) => {
  const { title, config, id, user, onDelete, dragHandleProps } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const manager = useManager();
  const subscriptionsClient =
    "Subscriptions" in manager ? manager.Subscriptions : null;
  const [configOverride, setConfigOverride] =
    useState<CardConfigOverrideType | null>(null);
  const effectiveConfig = resolveCardConfig(config, configOverride);

  const parseFormConfig = (
    cfg?: string | null,
  ): SubscriptionForecastFormType => {
    try {
      const parsed = (
        cfg ? JSON.parse(cfg) : {}
      ) as Partial<SubscriptionForecastFormType>;
      return {
        range: parsed.range ?? defaultConfig.range,
      };
    } catch (err) {
      console.error(err);
      return defaultConfig;
    }
  };

  const formConfig = useMemo(
    () => parseFormConfig(effectiveConfig),
    [effectiveConfig],
  );
  const timezone = useMemo(() => resolveTimezone(), []);

  const { data, isLoading } = useSubscriptionsRenewalsForecast({
    range: formConfig.range,
    timezone,
  });

  const { data: currencies } = useCurrenciesCommon();

  const totals = data?.totals ?? [];
  const count = data?.count ?? 0;
  const renewals = data?.renewals ?? [];

  const renewalsDialog = useRenewalsDialog();
  const selectSubscriptionDialog = useDialog();
  const addBillingLog = useAddSubscriptionBillingLogDialog();

  const subscriptionsPickerQuery = useQuery({
    queryKey: [
      ...SubscriptionsQueryKeys.all().queryKey,
      "forecast-card-picker",
    ],
    enabled: selectSubscriptionDialog.open && !!subscriptionsClient,
    queryFn: async () => {
      if (!subscriptionsClient) {
        throw new Error("subscriptions.featureDisabled");
      }

      return subscriptionsClient.get(
        {
          pageSize: 200,
          sortingBy: "name",
          sortingOrder: SortOrder.ASC,
        },
        normalizeListFilters(
          defaultSubscriptionsListFilters,
        ) as FilterSubscriptionDto,
      );
    },
  });

  const selectableSubscriptions = useMemo<SubscriptionDto[]>(
    () =>
      (subscriptionsPickerQuery.data?.items ?? []).filter(
        (subscription) =>
          toSubscriptionStatus(subscription.status) !== "CANCELED",
      ),
    [subscriptionsPickerQuery.data?.items],
  );

  const subscriptionPickerErrorMessage = useMemo(() => {
    if (!subscriptionsPickerQuery.error) return null;
    return subscriptionsPickerQuery.error instanceof Error
      ? subscriptionsPickerQuery.error.message
      : t("_accessibility:errors.500");
  }, [subscriptionsPickerQuery.error, t]);

  const resolveCurrency = (currencyName: string | null) => {
    if (!currencyName) return { name: "", symbol: "" };
    const match = currencies?.find((c) => c.name === currencyName);
    return { name: currencyName, symbol: match?.symbol ?? "" };
  };

  const handleOpenAddSubscription = useCallback(() => {
    selectSubscriptionDialog.handleClose();
    navigate(AppRoutes.subscriptionNew);
  }, [navigate, selectSubscriptionDialog]);

  const handleSelectSubscription: SelectSubscriptionDialogPropsType["onSelect"] =
    useCallback(
      (subscription) => {
        selectSubscriptionDialog.handleClose();
        addBillingLog.openDialogForSubscription(subscription);
      },
      [addBillingLog, selectSubscriptionDialog],
    );

  const handleRegisterRenewalPayment = useCallback(
    (subscriptionId: number) => {
      renewalsDialog.closeDialog();
      void addBillingLog.openDialogBySubscriptionId(subscriptionId);
    },
    [addBillingLog, renewalsDialog],
  );

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
        renderActiveFilters={({ formConfig }) => (
          <ActiveFilters
            range={formConfig.range}
            from={data?.from}
            to={data?.to}
          />
        )}
      >
        {() => (
          <div className="subscription-forecast-content">
            <p className="subscription-forecast-count poppins">
              {t("_pages:home.dashboard.subscriptionForecast.count", {
                count,
              })}
            </p>
            <div className="subscription-forecast-summary">
              <div className="subscription-forecast-totals">
                {totals.length === 0 ? (
                  <p className="subscription-forecast-total poppins">
                    {isLoading ? "…" : "0"}
                  </p>
                ) : (
                  totals.map((total, index) => {
                    const currency = resolveCurrency(total.currency);
                    return (
                      <p
                        key={`${total.currency ?? "none"}-${index}`}
                        className="subscription-forecast-total poppins"
                      >
                        {total.amount}{" "}
                        <Currency
                          name={currency.name}
                          symbol={currency.symbol}
                        />
                      </p>
                    );
                  })
                )}
              </div>
              <div className="subscription-forecast-actions">
                <IconButton
                  disabled={!subscriptionsClient}
                  onClick={handleOpenAddSubscription}
                  icon={faPlus}
                  data-tooltip-id="tooltip"
                  data-tooltip-content={t("_pages:subscriptions.add")}
                  aria-label={t("_pages:subscriptions.add")}
                />
                <IconButton
                  disabled={!subscriptionsClient}
                  onClick={selectSubscriptionDialog.handleOpen}
                  icon={faFileInvoice}
                  data-tooltip-id="tooltip"
                  data-tooltip-content={t(
                    "_pages:subscriptions.actions.billingLog.text",
                  )}
                  aria-label={t("_pages:subscriptions.actions.billingLog.text")}
                />
                <IconButton
                  disabled={isLoading || renewals.length === 0}
                  onClick={renewalsDialog.openDialog}
                  icon={faList}
                  data-tooltip-id="tooltip"
                  data-tooltip-content={t(
                    "_pages:home.dashboard.subscriptionForecast.details.title",
                  )}
                  aria-label={t(
                    "_pages:home.dashboard.subscriptionForecast.details.title",
                  )}
                />
              </div>
            </div>
          </div>
        )}
      </DashboardCard>
      <RenewalsDialog
        {...renewalsDialog}
        renewals={renewals}
        onRegisterPayment={handleRegisterRenewalPayment}
        registeringSubscriptionId={addBillingLog.resolvingSubscriptionId}
      />
      <SelectSubscriptionDialog
        open={selectSubscriptionDialog.open}
        handleClose={selectSubscriptionDialog.handleClose}
        subscriptions={selectableSubscriptions}
        isLoading={subscriptionsPickerQuery.isLoading}
        errorMessage={subscriptionPickerErrorMessage}
        onSelect={handleSelectSubscription}
        onAddSubscription={handleOpenAddSubscription}
      />
      <AddSubscriptionBillingLogDialog {...addBillingLog} />
    </>
  );
};
