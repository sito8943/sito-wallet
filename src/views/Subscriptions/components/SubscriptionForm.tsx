import { useEffect, useMemo } from "react";
import { Controller, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
  AutocompleteInput,
  Option,
  ParagraphInput,
  SelectInput,
  TextInput,
} from "@sito/dashboard-app";

import { useCurrenciesCommon, useSubscriptionProvidersCommon } from "hooks";
import { SUBSCRIPTION_BILLING_UNITS, SUBSCRIPTION_STATUSES, Tables } from "lib";

import { SubscriptionFormPropsType } from "../types";

export function SubscriptionForm(props: SubscriptionFormPropsType) {
  const { control, isLoading, setValue } = props;
  const { t } = useTranslation();

  const providersQuery = useSubscriptionProvidersCommon({ onlyEnabled: true });
  const currenciesQuery = useCurrenciesCommon();

  const providerOptions = useMemo(
    () => [...(providersQuery.data ?? [])] as Option[],
    [providersQuery.data],
  );

  const currencyOptions = useMemo(
    () => [...(currenciesQuery.data ?? [])] as Option[],
    [currenciesQuery.data],
  );

  const billingUnitOptions = useMemo(
    () =>
      SUBSCRIPTION_BILLING_UNITS.map((unit) => ({
        id: unit,
        name: t(`_entities:subscription.billingUnit.values.${unit}`),
      })),
    [t],
  );

  const statusOptions = useMemo(
    () =>
      SUBSCRIPTION_STATUSES.map((status) => ({
        id: status,
        name: t(`_entities:subscription.status.values.${status}`),
      })),
    [t],
  );

  const notificationEnabled = useWatch({
    control,
    name: "notificationEnabled",
  });

  useEffect(() => {
    if (!notificationEnabled && setValue) {
      setValue("notificationDaysBefore", "");
    }
  }, [notificationEnabled, setValue]);

  const formDisabled =
    isLoading || providersQuery.isLoading || currenciesQuery.isLoading;

  return (
    <>
      <Controller
        control={control}
        render={({ field }) => <input {...field} type="hidden" />}
        name="id"
      />

      <Controller
        control={control}
        rules={{
          required: t("_entities:base.name.required"),
        }}
        name="name"
        disabled={formDisabled}
        render={({ field: { value, ...rest } }) => (
          <TextInput
            required
            maxLength={120}
            value={value ?? ""}
            label={t("_entities:base.name.label")}
            placeholder={t("_entities:subscription.name.placeholder")}
            autoComplete={`${Tables.Subscriptions}-${t("_entities:base.name.label")}`}
            {...rest}
          />
        )}
      />

      <Controller
        control={control}
        rules={{
          required: t("_entities:subscription.provider.required"),
        }}
        name="provider"
        disabled={formDisabled}
        render={({ field: { value, onChange, ...rest } }) => (
          <AutocompleteInput
            required
            options={providerOptions}
            value={value}
            onChange={(nextValue) => onChange(nextValue)}
            label={t("_entities:subscription.provider.label")}
            placeholder={t("_entities:subscription.provider.placeholder")}
            autoComplete={`${Tables.Subscriptions}-${t("_entities:subscription.provider.label")}`}
            multiple={false}
            {...rest}
          />
        )}
      />
      <div className="flex gap-2">
        <Controller
          control={control}
          rules={{
            required: t("_entities:subscription.currency.required"),
          }}
          name="currency"
          disabled={formDisabled}
          render={({ field: { value, onChange, ...rest } }) => (
            <AutocompleteInput
              required
              options={currencyOptions}
              value={value}
              onChange={(nextValue) => onChange(nextValue)}
              label={t("_entities:subscription.currency.label")}
              placeholder={t("_entities:subscription.currency.placeholder")}
              autoComplete={`${Tables.Subscriptions}-${t("_entities:subscription.currency.label")}`}
              multiple={false}
              {...rest}
            />
          )}
        />

        <Controller
          control={control}
          rules={{
            required: t("_entities:subscription.amount.required"),
            validate: (value) =>
              Number(value) > 0 ||
              t("_entities:subscription.amount.greaterThanZero"),
          }}
          name="amount"
          disabled={formDisabled}
          render={({ field: { value, ...rest } }) => (
            <TextInput
              required
              type="number"
              min={0.01}
              step="0.01"
              value={value ?? ""}
              label={t("_entities:subscription.amount.label")}
              placeholder={t("_entities:subscription.amount.placeholder")}
              autoComplete={`${Tables.Subscriptions}-${t("_entities:subscription.amount.label")}`}
              {...rest}
            />
          )}
        />
      </div>
      <div className="flex gap-2">
        <Controller
          control={control}
          rules={{
            required: t("_entities:subscription.billingFrequency.required"),
            validate: (value) =>
              Number(value) >= 1 ||
              t("_entities:subscription.billingFrequency.greaterThanZero"),
          }}
          name="billingFrequency"
          disabled={formDisabled}
          render={({ field: { value, ...rest } }) => (
            <TextInput
              required
              type="number"
              min={1}
              step={1}
              value={value ?? ""}
              label={t("_entities:subscription.billingFrequency.label")}
              placeholder={t(
                "_entities:subscription.billingFrequency.placeholder",
              )}
              autoComplete={`${Tables.Subscriptions}-${t("_entities:subscription.billingFrequency.label")}`}
              {...rest}
            />
          )}
        />

        <Controller
          control={control}
          rules={{
            required: t("_entities:subscription.billingUnit.required"),
          }}
          name="billingUnit"
          disabled={formDisabled}
          render={({ field: { value, onChange, ...rest } }) => (
            <SelectInput
              required
              options={billingUnitOptions}
              value={value}
              onChange={(event) =>
                onChange((event.target as HTMLSelectElement).value)
              }
              label={t("_entities:subscription.billingUnit.label")}
              {...rest}
            />
          )}
        />
      </div>
      <div className="flex gap-2">
        <Controller
          control={control}
          rules={{
            required: t("_entities:subscription.startsAt.required"),
          }}
          name="startsAt"
          disabled={formDisabled}
          render={({ field: { value, ...rest } }) => (
            <TextInput
              required
              type="datetime-local"
              value={value ?? ""}
              label={t("_entities:subscription.startsAt.label")}
              autoComplete={`${Tables.Subscriptions}-${t("_entities:subscription.startsAt.label")}`}
              {...rest}
            />
          )}
        />

        <Controller
          control={control}
          name="lastPaidAt"
          disabled={formDisabled}
          render={({ field: { value, ...rest } }) => (
            <TextInput
              type="datetime-local"
              value={value ?? ""}
              label={t("_entities:subscription.lastPaidAt.label")}
              autoComplete={`${Tables.Subscriptions}-${t("_entities:subscription.lastPaidAt.label")}`}
              {...rest}
            />
          )}
        />
      </div>

      <Controller
        control={control}
        rules={{
          required: t("_entities:subscription.status.required"),
        }}
        name="status"
        disabled={formDisabled}
        render={({ field: { value, onChange, ...rest } }) => (
          <SelectInput
            required
            options={statusOptions}
            value={value}
            onChange={(event) =>
              onChange((event.target as HTMLSelectElement).value)
            }
            label={t("_entities:subscription.status.label")}
            {...rest}
          />
        )}
      />

      <Controller
        control={control}
        name="notificationEnabled"
        disabled={formDisabled}
        render={({ field: { value, onChange, ...rest } }) => (
          <label className="flex items-center gap-2 text-sm text-text">
            <input
              {...rest}
              type="checkbox"
              checked={!!value}
              onChange={(event) => onChange(event.target.checked)}
              className="h-4 w-4"
            />
            {t("_entities:subscription.notificationEnabled.label")}
          </label>
        )}
      />

      {notificationEnabled ? (
        <Controller
          control={control}
          rules={{
            required: t(
              "_entities:subscription.notificationDaysBefore.required",
            ),
            validate: (value) => {
              const parsed = Number(value);
              return (
                (Number.isFinite(parsed) && parsed >= 0 && parsed <= 30) ||
                t("_entities:subscription.notificationDaysBefore.range")
              );
            },
          }}
          name="notificationDaysBefore"
          disabled={formDisabled}
          render={({ field: { value, ...rest } }) => (
            <TextInput
              required
              type="number"
              min={0}
              max={30}
              step={1}
              value={value ?? ""}
              label={t("_entities:subscription.notificationDaysBefore.label")}
              placeholder={t(
                "_entities:subscription.notificationDaysBefore.placeholder",
              )}
              autoComplete={`${Tables.Subscriptions}-${t("_entities:subscription.notificationDaysBefore.label")}`}
              {...rest}
            />
          )}
        />
      ) : null}

      <Controller
        control={control}
        name="description"
        disabled={formDisabled}
        render={({ field: { value, ...rest } }) => (
          <ParagraphInput
            maxLength={500}
            value={value ?? ""}
            label={t("_entities:base.description.label")}
            placeholder={t("_entities:base.description.placeholder")}
            autoComplete={`${Tables.Subscriptions}-${t("_entities:base.description.label")}`}
            {...rest}
          />
        )}
      />
    </>
  );
}
