import { classNames } from "@sito/dashboard-app";
import { useTranslation } from "react-i18next";

import { Currency } from "../../../../Currencies";

import { getPredictionAmountClassName } from "./utils";

import type { TypeResumePredictionRowPropsType } from "./types";

export const TypeResumePredictionRow = (
  props: TypeResumePredictionRowPropsType,
) => {
  const { label, values, currencyName, currencySymbol, total = false } = props;
  const { t } = useTranslation();

  return (
    <div className="type-resume-prediction-row">
      <div
        aria-hidden="true"
        className={classNames(
          "type-resume-prediction-divider",
          total && "type-resume-prediction-divider--total",
        )}
      />
      <span className="type-resume-prediction-label">{label}</span>
      <span className={getPredictionAmountClassName(values.previous, total)}>
        {values.previous}{" "}
        <Currency name={currencyName} symbol={currencySymbol} />
      </span>
      <span className={getPredictionAmountClassName(values.current, total)}>
        {values.current}{" "}
        <Currency name={currencyName} symbol={currencySymbol} />
      </span>
      <span
        className={classNames(
          getPredictionAmountClassName(values.predicted, total),
          "type-resume-prediction-amount--estimate",
        )}
        title={t(
          "_pages:home.dashboard.transactionTypeResume.prediction.estimate",
        )}
      >
        ≈ {values.predicted}{" "}
        <Currency name={currencyName} symbol={currencySymbol} />
      </span>
    </div>
  );
};
