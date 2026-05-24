import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// icons
import { faList } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import { IconButton } from "@sito/dashboard-app";

// hooks
import { useCurrenciesCommon, useSubscriptionsRenewalsForecast } from "hooks";
import { useRenewalsDialog } from "./useRenewalsDialog";

// lib
import { RenewalRangePreset } from "lib";

// components
import { Currency } from "../../../../Currencies";
import { ConfigFormDialog } from "./ConfigFormDialog";
import { ActiveFilters } from "./ActiveFilters";
import { RenewalsDialog } from "./RenewalsDialog";
import { DashboardCard } from "../DashboardCard";

// styles
import "../TypeResume/styles.css";

// types
import type {
  SubscriptionForecastFormType,
  SubscriptionForecastPropsType,
} from "./types";

// utils
import { formToDto, resolveTimezone } from "./utils";

const defaultConfig: SubscriptionForecastFormType = {
  range: RenewalRangePreset.CurrentMonth,
};

export const SubscriptionForecastCard = (
  props: SubscriptionForecastPropsType,
) => {
  const { title, config, id, user, onDelete } = props;
  const { t } = useTranslation();

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

  const formConfig = useMemo(() => parseFormConfig(config), [config]);
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

  const resolveCurrency = (currencyName: string | null) => {
    if (!currencyName) return { name: "", symbol: "" };
    const match = currencies?.find((c) => c.name === currencyName);
    return { name: currencyName, symbol: match?.symbol ?? "" };
  };

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
          <div className="flex flex-col gap-2 w-full mt-auto">
            <p className="text-sm text-text-muted poppins">
              {t("_pages:home.dashboard.subscriptionForecast.count", {
                count,
              })}
            </p>
            <div className="flex items-end justify-between gap-2 w-full">
              <div className="flex flex-col gap-1">
                {totals.length === 0 ? (
                  <p className="!text-2xl font-bold poppins">
                    {isLoading ? "…" : "0"}
                  </p>
                ) : (
                  totals.map((total, index) => {
                    const currency = resolveCurrency(total.currency);
                    return (
                      <p
                        key={`${total.currency ?? "none"}-${index}`}
                        className="!text-2xl font-bold poppins"
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
              <IconButton
                disabled={isLoading || renewals.length === 0}
                onClick={renewalsDialog.openDialog}
                icon={faList}
                aria-label={t(
                  "_pages:home.dashboard.subscriptionForecast.details.title",
                )}
              />
            </div>
          </div>
        )}
      </DashboardCard>
      <RenewalsDialog {...renewalsDialog} renewals={renewals} />
    </>
  );
};
