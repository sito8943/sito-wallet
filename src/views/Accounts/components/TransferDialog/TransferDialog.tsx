import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";

import type { Option } from "@sito/dashboard-app";
import {
  AutocompleteInput,
  FormDialog,
  ParagraphInput,
  TextInput,
  formatForDatetimeLocal,
} from "@sito/dashboard-app";

import { Currency } from "views/Currencies";
import { useFeatureFlags } from "providers";

import type { CommonAccountDto } from "lib";

import type { TransferDialogPropsType } from "../../types";
import { getEligibleTransferAccounts } from "../../utils";

import "./styles.css";

export function TransferDialog(props: TransferDialogPropsType) {
  const { sourceAccount, accounts, control, setValue, open, isLoading } = props;
  const { t } = useTranslation();
  const { isFeatureEnabled } = useFeatureFlags();
  const enforceNonNegativeBalance = isFeatureEnabled("balanceGreaterThanZero");

  const eligibleAccounts = useMemo(
    () => getEligibleTransferAccounts(accounts, sourceAccount),
    [accounts, sourceAccount],
  );

  useEffect(() => {
    if (!open || !setValue) return;
    setValue("destinationAccount", eligibleAccounts[0] ?? null);
    setValue("date", formatForDatetimeLocal());
  }, [eligibleAccounts, open, setValue]);

  return (
    <FormDialog {...props}>
      {sourceAccount ? (
        <div className="transfer-dialog-source">
          <span className="transfer-dialog-source-label">
            {t("_pages:accounts.actions.transfer.dialog.sourceAccount")}
          </span>
          <strong>{sourceAccount.name}</strong>
          <span className="transfer-dialog-source-balance">
            {sourceAccount.balance}{" "}
            <Currency
              name={sourceAccount.currency?.name}
              symbol={sourceAccount.currency?.symbol}
            />
          </span>
        </div>
      ) : null}

      {eligibleAccounts.length ? (
        <>
          <Controller
            control={control}
            name="destinationAccount"
            disabled={isLoading}
            rules={{
              required: t(
                "_pages:accounts.actions.transfer.errors.accountsRequired",
              ),
              validate: (account: CommonAccountDto | null) => {
                if (!account?.id) {
                  return t(
                    "_pages:accounts.actions.transfer.errors.accountsRequired",
                  );
                }
                if (account.id === sourceAccount?.id) {
                  return t(
                    "_pages:accounts.actions.transfer.errors.accountsDifferent",
                  );
                }
                if (account.currency?.id !== sourceAccount?.currency?.id) {
                  return t(
                    "_pages:accounts.actions.transfer.errors.currencyMismatch",
                  );
                }
                return true;
              },
            }}
            render={({ field: { value, onChange, ...field } }) => (
              <AutocompleteInput
                {...field}
                required
                multiple={false}
                options={eligibleAccounts as Option[]}
                value={value}
                onChange={(account) => onChange(account)}
                label={t(
                  "_pages:accounts.actions.transfer.dialog.destinationAccount",
                )}
                placeholder={t(
                  "_pages:accounts.actions.transfer.dialog.destinationPlaceholder",
                )}
              />
            )}
          />

          <Controller
            control={control}
            name="amount"
            disabled={isLoading}
            rules={{
              required: t(
                "_pages:accounts.actions.transfer.errors.amountRequired",
              ),
              validate: (value: string) => {
                const amount = Number(value);
                if (!Number.isFinite(amount) || amount <= 0) {
                  return t(
                    "_pages:accounts.actions.transfer.errors.amountPositive",
                  );
                }
                if (
                  enforceNonNegativeBalance &&
                  sourceAccount &&
                  amount > sourceAccount.balance
                ) {
                  return t("_entities:account.balance.greaterThan0");
                }
                return true;
              },
            }}
            render={({ field: { value, ...field } }) => (
              <TextInput
                {...field}
                required
                type="number"
                min="0.01"
                step="0.01"
                value={value ?? ""}
                label={t("_entities:transaction.amount.label")}
                placeholder={t("_entities:transaction.amount.placeholder")}
              />
            )}
          />

          <Controller
            control={control}
            name="date"
            disabled={isLoading}
            rules={{ required: t("_entities:transaction.date.required") }}
            render={({ field: { value, ...field } }) => (
              <TextInput
                {...field}
                required
                type="datetime-local"
                value={value ?? ""}
                label={t("_entities:transaction.date.label")}
                placeholder={t("_entities:transaction.date.placeholder")}
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            disabled={isLoading}
            render={({ field: { value, ...field } }) => (
              <ParagraphInput
                {...field}
                maxLength={60}
                value={value ?? ""}
                label={t("_entities:base.description.label")}
                placeholder={t("_entities:base.description.placeholder")}
              />
            )}
          />
        </>
      ) : (
        <p className="transfer-dialog-empty">
          {t("_pages:accounts.actions.transfer.unavailable")}
        </p>
      )}
    </FormDialog>
  );
}
