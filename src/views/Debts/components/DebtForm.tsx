import { useMemo } from "react";
import { Controller } from "react-hook-form";

// @sito/dashboard-app
import type { Option } from "@sito/dashboard-app";
import {
  AutocompleteInput,
  ParagraphInput,
  SelectInput,
  TextInput,
  useTranslation,
} from "@sito/dashboard-app";

// hooks
import { useCurrenciesCommon } from "../../../hooks/queries/useCurrenciesCommon";

// lib
import { DEBT_DIRECTION_NAME, DEBT_DIRECTIONS, Tables } from "lib";

// types
import type { DebtFormPropsType } from "../types";
import { toDebtDirection } from "../utils";

import "./styles.css";

export function DebtForm(props: DebtFormPropsType) {
  const { control, isLoading } = props;
  const { t } = useTranslation();

  const currenciesQuery = useCurrenciesCommon();

  const currencyOptions = useMemo(
    () => [...(currenciesQuery.data ?? [])] as Option[],
    [currenciesQuery.data],
  );

  const directionOptions = useMemo(
    () =>
      DEBT_DIRECTIONS.map((direction) => ({
        id: direction,
        name: t(
          `_entities:debt.direction.values.${DEBT_DIRECTION_NAME[direction]}`,
        ),
      })),
    [t],
  );

  const formDisabled = isLoading || currenciesQuery.isLoading;

  return (
    <>
      <Controller
        control={control}
        render={({ field }) => <input {...field} type="hidden" />}
        name="id"
      />

      <div className="debt-form-grid">
        <Controller
          control={control}
          rules={{ required: t("_entities:debt.title.required") }}
          name="title"
          disabled={formDisabled}
          render={({ field: { value, ...rest } }) => (
            <TextInput
              required
              maxLength={120}
              value={value ?? ""}
              label={t("_entities:debt.title.label")}
              placeholder={t("_entities:debt.title.placeholder")}
              autoComplete={`${Tables.Debts}-${t("_entities:debt.title.label")}`}
              {...rest}
            />
          )}
        />

        <Controller
          control={control}
          rules={{ required: t("_entities:debt.direction.required") }}
          name="direction"
          disabled={formDisabled}
          render={({ field: { value, onChange, ...rest } }) => (
            <SelectInput
              required
              options={directionOptions}
              value={value}
              onChange={(event) =>
                onChange(
                  toDebtDirection((event.target as HTMLSelectElement).value),
                )
              }
              label={t("_entities:debt.direction.label")}
              {...rest}
            />
          )}
        />

        <Controller
          control={control}
          rules={{ required: t("_entities:debt.counterpartyName.required") }}
          name="counterpartyName"
          disabled={formDisabled}
          render={({ field: { value, ...rest } }) => (
            <TextInput
              required
              maxLength={120}
              value={value ?? ""}
              label={t("_entities:debt.counterpartyName.label")}
              placeholder={t("_entities:debt.counterpartyName.placeholder")}
              autoComplete={`${Tables.Debts}-${t("_entities:debt.counterpartyName.label")}`}
              {...rest}
            />
          )}
        />

        <Controller
          control={control}
          name="counterpartyContact"
          disabled={formDisabled}
          render={({ field: { value, ...rest } }) => (
            <TextInput
              maxLength={160}
              value={value ?? ""}
              label={t("_entities:debt.counterpartyContact.label")}
              placeholder={t("_entities:debt.counterpartyContact.placeholder")}
              autoComplete={`${Tables.Debts}-${t("_entities:debt.counterpartyContact.label")}`}
              {...rest}
            />
          )}
        />

        <Controller
          control={control}
          rules={{
            required: t("_entities:debt.originalAmount.required"),
            validate: (value) =>
              Number(value) > 0 ||
              t("_entities:debt.originalAmount.greaterThanZero"),
          }}
          name="originalAmount"
          disabled={formDisabled}
          render={({ field: { value, ...rest } }) => (
            <TextInput
              required
              type="number"
              min={0.01}
              step="0.01"
              value={value ?? ""}
              label={t("_entities:debt.originalAmount.label")}
              placeholder={t("_entities:debt.originalAmount.placeholder")}
              autoComplete={`${Tables.Debts}-${t("_entities:debt.originalAmount.label")}`}
              {...rest}
            />
          )}
        />

        <Controller
          control={control}
          rules={{ required: t("_entities:debt.currency.required") }}
          name="currency"
          disabled={formDisabled}
          render={({ field: { value, onChange, ...rest } }) => (
            <AutocompleteInput
              required
              options={currencyOptions}
              value={value}
              onChange={(nextValue) => onChange(nextValue)}
              label={t("_entities:debt.currency.label")}
              placeholder={t("_entities:debt.currency.placeholder")}
              autoComplete={`${Tables.Debts}-${t("_entities:debt.currency.label")}`}
              multiple={false}
              {...rest}
            />
          )}
        />

        <Controller
          control={control}
          rules={{ required: t("_entities:debt.issuedAt.required") }}
          name="issuedAt"
          disabled={formDisabled}
          render={({ field: { value, ...rest } }) => (
            <TextInput
              required
              type="datetime-local"
              value={value ?? ""}
              label={t("_entities:debt.issuedAt.label")}
              autoComplete={`${Tables.Debts}-${t("_entities:debt.issuedAt.label")}`}
              {...rest}
            />
          )}
        />

        <Controller
          control={control}
          name="dueAt"
          disabled={formDisabled}
          render={({ field: { value, ...rest } }) => (
            <TextInput
              type="datetime-local"
              value={value ?? ""}
              label={t("_entities:debt.dueAt.label")}
              autoComplete={`${Tables.Debts}-${t("_entities:debt.dueAt.label")}`}
              {...rest}
            />
          )}
        />
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
            autoComplete={`${Tables.Debts}-${t("_entities:base.description.label")}`}
            {...rest}
          />
        )}
      />
    </>
  );
}
