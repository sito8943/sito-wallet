import { useEffect, useMemo } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
  AutocompleteInput,
  Option,
  ParagraphInput,
  TextInput,
} from "@sito/dashboard-app";

import { useCurrenciesCommon } from "hooks";
import { Tables } from "lib";

import { AddSubscriptionBillingLogDialogPropsType } from "../types";

export function SubscriptionBillingLogForm(
  props: AddSubscriptionBillingLogDialogPropsType,
) {
  const { control, isLoading, open, setValue, selectedSubscription } = props;
  const { t } = useTranslation();

  const currenciesQuery = useCurrenciesCommon();

  const currencyOptions = useMemo(
    () => [...(currenciesQuery.data ?? [])] as Option[],
    [currenciesQuery.data],
  );

  useEffect(() => {
    if (!open || !selectedSubscription || !setValue) return;

    setValue("subscriptionId", selectedSubscription.id);
    setValue("amount", String(selectedSubscription.amount ?? ""));
    setValue("paidAt", new Date().toISOString().slice(0, 16));
    setValue("currency", selectedSubscription.currency ?? null);
    setValue("note", "");
  }, [open, selectedSubscription, setValue]);

  const formDisabled = isLoading || currenciesQuery.isLoading;

  return (
    <>
      <Controller
        control={control}
        render={({ field }) => <input {...field} type="hidden" />}
        name="subscriptionId"
      />

      {selectedSubscription ? (
        <p className="text-sm text-text-muted">
          {t("_pages:subscriptions.actions.billingLog.for")}:
          <strong className="ml-1 text-text">{selectedSubscription.name}</strong>
        </p>
      ) : null}

      <Controller
        control={control}
        rules={{
          required: t("_entities:subscriptionBillingLog.amount.required"),
          validate: (value) =>
            Number(value) > 0 ||
            t("_entities:subscriptionBillingLog.amount.greaterThanZero"),
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
            label={t("_entities:subscriptionBillingLog.amount.label")}
            placeholder={t("_entities:subscriptionBillingLog.amount.placeholder")}
            autoComplete={`${Tables.Subscriptions}-${t("_entities:subscriptionBillingLog.amount.label")}`}
            {...rest}
          />
        )}
      />

      <Controller
        control={control}
        rules={{
          required: t("_entities:subscriptionBillingLog.paidAt.required"),
        }}
        name="paidAt"
        disabled={formDisabled}
        render={({ field: { value, ...rest } }) => (
          <TextInput
            required
            type="datetime-local"
            value={value ?? ""}
            label={t("_entities:subscriptionBillingLog.paidAt.label")}
            autoComplete={`${Tables.Subscriptions}-${t("_entities:subscriptionBillingLog.paidAt.label")}`}
            {...rest}
          />
        )}
      />

      <Controller
        control={control}
        name="currency"
        disabled={formDisabled}
        render={({ field: { value, onChange, ...rest } }) => (
          <AutocompleteInput
            options={currencyOptions}
            value={value}
            onChange={(nextValue) => onChange(nextValue)}
            label={t("_entities:subscriptionBillingLog.currency.label")}
            placeholder={t("_entities:subscriptionBillingLog.currency.placeholder")}
            autoComplete={`${Tables.Subscriptions}-${t("_entities:subscriptionBillingLog.currency.label")}`}
            multiple={false}
            {...rest}
          />
        )}
      />

      <Controller
        control={control}
        name="note"
        disabled={formDisabled}
        render={({ field: { value, ...rest } }) => (
          <ParagraphInput
            maxLength={500}
            value={value ?? ""}
            label={t("_entities:subscriptionBillingLog.note.label")}
            placeholder={t("_entities:subscriptionBillingLog.note.placeholder")}
            autoComplete={`${Tables.Subscriptions}-${t("_entities:subscriptionBillingLog.note.label")}`}
            {...rest}
          />
        )}
      />
    </>
  );
}
