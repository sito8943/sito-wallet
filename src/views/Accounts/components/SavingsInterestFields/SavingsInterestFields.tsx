import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";

// @sito/dashboard-app
import {
  Button,
  SelectInput,
  TextInput,
  classNames,
} from "@sito/dashboard-app";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";

// components
import { Accordion } from "components";

// lib
import { Tables } from "lib";

// types
import type {
  InterestSelectOption,
  SavingsInterestFieldsPropsType,
} from "./types";
import { InterestPresetId } from "./types";

// constants
import { INTEREST_SELECT_FIELDS } from "./constants";

// utils
import { getInterestPresetEntries, numericEnumEntries } from "./utils";

import "./styles.css";

export function SavingsInterestFields(props: SavingsInterestFieldsPropsType) {
  const { control, setValue, isLoading } = props;
  const { t } = useTranslation();
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const selectOptions = useMemo(
    () =>
      Object.fromEntries(
        INTEREST_SELECT_FIELDS.map(({ name, i18nKey, enumObject }) => [
          name,
          [
            {
              id: "",
              name: t("_entities:account.interest.defaultOption"),
            },
            ...numericEnumEntries(enumObject).map(({ key, value }) => ({
              id: value,
              name: t(`_entities:account.interest.${i18nKey}.values.${key}`),
            })),
          ] satisfies InterestSelectOption[],
        ]),
      ),
    [t],
  );

  const applyPreset = useCallback(
    (presetId: InterestPresetId) => {
      if (!setValue) return;
      getInterestPresetEntries(presetId).forEach(([name, value]) =>
        setValue(name, value, { shouldDirty: true }),
      );
      setAdvancedOpen(true);
    },
    [setValue],
  );

  return (
    <fieldset className="savings-interest">
      <legend className="savings-interest-title">
        {t("_entities:account.interest.title")}
      </legend>
      <div className="account-form-row">
        <Controller
          control={control}
          name="interestRate"
          disabled={isLoading}
          rules={{
            min: {
              value: 0,
              message: t("_entities:account.interest.rate.min"),
            },
          }}
          render={({ field: { value, ...rest } }) => (
            <TextInput
              id="interestRate"
              type="number"
              step="0.0001"
              min={0}
              value={value ?? ""}
              autoComplete={`${Tables.Accounts}-interest-rate`}
              label={t("_entities:account.interest.rate.label")}
              placeholder={t("_entities:account.interest.rate.placeholder")}
              {...rest}
            />
          )}
        />
        <Controller
          control={control}
          name="aer"
          disabled={isLoading}
          render={({ field: { value, ...rest } }) => (
            <TextInput
              id="aer"
              type="number"
              step="0.0001"
              min={0}
              value={value ?? ""}
              autoComplete={`${Tables.Accounts}-aer`}
              label={t("_entities:account.interest.aer.label")}
              placeholder={t("_entities:account.interest.aer.placeholder")}
              {...rest}
            />
          )}
        />
      </div>
      <p className="savings-interest-hint">
        {t("_entities:account.interest.hint")}
      </p>
      <div className="savings-interest-actions">
        <button
          type="button"
          className="savings-interest-advanced-toggle"
          aria-expanded={advancedOpen}
          onClick={() => setAdvancedOpen((open) => !open)}
        >
          {t(
            advancedOpen
              ? "_entities:account.interest.advanced.hide"
              : "_entities:account.interest.advanced.show",
          )}
          <FontAwesomeIcon
            icon={faChevronDown}
            className={classNames(
              "savings-interest-advanced-chevron",
              advancedOpen && "open",
            )}
          />
        </button>
        <Button
          type="button"
          variant="outlined"
          disabled={isLoading}
          onClick={() => applyPreset(InterestPresetId.RevolutUkInstantAccess)}
          aria-label={t("_entities:account.interest.preset.apply")}
        >
          <FontAwesomeIcon icon={faWandMagicSparkles} />
          {t(
            `_entities:account.interest.preset.values.${InterestPresetId.RevolutUkInstantAccess}`,
          )}
        </Button>
      </div>
      <Accordion
        open={advancedOpen}
        contentClassName="savings-interest-advanced"
      >
        {INTEREST_SELECT_FIELDS.map(({ name, i18nKey }) => (
          <Controller
            key={name}
            control={control}
            name={name}
            disabled={isLoading}
            render={({ field: { value, onChange, ...rest } }) => (
              <SelectInput
                id={name}
                options={selectOptions[name]}
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                label={t(`_entities:account.interest.${i18nKey}.label`)}
                {...rest}
              />
            )}
          />
        ))}
        <div className="account-form-row">
          <Controller
            control={control}
            name="interestPayoutDelayDays"
            disabled={isLoading}
            rules={{
              min: {
                value: 0,
                message: t("_entities:account.interest.payoutDelayDays.min"),
              },
            }}
            render={({ field: { value, ...rest } }) => (
              <TextInput
                id="interestPayoutDelayDays"
                type="number"
                step="1"
                min={0}
                value={value ?? ""}
                label={t("_entities:account.interest.payoutDelayDays.label")}
                placeholder="0"
                {...rest}
              />
            )}
          />
          <Controller
            control={control}
            name="interestRoundingScale"
            disabled={isLoading}
            rules={{
              min: {
                value: 0,
                message: t("_entities:account.interest.roundingScale.min"),
              },
            }}
            render={({ field: { value, ...rest } }) => (
              <TextInput
                id="interestRoundingScale"
                type="number"
                step="1"
                min={0}
                value={value ?? ""}
                label={t("_entities:account.interest.roundingScale.label")}
                placeholder="2"
                {...rest}
              />
            )}
          />
        </div>
      </Accordion>
    </fieldset>
  );
}
