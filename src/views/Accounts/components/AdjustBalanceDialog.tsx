import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";

// @sito/dashboard-app
import { FormDialog, TextInput, ParagraphInput } from "@sito/dashboard-app";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faScaleBalanced } from "@fortawesome/free-solid-svg-icons";

// components
import { Currency } from "views/Currencies/components/Currency";

// types
import { AdjustBalanceDialogPropsType, AdjustBalanceFormType } from "../types";

export function AdjustBalanceDialog(props: AdjustBalanceDialogPropsType) {
  const { selectedAccount, control, setValue, open, isLoading } = props;
  const { t } = useTranslation();

  useEffect(() => {
    if (open && selectedAccount && setValue) {
      setValue("newBalance", String(selectedAccount.balance));
      setValue("description", "");
    }
  }, [open, selectedAccount, setValue]);

  return (
    <FormDialog<AdjustBalanceFormType> {...props}>
      {selectedAccount && (
        <div className="flex items-center gap-2 text-text-muted text-sm">
          <FontAwesomeIcon icon={faScaleBalanced} />
          <span>
            {t("_pages:accounts.actions.adjustBalance.dialog.currentBalance")}:{" "}
            <strong>
              {selectedAccount.balance}{" "}
              <Currency
                name={selectedAccount.currency?.name}
                symbol={selectedAccount.currency?.symbol}
              />
            </strong>
          </span>
        </div>
      )}
      <Controller
        control={control}
        name="newBalance"
        rules={{
          required: t("_entities:account.balance.required"),
          validate: (value) =>
            Number(value) !== selectedAccount?.balance ||
            t("_pages:accounts.actions.adjustBalance.dialog.sameBalance"),
        }}
        disabled={isLoading}
        render={({ field: { value, ...rest } }) => (
          <TextInput
            id="newBalance"
            required
            type="number"
            value={value ?? ""}
            label={t("_pages:accounts.actions.adjustBalance.dialog.newBalance")}
            placeholder={t("_entities:account.balance.placeholder")}
            {...rest}
          />
        )}
      />
      <Controller
        control={control}
        name="description"
        disabled={isLoading}
        render={({ field: { value, ...rest } }) => (
          <ParagraphInput
            id="description"
            maxLength={60}
            value={value ?? ""}
            label={t("_entities:base.description.label")}
            placeholder={t("_entities:base.description.placeholder")}
            {...rest}
          />
        )}
      />
    </FormDialog>
  );
}
