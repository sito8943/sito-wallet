import { useEffect, useMemo } from "react";
import { Controller, useWatch } from "react-hook-form";

// @sito/dashboard-app
import {
  AutocompleteInput,
  CheckInput,
  Option,
  ParagraphInput,
  SelectInput,
  TextInput,
  useTranslation,
} from "@sito/dashboard-app";

// hooks
import {
  useAccountsCommon,
  useCurrenciesCommon,
  useSubscriptionProvidersCommon,
} from "hooks";

// lib
import { SUBSCRIPTION_BILLING_UNITS, SUBSCRIPTION_STATUSES, Tables } from "lib";

// types
import { SubscriptionFormPropsType } from "../types";

export function SubscriptionForm(props: SubscriptionFormPropsType) {
  const { control, isLoading, setValue } = props;
  const { t } = useTranslation();

  const providersQuery = useSubscriptionProvidersCommon({ onlyEnabled: true });
  const currenciesQuery = useCurrenciesCommon();
  const accountsQuery = useAccountsCommon();

  const providerOptions = useMemo(
    () => [...(providersQuery.data ?? [])] as Option[],
    [providersQuery.data],
  );

  const currencyOptions = useMemo(
    () => [...(currenciesQuery.data ?? [])] as Option[],
    [currenciesQuery.data],
  );

  const accountOptions = useMemo(
    () => [...(accountsQuery.data ?? [])] as Option[],
    [accountsQuery.data],
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
  const autoCreateTransaction = useWatch({
    control,
    name: "autoCreateTransaction",
  });
  const startsAt = useWatch({
    control,
    name: "startsAt",
  });

  useEffect(() => {
    if (!notificationEnabled) {
      setValue("notificationDaysBefore", "", { shouldDirty: false });
    }
  }, [notificationEnabled, setValue]);

  const formDisabled =
    isLoading ||
    providersQuery.isLoading ||
    currenciesQuery.isLoading ||
    accountsQuery.isLoading;

  return (
    <>
      <Controller
        control={control}
        render={({ field }) => <input {...field} type="hidden" />}
        name="id"
      />

      <div className="grid gap-5 md:grid-cols-2">
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
          name="endsAt"
          disabled={formDisabled}
          rules={{
            validate: (value) => {
              const parsedEndsAt = value?.trim();
              if (!parsedEndsAt?.length) return true;

              const parsedStartsAt = startsAt?.trim();
              if (!parsedStartsAt?.length) return true;

              const startDate = new Date(parsedStartsAt);
              const endDate = new Date(parsedEndsAt);

              if (
                Number.isNaN(startDate.getTime()) ||
                Number.isNaN(endDate.getTime())
              ) {
                return true;
              }

              return (
                endDate.getTime() >= startDate.getTime() ||
                t("_entities:subscription.endsAt.afterStart")
              );
            },
          }}
          render={({ field: { value, ...rest } }) => (
            <TextInput
              type="datetime-local"
              value={value ?? ""}
              label={t("_entities:subscription.endsAt.label")}
              autoComplete={`${Tables.Subscriptions}-${t("_entities:subscription.endsAt.label")}`}
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
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Controller
          control={control}
          name="autoCreateTransaction"
          disabled={formDisabled}
          render={({ field: { value, onChange, ...rest } }) => (
            <CheckInput
              {...rest}
              id="subscription-auto-create-transaction"
              checked={!!value}
              label={t("_entities:subscription.autoCreateTransaction.label")}
              inputClassName="h-4 w-4"
              onChange={(event) => onChange(event.currentTarget.checked)}
            />
          )}
        />

        <Controller
          control={control}
          name="account"
          disabled={formDisabled}
          rules={{
            validate: (value) => {
              if (!autoCreateTransaction) return true;
              return !!value?.id || t("_entities:subscription.account.requiredWhenAuto");
            },
          }}
          render={({ field: { value, onChange, ...rest } }) => (
            <AutocompleteInput
              required={!!autoCreateTransaction}
              options={accountOptions}
              value={value}
              onChange={(nextValue) => onChange(nextValue)}
              label={t("_entities:subscription.account.label")}
              placeholder={t("_entities:subscription.account.placeholder")}
              autoComplete={`${Tables.Subscriptions}-${t("_entities:subscription.account.label")}`}
              multiple={false}
              {...rest}
            />
          )}
        />

        <Controller
          control={control}
          name="notificationEnabled"
          disabled={formDisabled}
          render={({ field: { value, onChange, ...rest } }) => (
            <CheckInput
              {...rest}
              id="subscription-notification-enabled"
              checked={!!value}
              label={t("_entities:subscription.notificationEnabled.label")}
              inputClassName="h-4 w-4"
              onChange={(event) => onChange(event.currentTarget.checked)}
            />
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
      </div>

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
