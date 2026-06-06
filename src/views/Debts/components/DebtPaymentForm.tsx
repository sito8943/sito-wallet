import { useEffect, useMemo } from "react";
import { Controller, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import type { Option } from "@sito/dashboard-app";
import {
  AutocompleteInput,
  CheckInput,
  ParagraphInput,
  TextInput,
} from "@sito/dashboard-app";

import { useAccountsCommon } from "hooks/queries/useAccountsCommon";
import { useTransactionCategoriesCommon } from "hooks/queries/useTransactionCategoriesCommon";

import type { CommonTransactionCategoryDto } from "lib";
import { DebtDirection, Tables, TransactionType } from "lib";

import type { AddDebtPaymentDialogPropsType } from "../types";

import "./styles.css";

export function DebtPaymentForm(props: AddDebtPaymentDialogPropsType) {
  const { control, isLoading, open, setValue, selectedDebt } = props;
  const { t } = useTranslation();

  const accountsQuery = useAccountsCommon();
  const categoriesQuery = useTransactionCategoriesCommon();

  const autoCreateTransaction = useWatch({
    control,
    name: "autoCreateTransaction",
  });

  const accountOptions = useMemo(
    () => [...(accountsQuery.data ?? [])] as Option[],
    [accountsQuery.data],
  );

  // RECEIVABLE -> income (IN) categories, PAYABLE -> expense (OUT) categories.
  const expectedCategoryType =
    selectedDebt?.direction === DebtDirection.Receivable
      ? TransactionType.In
      : TransactionType.Out;

  const categoryOptions = useMemo(
    () =>
      (categoriesQuery.data ?? [])
        .filter((category) => category.type === expectedCategoryType)
        .map((category) => ({
          ...category,
          name: category.auto
            ? t("_entities:transactionCategory.name.init")
            : category.name,
        })) as CommonTransactionCategoryDto[],
    [categoriesQuery.data, expectedCategoryType, t],
  );

  useEffect(() => {
    if (!open || !selectedDebt || !setValue) return;

    setValue("debtId", selectedDebt.id);
    setValue("amount", String(selectedDebt.pendingAmount ?? ""));
    setValue("paidAt", new Date().toISOString().slice(0, 16));
    setValue("note", "");
    setValue("autoCreateTransaction", false);
    setValue("account", null);
    setValue("category", null);
  }, [open, selectedDebt, setValue]);

  const formDisabled = isLoading;

  return (
    <>
      <Controller
        control={control}
        render={({ field }) => <input {...field} type="hidden" />}
        name="debtId"
      />

      {selectedDebt ? (
        <p className="debt-payment-current">
          {t("_pages:debts.actions.payment.for")}:
          <strong className="debt-payment-current-name">
            {selectedDebt.title}
          </strong>
        </p>
      ) : null}

      <Controller
        control={control}
        rules={{
          required: t("_entities:debtPayment.amount.required"),
          validate: (value) =>
            Number(value) > 0 ||
            t("_entities:debtPayment.amount.greaterThanZero"),
        }}
        name="amount"
        disabled={formDisabled}
        render={({ field: { value, ...rest } }) => (
          <TextInput
            required
            type="number"
            min={0.01}
            step="0.01"
            value={value ?? ""}
            label={t("_entities:debtPayment.amount.label")}
            placeholder={t("_entities:debtPayment.amount.placeholder")}
            autoComplete={`${Tables.Debts}-${t("_entities:debtPayment.amount.label")}`}
            {...rest}
          />
        )}
      />

      <Controller
        control={control}
        rules={{ required: t("_entities:debtPayment.paidAt.required") }}
        name="paidAt"
        disabled={formDisabled}
        render={({ field: { value, ...rest } }) => (
          <TextInput
            required
            type="datetime-local"
            value={value ?? ""}
            label={t("_entities:debtPayment.paidAt.label")}
            autoComplete={`${Tables.Debts}-${t("_entities:debtPayment.paidAt.label")}`}
            {...rest}
          />
        )}
      />

      <Controller
        control={control}
        name="note"
        disabled={formDisabled}
        render={({ field: { value, ...rest } }) => (
          <ParagraphInput
            maxLength={500}
            value={value ?? ""}
            label={t("_entities:debtPayment.note.label")}
            placeholder={t("_entities:debtPayment.note.placeholder")}
            autoComplete={`${Tables.Debts}-${t("_entities:debtPayment.note.label")}`}
            {...rest}
          />
        )}
      />

      <Controller
        control={control}
        name="autoCreateTransaction"
        disabled={formDisabled}
        render={({ field: { value, onChange, ...rest } }) => (
          <CheckInput
            {...rest}
            id="debt-payment-auto-create-transaction"
            checked={!!value}
            label={t("_entities:debtPayment.autoCreateTransaction.label")}
            inputClassName="debt-payment-toggle-input"
            containerClassName="debt-payment-toggle"
            onChange={(event) => onChange(event.currentTarget.checked)}
          />
        )}
      />

      {autoCreateTransaction ? (
        <div className="debt-payment-grid">
          <Controller
            control={control}
            name="account"
            disabled={formDisabled || accountsQuery.isLoading}
            rules={{
              required: t("_entities:debtPayment.account.requiredWhenAuto"),
            }}
            render={({ field: { value, onChange, ...rest } }) => (
              <AutocompleteInput
                required
                options={accountOptions}
                value={value}
                onChange={(nextValue) => onChange(nextValue)}
                label={t("_entities:debtPayment.account.label")}
                placeholder={t("_entities:debtPayment.account.placeholder")}
                autoComplete={`${Tables.Debts}-${t("_entities:debtPayment.account.label")}`}
                multiple={false}
                {...rest}
              />
            )}
          />

          <Controller
            control={control}
            name="category"
            disabled={formDisabled || categoriesQuery.isLoading}
            render={({ field: { value, onChange, ...rest } }) => (
              <AutocompleteInput
                options={categoryOptions as Option[]}
                value={value}
                onChange={(nextValue) => onChange(nextValue)}
                label={t("_entities:debtPayment.category.label")}
                placeholder={t("_entities:debtPayment.category.placeholder")}
                autoComplete={`${Tables.Debts}-${t("_entities:debtPayment.category.label")}`}
                multiple={false}
                {...rest}
              />
            )}
          />
        </div>
      ) : null}
    </>
  );
}
