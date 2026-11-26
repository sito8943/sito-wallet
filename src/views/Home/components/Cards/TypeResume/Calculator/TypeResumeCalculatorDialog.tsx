import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft, faWarning } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import {
  Button,
  classNames,
  Dialog,
  SelectInput,
  TextInput,
} from "@sito/dashboard-app";

// components
import { Money } from "components";
import { CalculatorLinesSection } from "./CalculatorLinesSection";

// hooks
import { useTypeResumeCalculator } from "./useTypeResumeCalculator";

// utils
import {
  getCalculatorMonthLabel,
  getCalculatorMonthOptions,
  getFirstNegativeMonth,
  projectCalculator,
} from "./utils";

// constants
import { CALCULATOR_MONTH_OPTIONS } from "./constants";

// types
import type { TypeResumeCalculatorDialogPropsType } from "./types";

import "./styles.css";

const KEY = "_pages:home.dashboard.transactionTypeResume.calculator";

export const TypeResumeCalculatorDialog = (
  props: TypeResumeCalculatorDialogPropsType,
) => {
  const {
    open,
    closeDialog,
    cardId,
    prefill,
    hasAccount,
    currencyName,
    currencySymbol,
  } = props;
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const calculator = useTypeResumeCalculator({ cardId, prefill });
  const { value } = calculator;
  const currency = { name: currencyName, symbol: currencySymbol };

  const results = useMemo(() => projectCalculator(value, new Date()), [value]);
  const negative = getFirstNegativeMonth(results);
  const last = results[results.length - 1];

  const nowLabel = t(`${KEY}.now`);
  const monthLabel = (index: number, date: Date) =>
    getCalculatorMonthLabel(index, date, locale, nowLabel);
  const monthOptions = getCalculatorMonthOptions(results, locale, nowLabel);

  const monthsOptions = useMemo(
    () =>
      CALCULATOR_MONTH_OPTIONS.map((months) => ({
        id: months,
        value: t(`${KEY}.monthsValue`, { count: months }),
      })),
    [t],
  );

  return (
    <Dialog
      open={open}
      handleClose={closeDialog}
      title={t(`${KEY}.title`)}
      className="type-resume-calculator-dialog"
    >
      <div className="type-resume-calculator">
        <div className="type-resume-calculator-settings">
          <TextInput
            name="calculator-start-balance"
            type="number"
            step="any"
            inputMode="decimal"
            value={calculator.startBalanceInput ?? value.startBalance}
            label={t(`${KEY}.startBalance`)}
            helperText={t(
              hasAccount
                ? `${KEY}.startBalanceHelper`
                : `${KEY}.noAccountHelper`,
            )}
            onChange={(event) =>
              calculator.setStartBalance(event.currentTarget.value)
            }
          />
          <SelectInput
            name="calculator-months"
            options={monthsOptions}
            value={value.months}
            label={t(`${KEY}.months`)}
            onChange={(event) => calculator.setMonths(event.target.value)}
          />
        </div>

        <CalculatorLinesSection
          kind="monthly"
          lines={value.monthly}
          monthOptions={monthOptions}
          onAdd={() => calculator.addLine("monthly")}
          onChange={(id, patch) => calculator.updateLine("monthly", id, patch)}
          onRemove={(id) => calculator.removeLine("monthly", id)}
        />
        <CalculatorLinesSection
          kind="oneOff"
          lines={value.oneOff}
          monthOptions={monthOptions}
          onAdd={() => calculator.addLine("oneOff")}
          onChange={(id, patch) => calculator.updateLine("oneOff", id, patch)}
          onRemove={(id) => calculator.removeLine("oneOff", id)}
        />

        <div className="type-resume-calculator-summary">
          <p>
            {t(`${KEY}.final`, { month: monthLabel(last.index, last.date) })}{" "}
            <strong
              className={classNames(
                "poppins",
                last.balance < 0 && "text-text-error",
              )}
            >
              <Money amount={last.balance} currency={currency} />
            </strong>
          </p>
          {negative && (
            <p className="type-resume-calculator-warning">
              <FontAwesomeIcon icon={faWarning} />
              {t(`${KEY}.negative`, {
                month: monthLabel(negative.index, negative.date),
              })}
            </p>
          )}
        </div>

        <div className="type-resume-calculator-table" role="table">
          <div className="type-resume-calculator-row" role="row">
            {(["month", "income", "expense", "balance"] as const).map(
              (column) => (
                <span
                  key={column}
                  role="columnheader"
                  className="type-resume-compare-header"
                >
                  {t(`${KEY}.columns.${column}`)}
                </span>
              ),
            )}
          </div>
          {results.map((result) => (
            <div
              key={result.index}
              className="type-resume-calculator-row"
              role="row"
            >
              <span role="cell" className="type-resume-calculator-month">
                {monthLabel(result.index, result.date)}
              </span>
              <span role="cell" className="text-text-success">
                <Money amount={result.income} currency={currency} />
              </span>
              <span role="cell" className="text-text-error">
                <Money amount={result.expense} currency={currency} />
              </span>
              <span
                role="cell"
                className={classNames(
                  "poppins font-semibold",
                  result.balance < 0 && "text-text-error",
                )}
              >
                <Money amount={result.balance} currency={currency} />
              </span>
            </div>
          ))}
        </div>

        <div className="type-resume-calculator-footer">
          <p className="type-resume-prediction-hint">{t(`${KEY}.hint`)}</p>
          {calculator.hasDraft && (
            <Button type="button" variant="text" onClick={calculator.reset}>
              <FontAwesomeIcon icon={faRotateLeft} />
              {t(`${KEY}.reset`)}
            </Button>
          )}
        </div>
      </div>
    </Dialog>
  );
};
