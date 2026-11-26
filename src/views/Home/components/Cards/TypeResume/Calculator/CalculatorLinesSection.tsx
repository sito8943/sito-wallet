import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import { Button } from "@sito/dashboard-app";

import { CalculatorLineRow } from "./CalculatorLineRow";

// types
import type { CalculatorLinesSectionPropsType } from "./types";

export const CalculatorLinesSection = (
  props: CalculatorLinesSectionPropsType,
) => {
  const { kind, lines, monthOptions, onAdd, onChange, onRemove } = props;
  const { t } = useTranslation();

  return (
    <section className="type-resume-calculator-section">
      <h3 className="type-resume-calculator-section-title">
        {t(
          `_pages:home.dashboard.transactionTypeResume.calculator.${kind}.title`,
        )}
      </h3>
      {lines.map((line) => (
        <CalculatorLineRow
          key={line.id}
          kind={kind}
          line={line}
          monthOptions={monthOptions}
          onChange={(patch) => onChange(line.id, patch)}
          onRemove={() => onRemove(line.id)}
        />
      ))}
      <Button
        type="button"
        variant="outlined"
        className="type-resume-calculator-add"
        onClick={onAdd}
      >
        <FontAwesomeIcon icon={faPlus} />
        {t(
          `_pages:home.dashboard.transactionTypeResume.calculator.${kind}.add`,
        )}
      </Button>
    </section>
  );
};
