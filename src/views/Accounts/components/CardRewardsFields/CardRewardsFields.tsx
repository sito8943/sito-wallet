import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useWatch } from "react-hook-form";

// @sito/dashboard-app
import {
  AutocompleteInput,
  Button,
  SelectInput,
  TextInput,
} from "@sito/dashboard-app";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";

// lib
import type {
  AccountRewardsPlanPreset,
  CommonTransactionCategoryDto,
} from "lib";
import {
  REWARDS_NAME_MAX_LENGTH,
  RewardsRounding,
  Tables,
  findMatchingRewardsPreset,
  getRewardsPresetEntries,
  getRewardsPresets,
} from "lib";

// hooks
import { useTransactionCategoriesCommon } from "hooks/queries/useTransactionCategoriesCommon";

// types
import type {
  CardRewardsFieldsPropsType,
  RewardsRoundingOption,
} from "./types";

// utils
import { numericEnumEntries } from "../SavingsInterestFields/utils";
import {
  getExcludableRewardsCategories,
  getRewardsPairErrorKey,
  selectCategoriesByIds,
} from "./utils";

import "./styles.css";

export function CardRewardsFields(props: CardRewardsFieldsPropsType) {
  const { control, setValue, isLoading } = props;
  const { t } = useTranslation();

  const [bankName, spendUnit, pointsPerUnit] = useWatch({
    control,
    name: ["bankName", "rewardsSpendUnit", "rewardsPointsPerUnit"],
  });

  const presets = useMemo(() => getRewardsPresets(bankName), [bankName]);
  const selectedPreset = findMatchingRewardsPreset(presets, {
    rewardsSpendUnit: spendUnit,
    rewardsPointsPerUnit: pointsPerUnit,
  });

  const roundingOptions = useMemo<RewardsRoundingOption[]>(
    () => [
      { id: "", name: t("_entities:account.rewards.rounding.default") },
      ...numericEnumEntries(RewardsRounding).map(({ key, value }) => ({
        id: value,
        name: t(`_entities:account.rewards.rounding.values.${key}`),
      })),
    ],
    [t],
  );

  const transactionCategories = useTransactionCategoriesCommon();
  const excludableCategories = useMemo(
    () => getExcludableRewardsCategories(transactionCategories.data ?? []),
    [transactionCategories.data],
  );

  const applyPreset = useCallback(
    (preset: AccountRewardsPlanPreset) => {
      if (!setValue) return;
      getRewardsPresetEntries(preset).forEach(([name, value]) =>
        setValue(name, value, { shouldDirty: true, shouldValidate: true }),
      );
    },
    [setValue],
  );

  const validatePair = (unit: unknown, points: unknown) => {
    const errorKey = getRewardsPairErrorKey(unit, points);
    return errorKey === null || t(errorKey);
  };

  return (
    <div className="card-rewards">
      {presets.length > 0 && (
        <div className="card-rewards-plans">
          <span className="card-rewards-plans-label">
            {t("_entities:account.rewards.plans.label", { bank: bankName })}
          </span>
          <div className="card-rewards-plans-list">
            {presets.map((preset) => (
              <Button
                key={preset.id}
                type="button"
                variant={
                  selectedPreset?.id === preset.id ? "submit" : "outlined"
                }
                color="primary"
                disabled={isLoading}
                aria-pressed={selectedPreset?.id === preset.id}
                aria-label={t("_entities:account.rewards.plans.apply", {
                  plan: preset.label,
                })}
                onClick={() => applyPreset(preset)}
              >
                <FontAwesomeIcon icon={faWandMagicSparkles} />
                {preset.label}
              </Button>
            ))}
          </div>
        </div>
      )}
      <Controller
        control={control}
        name="rewardsName"
        disabled={isLoading}
        rules={{
          maxLength: {
            value: REWARDS_NAME_MAX_LENGTH,
            message: t("_entities:account.rewards.name.maxLength"),
          },
        }}
        render={({ field: { value, ...rest } }) => (
          <TextInput
            id="rewardsName"
            maxLength={REWARDS_NAME_MAX_LENGTH}
            value={value ?? ""}
            autoComplete={`${Tables.Accounts}-rewards-name`}
            label={t("_entities:account.rewards.name.label")}
            placeholder={t("_entities:account.rewards.name.placeholder")}
            {...rest}
          />
        )}
      />
      <div className="card-rewards-row">
        <Controller
          control={control}
          name="rewardsSpendUnit"
          disabled={isLoading}
          rules={{
            deps: ["rewardsPointsPerUnit"],
            validate: (value, form) =>
              validatePair(value, form.rewardsPointsPerUnit),
          }}
          render={({ field: { value, ...rest } }) => (
            <TextInput
              id="rewardsSpendUnit"
              type="number"
              step="any"
              min={0}
              value={value ?? ""}
              label={t("_entities:account.rewards.spendUnit.label")}
              placeholder={t("_entities:account.rewards.spendUnit.placeholder")}
              {...rest}
            />
          )}
        />
        <Controller
          control={control}
          name="rewardsPointsPerUnit"
          disabled={isLoading}
          rules={{
            deps: ["rewardsSpendUnit"],
            validate: (value, form) =>
              validatePair(form.rewardsSpendUnit, value),
          }}
          render={({ field: { value, ...rest } }) => (
            <TextInput
              id="rewardsPointsPerUnit"
              type="number"
              step="any"
              min={0}
              value={value ?? ""}
              label={t("_entities:account.rewards.pointsPerUnit.label")}
              placeholder={t(
                "_entities:account.rewards.pointsPerUnit.placeholder",
              )}
              {...rest}
            />
          )}
        />
      </div>
      <p className="card-rewards-hint">{t("_entities:account.rewards.hint")}</p>
      <Controller
        control={control}
        name="rewardsRounding"
        disabled={isLoading}
        render={({ field: { value, onChange, ...rest } }) => (
          <SelectInput
            id="rewardsRounding"
            options={roundingOptions}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            label={t("_entities:account.rewards.rounding.label")}
            {...rest}
          />
        )}
      />
      <div className="card-rewards-row">
        <Controller
          control={control}
          name="rewardsPointValue"
          disabled={isLoading}
          rules={{
            min: {
              value: 0,
              message: t("_entities:account.rewards.pointValue.min"),
            },
          }}
          render={({ field: { value, ...rest } }) => (
            <TextInput
              id="rewardsPointValue"
              type="number"
              step="any"
              min={0}
              value={value ?? ""}
              label={t("_entities:account.rewards.pointValue.label")}
              placeholder={t(
                "_entities:account.rewards.pointValue.placeholder",
              )}
              {...rest}
            />
          )}
        />
        <Controller
          control={control}
          name="rewardsStartDate"
          disabled={isLoading}
          render={({ field: { value, ...rest } }) => (
            <TextInput
              id="rewardsStartDate"
              type="date"
              value={value ?? ""}
              label={t("_entities:account.rewards.startDate.label")}
              helperText={t("_entities:account.rewards.startDate.helper")}
              {...rest}
            />
          )}
        />
      </div>
      <Controller
        control={control}
        name="rewardsExcludedCategoryIds"
        disabled={isLoading}
        render={({ field: { value, onChange, ...rest } }) => (
          <AutocompleteInput
            id="rewardsExcludedCategoryIds"
            multiple
            value={selectCategoriesByIds(excludableCategories, value)}
            onChange={(next) =>
              onChange(
                ((next as CommonTransactionCategoryDto[] | null) ?? []).map(
                  (category) => category.id,
                ),
              )
            }
            options={excludableCategories}
            label={t("_entities:account.rewards.excludedCategories.label")}
            placeholder={t(
              "_entities:account.rewards.excludedCategories.placeholder",
            )}
            {...rest}
          />
        )}
      />
      {/* Hint outside the input: AutocompleteInput centers its chips over the
          whole field (helper text included), so a helperText pushes them off. */}
      <p className="card-rewards-hint card-rewards-excluded-hint">
        {t("_entities:account.rewards.excludedCategories.hint")}
      </p>
    </div>
  );
}
