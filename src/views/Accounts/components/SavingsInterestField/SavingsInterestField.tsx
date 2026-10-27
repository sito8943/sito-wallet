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
import { SavingsInterestDialog } from "../SavingsInterestDialog";

// constants
import { INTEREST_FIELD_NAMES } from "./constants";

// types
import type { SavingsInterestFieldPropsType } from "./types";

import "./styles.css";

/**
 * Interest summary inside the account form. The settings are edited in their
 * own dialog so they don't stretch the form on small screens.
 */
export function SavingsInterestField(props: SavingsInterestFieldPropsType) {
  const { control, isLoading } = props;
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const [rateValue, aerValue] = useWatch({
    control,
    name: ["interestRate", "aer"],
  });
  const rate = parseNullableNumber(rateValue);
  const aer = parseNullableNumber(aerValue);
  const formatRate = (value: number) =>
    value.toLocaleString(i18n.language, { maximumFractionDigits: 4 });

  const { errors } = useFormState({ control, name: INTEREST_FIELD_NAMES });
  const hasError = INTEREST_FIELD_NAMES.some((name) => !!errors[name]);

  return (
    <div className="savings-interest-field">
      <div className="savings-interest-field-info">
        <span className="savings-interest-field-title">
          {t("_entities:account.interest.title")}
        </span>
        <span className="savings-interest-field-summary">
          {rate === null
            ? t("_entities:account.interest.notConfigured")
            : t(
                aer === null
                  ? "_entities:account.interest.summaryRate"
                  : "_entities:account.interest.summary",
                {
                  rate: formatRate(rate),
                  aer: aer === null ? "" : formatRate(aer),
                },
              )}
        </span>
        {hasError && (
          <span className="savings-interest-field-error">
            {t("_entities:account.interest.invalid")}
          </span>
        )}
      </div>
      <Button
        type="button"
        variant="outlined"
        disabled={isLoading}
        onClick={() => setOpen(true)}
      >
        <FontAwesomeIcon icon={rate === null ? faPlus : faPencil} />{" "}
        {t(
          rate === null
            ? "_entities:account.interest.configure"
            : "_entities:account.interest.edit",
        )}
      </Button>
      <SavingsInterestDialog
        {...props}
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
