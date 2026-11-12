import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormState, useWatch } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import { Button } from "@sito/dashboard-app";

// lib
import { parseNullableNumber } from "lib";

// components
import { CardRewardsDialog } from "../CardRewardsDialog";

// constants
import { REWARDS_FIELD_NAMES } from "../CardRewardsFields/constants";

// types
import type { CardRewardsFieldPropsType } from "./types";

import "./styles.css";

/**
 * Rewards summary inside the account form (Card accounts). The settings are
 * edited in their own dialog so they don't stretch the form on small screens.
 */
export function CardRewardsField(props: CardRewardsFieldPropsType) {
  const { control, isLoading } = props;
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const [nameValue, unitValue, pointsValue] = useWatch({
    control,
    name: ["rewardsName", "rewardsSpendUnit", "rewardsPointsPerUnit"],
  });
  const unit = parseNullableNumber(unitValue);
  const points = parseNullableNumber(pointsValue);
  const name = typeof nameValue === "string" ? nameValue.trim() : "";
  const configured = unit !== null && points !== null;
  const formatNumber = (value: number) =>
    value.toLocaleString(i18n.language, { maximumFractionDigits: 4 });

  const { errors } = useFormState({ control, name: REWARDS_FIELD_NAMES });
  const hasError = REWARDS_FIELD_NAMES.some((field) => !!errors[field]);

  return (
    <div className="card-rewards-field">
      <div className="card-rewards-field-info">
        <span className="card-rewards-field-title">
          {t("_entities:account.rewards.title")}
        </span>
        <span className="card-rewards-field-summary">
          {configured
            ? t(
                name
                  ? "_entities:account.rewards.summaryNamed"
                  : "_entities:account.rewards.summary",
                {
                  name,
                  points: formatNumber(points),
                  unit: formatNumber(unit),
                },
              )
            : t("_entities:account.rewards.notConfigured")}
        </span>
        {hasError && (
          <span className="card-rewards-field-error">
            {t("_entities:account.rewards.invalid")}
          </span>
        )}
      </div>
      <Button
        type="button"
        variant="outlined"
        disabled={isLoading}
        onClick={() => setOpen(true)}
      >
        <FontAwesomeIcon icon={configured ? faPencil : faPlus} />{" "}
        {t(
          configured
            ? "_entities:account.rewards.edit"
            : "_entities:account.rewards.configure",
        )}
      </Button>
      <CardRewardsDialog
        {...props}
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
