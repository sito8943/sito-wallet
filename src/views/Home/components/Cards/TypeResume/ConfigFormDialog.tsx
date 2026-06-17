import { Controller, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo } from "react";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// @sito/dashboard-app
import type { Option } from "@sito/dashboard-app";
import {
  classNames,
  enumToKeyValueArray,
  FormDialog,
  AutocompleteInput,
  CheckInput,
  SelectInput,
} from "@sito/dashboard-app";

// hooks
import { useAccountsCommon } from "../../../../../hooks/queries/useAccountsCommon";
import { useTransactionCategoriesCommon } from "../../../../../hooks/queries/useTransactionCategoriesCommon";

// lib
import type { CommonTransactionCategoryDto } from "lib";
import { Tables, TransactionType, TransactionTypeResumeTime } from "lib";

// types
import type {
  ConfigFormDialogPropsType,
  TypeResumeTypeFormType,
} from "./types";

// utils
import { icons } from "../../../../Transactions/components/utils";
import { getOppositeTransactionType } from "./utils";

import "../styles.css";

export const ConfigFormDialog = (
  props: ConfigFormDialogPropsType<TypeResumeTypeFormType>,
) => {
  const { control, isLoading, setValue } = props;
  const { t } = useTranslation();

  const parsedTypes = useMemo(
    () =>
      enumToKeyValueArray(TransactionType)?.map((item) => ({
        id: item.value,
        value: t(`_entities:transactionCategory:type.values.${item.key}`),
      })) as Option[],
    [t],
  );

  const parsedTimes = useMemo(
    () =>
      enumToKeyValueArray(TransactionTypeResumeTime)?.map((item) => ({
        id: item.value,
        value: t(`_entities:transaction.typeResume.time.values.${item.key}`),
      })) as Option[],
    [t],
  );

  const type = useWatch({ control, name: "type" });
  const time = useWatch({ control, name: "time" });
  const showOppositeType = useWatch({
    control,
    name: "showOppositeType",
  }) as boolean | undefined;
  const excludedCategoryIds = useWatch({
    control,
    name: "excludedCategoryIds",
  }) as number[] | undefined;
  const excludedCategories = useWatch({
    control,
    name: "excludedCategories",
  }) as CommonTransactionCategoryDto[] | undefined;
  const oppositeExcludedCategoryIds = useWatch({
    control,
    name: "oppositeExcludedCategoryIds",
  }) as number[] | undefined;
  const oppositeExcludedCategories = useWatch({
    control,
    name: "oppositeExcludedCategories",
  }) as CommonTransactionCategoryDto[] | undefined;

  const haveSameIds = (
    left: Array<number | string>,
    right: Array<number | string>,
  ) =>
    left.length === right.length &&
    left.every((value, index) => Number(value) === Number(right[index]));

  useEffect(() => {
    if (setValue && type === undefined) {
      setValue("type", TransactionType.In);
    }
  }, [setValue, type]);

  useEffect(() => {
    if (setValue && time === undefined) {
      setValue("time", TransactionTypeResumeTime.CurrentMonth);
    }
  }, [setValue, time]);

  const { data: accounts } = useAccountsCommon();
  const transactionCategories = useTransactionCategoriesCommon();
  const oppositeType = useMemo(
    () =>
      type === undefined
        ? undefined
        : getOppositeTransactionType(Number(type) as TransactionType),
    [type],
  );

  const parsedCategories = useMemo(
    () =>
      (transactionCategories.data ?? [])
        .filter((category) => Number(category.type) === Number(type ?? 0))
        .map((category) => ({
          ...category,
          name: category.auto
            ? t("_entities:transactionCategory.name.init")
            : category.name,
        })),
    [t, transactionCategories.data, type],
  );

  const parsedOppositeCategories = useMemo(
    () =>
      (transactionCategories.data ?? [])
        .filter(
          (category) =>
            oppositeType !== undefined &&
            Number(category.type) === Number(oppositeType),
        )
        .map((category) => ({
          ...category,
          name: category.auto
            ? t("_entities:transactionCategory.name.init")
            : category.name,
        })),
    [oppositeType, t, transactionCategories.data],
  );

  useEffect(() => {
    if (setValue && excludedCategoryIds === undefined) {
      setValue("excludedCategoryIds", []);
    }
  }, [excludedCategoryIds, setValue]);

  useEffect(() => {
    if (setValue && oppositeExcludedCategoryIds === undefined) {
      setValue("oppositeExcludedCategoryIds", []);
    }
  }, [oppositeExcludedCategoryIds, setValue]);

  useEffect(() => {
    if (
      !setValue ||
      transactionCategories.data === undefined ||
      type === undefined
    ) {
      return;
    }

    const availableIds = new Set(
      parsedCategories.map((category) => category.id),
    );
    const nextExcludedCategoryIds = (excludedCategoryIds ?? []).filter((id) =>
      availableIds.has(id),
    );

    if (!haveSameIds(nextExcludedCategoryIds, excludedCategoryIds ?? [])) {
      setValue("excludedCategoryIds", nextExcludedCategoryIds);
    }

    const nextExcludedCategories = parsedCategories.filter((category) =>
      nextExcludedCategoryIds.includes(category.id),
    );

    if (
      !haveSameIds(
        nextExcludedCategories.map((category) => category.id),
        (excludedCategories ?? []).map((category) => category.id),
      )
    ) {
      setValue("excludedCategories", nextExcludedCategories);
    }
  }, [
    excludedCategories,
    excludedCategoryIds,
    parsedCategories,
    setValue,
    transactionCategories.data,
    type,
  ]);

  useEffect(() => {
    if (
      !setValue ||
      transactionCategories.data === undefined ||
      oppositeType === undefined
    ) {
      return;
    }

    if (!showOppositeType) {
      if ((oppositeExcludedCategoryIds ?? []).length > 0) {
        setValue("oppositeExcludedCategoryIds", []);
      }
      if ((oppositeExcludedCategories ?? []).length > 0) {
        setValue("oppositeExcludedCategories", []);
      }
      return;
    }

    const availableIds = new Set(
      parsedOppositeCategories.map((category) => category.id),
    );
    const nextExcludedCategoryIds = (oppositeExcludedCategoryIds ?? []).filter(
      (id) => availableIds.has(id),
    );

    if (
      !haveSameIds(nextExcludedCategoryIds, oppositeExcludedCategoryIds ?? [])
    ) {
      setValue("oppositeExcludedCategoryIds", nextExcludedCategoryIds);
    }

    const nextExcludedCategories = parsedOppositeCategories.filter((category) =>
      nextExcludedCategoryIds.includes(category.id),
    );

    if (
      !haveSameIds(
        nextExcludedCategories.map((category) => category.id),
        (oppositeExcludedCategories ?? []).map((category) => category.id),
      )
    ) {
      setValue("oppositeExcludedCategories", nextExcludedCategories);
    }
  }, [
    oppositeExcludedCategories,
    oppositeExcludedCategoryIds,
    oppositeType,
    parsedOppositeCategories,
    setValue,
    showOppositeType,
    transactionCategories.data,
  ]);

  return (
    <FormDialog
      title={t("_pages:home.dashboard.transactionTypeResume.configTitle")}
      {...props}
    >
      <Controller
        control={control}
        name="account"
        render={({ field: { value, onChange, ...rest } }) => (
          <AutocompleteInput
            value={value ?? null}
            multiple={false}
            label={t("_entities:transaction.account.label")}
            autoComplete={`${Tables.Transactions}-${t("_entities:transaction.account.label")}`}
            onChange={(nextValue) => onChange(nextValue)}
            options={[
              {
                id: "",
                value: t("_entities:transaction.account.placeholder"),
              },
              ...(accounts ?? []),
            ]}
            containerClassName="dashboard-card-autocomplete-full"
            {...rest}
          />
        )}
      />
      <Controller
        control={control}
        name="excludedCategories"
        render={({ field: { value, onChange, ...rest } }) => (
          <AutocompleteInput
            value={value ?? []}
            multiple
            label={t(
              "_entities:transaction.typeResume.excludedCategories.label",
            )}
            placeholder={t(
              "_entities:transaction.typeResume.excludedCategories.placeholder",
            )}
            autoComplete={`${Tables.Transactions}-${t(
              "_entities:transaction.typeResume.excludedCategories.label",
            )}`}
            onChange={(nextValue) => {
              const nextCategories =
                (nextValue as CommonTransactionCategoryDto[] | null) ?? [];
              onChange(nextCategories);
              setValue?.(
                "excludedCategoryIds",
                nextCategories.map((category) => category.id),
              );
            }}
            options={parsedCategories}
            containerClassName="dashboard-card-autocomplete-full"
            {...rest}
          />
        )}
      />
      {showOppositeType ? (
        <Controller
          control={control}
          name="oppositeExcludedCategories"
          render={({ field: { value, onChange, ...rest } }) => (
            <AutocompleteInput
              value={value ?? []}
              multiple
              label={t(
                "_entities:transaction.typeResume.oppositeExcludedCategories.label",
              )}
              placeholder={t(
                "_entities:transaction.typeResume.oppositeExcludedCategories.placeholder",
              )}
              autoComplete={`${Tables.Transactions}-${t(
                "_entities:transaction.typeResume.oppositeExcludedCategories.label",
              )}`}
              onChange={(nextValue) => {
                const nextCategories =
                  (nextValue as CommonTransactionCategoryDto[] | null) ?? [];
                onChange(nextCategories);
                setValue?.(
                  "oppositeExcludedCategoryIds",
                  nextCategories.map((category) => category.id),
                );
              }}
              options={parsedOppositeCategories}
              containerClassName="dashboard-card-autocomplete-full"
              {...rest}
            />
          )}
        />
      ) : null}
      <div className="dashboard-card-select-container">
        <Controller
          control={control}
          name="type"
          disabled={isLoading}
          render={({ field: { value, onChange, ...rest } }) => (
            <SelectInput
              options={parsedTypes}
              value={value}
              onChange={(e) => onChange((e.target as HTMLSelectElement).value)}
              label={t("_entities:transactionCategory.type.label")}
              inputClassName="dashboard-card-select-input dashboard-card-icon-select-input"
              {...rest}
            >
              <FontAwesomeIcon
                icon={icons[(type ?? 0) as keyof typeof icons]}
                className={classNames(
                  "dashboard-card-select-icon vertical-center",
                  Number(type) === TransactionType.In
                    ? "dashboard-card-select-icon--income inverted-success"
                    : "dashboard-card-select-icon--expense inverted-error",
                )}
              />
            </SelectInput>
          )}
        />
        <Controller
          control={control}
          name="time"
          disabled={isLoading}
          render={({ field: { value, onChange, ...rest } }) => (
            <SelectInput
              options={parsedTimes}
              value={value}
              onChange={(e) => onChange((e.target as HTMLSelectElement).value)}
              label={t("_entities:transaction.typeResume.time.label")}
              inputClassName="dashboard-card-select-input"
              {...rest}
            />
          )}
        />
      </div>
      <div className="dashboard-card-toggle-container">
        <Controller
          control={control}
          name="showFiltersAsBadge"
          render={({ field: { value, onChange, ...rest } }) => (
            <CheckInput
              {...rest}
              id="type-resume-show-filters-as-badge"
              checked={!!value}
              label={t("_pages:home.dashboard.filterDisplay.badgeToggle")}
              inputClassName="dashboard-card-toggle-input"
              containerClassName="dashboard-card-toggle"
              onChange={(event) => onChange(event.currentTarget.checked)}
            />
          )}
        />
        <Controller
          control={control}
          name="showOppositeType"
          render={({ field: { value, onChange, ...rest } }) => (
            <CheckInput
              {...rest}
              id="type-resume-show-opposite-type"
              checked={!!value}
              label={t(
                "_pages:home.dashboard.transactionTypeResume.showOppositeTypeToggle",
              )}
              inputClassName="dashboard-card-toggle-input"
              containerClassName="dashboard-card-toggle"
              onChange={(event) => onChange(event.currentTarget.checked)}
            />
          )}
        />
      </div>
    </FormDialog>
  );
};
