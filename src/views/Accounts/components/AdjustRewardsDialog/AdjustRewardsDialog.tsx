import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useWatch } from "react-hook-form";

// @sito/dashboard-app
import { Button, FormDialog, TextInput } from "@sito/dashboard-app";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift } from "@fortawesome/free-solid-svg-icons";

// lib
import { AdjustRewardsMode, formatRewardsPoints } from "lib";

// types
import type {
  AdjustRewardsDialogPropsType,
  AdjustRewardsFormType,
} from "../../types";

// constants
import { ADJUST_REWARDS_MODES } from "./constants";

// utils
import {
  getAdjustRewardsAmountErrorKey,
  getAdjustedRewardsBalance,
} from "./utils";

import "./styles.css";

/** Redeem/add points (delta) or set the balance to the bank's value. */
export function AdjustRewardsDialog(props: AdjustRewardsDialogPropsType) {
  const { selectedAccount, control, setValue, open, isLoading } = props;
  const { t, i18n } = useTranslation();

  const rewards = selectedAccount?.rewards;
  const pointsName =
    rewards?.name ?? t("_entities:account.rewards.defaultName");

  const [watchedMode, amount] = useWatch({
    control,
    name: ["mode", "amount"],
  });
  const mode = watchedMode ?? AdjustRewardsMode.Delta;
  const resultBalance = rewards
    ? getAdjustedRewardsBalance(rewards.balance, mode, amount)
    : null;

  useEffect(() => {
    if (open && setValue) {
      setValue("mode", AdjustRewardsMode.Delta);
      setValue("amount", "");
    }
  }, [open, setValue]);

  return (
    <FormDialog<AdjustRewardsFormType> {...props}>
      {rewards && (
        <div className="adjust-rewards-current">
          <FontAwesomeIcon icon={faGift} />
          <span>
            {t("_pages:accounts.actions.adjustRewards.dialog.current", {
              name: pointsName,
            })}
            :{" "}
            <strong>
              {formatRewardsPoints(rewards.balance, i18n.language)}
            </strong>
          </span>
        </div>
      )}
      <Controller
        control={control}
        name="mode"
        rules={{ deps: ["amount"] }}
        render={({ field: { value, onChange } }) => (
          <div
            className="adjust-rewards-modes"
            role="group"
            aria-label={t("_pages:accounts.actions.adjustRewards.dialog.mode")}
          >
            {ADJUST_REWARDS_MODES.map((option) => (
              <Button
                key={option}
                type="button"
                color="primary"
                variant={value === option ? "submit" : "outlined"}
                aria-pressed={value === option}
                disabled={isLoading}
                onClick={() => onChange(option)}
              >
                {t(`_pages:accounts.actions.adjustRewards.modes.${option}`)}
              </Button>
            ))}
          </div>
        )}
      />
      <Controller
        control={control}
        name="amount"
        rules={{
          validate: (value, form) => {
            const errorKey = getAdjustRewardsAmountErrorKey(
              form.mode,
              value,
              rewards?.balance,
            );
            return errorKey === null || t(errorKey);
          },
        }}
        disabled={isLoading}
        render={({ field: { value, ...rest } }) => (
          <TextInput
            id="rewardsAmount"
            required
            type="number"
            step="any"
            value={value ?? ""}
            label={t(
              `_pages:accounts.actions.adjustRewards.dialog.${mode}.label`,
            )}
            placeholder={t(
              `_pages:accounts.actions.adjustRewards.dialog.${mode}.placeholder`,
            )}
            helperText={t(
              `_pages:accounts.actions.adjustRewards.dialog.${mode}.helper`,
            )}
            {...rest}
          />
        )}
      />
      {resultBalance !== null && (
        <p className="adjust-rewards-result">
          {t("_pages:accounts.actions.adjustRewards.dialog.result", {
            balance: formatRewardsPoints(resultBalance, i18n.language),
          })}
        </p>
      )}
    </FormDialog>
  );
}
