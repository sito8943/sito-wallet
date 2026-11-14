import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useWatch } from "react-hook-form";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import type { Option } from "@sito/dashboard-app";
import {
  AutocompleteInput,
  ParagraphInput,
  TextInput,
} from "@sito/dashboard-app";

// hooks
import {
  useAccountsCommon,
  useCurrenciesCommon,
  useProductsCommon,
} from "hooks";

// lib
import type { CommonAccountDto, PhotoFormValues } from "lib";
import { Tables, withProductLabel } from "lib";

// components
import { PhotoField } from "components";

// constants
import {
  GOAL_DESCRIPTION_MAX_LENGTH,
  GOAL_NAME_MAX_LENGTH,
  GOAL_PHOTO_INPUT_ID,
} from "../../constants";

// utils
import { getProductPrefill, isAccountUsedByOtherActiveGoal } from "../../utils";

// types
import type { GoalFormPropsType, GoalFormType } from "../../types";

import "./styles.css";

export function GoalForm(props: GoalFormPropsType) {
  const { control, isLoading, setValue, getValues, goals } = props;
  const { t } = useTranslation();

  // Own catalog only: the backend rejects shared products.
  const products = useProductsCommon();
  const accounts = useAccountsCommon();
  const currencies = useCurrenciesCommon({ includeShared: true });

  const productOptions = useMemo(
    () => (products.data ?? []).map(withProductLabel) as Option[],
    [products.data],
  );
  const accountOptions = useMemo(
    () => (accounts.data ?? []) as Option[],
    [accounts.data],
  );
  const currencyOptions = useMemo(
    () => (currencies.data ?? []) as Option[],
    [currencies.data],
  );

  const [id, account, product, photo, photoUrl, file, removePhoto] = useWatch({
    control,
    name: [
      "id",
      "account",
      "product",
      "photo",
      "photoUrl",
      "file",
      "removePhoto",
    ],
  });

  const accountInUse = isAccountUsedByOtherActiveGoal(goals, account?.id, id);

  const patchForm = (patch: Partial<GoalFormType>) =>
    Object.entries(patch).forEach(([key, value]) =>
      setValue(key, value, { shouldDirty: true }),
    );

  return (
    <>
      <Controller
        control={control}
        name="id"
        render={({ field }) => <input {...field} type="hidden" />}
      />
      <div className="goal-form-grid">
        <Controller
          control={control}
          name="name"
          disabled={isLoading}
          rules={{ required: t("_entities:base.name.required") }}
          render={({ field: { value, ...rest } }) => (
            <TextInput
              required
              maxLength={GOAL_NAME_MAX_LENGTH}
              autoComplete="off"
              value={value ?? ""}
              label={t("_entities:base.name.label")}
              placeholder={t("_entities:goal.name.placeholder")}
              {...rest}
            />
          )}
        />
        <Controller
          control={control}
          name="product"
          disabled={isLoading}
          render={({ field: { value, onChange, ...rest } }) => (
            <AutocompleteInput
              options={productOptions}
              value={value && withProductLabel(value)}
              onChange={(next) => {
                const selected =
                  (next &&
                    !Array.isArray(next) &&
                    products.data?.find((item) => item.id === next.id)) ||
                  null;
                onChange(selected);
                patchForm(getProductPrefill(getValues(), selected));
              }}
              label={t("_entities:goal.product.label")}
              helperText={t("_entities:goal.product.helper")}
              autoComplete={`${Tables.Goals}-${t("_entities:goal.product.label")}`}
              multiple={false}
              {...rest}
            />
          )}
        />
        <Controller
          control={control}
          name="account"
          disabled={isLoading}
          render={({ field: { value, onChange, ...rest } }) => (
            <AutocompleteInput
              options={accountOptions}
              value={value}
              onChange={(next) => {
                const selected =
                  next && !Array.isArray(next)
                    ? (next as CommonAccountDto)
                    : null;
                onChange(selected);
                if (selected?.currency)
                  patchForm({ currency: selected.currency });
              }}
              label={t("_entities:goal.account.label")}
              helperText={t("_entities:goal.account.helper")}
              autoComplete={`${Tables.Goals}-${t("_entities:goal.account.label")}`}
              multiple={false}
              {...rest}
            />
          )}
        />
        <Controller
          control={control}
          name="currency"
          disabled={isLoading || !!account}
          rules={{
            validate: (value, values) =>
              !!values.account ||
              !!value ||
              t("_entities:goal.currency.required"),
          }}
          render={({ field: { value, onChange, ...rest } }) => (
            <AutocompleteInput
              required={!account}
              options={currencyOptions}
              value={value}
              onChange={(next) => onChange(next)}
              label={t("_entities:goal.currency.label")}
              placeholder={t("_entities:goal.currency.placeholder")}
              autoComplete={`${Tables.Goals}-${t("_entities:goal.currency.label")}`}
              multiple={false}
              {...rest}
            />
          )}
        />
        <Controller
          control={control}
          name="targetAmount"
          disabled={isLoading}
          rules={{
            required: t("_entities:goal.targetAmount.required"),
            validate: (value) =>
              Number(value) > 0 ||
              t("_entities:goal.targetAmount.greaterThanZero"),
          }}
          render={({ field: { value, ...rest } }) => (
            <TextInput
              required
              type="number"
              min={0}
              step="any"
              value={value ?? ""}
              label={t("_entities:goal.targetAmount.label")}
              placeholder={t("_entities:goal.targetAmount.placeholder")}
              autoComplete="off"
              {...rest}
            />
          )}
        />
        {!account && (
          <Controller
            control={control}
            name="savedAmount"
            disabled={isLoading}
            rules={{
              validate: (value) =>
                !value ||
                Number(value) >= 0 ||
                t("_entities:goal.savedAmount.min"),
            }}
            render={({ field: { value, ...rest } }) => (
              <TextInput
                type="number"
                min={0}
                step="any"
                value={value ?? ""}
                label={t("_entities:goal.savedAmount.label")}
                placeholder={t("_entities:goal.savedAmount.placeholder")}
                helperText={t("_entities:goal.savedAmount.helper")}
                autoComplete="off"
                {...rest}
              />
            )}
          />
        )}
        <Controller
          control={control}
          name="deadline"
          disabled={isLoading}
          render={({ field: { value, ...rest } }) => (
            <TextInput
              type="date"
              value={value ?? ""}
              label={t("_entities:goal.deadline.label")}
              autoComplete="off"
              {...rest}
            />
          )}
        />
      </div>
      {accountInUse && (
        <p className="goal-form-warning" role="status">
          <FontAwesomeIcon icon={faWarning} />
          {t("_entities:goal.account.inUse")}
        </p>
      )}
      <Controller
        control={control}
        name="description"
        disabled={isLoading}
        render={({ field: { value, ...rest } }) => (
          <ParagraphInput
            maxLength={GOAL_DESCRIPTION_MAX_LENGTH}
            value={value ?? ""}
            label={t("_entities:base.description.label")}
            placeholder={t("_entities:base.description.placeholder")}
            {...rest}
          />
        )}
      />
      <PhotoField
        inputId={GOAL_PHOTO_INPUT_ID}
        disabled={isLoading}
        hideUrl
        fallbackPhoto={product?.photo}
        values={{ photo, photoUrl, file, removePhoto }}
        onChange={(patch: Partial<PhotoFormValues>) => patchForm(patch)}
      />
    </>
  );
}
