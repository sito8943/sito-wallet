import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import { IconButton, SelectInput, TextInput } from "@sito/dashboard-app";

// lib
import { TransactionType } from "lib";

// types
import type { CalculatorLineRowPropsType } from "./types";

export const CalculatorLineRow = (props: CalculatorLineRowPropsType) => {
  const { kind, line, monthOptions, onChange, onRemove } = props;
  const { t } = useTranslation();

  const typeOptions = useMemo(
    () => [
      {
        id: TransactionType.In,
        value: t("_entities:transactionCategory:type.values.In"),
      },
      {
        id: TransactionType.Out,
        value: t("_entities:transactionCategory:type.values.Out"),
      },
    ],
    [t],
  );

  return (
    <div className="type-resume-calculator-line">
      <TextInput
        name={`calculator-${line.id}-name`}
        autoComplete="off"
        value={line.name}
        label={t(
          "_pages:home.dashboard.transactionTypeResume.calculator.line.name",
        )}
        placeholder={t(
          `_pages:home.dashboard.transactionTypeResume.calculator.${kind}.placeholder`,
        )}
        containerClassName="type-resume-calculator-line-name"
        onChange={(event) => onChange({ name: event.currentTarget.value })}
      />
      <TextInput
        name={`calculator-${line.id}-amount`}
        type="number"
        step="any"
        min={0}
        inputMode="decimal"
        value={line.amount}
        label={t(
          "_pages:home.dashboard.transactionTypeResume.calculator.line.amount",
        )}
        onChange={(event) => onChange({ amount: event.currentTarget.value })}
      />
      <SelectInput
        name={`calculator-${line.id}-type`}
        options={typeOptions}
        value={line.type}
        label={t("_entities:transactionCategory.type.label")}
        onChange={(event) => onChange({ type: Number(event.target.value) })}
      />
      {kind === "oneOff" && (
        <SelectInput
          name={`calculator-${line.id}-month`}
          options={monthOptions}
          value={line.month}
          label={t(
            "_pages:home.dashboard.transactionTypeResume.calculator.line.month",
          )}
          onChange={(event) => onChange({ month: Number(event.target.value) })}
        />
      )}
      <IconButton
        icon={faTrash}
        color="error"
        className="type-resume-calculator-line-remove"
        onClick={onRemove}
        data-tooltip-id="tooltip"
        data-tooltip-content={t(
          "_pages:home.dashboard.transactionTypeResume.calculator.line.remove",
        )}
        aria-label={t(
          "_pages:home.dashboard.transactionTypeResume.calculator.line.remove",
        )}
      />
    </div>
  );
};
